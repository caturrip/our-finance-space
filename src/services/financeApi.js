// ============================================
// API SERVICE — Connects to your Railway-deployed
// WhatsApp Finance Bot backend.
//
// Set VITE_API_BASE_URL in .env to your Railway URL,
// e.g. https://your-bot.up.railway.app/api
//
// If the env variable is not set or the request fails,
// the dashboard automatically falls back to dummyData.js
// so the UI keeps working in offline / demo mode.
// ============================================

import axios from 'axios'
import * as dummy from '../data/dummyData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_TOKEN = import.meta.env.VITE_API_TOKEN || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
})

// Generic safe-fetch wrapper — falls back to dummy data on any failure
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

// Each function maps to an endpoint your Railway bot should expose.
// Adjust the paths to match your bot's actual routes.
// Semua endpoint bypass Railway — gunakan dummyData sampai Railway diupdate sesuai spreadsheet
const local = (data) => Promise.resolve({ data, source: 'dummy' })

export const financeApi = {
  getSummary:       () => local(dummy.summary),
  getGoals:         () => local(dummy.goals),
  getCategories:    () => local(dummy.expenseCategories),
  getCategoryChart: () => local(dummy.expenseByCategory),
  getCashflow:      () => local(dummy.monthlyCashflow),
  getTransactions:  () => local(dummy.recentTransactions),
  getNotes:         () => local(dummy.notes),
  getCouple:        () => local(dummy.couple),
  getAccounts:      () => local(dummy.accountBreakdown),
}

export default financeApi
