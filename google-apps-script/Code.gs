/**
 * Our Finance Space — Google Apps Script Backend
 * Deploy sebagai Web App: "Execute as Me", "Anyone can access"
 *
 * Setup:
 * 1. Buka spreadsheet → Extensions → Apps Script
 * 2. Paste kode ini, save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL → Tambahkan ke Vercel env: VITE_SHEETS_URL=<url>
 *
 * SESUAIKAN CONFIG di bawah dengan nama sheet/tab kamu.
 */

// ============================================================
// CONFIG — SESUAIKAN DENGAN SPREADSHEET KAMU
// ============================================================
const CONFIG = {
  SPREADSHEET_ID: '13fZhZ1BbRc-G6anQlccFeTaoYMNDgc1B9KIK83171KI',

  // Nama tab/sheet untuk transaksi.
  // Cek: di bagian bawah spreadsheet ada tab-tab. Pilih yang berisi list transaksi.
  SHEET_TRANSAKSI: 'Data',        // <-- ganti dengan nama tab transaksi kamu

  // Kolom di sheet transaksi (0-based, A=0, B=1, C=2, dst)
  COL_TANGGAL:    0,  // kolom A: tanggal (YYYY-MM-DD atau DD/MM/YYYY)
  COL_ORANG:      1,  // kolom B: Catur / Vermita / Keduanya
  COL_KATEGORI:   2,  // kolom C: Makanan & Minuman, dll
  COL_KETERANGAN: 3,  // kolom D: deskripsi transaksi
  COL_NOMINAL:    4,  // kolom E: jumlah (angka)
  COL_TIPE:       5,  // kolom F: 'pengeluaran' atau 'pemasukan'
  ROW_HEADER:     1,  // baris header (data mulai dari ROW_HEADER+1)

  // Nama tab untuk saving goals (tabungan).
  // Jika tidak ada tab terpisah, set ke null.
  SHEET_TABUNGAN: 'Tabungan',     // <-- ganti atau null jika tidak ada

  // Kolom di sheet tabungan
  COL_GOAL_NAMA:    0,  // kolom A: nama goal
  COL_GOAL_TARGET:  1,  // kolom B: target amount
  COL_GOAL_CURRENT: 2,  // kolom C: current saved
  COL_GOAL_DEADLINE:3,  // kolom D: deadline (opsional)

  // Income bulanan — gaji tetap, update manual saat berubah
  INCOME: {
    CATUR:   8_000_000,
    VERMITA: 6_500_000,
  },
}
// ============================================================

function doGet(e) {
  try {
    const result = getAllData()
    return buildResponse(result)
  } catch (err) {
    return buildResponse({ error: err.message })
  }
}

function getAllData() {
  const ss   = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
  const now  = new Date()
  const yr   = now.getFullYear()
  const mo   = now.getMonth() // 0-based
  const monthStr = `${yr}-${String(mo + 1).padStart(2, '0')}`

  // 1. Transaksi
  const transactions = getTransactions(ss, monthStr)

  // 2. Goals
  const goals = getGoals(ss)

  // 3. Summary bulan ini
  const monthExpTx = transactions.filter(t => t.type === 'expense')
  const monthIncTx = transactions.filter(t => t.type === 'income')

  const monthlyExpense = monthExpTx.reduce((s, t) => s + t.amount, 0)
  const monthlyIncome  = monthIncTx.length > 0
    ? monthIncTx.reduce((s, t) => s + t.amount, 0)
    : (CONFIG.INCOME.CATUR + CONFIG.INCOME.VERMITA) // fallback ke gaji tetap

  // 4. Kategori
  const catMap = {}
  for (const t of monthExpTx) {
    const cat = t.category || 'Lainnya'
    if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, count: 0 }
    catMap[cat].total += t.amount
    catMap[cat].count++
  }
  const categories = Object.values(catMap).sort((a, b) => b.total - a.total)

  // 5. Saving progress
  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)

  return {
    source: 'sheets',
    monthlyIncome,
    monthlyExpense,
    transactionCount: transactions.length,
    categories,
    transactions: transactions.slice(0, 100), // kirim max 100 tx terbaru
    goals,
    savingProgress: totalTarget > 0 ? totalSaved / totalTarget : 0,
    totalSaved,
    totalTarget,
    monthStr,
  }
}

function getTransactions(ss, monthStr) {
  const sheet = ss.getSheetByName(CONFIG.SHEET_TRANSAKSI)
  if (!sheet) return []

  const lastRow = sheet.getLastRow()
  if (lastRow <= CONFIG.ROW_HEADER) return []

  const dataRange = sheet.getRange(
    CONFIG.ROW_HEADER + 1, 1,
    lastRow - CONFIG.ROW_HEADER,
    Math.max(CONFIG.COL_TIPE, CONFIG.COL_NOMINAL, CONFIG.COL_KATEGORI, CONFIG.COL_ORANG, CONFIG.COL_KETERANGAN, CONFIG.COL_TANGGAL) + 1
  )
  const rows = dataRange.getValues()

  const transactions = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const raw = row[CONFIG.COL_TANGGAL]
    if (!raw) continue

    const date    = formatDate(raw)
    if (!date) continue

    // Filter ke bulan ini saja
    if (!date.startsWith(monthStr)) continue

    const amount  = Number(row[CONFIG.COL_NOMINAL]) || 0
    if (amount <= 0) continue

    const tipeRaw = String(row[CONFIG.COL_TIPE] || '').toLowerCase().trim()
    const type    = tipeRaw.includes('masuk') || tipeRaw === 'income' || tipeRaw === 'pemasukan'
      ? 'income' : 'expense'

    transactions.push({
      id:          `gs_${i + CONFIG.ROW_HEADER + 1}`,
      date,
      person:      String(row[CONFIG.COL_ORANG]      || 'Catur').trim(),
      category:    String(row[CONFIG.COL_KATEGORI]   || 'Lainnya').trim(),
      description: String(row[CONFIG.COL_KETERANGAN] || '').trim(),
      amount,
      type,
    })
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date))
}

function getGoals(ss) {
  if (!CONFIG.SHEET_TABUNGAN) return []
  const sheet = ss.getSheetByName(CONFIG.SHEET_TABUNGAN)
  if (!sheet) return []

  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []

  const GOAL_ICONS = {
    'Anak': '🍼', 'Persalinan': '🍼',
    'Rumah': '🏡', 'DP Rumah': '🏡',
    'Liburan': '✈️', 'Darurat': '🛡️',
    'Deposito': '💰', 'Tabungan': '💰',
    'Pendidikan': '📚',
  }
  const GOAL_COLORS = [
    'from-blush-300 to-peach-400',
    'from-finance-400 to-finance-600',
    'from-peach-300 to-blush-400',
    'from-peach-200 to-peach-400',
  ]

  const rows = sheet.getRange(2, 1, lastRow - 1, 5).getValues()
  const goals = []
  for (let i = 0; i < rows.length; i++) {
    const row  = rows[i]
    const name = String(row[CONFIG.COL_GOAL_NAMA] || '').trim()
    if (!name) continue
    const target  = Number(row[CONFIG.COL_GOAL_TARGET])  || 0
    const current = Number(row[CONFIG.COL_GOAL_CURRENT]) || 0
    const deadline= String(row[CONFIG.COL_GOAL_DEADLINE] || '').trim()

    const icon  = Object.entries(GOAL_ICONS).find(([k]) => name.includes(k))?.[1] || '🎯'
    const color = GOAL_COLORS[i % GOAL_COLORS.length]

    goals.push({
      id: `goal_${i}`,
      name, target, current, deadline, icon, color, emoji: icon,
    })
  }
  return goals
}

function formatDate(raw) {
  if (!raw) return null
  if (raw instanceof Date) {
    const d = raw
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  const s = String(raw).trim()
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  // DD/MM/YYYY
  const match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`
  return null
}

function buildResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
  return output
}
