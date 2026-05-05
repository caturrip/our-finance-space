import axios from 'axios'
import * as dummy from '../data/dummyData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_TOKEN    = import.meta.env.VITE_API_TOKEN    || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
})

async function safeFetch(endpoint, fallback) {
  if (!API_BASE_URL) return { data: fallback, source: 'dummy' }
  try {
    const { data } = await api.get(endpoint)
    return { data, source: 'live' }
  } catch (err) {
    console.warn(`[finance-api] ${endpoint} failed, using dummy:`, err.message)
    return { data: fallback, source: 'dummy' }
  }
}

export const financeApi = {
  // Transactions — endpoint Railway aktif, fetch semua untuk komputasi client-side
  getTransactions: () => safeFetch('/transactions?limit=1000', dummy.recentTransactions),

  // Goals & Notes: Railway returns fake/demo data → always use local dummy
  getGoals:  () => Promise.resolve({ data: dummy.goals,  source: 'dummy' }),
  getNotes:  () => Promise.resolve({ data: dummy.notes,  source: 'dummy' }),
  getCouple: () => safeFetch('/couple', dummy.couple),

  // Tidak ada endpoint Railway — dihitung dari transactions di useFinanceData
  getSummary:       () => Promise.resolve({ data: dummy.summary,           source: 'dummy' }),
  getCategories:    () => Promise.resolve({ data: dummy.expenseCategories, source: 'dummy' }),
  getCategoryChart: () => Promise.resolve({ data: dummy.expenseByCategory, source: 'dummy' }),
  getCashflow:      () => Promise.resolve({ data: dummy.monthlyCashflow,   source: 'dummy' }),
  getAccounts:      () => Promise.resolve({ data: dummy.accountBreakdown,  source: 'dummy' }),
}

export default financeApi
