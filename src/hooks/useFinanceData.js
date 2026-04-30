import { useEffect, useState } from 'react'
import financeApi from '../services/financeApi'
import * as dummy from '../data/dummyData'

// Hook that fetches all dashboard data in parallel.
// Falls back to dummy data on any failure.
export function useFinanceData() {
  const [data, setData] = useState({
    summary: dummy.summary,
    goals: dummy.goals,
    categories: dummy.expenseCategories,
    categoryChart: dummy.expenseByCategory,
    cashflow: dummy.monthlyCashflow,
    transactions: dummy.recentTransactions,
    notes: dummy.notes,
    couple: dummy.couple,
  })
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('dummy') // 'dummy' | 'live'

  useEffect(() => {
    console.log(data.goals)
    let cancelled = false

    async function load() {
      const [
        summary, goals, categories, categoryChart,
        cashflow, transactions, notes, couple,
      ] = await Promise.all([
        financeApi.getSummary(),
        financeApi.getGoals(),
        financeApi.getCategories(),
        financeApi.getCategoryChart(),
        financeApi.getCashflow(),
        financeApi.getTransactions(),
        financeApi.getNotes(),
        financeApi.getCouple(),
      ])

      if (cancelled) return

      const anyLive = [summary, goals, categories, categoryChart,
        cashflow, transactions, notes, couple].some(r => r.source === 'live')

      setData({
        summary: summary.data,
        goals: goals.data,
        categories: categories.data,
        categoryChart: categoryChart.data,
        cashflow: cashflow.data,
        transactions: transactions.data,
        notes: notes.data,
        couple: couple.data,
      })
      setSource(anyLive ? 'live' : 'dummy')
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { ...data, loading, source }
}
