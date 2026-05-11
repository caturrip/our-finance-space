import axios from 'axios'
import * as dummy from '../data/dummyData'

const API_BASE_URL  = import.meta.env.VITE_API_BASE_URL  || ''
const API_TOKEN     = import.meta.env.VITE_API_TOKEN     || ''
const SHEETS_URL    = import.meta.env.VITE_SHEETS_URL    || '' // Google Apps Script URL

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
    console.warn(`[finance-api] ${endpoint} failed:`, err.message)
    return { data: fallback, source: 'dummy' }
  }
}

/** Fetch dari Google Apps Script (direct Sheets access). */
async function fetchSheets() {
  if (!SHEETS_URL) return null
  try {
    const { data } = await axios.get(SHEETS_URL, { timeout: 10000 })
    if (data?.source === 'sheets') return data
    return null
  } catch (err) {
    console.warn('[sheets] fetch failed:', err.message)
    return null
  }
}

export const financeApi = {
  fetchSheets,

  // Transactions — endpoint Railway aktif, fetch semua untuk komputasi client-side
  getTransactions: () => safeFetch('/transactions?limit=1000', dummy.recentTransactions),

  // Goals, Notes, Couple — semua dari Railway (live dari Google Sheets via bot)
  getGoals:  () => safeFetch('/goals',  dummy.goals),
  getNotes:  () => safeFetch('/notes',  dummy.notes),
  getCouple: () => safeFetch('/couple', dummy.couple),
}

export default financeApi
