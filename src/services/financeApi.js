import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_TOKEN    = import.meta.env.VITE_API_TOKEN    || ''
const SHEETS_URL   = import.meta.env.VITE_SHEETS_URL   || '' // v2

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
})

async function safeFetch(endpoint, emptyValue) {
  if (!API_BASE_URL) return { data: emptyValue, source: 'disconnected' }
  try {
    const { data } = await api.get(endpoint)
    return { data, source: 'live' }
  } catch (err) {
    console.warn(`[finance-api] ${endpoint} failed:`, err.message)
    return { data: emptyValue, source: 'disconnected' }
  }
}

/** Tier 1: baca langsung dari Google Apps Script (Google Sheets). */
async function fetchSheets() {
  if (!SHEETS_URL) return null
  try {
    const { data } = await axios.get(SHEETS_URL, { timeout: 12000 })
    if (data?.source === 'sheets') return data
    return null
  } catch (err) {
    console.warn('[sheets] fetch failed:', err.message)
    return null
  }
}

export const financeApi = {
  fetchSheets,
  getTransactions: () => safeFetch('/transactions?limit=2000', []),
  getGoals:        () => safeFetch('/goals',  []),
  getNotes:        () => safeFetch('/notes',  []),
  getCouple:       () => safeFetch('/couple', null),
}

export default financeApi
