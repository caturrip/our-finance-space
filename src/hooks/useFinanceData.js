import { useCallback, useEffect, useRef, useState } from 'react'
import financeApi from '../services/financeApi'
import * as dummy from '../data/dummyData'

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
const FALLBACK_COLORS = ['#10b981','#f97316','#6366f1','#fbbf24','#60a5fa','#a78bfa','#f08672','#34d399']

function getMeta(catName, idx) {
  return CATEGORY_META[catName] || {
    icon: '📦',
    color: 'from-finance-200 to-finance-400',
    chartColor: FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
  }
}

/**
 * Ambil income dari sheet_inc_* records Railway.
 * Backend sering ikut-ikutkan baris total dari bulan lain → filter:
 * - Amount harus dalam range gaji wajar (10jt – 25jt gabungan)
 * - Ambil row number tertinggi (record paling baru di spreadsheet)
 * Fallback ke dummy.summary.monthlyIncome jika tidak ada yang lolos filter.
 */
function extractSheetIncome(transactions) {
  const candidates = transactions
    .filter(t => t.type === 'income' && /^sheet_inc_\d+$/.test(t.id ?? ''))
    .filter(t => t.amount >= 10_000_000 && t.amount <= 25_000_000)
    .sort((a, b) => {
      const rowA = parseInt(a.id.replace('sheet_inc_', ''))
      const rowB = parseInt(b.id.replace('sheet_inc_', ''))
      return rowB - rowA // row tertinggi = entry paling baru
    })
  return candidates[0]?.amount ?? null
}

function buildDashboard(transactions) {
  const now = new Date()
  const yr  = now.getFullYear()
  const mo  = now.getMonth() // 0-indexed
  const currentMonthStr = `${yr}-${String(mo + 1).padStart(2, '0')}`

  // Merge manual transactions (big items not synced to Railway) — dedupe by date+desc+amount
  const liveKeys = new Set(transactions.map(t =>
    `${t.date}|${(t.description ?? '').trim().toLowerCase()}|${t.amount}`
  ))
  const allTransactions = [
    ...transactions,
    ...dummy.manualTransactions.filter(m =>
      !liveKeys.has(`${m.date}|${(m.description ?? '').trim().toLowerCase()}|${m.amount}`)
    ),
  ]

  // Expense bulan ini
  const monthExpTx = allTransactions.filter(
    t => t.type === 'expense' && t.date?.startsWith(currentMonthStr)
  )
  const monthlyExpense   = monthExpTx.reduce((s, t) => s + (t.amount || 0), 0)
  const transactionCount = allTransactions.filter(t => t.date?.startsWith(currentMonthStr)).length

  // Income: dari sheet_inc_* (real-time Google Sheets) → fallback dummy
  const sheetIncome  = extractSheetIncome(transactions)
  const monthlyIncome = sheetIncome ?? dummy.summary.monthlyIncome

  // Kategori
  const catMap = {}
  for (const t of monthExpTx) {
    const cat = t.category || 'Lainnya'
    if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, count: 0 }
    catMap[cat].total += t.amount || 0
    catMap[cat].count++
  }
  const categories = Object.values(catMap)
    .sort((a, b) => b.total - a.total)
    .map((c, i) => ({
      ...c,
      ...getMeta(c.name, i),
      budget: dummy.categoryBudgets[c.name] ?? null,
    }))

  const categoryChart = categories.map((c, i) => ({
    name: c.name, value: c.total,
    color: getMeta(c.name, i).chartColor,
    icon: getMeta(c.name, i).icon,
  }))

  // Cashflow: bulan lalu pakai dummy (data historis sudah benar),
  // bulan ini override dengan data live dari Railway
  const cashflow = dummy.monthlyCashflow.map((m, i) =>
    i === mo ? { ...m, income: monthlyIncome, expense: monthlyExpense } : m
  )

  // Burn rate & proyeksi
  const daysIntoMonth = now.getDate()
  const daysInMonth   = new Date(yr, mo + 1, 0).getDate()
  const projectedExpense = daysIntoMonth > 0
    ? Math.round(monthlyExpense / daysIntoMonth * daysInMonth)
    : 0
  const burnRate   = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0
  const netSavings = monthlyIncome - monthlyExpense

  // Delta vs bulan lalu (dari cashflow historis)
  const prevMoData = mo > 0 ? dummy.monthlyCashflow[mo - 1] : null
  const deltaExpense = prevMoData?.expense > 0
    ? ((monthlyExpense - prevMoData.expense) / prevMoData.expense) * 100
    : null
  const deltaIncome = prevMoData?.income > 0
    ? ((monthlyIncome - prevMoData.income) / prevMoData.income) * 100
    : null

  // Summary
  const summary = {
    ...dummy.summary,
    monthlyIncome,
    monthlyExpense,
    transactionCount,
    activeMonth: MONTH_NAMES_ID[mo],
    activeYear:  yr,
    daysIntoMonth,
    daysInMonth,
    projectedExpense,
    burnRate,
    netSavings,
    deltaExpense,
    deltaIncome,
  }

  // Transaksi tampilan: expense semua + income hanya yang WhatsApp (UUID, bukan sheet_*)
  // Sort descending dulu agar slice(0,80) selalu ambil yang paling baru
  const displayTransactions = allTransactions
    .filter(t => t.type === 'expense' || (t.type === 'income' && !/^sheet_/.test(t.id ?? '')))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 80)

  return { summary, categories, categoryChart, cashflow, displayTransactions }
}

const INITIAL_DATA = {
  summary:       dummy.summary,
  goals:         dummy.goals,
  categories:    dummy.expenseCategories.map(c => ({
    ...c,
    budget: dummy.categoryBudgets[c.name] ?? null,
  })),
  categoryChart: dummy.expenseByCategory,
  cashflow:      dummy.monthlyCashflow,
  transactions:  dummy.recentTransactions,
  notes:         dummy.notes,
  couple:        dummy.couple,
}

const POLL_INTERVAL = 30 * 1000 // 30 detik

export function useFinanceData() {
  const [data, setData]       = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [source, setSource]   = useState('dummy')
  const [lastSync, setLastSync] = useState(null)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    // ── Tier 1: Google Sheets langsung (jika VITE_SHEETS_URL diset) ──────────
    const sheetsData = await financeApi.fetchSheets()
    if (!mountedRef.current) return

    if (sheetsData) {
      const { transactions: sheetsTx, goals, categories: sheetsCats,
              monthlyIncome, monthlyExpense, savingProgress,
              totalSaved, totalTarget } = sheetsData

      // Merge manual transactions (transaksi besar yang mungkin belum di Sheets)
      const sheetKeys = new Set((sheetsTx || []).map(t =>
        `${t.date}|${(t.description ?? '').trim().toLowerCase()}|${t.amount}`
      ))
      const allTx = [
        ...(sheetsTx || []),
        ...dummy.manualTransactions.filter(m =>
          !sheetKeys.has(`${m.date}|${(m.description ?? '').trim().toLowerCase()}|${m.amount}`)
        ),
      ]

      const now  = new Date()
      const yr   = now.getFullYear()
      const mo   = now.getMonth()
      const daysIntoMonth = now.getDate()
      const daysInMonth   = new Date(yr, mo + 1, 0).getDate()
      const projectedExpense = daysIntoMonth > 0
        ? Math.round(monthlyExpense / daysIntoMonth * daysInMonth) : 0
      const burnRate   = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0
      const netSavings = monthlyIncome - monthlyExpense
      const prevMoData = mo > 0 ? dummy.monthlyCashflow[mo - 1] : null
      const deltaExpense = prevMoData?.expense > 0
        ? ((monthlyExpense - prevMoData.expense) / prevMoData.expense) * 100 : null
      const deltaIncome = prevMoData?.income > 0
        ? ((monthlyIncome - prevMoData.income) / prevMoData.income) * 100 : null

      const catMap = {}
      allTx.filter(t => t.type === 'expense').forEach(t => {
        const cat = t.category || 'Lainnya'
        if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, count: 0 }
        catMap[cat].total += t.amount || 0
        catMap[cat].count++
      })
      const categories = Object.values(catMap).sort((a, b) => b.total - a.total)
        .map((c, i) => ({ ...c, ...getMeta(c.name, i), budget: dummy.categoryBudgets[c.name] ?? null }))
      const categoryChart = categories.map((c, i) => ({
        name: c.name, value: c.total,
        color: getMeta(c.name, i).chartColor,
        icon:  getMeta(c.name, i).icon,
      }))
      const cashflow = dummy.monthlyCashflow.map((m, i) =>
        i === mo ? { ...m, income: monthlyIncome, expense: monthlyExpense } : m
      )
      const displayTransactions = allTx
        .filter(t => t.type === 'expense' || (t.type === 'income' && !/^sheet_/.test(t.id ?? '')))
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
        .slice(0, 80)

      setData({
        summary: {
          ...dummy.summary,
          monthlyIncome, monthlyExpense,
          transactionCount: allTx.length,
          activeMonth: MONTH_NAMES_ID[mo], activeYear: yr,
          daysIntoMonth, daysInMonth, projectedExpense,
          burnRate, netSavings, deltaExpense, deltaIncome,
          savingProgress,
          monthlySavingActual: totalSaved,
          monthlySavingTarget: totalTarget,
        },
        goals:        goals?.length ? goals : dummy.goals,
        categories,
        categoryChart,
        cashflow,
        transactions: displayTransactions,
        notes:        dummy.notes,
        couple:       dummy.couple,
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

    const isLive = txResult.source === 'live'
    const goals  = goalsResult.data

    const totalSaved  = goals.reduce((s, g) => s + (g.current || 0), 0)
    const totalTarget = goals.reduce((s, g) => s + (g.target  || 0), 0)
    const savingProgress = totalTarget > 0 ? Math.min(totalSaved / totalTarget, 1) : 0

    if (isLive) {
      const { summary, categories, categoryChart, cashflow, displayTransactions } =
        buildDashboard(txResult.data)

      setData({
        summary: { ...summary, savingProgress, monthlySavingActual: totalSaved, monthlySavingTarget: totalTarget },
        goals,
        categories,
        categoryChart,
        cashflow,
        transactions: displayTransactions,
        notes:        notesResult.data,
        couple:       coupleResult.data,
      })
      setSource('live')
    } else {
      // ── Tier 3: Demo (dummy data) ─────────────────────────────────────────
      setData({
        ...INITIAL_DATA,
        goals,
        notes:  notesResult.data,
        couple: coupleResult.data,
        summary: {
          ...INITIAL_DATA.summary,
          savingProgress,
          monthlySavingActual: totalSaved,
          monthlySavingTarget: totalTarget,
        },
      })
      setSource('dummy')
    }

    setLastSync(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    load()
    const interval = setInterval(load, POLL_INTERVAL)

    // Refresh saat tab aktif kembali (misal: user buka tab setelah kirim WA)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [load])

  return { ...data, loading, source, lastSync, refresh: load }
}
