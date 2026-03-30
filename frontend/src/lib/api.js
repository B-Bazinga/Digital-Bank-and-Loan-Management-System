import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
const storageKey = 'loan_frontend_token'

export const api = axios.create({
  baseURL,
  timeout: 10000,
})

export function getStoredToken() {
  return localStorage.getItem(storageKey) || ''
}

export function setStoredToken(token) {
  const trimmed = token.trim()
  if (trimmed) {
    localStorage.setItem(storageKey, trimmed)
    api.defaults.headers.common.Authorization = `Bearer ${trimmed}`
  } else {
    localStorage.removeItem(storageKey)
    delete api.defaults.headers.common.Authorization
  }
}

setStoredToken(getStoredToken())

export function normalizeLoan(rawLoan) {
  const id = rawLoan?._id || rawLoan?.id || ''
  return {
    id,
    userId: rawLoan?.user_id || rawLoan?.userId || 'unknown-user',
    amount: Number(rawLoan?.amount || 0),
    status: rawLoan?.status || 'pending',
  }
}
