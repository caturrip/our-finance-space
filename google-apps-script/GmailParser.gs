// =======================================================
// GMAIL PARSER — Auto-import transaksi bank ke Sheets
// Banks: BCA, Jago, BLU, SeaBank, Mandiri
// Sheet target: tab per bulan (Jan, Feb, Mar, ..., Mei, ...)
// =======================================================

const GMAIL_CFG = {
  SPREADSHEET_ID: '13fZhZ1BbRc-G6anQlccFeTaoYMNDgc1B9KIK83171KI',
  RAILWAY_URL: 'https://wa-finance-bot-production.up.railway.app/api',
  RAILWAY_TOKEN: 'catur-mita-finance-2026',
  PROCESSED_LABEL: 'finance-processed',
  CATUR_NAMES: ['CATUR URIP', 'CATUR URIP SUROJATI', 'CATUR URIP SUROJATI P', 'CATUR URIP SUROJATI PANUNTUN'],
  VERMITA_NAMES: ['VERMITA YOLANDA', 'VERMITA'],
};

// Nama tab sheet sesuai spreadsheet
const MONTH_SHEETS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const BANK_SENDERS = {
  'bca@bca.co.id':                  'BCA',
  'noreply@jago.com':               'JAGO',
  'receipts@blubybcadigital.id':    'BLU',
  'alerts@seabank.co.id':           'SEABANK',
  'noreply.livin@bankmandiri.co.id':'MANDIRI',
};

// =======================================================
// MAIN — dipanggil trigger tiap 5 menit
// =======================================================
function processEmails() {
  const label = gmailGetOrCreateLabel();
  const senderList = Object.keys(BANK_SENDERS).join(' OR ');
  const threads = GmailApp.search(
    `from:(${senderList}) -label:${GMAIL_CFG.PROCESSED_LABEL}`,
    0, 50
  );

  let saved = 0;

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      const bank = gmailGetBank(message.getFrom());
      if (!bank) return;

      try {
        const tx = gmailParseEmail(message.getPlainBody(), bank);
        if (tx && tx.amount > 0) {
          gmailSaveToSheet(tx);
          gmailSyncToRailway(tx);
          saved++;
          console.log(`[OK] ${tx.bank} | Rp${tx.amount} | ${tx.description} | ${tx.txType}`);
        } else {
          console.log(`[SKIP] ${bank} — bukan transaksi atau amount 0`);
        }
      } catch (e) {
        console.error(`[ERROR] ${bank}: ${e.message}`);
      }
    });

    thread.addLabel(label);
  });

  if (saved > 0) console.log(`Selesai: ${saved} transaksi disimpan`);
}

// =======================================================
// ROUTER PARSER
// =======================================================
function gmailParseEmail(body, bank) {
  switch (bank) {
    case 'BCA':     return gmailParseBCA(body);
    case 'JAGO':    return gmailParseJago(body);
    case 'BLU':     return gmailParseBLU(body);
    case 'SEABANK': return gmailParseSeaBank(body);
    case 'MANDIRI': return gmailParseMandiri(body);
    default: return null;
  }
}

// =======================================================
// PARSER BCA
// Transfer biasa  → "Transfer Amount : IDR 42,500.00"
// Virtual Account → "Total Payment   : IDR 435,000.00"
// Cardless Tarik  → "Amount : IDR 100,000.00"
// =======================================================
function gmailParseBCA(body) {
  const status = gmailExtract(body, /Status\s*:\s*(.+)/i);
  if (status && !status.toLowerCase().includes('successful')) return null;

  // Coba semua kemungkinan nama field amount
  const amountMatch = body.match(
    /(?:Transfer Amount|Total Payment|Bill Total|Amount)\s*:\s*(IDR[\s\d,\.]+)/i
  );
  if (!amountMatch) return null;

  // Coba semua kemungkinan nama field merchant/penerima
  const merchant =
    gmailExtract(body, /Company\/Product Name\s*:\s*(.+)/i) ||
    gmailExtract(body, /Beneficiary Name\s*:\s*(.+)/i)       ||
    gmailExtract(body, /Transfer Type\s*:\s*(.+)/i)           ||
    'BCA Transaction';

  const dateStr = gmailExtract(body, /Transaction Date\s*:\s*(.+)/i);
  const ref     = gmailExtract(body, /Reference No\.\s*:\s*(.+)/i);

  return {
    bank: 'BCA',
    amount: gmailParseAmount(amountMatch[1]),
    description: merchant.trim(),
    date: gmailParseDate(dateStr),
    ref: ref ? ref.trim() : null,
    txType: gmailClassify(merchant),
  };
}

// =======================================================
// PARSER JAGO
// Payment QRIS → "To\nBatagor Mang Jajang\n9360..."
// Transfer     → "To\nAlif Sapto Nugroho\nJago • 102..."
// Amount: "Rp 10.000" atau "Rp20.000" (ada/tidak spasi)
// =======================================================
function gmailParseJago(body) {
  const statusLine = gmailExtract(body, /Transaction Status\s*[\r\n]+(.+)/i);
  if (statusLine && !statusLine.toLowerCase().includes('successful')) return null;

  // Rp\s* untuk handle "Rp 10.000" dan "Rp20.000"
  const amountStr = gmailExtract(body, /Amount\s*[\r\n]+\s*(Rp\s*[\d\.]+)/i);
  if (!amountStr) return null;

  // Merchant: setelah "To", sebelum nomor rekening atau nama bank
  const toBlock = body.match(
    /\bTo\b[\r\n\s]+([\w\s&'.,\-]+?)[\r\n]+(\d{10,}|Jago|BCA|Mandiri|BNI|BRI|SeaBank|Ottocash)/i
  );
  const merchant = toBlock
    ? toBlock[1].trim()
    : gmailExtract(body, /\bTo\b[\r\n]+(.+)/i) || 'Jago Transaction';

  const dateStr = gmailExtract(body, /Transaction Date\s*[\r\n]+(.+)/i);

  return {
    bank: 'JAGO',
    amount: gmailParseAmount(amountStr),
    description: merchant,
    date: gmailParseDate(dateStr),
    ref: null,
    txType: gmailClassify(merchant),
  };
}

// =======================================================
// PARSER BLU
// "Total\nRp189.724,00"
// =======================================================
function gmailParseBLU(body) {
  // Total = sudah dikurangi admin fee + bluRewards
  const amountStr = gmailExtract(body, /^Total\s*[\r\n]+(Rp[\d\.,]+)/im);
  if (!amountStr) return null;

  // Penerima: nama kapital sebelum nama bank tujuan
  const banks = 'BCA|JAGO|Mandiri|BNI|BRI|SEABANK|CIMB|PERMATA|BSI';
  const recipientMatch = body.match(
    new RegExp(`([A-Z][A-Z\\s\\.]+?)\\s*[\\r\\n]+(${banks})\\s*[\\r\\n]+`, 'i')
  );
  const merchant = recipientMatch
    ? recipientMatch[1].trim()
    : gmailExtract(body, /Nama Penerima\s*[\r\n]+(.+)/i) || 'BLU Transfer';

  const dateStr = gmailExtract(body, /Tgl & Jam Transaksi\s*[\r\n]+(.+)/i);
  const refRaw  = gmailExtract(body, /No\. Ref blu\s*[\r\n]+([\d\s]+)/i);
  const ref     = refRaw ? refRaw.replace(/\s/g, '') : null;

  return {
    bank: 'BLU',
    amount: gmailParseAmount(amountStr),
    description: merchant,
    date: gmailParseDate(dateStr),
    ref,
    txType: gmailClassify(merchant),
  };
}

// =======================================================
// PARSER SEABANK
// "Jumlah\nRp1"
// =======================================================
function gmailParseSeaBank(body) {
  const amountStr = gmailExtract(body, /Jumlah\s*[\r\n]+(Rp[\d\.,]+)/i);
  if (!amountStr) return null;

  const merchant = gmailExtract(body, /Nama Penerima\s*[\r\n]+(.+)/i) || 'SeaBank Transfer';
  const dateStr  = gmailExtract(body, /Waktu Transaksi\s*[\r\n]+(.+)/i);
  const ref      = gmailExtract(body, /No\. Referensi\s*[\r\n]+(.+)/i);

  return {
    bank: 'SEABANK',
    amount: gmailParseAmount(amountStr),
    description: merchant.trim(),
    date: gmailParseDate(dateStr),
    ref: ref ? ref.trim() : null,
    txType: gmailClassify(merchant),
  };
}

// =======================================================
// PARSER MANDIRI / LIVIN
// QR Payment  → "Nominal Transaksi    Rp 15.000,00"
// Top-up      → "Nominal Top-up Rp 19.000,00"
// Merchant    → "Penerima" atau "Penyedia Jasa"
// Ref         → "No. Referensi" atau "Nomor Referensi"
// =======================================================
function gmailParseMandiri(body) {
  const amountStr =
    gmailExtract(body, /Nominal Transaksi[\s\S]{0,30}?(Rp[\s\d\.,]+)/i) ||
    gmailExtract(body, /Nominal Top-up\s+(Rp[\s\d\.,]+)/i)               ||
    gmailExtract(body, /Nominal\s+(Rp[\s\d\.,]+)/i);
  if (!amountStr) return null;

  const merchant =
    gmailExtract(body, /Penerima\s*[\r\n]+(.+)/i)           ||
    gmailExtract(body, /Penyedia Jasa\s*[\r\n]+(.+)/i)      ||
    'Mandiri Transaction';

  const dateStr = gmailExtract(body, /Tanggal\s+(\d+\s+\w+\s+\d{4})/i);
  const timeStr = gmailExtract(body, /Jam\s+(\d+:\d+:\d+\s*WIB)/i);
  const ref     =
    gmailExtract(body, /No\. Referensi\s+([\d]+)/i)    ||
    gmailExtract(body, /Nomor Referensi\s+([\d]+)/i);

  const fullDate = [dateStr, timeStr].filter(Boolean).join(' ');

  return {
    bank: 'MANDIRI',
    amount: gmailParseAmount(amountStr),
    description: merchant.trim(),
    date: gmailParseDate(fullDate),
    ref: ref ? ref.trim() : null,
    txType: gmailClassify(merchant),
  };
}

// =======================================================
// AMOUNT PARSER
// IDR 42,500.00  → 42500  (BCA, English)
// Rp 15.000,00  → 15000  (Mandiri/BLU, Indonesian)
// Rp 10.000     → 10000  (Jago, tanpa desimal)
// =======================================================
function gmailParseAmount(str) {
  const s = str.replace(/^(IDR|Rp)\s*/i, '').trim();
  if (/,\d{2}$/.test(s)) {
    return Math.round(parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0);
  }
  if (/\.\d{2}$/.test(s)) {
    return Math.round(parseFloat(s.replace(/,/g, '')) || 0);
  }
  return Math.round(parseFloat(s.replace(/[.,]/g, '')) || 0);
}

// =======================================================
// DATE PARSER
// =======================================================
const BULAN_ID = {
  Januari:'January', Februari:'February', Maret:'March',
  April:'April', Mei:'May', Juni:'June',
  Juli:'July', Agustus:'August', September:'September',
  Oktober:'October', November:'November', Desember:'December',
};

function gmailParseDate(str) {
  if (!str) return new Date();
  let s = str.trim();
  Object.entries(BULAN_ID).forEach(([id, en]) => {
    s = s.replace(new RegExp(id, 'gi'), en);
  });
  s = s.replace(/\s*(WIB|WITA|WIT)\s*/gi, ' ').replace(',', '').trim();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

// =======================================================
// CLASSIFY TRANSACTION TYPE
// =======================================================
function gmailClassify(merchant) {
  if (!merchant) return 'expense';
  const up = merchant.toUpperCase();
  if (GMAIL_CFG.VERMITA_NAMES.some(n => up.includes(n))) return 'shared_expense';
  if (GMAIL_CFG.CATUR_NAMES.some(n => up.includes(n)))   return 'self_transfer';
  return 'expense';
}

// =======================================================
// AUTO KATEGORISASI
// =======================================================
function gmailCategorize(desc) {
  if (!desc) return 'Lainnya';
  const d = desc.toUpperCase();
  const rules = [
    { cat: 'Makanan & Minuman',  keys: ['MAKAN','MINUM','RESTO','CAFE','COFFEE','FOOD','BATAGOR','CIRENG','WARUNG','BAKSO','SOTO','NASI','MIE','BOBA','KFC','MCDONALD','PIZZA','BURGER','INDOMARET','ALFAMART','SUPERINDO','GIANT','HYPERMART','LOTTEMART','CARREFOUR','BASRENG'] },
    { cat: 'Transportasi',       keys: ['KERETA','KAI','TIKET KA','GOJEK','GRAB','MAXIM','TAXI','BUS','TOL','PARKIR','BENSIN','BBM','SPBU','PERTAMINA','SHELL','TIKET','DAMRI','MRT','LRT','TRANSJAKARTA'] },
    { cat: 'Belanja Online',     keys: ['SHOPEE','TOKOPEDIA','LAZADA','BLIBLI','BUKALAPAK','TIKTOK SHOP'] },
    { cat: 'Tagihan & Utilitas', keys: ['PLN','LISTRIK','PDAM','TELKOM','INDIHOME','BIZNET','TELKOMSEL','INDOSAT','XL','SMARTFREN','AXIS','BPJS','INTERNET'] },
    { cat: 'Hiburan',            keys: ['NETFLIX','SPOTIFY','YOUTUBE','BIOSKOP','XXI','CGV','DISNEY','VIDIO','STEAM'] },
    { cat: 'Kesehatan',          keys: ['APOTEK','KIMIA FARMA','GUARDIAN','RUMAH SAKIT','KLINIK','HALODOC','K24'] },
    { cat: 'Transfer Pasangan',  keys: GMAIL_CFG.VERMITA_NAMES },
    { cat: 'Transfer Sendiri',   keys: GMAIL_CFG.CATUR_NAMES },
    { cat: 'Top-up & E-money',   keys: ['E-MONEY','EMONEY','TOP-UP','TOPUP','OVO','DANA','GOPAY','LINKAJA','FLAZZ'] },
  ];
  for (const { cat, keys } of rules) {
    if (keys.some(k => d.includes(k.toUpperCase()))) return cat;
  }
  return 'Lainnya';
}

// =======================================================
// SIMPAN KE SHEET BULAN
// Sheet: Jan/Feb/.../Mei/... (ditentukan dari tanggal transaksi)
// Kolom: STATUS | TANGGAL | METODE BAYAR | KATEGORI | DESKRIPSI | Actual
// =======================================================
function gmailSaveToSheet(tx) {
  const ss = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);

  // Tentukan sheet berdasarkan bulan transaksi
  const txDate   = tx.date instanceof Date ? tx.date : new Date();
  const sheetName = MONTH_SHEETS[txDate.getMonth()];
  const sheet     = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" tidak ditemukan`);

  const statusLabel = {
    expense:        'Auto',
    shared_expense: 'Transfer Pasangan',
    self_transfer:  'Transfer Sendiri',
  };

  sheet.appendRow([
    statusLabel[tx.txType] || 'Auto',  // STATUS
    tx.date,                            // TANGGAL
    tx.bank,                            // METODE BAYAR
    gmailCategorize(tx.description),    // KATEGORI
    tx.description,                     // DESKRIPSI
    tx.amount,                          // Actual
  ]);
}

// =======================================================
// SYNC KE RAILWAY
// =======================================================
function gmailSyncToRailway(tx) {
  try {
    UrlFetchApp.fetch(`${GMAIL_CFG.RAILWAY_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GMAIL_CFG.RAILWAY_TOKEN}`,
      },
      payload: JSON.stringify({
        date:        tx.date,
        bank:        tx.bank,
        description: tx.description,
        amount:      tx.amount,
        type:        tx.txType,
        ref:         tx.ref,
        source:      'email-auto',
        person:      'Catur',
      }),
      muteHttpExceptions: true,
    });
  } catch (e) {
    console.warn('Railway sync gagal (non-kritis):', e.message);
  }
}

// =======================================================
// DEBUG FUNCTIONS
// =======================================================

function debugSheets() {
  const ss    = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);
  const names = ss.getSheets().map(s => `"${s.getName()}"`);
  console.log('Sheet yang tersedia:\n' + names.join('\n'));
}

// Cek header dan baris pertama sheet bulan ini
function debugHeaders() {
  const ss        = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);
  const sheetName = MONTH_SHEETS[new Date().getMonth()];
  const sheet     = ss.getSheetByName(sheetName);
  if (!sheet) { console.log(`Sheet "${sheetName}" tidak ditemukan`); return; }

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  console.log(`Headers "${sheetName}": ` + JSON.stringify(headers));

  if (sheet.getLastRow() > 1) {
    const sample = sheet.getRange(2, 1, 1, lastCol).getValues()[0];
    console.log('Contoh baris data: ' + JSON.stringify(sample));
  }
}

// Lihat plain text email tiap bank (untuk debug parsing)
function debugEmailBodies() {
  const senderList = Object.keys(BANK_SENDERS).join(' OR ');
  const threads    = GmailApp.search(`from:(${senderList})`, 0, 10);

  threads.forEach(thread => {
    const msg  = thread.getMessages()[0];
    const bank = gmailGetBank(msg.getFrom());
    if (!bank) return;
    console.log(`\n===== ${bank} =====`);
    console.log(msg.getPlainBody().substring(0, 800));
    console.log('===================');
  });
}

// =======================================================
// HELPERS
// =======================================================

function gmailGetOrCreateLabel() {
  return GmailApp.getUserLabelByName(GMAIL_CFG.PROCESSED_LABEL)
    || GmailApp.createLabel(GMAIL_CFG.PROCESSED_LABEL);
}

function gmailGetBank(from) {
  for (const [email, bank] of Object.entries(BANK_SENDERS)) {
    if (from.includes(email)) return bank;
  }
  return null;
}

function gmailExtract(body, regex) {
  const m = body.match(regex);
  return m ? m[1].trim() : null;
}

// =======================================================
// SETUP — jalankan SEKALI untuk aktifkan trigger otomatis
// =======================================================
function setupGmailParser() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'processEmails')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('processEmails')
    .timeBased()
    .everyMinutes(5)
    .create();

  console.log('Trigger aktif: processEmails tiap 5 menit');
}
