import { useCallback, useEffect, useRef, useState } from 'react'
import financeApi from '../services/financeApi'
import { couple, categoryBudgets, accountBreakdown, manualTransactions, monthlyCashflow } from '../data/dummyData'

const MONTH_NAMES_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const CATEGORY_META = {
  'Makanan & Minuman': { icon: '🍜', color: 'from-finance-300 to-finance-500', chartColor: '#10b981' },
  'Cicilan':           { icon: '💳', color: 'from-finance-200 to-finance-400', chartColor: '#f97316' },
  'Kontrakan':         { icon: '🏠', color: 'from-finance-400 to-finance-600', chartColor: '#6366f1' },
  'Entertaint':        { icon: '🎭', color: 'from-peach-400 to-blush-500',     chartColor: '#fbbf24' },
  'Listrik/Air':       { icon: '💡', color: 'from-peach-300 to-peach-500',     chartColor: '#60a5fa' },
  'Sedekah':           { icon: '🤲', color: 'from-peach-200 to-peach-400',     chartColor: '#a78bfa' },
  'Lainnya':           { icon: '📦', color: 'from-blush-200 to-peach-300',     chartColor: '#f08672' },
  'Transportasi':      { icon: '🚗', color: 'from-blush-300 to-blush-500',     chartColor: '#34d399' },
  'Skin Care':         { icon: '✨', color: 'from-peach-400 to-blush-500',     chartColor: '#f9a8d4' },
  'Orang Tua':         { icon: '👴', color: 'from-peach-200 to-peach-400',     chartColor: '#fdba74' },
  'Laundry':           { icon: '👕', color: 'from-blush-300 to-finance-300',   chartColor: '#93c5fd' },
  'Uang Harian':       { icon: '💵', color: 'from-finance-100 to-finance-300', chartColor: '#4ade80' },
}
const FALLBACK_COLORS = ['#10b981', '#f97316', '#6366f1', '#fbbf24', '#60a5fa', '#a78bfa', '#f08672', '#34d399']

function getMeta(catName, idx) {
  return CATEGORY_META[catName] || {
    icon: '📦',
    color: 'from-finance-200 to-finance-400',
    chartColor: FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
  }
}

/**
 * Ambil income bulan ini dari sheet_inc_* records Railway.
 * Railway mengirim SEMUA income historis dengan tanggal hari ini —
 * kita ambil yang row-number tertinggi (= entry paling baru = income bulan ini).
 * Filter: amount harus dalam range gaji wajar (7jt – 25jt).
 */
function extractSheetIncome(transactions) {
  const candidates = transactions
    .filter(t => t.type === 'income' && /^sheet_inc_\d+$/.test(t.id ?? ''))
    .filter(t => t.amount >= 7_000_000 && t.amount <= 25_000_000)
    .sort((a, b) => {
      const rowA = parseInt(a.id.replace('sheet_inc_', ''))
      const rowB = parseInt(b.id.replace('sheet_inc_', ''))
      return rowB - rowA // row tertinggi = entry paling baru
    })
  return candidates[0]?.amount ?? null
}

/**
 * Merge Railway transactions dengan manualTransactions dari config.
 * Dedupe berdasarkan date|description|amount untuk hindari duplikasi.
 */
function mergeWithManual(railwayTx) {
  const liveKeys = new Set(railwayTx.map(t =>
    `${t.date}|${(t.description ?? '').trim().toLowerCase()}|${t.amount}`
  ))
  return [
    ...railwayTx,
    ...manualTransactions.filter(m =>
      !liveKeys.has(`${m.date}|${(m.description ?? '').trim().toLowerCase()}|${m.amount}`)
    ),
  ]
}

/**
 * Buat cashflow 12 bulan:
 * - Bulan historis: dari config monthlyCashflow (data nyata spreadsheet)
 * - Bulan sekarang: override income & expense dari Railway + manual
 */
function buildCashflow(mo, currentMonthIncome, currentMonthExpense) {
  return monthlyCashflow.map((m, i) =>
    i === mo
      ? { ...m, income: currentMonthIncome, expense: currentMonthExpense }
      : m
  )
}

/** Total saldo dari konfigurasi rekening. */
const TOTAL_BALANCE = accountBreakdown.reduce((s, a) => s + a.balance, 0)

function buildDashboard(railwayTx) {
  const now = new Date()
  const yr  = now.getFullYear()
  const mo  = now.getMonth()
  const currentMonthStr = `${yr}-${String(mo + 1).padStart(2, '0')}`

  // Merge Railway + manual transactions (transaksi spreadsheet yang tidak lewat bot)
  const allTransactions = mergeWithManual(railwayTx)

  // Expense bulan ini (Railway + manual)
  const monthExpTx = allTransactions.filter(
    t => t.type === 'expense' && t.date?.startsWith(currentMonthStr)
  )
  const monthlyExpense   = monthExpTx.reduce((s, t) => s + (t.amount || 0), 0)
  const transactionCount = allTransactions.filter(t => t.date?.startsWith(currentMonthStr)).length

  // Income bulan ini — ambil dari sheet_inc_* dengan row tertinggi
  // (Railway mengirim semua income historis dengan tanggal hari ini → TIDAK bisa dijumlah)
  const sheetIncome  = extractSheetIncome(railwayTx)
  const monthlyIncome = sheetIncome ?? 0

  // Kategori bulan ini
  const catMap = {}
  for (const t of monthExpTx) {
    const cat = t.category || 'Lainnya'
    if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, count: 0 }
    catMap[cat].total += t.amount || 0
    catMap[cat].count++
  }
  const categories = Object.values(catMap)
    .sort((a, b) => b.total - a.total)
    .map((c, i) => ({ ...c, ...getMeta(c.name, i), budget: categoryBudgets[c.name] ?? null }))

  const categoryChart = categories.map((c, i) => ({
    name: c.name, value: c.total,
    color: getMeta(c.name, i).chartColor,
    icon: getMeta(c.name, i).icon,
  }))

  // Cashflow: historis dari config, bulan ini dari Railway+manual
  const cashflow = buildCashflow(mo, monthlyIncome, monthlyExpense)

  // Burn rate & proyeksi
  const daysIntoMonth = now.getDate()
  const daysInMonth   = new Date(yr, mo + 1, 0).getDate()
  const projectedExpense = daysIntoMonth > 0
    ? Math.round(monthlyExpense / daysIntoMonth * daysInMonth) : 0
  const burnRate   = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0
  const netSavings = monthlyIncome - monthlyExpense

  // Delta vs bulan lalu (dari cashflow historis config)
  const prevMo = mo > 0 ? monthlyCashflow[mo - 1] : null
  const deltaExpense = prevMo?.expense > 0
    ? ((monthlyExpense - prevMo.expense) / prevMo.expense) * 100 : null
  const deltaIncome = prevMo?.income > 0
    ? ((monthlyIncome - prevMo.income) / prevMo.income) * 100 : null

  const summary = {
    totalBalance: TOTAL_BALANCE,
    monthlyIncome,
    monthlyExpense,
    transactionCount,
    savingProgress: 0,
    monthlySavingActual: 0,
    monthlySavingTarget: 0,
    activeMonth: MONTH_NAMES_ID[mo],
    activeYear: yr,
    daysIntoMonth,
    daysInMonth,
    projectedExpense,
    burnRate,
    netSavings,
    deltaExpense,
    deltaIncome,
  }

  // Tampilkan expense + income WA (bukan sheet_inc_*)
  const displayTransactions = allTransactions
    .filter(t => t.type === 'expense' || (t.type === 'income' && !/^sheet_/.test(t.id ?? '')))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 100)

  return { summary, categories, categoryChart, cashflow, displayTransactions }
}

/** State awal — menunggu Railway, tampilkan angka 0 bukan dummy. */
function makeEmptyState() {
  const mo = new Date().getMonth()
  return {
    summary: {
      totalBalance: TOTAL_BALANCE,
      monthlyIncome: 0,
      monthlyExpense: 0,
      transactionCount: 0,
      savingProgress: 0,
      monthlySavingActual: 0,
      monthlySavingTarget: 0,
      activeMonth: MONTH_NAMES_ID[mo],
      activeYear: new Date().getFullYear(),
      daysIntoMonth: new Date().getDate(),
      daysInMonth: new Date(new Date().getFullYear(), mo + 1, 0).getDate(),
      projectedExpense: 0,
      burnRate: 0,
      netSavings: 0,
      deltaExpense: null,
      deltaIncome: null,
    },
    goals:        [],
    categories:   [],
    categoryChart: [],
    cashflow:     monthlyCashflow, // tampilkan historis saat loading
    transactions: [],
    notes:        [],
    couple,
  }
}

const POLL_INTERVAL = 30 * 1000

export function useFinanceData() {
  const [data, setData]         = useState(makeEmptyState)
  const [loading, setLoading]   = useState(true)
  const [source, setSource]     = useState('loading')
  const [lastSync, setLastSync] = useState(null)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    // ── Tier 1: Google Sheets langsung (jika VITE_SHEETS_URL diset) ──────────
    const sheetsData = await financeApi.fetchSheets()
    if (!mountedRef.current) return

    if (sheetsData) {
      const {
        transactions: sheetsTx = [],
        goals: sheetsGoals = [],
        monthlyIncome = 0,
        monthlyExpense = 0,
        savingProgress = 0,
        totalSaved = 0,
        totalTarget = 0,
      } = sheetsData

      const now  = new Date()
      const yr   = now.getFullYear()
      const mo   = now.getMonth()
      const currentMonthStr = `${yr}-${String(mo + 1).padStart(2, '0')}`
      const daysIntoMonth = now.getDate()
      const daysInMonth   = new Date(yr, mo + 1, 0).getDate()
      const projectedExpense = daysIntoMonth > 0
        ? Math.round(monthlyExpense / daysIntoMonth * daysInMonth) : 0
      const burnRate    = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0
      const netSavings  = monthlyIncome - monthlyExpense
      const cashflow    = buildCashflow(mo, monthlyIncome, monthlyExpense)
      const prevMo      = mo > 0 ? monthlyCashflow[mo - 1] : null
      const deltaExpense = prevMo?.expense > 0
        ? ((monthlyExpense - prevMo.expense) / prevMo.expense) * 100 : null
      const deltaIncome = prevMo?.income > 0
        ? ((monthlyIncome - prevMo.income) / prevMo.income) * 100 : null

      // Kategori dari Sheets
      const catMap = {}
      sheetsTx.filter(t => t.type === 'expense' && t.date?.startsWith(currentMonthStr))
        .forEach(t => {
          const cat = t.category || 'Lainnya'
          if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, count: 0 }
          catMap[cat].total += t.amount || 0
          catMap[cat].count++
        })
      const categories = Object.values(catMap).sort((a, b) => b.total - a.total)
        .map((c, i) => ({ ...c, ...getMeta(c.name, i), budget: categoryBudgets[c.name] ?? null }))
      const categoryChart = categories.map((c, i) => ({
        name: c.name, value: c.total,
        color: getMeta(c.name, i).chartColor,
        icon: getMeta(c.name, i).icon,
      }))

      const displayTransactions = [...sheetsTx]
        .filter(t => t.type === 'expense' || (t.type === 'income' && !/^sheet_/.test(t.id ?? '')))
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
        .slice(0, 100)

      setData({
        summary: {
          totalBalance: TOTAL_BALANCE,
          monthlyIncome, monthlyExpense,
          transactionCount: sheetsTx.length,
          savingProgress, monthlySavingActual: totalSaved, monthlySavingTarget: totalTarget,
          activeMonth: MONTH_NAMES_ID[mo], activeYear: yr,
          daysIntoMonth, daysInMonth, projectedExpense,
          burnRate, netSavings, deltaExpense, deltaIncome,
        },
        goals:        sheetsGoals.length ? sheetsGoals : [],
        categories,
        categoryChart,
        cashflow,
        transactions: displayTransactions,
        notes:        [],
        couple,
      })
      setSource('sheets')
      setLastSync(new Date())
      setLoading(false)
      return
    }

    // ── Tier 2: Railway API ───────────────────────────────────────────────────
    const [txResult, goalsResult, notesResult, coupleResult] = await Promise.all([
      financeApi.getTransactions(),
      financeApi.getGoals(),
      financeApi.getNotes(),
      financeApi.getCouple(),
    ])
    if (!mountedRef.current) return

    const isLive     = txResult.source === 'live'
    const goals      = Array.isArray(goalsResult.data)  ? goalsResult.data  : []
    const notes      = Array.isArray(notesResult.data)  ? notesResult.data  : []
    const coupleData = coupleResult.data || couple

    const totalSaved    = goals.reduce((s, g) => s + (g.current || 0), 0)
    const totalTarget   = goals.reduce((s, g) => s + (g.target  || 0), 0)
    const savingProgress = totalTarget > 0 ? Math.min(totalSaved / totalTarget, 1) : 0

    if (isLive && Array.isArray(txResult.data)) {
      const { summary, categories, categoryChart, cashflow, displayTransactions } =
        buildDashboard(txResult.data)

      setData({
        summary: { ...summary, savingProgress, monthlySavingActual: totalSaved, monthlySavingTarget: totalTarget },
        goals,
        categories,
        categoryChart,
        cashflow,
        transactions: displayTransactions,
        notes,
        couple: coupleData,
      })
      setSource('live')
    } else {
      // Railway down — tampilkan state kosong + historis cashflow
      const empty = makeEmptyState()
      setData({ ...empty, goals, notes, couple: coupleData })
      setSource('disconnected')
    }

    setLastSync(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    load()
    const interval = setInterval(load, POLL_INTERVAL)
    const onFocus = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      mountedRef.current = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [load])

  return { ...data, loading, source, lastSync, refresh: load }
}
