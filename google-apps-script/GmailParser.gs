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
  CUTOFF_DATE: '2026/05/11',  // hanya proses email dari tanggal ini ke atas
  CATUR_NAMES: ['CATUR URIP', 'CATUR URIP SUROJATI', 'CATUR URIP SUROJATI P', 'CATUR URIP SUROJATI PANUNTUN'],
  VERMITA_NAMES: ['VERMITA YOLANDA', 'VERMITA'],
  // Merchant yang di-skip (tidak disimpan ke sheet)
  SKIP_MERCHANTS: ['PT SINAR DIGITAL TERDEPAN', 'PT KERETA API INDONESIA'],
};

// Cache dropdown options per run (reset tiap eksekusi baru)
let _validMetode   = null;
let _validKategori = null;

// Baca dropdown options dari data validation kolom di sheet
// Scan hingga 10 baris mulai startRow untuk menemukan sel yang punya validation
function gmailGetDropdownOptions(sheet, startRow, colIndex) {
  if (!sheet || !Number.isFinite(startRow) || !Number.isFinite(colIndex)) {
    console.warn('gmailGetDropdownOptions: argumen tidak valid', typeof sheet, startRow, colIndex);
    return [];
  }
  for (let i = 0; i < 10; i++) {
    try {
      const validation = sheet.getRange(startRow + i, colIndex).getDataValidation();
      if (!validation) continue;
      const type = validation.getCriteriaType();
      const vals = validation.getCriteriaValues();
      if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
        const opts = (vals[0] || []).filter(v => v !== '');
        if (opts.length > 0) return opts;
      }
      if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
        const opts = vals[0].getValues().flat().filter(v => v !== '' && v !== null);
        if (opts.length > 0) return opts;
      }
    } catch(e) {
      console.warn(`Gagal baca dropdown baris ${startRow + i}:`, e.message);
    }
  }
  return [];
}

// Cocokkan nilai ke opsi yang tersedia di dropdown (case-insensitive, abaikan spasi)
function gmailMatchOption(value, options, fallback) {
  if (!options || options.length === 0) return value;
  // Normalisasi: uppercase + hapus semua spasi (fix "SEABANK" vs "Sea Bank")
  const norm = v => String(v).toUpperCase().replace(/\s+/g, '');
  const up = norm(value);
  const exact   = options.find(o => norm(o) === up);
  if (exact) return exact;
  const partial = options.find(o => up.includes(norm(o)) || norm(o).includes(up));
  if (partial) return partial;
  return fallback
    || options.find(o => String(o).toUpperCase().includes('LAIN'))
    || options[options.length - 1]
    || value;
}

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
    `from:(${senderList}) -label:${GMAIL_CFG.PROCESSED_LABEL} after:${GMAIL_CFG.CUTOFF_DATE}`,
    0, 50
  );

  let saved = 0;

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      const bank = gmailGetBank(message.getFrom());
      if (!bank) return;

      try {
        const tx = gmailParseEmail(message.getPlainBody(), bank);
        if (!tx || tx.amount <= 0) {
          console.log(`[SKIP] ${bank} — bukan transaksi atau amount 0`);
        } else if (tx.txType === 'self_transfer' || tx.txType === 'shared_expense' || tx.txType === 'skip') {
          console.log(`[SKIP] ${bank} | Rp${tx.amount} | ${tx.description} — ${tx.txType}`);
        } else {
          gmailSaveToSheet(tx);
          gmailSyncToRailway(tx);
          saved++;
          console.log(`[OK] ${tx.bank} | Rp${tx.amount} | ${tx.description}`);
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

  // Batasi ke satu baris ([ \t]* bukan \s) agar digit tanggal di baris berikutnya tidak ikut ter-capture
  const amountMatch = body.match(
    /(?:Transfer Amount|Total Payment|Bill Total|Amount)\s*:\s*(IDR[ \t]*[\d,\.]+)/i
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

  if (amountMatch[1] == null) {
    console.warn('[BCA] amountMatch ada tapi group 1 undefined, body snippet:', body.substring(0, 200));
    return null;
  }
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
    gmailExtract(body, /Nominal Transaksi[\s\S]{0,30}?(Rp[ \t]*[\d\.,]+)/i) ||
    gmailExtract(body, /Nominal Top-up[ \t]+(Rp[ \t]*[\d\.,]+)/i)            ||
    gmailExtract(body, /Nominal[ \t]+(Rp[ \t]*[\d\.,]+)/i);
  if (!amountStr) return null;

  // ^ + m flag: hanya cocok jika "Penerima" di awal baris (bukan dalam kalimat disclaimer)
  const merchant =
    gmailExtract(body, /^Penerima\s*[\r\n]+(.+)/im)          ||
    gmailExtract(body, /^Penyedia Jasa\s*[\r\n]+(.+)/im)     ||
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
  if (!str) return 0;
  // Hapus prefix IDR/Rp lalu semua whitespace (termasuk newline jika regex slip)
  const s = str.replace(/^(IDR|Rp)\s*/i, '').replace(/\s/g, '');
  if (/,\d{2}$/.test(s)) {
    // Format Indonesia: 15.000,00 → 15000
    return Math.round(parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0);
  }
  if (/\.\d{2}$/.test(s)) {
    // Format English: 11,500.00 → 11500
    return Math.round(parseFloat(s.replace(/,/g, '')) || 0);
  }
  // Format tanpa desimal: 10.000 atau 10000
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
  if (GMAIL_CFG.SKIP_MERCHANTS.some(n => up.includes(n.toUpperCase()))) return 'skip';
  if (GMAIL_CFG.VERMITA_NAMES.some(n => up.includes(n))) return 'shared_expense';
  if (GMAIL_CFG.CATUR_NAMES.some(n => up.includes(n)))   return 'self_transfer';
  return 'expense';
}

// =======================================================
// AUTO KATEGORISASI
// =======================================================
// Kategori disesuaikan dengan opsi dropdown spreadsheet
function gmailCategorize(desc) {
  if (!desc) return 'Lainnya';
  const d = desc.toUpperCase();
  const rules = [
    { cat: 'Makanan & Minuman', keys: ['MAKAN','MINUM','RESTO','CAFE','COFFEE','FOOD','BATAGOR','CIRENG','WARUNG','BAKSO','SOTO','NASI','MIE','BOBA','KFC','MCDONALD','PIZZA','BURGER','INDOMARET','ALFAMART','SUPERINDO','GIANT','HYPERMART','LOTTEMART','CARREFOUR','BASRENG','MIXUE','CHATIME','KENTUCKY'] },
    { cat: 'Transportasi',      keys: ['GOJEK','GRAB','MAXIM','TAXI','BUS','TOL','PARKIR','BENSIN','BBM','SPBU','PERTAMINA','SHELL','DAMRI','MRT','LRT','TRANSJAKARTA','GOCAR','GORIDE'] },
    { cat: 'Listrik/Air',       keys: ['PLN','LISTRIK','PDAM','AIR','TELKOM','INDIHOME','BIZNET','TELKOMSEL','INDOSAT','XL','SMARTFREN','AXIS','BPJS','INTERNET'] },
    { cat: 'Entertaint',        keys: ['NETFLIX','SPOTIFY','YOUTUBE','BIOSKOP','XXI','CGV','DISNEY','VIDIO','STEAM','SHOPEE','TOKOPEDIA','LAZADA','BLIBLI','BUKALAPAK','TIKTOK'] },
    { cat: 'Skin Care',         keys: ['SKINCARE','SKIN CARE','WARDAH','SOMETHINC','EMINA','GUARDIAN','WATSON','MAKEUP','KOSMETIK'] },
    { cat: 'Laundry',           keys: ['LAUNDRY','LAUNDRI','CUCI BAJU','CUCI PAKAIAN'] },
    { cat: 'Kontrakan',         keys: ['KONTRAKAN','SEWA','KOST','KOS '] },
    { cat: 'Cicilan',           keys: ['CICILAN','ANGSURAN','KREDIT','KREDIVO','AKULAKU'] },
    { cat: 'Orang Tua',         keys: ['ORANG TUA','ORTU','AYAH','IBU','MAMA','PAPA'] },
    { cat: 'Sedekah',           keys: ['SEDEKAH','INFAQ','ZAKAT','DONASI','AMAL'] },
    { cat: 'Uang Harian',       keys: ['UANG HARIAN','JAJAN','HARIAN'] },
  ];
  for (const { cat, keys } of rules) {
    if (keys.some(k => d.includes(k))) return cat;
  }
  return 'Lainnya';
}

// =======================================================
// SIMPAN KE SHEET BULAN
// Sheet: Jan/Feb/.../Mei/... (ditentukan dari tanggal transaksi)
// Kolom: STATUS | TANGGAL | METODE BAYAR | KATEGORI | DESKRIPSI | Actual
// Posisi tabel dicari otomatis (tidak selalu di baris 1)
// =======================================================
function gmailSaveToSheet(tx) {
  const ss      = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);
  const txDate  = tx.date instanceof Date ? tx.date : new Date();
  const sheetName = MONTH_SHEETS[txDate.getMonth()];
  const sheet   = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" tidak ditemukan`);

  const table = gmailFindTransactionTable(sheet);
  if (!table) throw new Error(`Tabel STATUS|TANGGAL tidak ditemukan di sheet "${sheetName}"`);

  const { headerRow, startCol } = table;

  // Cari posisi insert berdasarkan urutan tanggal
  // Scan kolom TANGGAL, temukan baris pertama yang kosong atau tanggal > tx.date
  const tanggalCol  = startCol + 1;
  const maxScan     = 400;
  const tanggalData = sheet.getRange(headerRow + 1, tanggalCol, maxScan, 1).getValues();
  const txTime      = txDate.getTime();

  let appendRow    = headerRow + 1;
  let foundSlot    = false;
  for (let i = 0; i < tanggalData.length; i++) {
    const val = tanggalData[i][0];
    if (val === '' || val === null || val === undefined) {
      // Baris kosong: insert di sini
      appendRow = headerRow + 1 + i;
      foundSlot = true;
      break;
    }
    // Baris sudah terisi: cek apakah tanggal baris ini > txDate (insert sebelumnya)
    const rowTime = val instanceof Date ? val.getTime() : new Date(val).getTime();
    if (!isNaN(rowTime) && rowTime > txTime) {
      // Geser baris ke bawah supaya ada ruang
      sheet.insertRowBefore(headerRow + 1 + i);
      appendRow = headerRow + 1 + i;
      foundSlot = true;
      break;
    }
  }
  if (!foundSlot) appendRow = headerRow + 1 + tanggalData.filter(r => r[0] !== '' && r[0] !== null).length;

  // Baca dropdown options dari sheet (cache per run, scan hingga 10 baris)
  const dataRow = headerRow + 1;
  console.log(`[SHEET] "${sheetName}" headerRow=${headerRow} startCol=${startCol} dataRow=${dataRow}`);
  if (!_validMetode)   _validMetode   = gmailGetDropdownOptions(sheet, dataRow, startCol + 2);
  if (!_validKategori) _validKategori = gmailGetDropdownOptions(sheet, dataRow, startCol + 3);

  console.log('Metode options: '   + (_validMetode.length   ? _validMetode.join(', ')   : '(kosong)'));
  console.log('Kategori options: ' + (_validKategori.length ? _validKategori.join(', ') : '(kosong)'));

  // Gunakan nilai persis dari dropdown (hasil debugDropdown)
  const BANK_LABEL = { BCA:'BCA', JAGO:'JAGO', BLU:'BLU', SEABANK:'SEABANK', MANDIRI:'Mandiri' };
  const metedeInput = BANK_LABEL[tx.bank] || tx.bank;
  const metode   = gmailMatchOption(metedeInput, _validMetode, metedeInput);
  const kategori = gmailMatchOption(gmailCategorize(tx.description), _validKategori, 'Lainnya');

  const range = sheet.getRange(appendRow, startCol, 1, 6);
  range.setValues([[
    false,      // STATUS (checkbox FALSE)
    tx.date,    // TANGGAL
    metode,     // METODE BAYAR (dari dropdown sheet)
    kategori,   // KATEGORI (dari dropdown sheet)
    tx.description, // DESKRIPSI
    tx.amount,  // Actual
  ]]);
}

// Cari posisi tabel transaksi di dalam sheet (bisa di baris mana saja)
function gmailFindTransactionTable(sheet) {
  const lastRow = Math.min(sheet.getLastRow(), 50); // cari di 50 baris pertama
  const lastCol = Math.min(sheet.getLastColumn(), 20);
  if (lastRow < 1 || lastCol < 1) return null;

  const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const cell = String(data[r][c]).toUpperCase().trim();
      if (cell === 'STATUS') {
        const next = c + 1 < data[r].length ? String(data[r][c + 1]).toUpperCase() : '';
        if (next.includes('TANGGAL')) {
          return { headerRow: r + 1, startCol: c + 1 }; // 1-based
        }
      }
    }
  }
  return null;
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

// Jalankan SEKALI untuk cek isi dropdown Metode Bayar & Kategori di sheet bulan ini
function debugDropdown() {
  const ss        = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);
  const sheetName = MONTH_SHEETS[new Date().getMonth()];
  const sheet     = ss.getSheetByName(sheetName);
  if (!sheet) { console.log('Sheet tidak ditemukan:', sheetName); return; }

  const table = gmailFindTransactionTable(sheet);
  if (!table) { console.log('Tabel STATUS|TANGGAL tidak ditemukan'); return; }

  const { headerRow, startCol } = table;
  console.log(`Sheet: "${sheetName}" | headerRow=${headerRow} | startCol=${startCol}`);

  const headers = sheet.getRange(headerRow, startCol, 1, 6).getValues()[0];
  console.log('Headers: ' + JSON.stringify(headers));

  // Coba baca validation dari setiap kolom tabel
  for (let offset = 0; offset < 6; offset++) {
    const opts = gmailGetDropdownOptions(sheet, headerRow + 1, startCol + offset);
    console.log(`Kolom ${startCol + offset} (${headers[offset] || '?'}): ` +
      (opts.length ? opts.join(' | ') : '(tidak ada dropdown)'));
  }
}

function debugSheets() {
  const ss    = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);
  const names = ss.getSheets().map(s => `"${s.getName()}"`);
  console.log('Sheet yang tersedia:\n' + names.join('\n'));
}

// Cek posisi tabel transaksi di sheet bulan ini
function debugHeaders() {
  const ss        = SpreadsheetApp.openById(GMAIL_CFG.SPREADSHEET_ID);
  const sheetName = MONTH_SHEETS[new Date().getMonth()];
  const sheet     = ss.getSheetByName(sheetName);
  if (!sheet) { console.log(`Sheet "${sheetName}" tidak ditemukan`); return; }

  const table = gmailFindTransactionTable(sheet);
  if (!table) {
    console.log(`Tabel STATUS|TANGGAL tidak ditemukan di sheet "${sheetName}"`);
    return;
  }

  const { headerRow, startCol } = table;
  console.log(`Sheet: "${sheetName}" — tabel di baris ${headerRow}, kolom ${startCol}`);

  const headers = sheet.getRange(headerRow, startCol, 1, 6).getValues()[0];
  console.log('Headers: ' + JSON.stringify(headers));

  if (sheet.getLastRow() > headerRow) {
    const sample = sheet.getRange(headerRow + 1, startCol, 1, 6).getValues()[0];
    console.log('Baris pertama data: ' + JSON.stringify(sample));
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
  return (m && m[1] != null) ? m[1].trim() : null;
}

// =======================================================
// RESET LABEL — hapus label finance-processed dari semua
// email bank sejak CUTOFF_DATE, supaya bisa diproses ulang
// =======================================================
function resetAllLabels() {
  const label = GmailApp.getUserLabelByName(GMAIL_CFG.PROCESSED_LABEL);
  if (!label) { console.log('Label tidak ditemukan'); return; }

  const senderList = Object.keys(BANK_SENDERS).join(' OR ');
  const threads = GmailApp.search(
    `from:(${senderList}) label:${GMAIL_CFG.PROCESSED_LABEL} after:${GMAIL_CFG.CUTOFF_DATE}`,
    0, 100
  );
  threads.forEach(t => t.removeLabel(label));
  console.log(`Reset label dari ${threads.length} thread`);
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
