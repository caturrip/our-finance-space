/**
 * Our Finance Space — Google Apps Script Backend
 * Baca data dari tab bulanan (Jan/Feb/.../Mei/...) yang diisi oleh GmailParser
 *
 * Setup:
 * 1. Buka spreadsheet → Extensions → Apps Script
 * 2. Paste kode ini (timpa yang lama), save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL → Tambahkan ke Vercel env: VITE_SHEETS_URL=<url>
 */

const CONFIG = {
  SPREADSHEET_ID: '13fZhZ1BbRc-G6anQlccFeTaoYMNDgc1B9KIK83171KI',
  MONTH_SHEETS:   ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],

  // Income bulanan — update manual jika berubah
  INCOME: {
    CATUR:   8000000,
    VERMITA: 6500000,
  },
}

// ============================================================

function doGet() {
  try {
    const result = getAllData()
    return buildResponse(result)
  } catch (err) {
    return buildResponse({ error: err.message, source: 'sheets' })
  }
}

function getAllData() {
  const ss  = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  const now = new Date()
  const mo  = now.getMonth() // 0-based

  // Baca semua transaksi dari semua tab bulanan (Jan–bulan ini)
  const allTransactions = []
  for (let m = 0; m <= mo; m++) {
    const sheetName = CONFIG.MONTH_SHEETS[m]
    const sheet = ss.getSheetByName(sheetName)
    if (!sheet) continue
    const txs = readMonthlySheet(sheet, sheetName, now.getFullYear(), m)
    allTransactions.push(...txs)
  }

  // Transaksi bulan ini
  const yr  = now.getFullYear()
  const currentMonthStr = `${yr}-${String(mo + 1).padStart(2, '0')}`
  const monthExpTx = allTransactions.filter(
    t => t.type === 'expense' && t.date?.startsWith(currentMonthStr)
  )
  const monthlyExpense = monthExpTx.reduce((s, t) => s + t.amount, 0)
  const monthlyIncome  = CONFIG.INCOME.CATUR + CONFIG.INCOME.VERMITA

  // Kategori bulan ini
  const catMap = {}
  for (const t of monthExpTx) {
    const cat = t.category || 'Lainnya'
    if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, count: 0 }
    catMap[cat].total += t.amount
    catMap[cat].count++
  }
  const categories = Object.values(catMap).sort((a, b) => b.total - a.total)

  // Cashflow historis — expense per bulan dari sheet, income dari CONFIG
  const cashflow = CONFIG.MONTH_SHEETS.map((name, m) => {
    const monthStr = `${yr}-${String(m + 1).padStart(2, '0')}`
    const exp = allTransactions
      .filter(t => t.type === 'expense' && t.date?.startsWith(monthStr))
      .reduce((s, t) => s + t.amount, 0)
    return {
      month:   name,
      income:  m <= mo ? monthlyIncome : 0,
      expense: exp,
    }
  })

  return {
    source:         'sheets',
    monthlyIncome,
    monthlyExpense,
    transactionCount: monthExpTx.length,
    categories,
    transactions:   allTransactions
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
      .slice(0, 200),
    cashflow,
    goals:          [],
    savingProgress: 0,
    totalSaved:     0,
    totalTarget:    0,
    monthStr:       currentMonthStr,
  }
}

/**
 * Baca tab bulanan — cari tabel STATUS|TANGGAL secara otomatis
 * (posisi bisa berbeda-beda antar sheet)
 */
function readMonthlySheet(sheet, sheetName, year, monthIndex) {
  const table = findTransactionTable(sheet)
  if (!table) return []

  const { headerRow, startCol } = table
  // Kolom (1-based): STATUS=+0, TANGGAL=+1, METODE=+2, KATEGORI=+3, DESKRIPSI=+4, ACTUAL=+5
  const lastRow  = sheet.getLastRow()
  const dataRows = lastRow - headerRow
  if (dataRows <= 0) return []

  const data = sheet.getRange(headerRow + 1, startCol, dataRows, 6).getValues()
  const monthStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}`

  const transactions = []
  for (let i = 0; i < data.length; i++) {
    const [_status, rawDate, metode, kategori, deskripsi, nominal] = data[i]

    // Skip baris kosong
    if (!rawDate && !nominal) continue
    const amount = Number(nominal) || 0
    if (amount <= 0) continue

    const date = formatDate(rawDate)
    if (!date) continue
    if (!date.startsWith(monthStr)) continue

    transactions.push({
      id:          `gs_${sheetName}_${i + headerRow + 1}`,
      date,
      person:      'Catur',            // GmailParser hanya catat Catur untuk sekarang
      category:    String(kategori  || 'Lainnya').trim(),
      description: String(deskripsi || '').trim(),
      bank:        String(metode    || '').trim(),
      amount,
      type:        'expense',
    })
  }

  return transactions
}

/**
 * Cari posisi tabel STATUS|TANGGAL dalam sheet (bisa di baris/kolom mana saja)
 */
function findTransactionTable(sheet) {
  const lastRow = Math.min(sheet.getLastRow(), 50)
  const lastCol = Math.min(sheet.getLastColumn(), 20)
  if (lastRow < 1 || lastCol < 1) return null

  const data = sheet.getRange(1, 1, lastRow, lastCol).getValues()
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const cell = String(data[r][c]).toUpperCase().trim()
      if (cell === 'STATUS') {
        const next = c + 1 < data[r].length ? String(data[r][c + 1]).toUpperCase() : ''
        if (next.includes('TANGGAL')) {
          return { headerRow: r + 1, startCol: c + 1 } // 1-based
        }
      }
    }
  }
  return null
}

function formatDate(raw) {
  if (!raw) return null
  if (raw instanceof Date) {
    const d = raw
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  const s = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`
  return null
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
