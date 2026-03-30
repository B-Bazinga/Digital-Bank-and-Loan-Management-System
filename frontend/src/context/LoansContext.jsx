/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, normalizeLoan } from '../lib/api'
import { useAuth } from './AuthContext'

const LoansContext = createContext(null)

export function LoansProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchLoans = useCallback(async (showLoader = false) => {
    if (!isAuthenticated) {
      setLoans([])
      setLoading(false)
      setRefreshing(false)
      setErrorMessage('')
      return
    }

    if (showLoader) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      const response = await api.get('/loans')
      const list = Array.isArray(response.data) ? response.data : []
      setLoans(list.map(normalizeLoan))
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || 'Unable to fetch loans. Add a valid access token.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [isAuthenticated])

  const applyLoan = useCallback(async ({ amount }) => {
    try {
      const response = await api.post('/loans/apply', { amount: Number(amount) })
      const created = normalizeLoan(response.data)
      setLoans((current) => [created, ...current])
      setActionMessage('Loan application submitted successfully.')
      setErrorMessage('')
      return created
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || 'Unable to submit loan application.')
      throw error
    }
  }, [])

  const updateLoanStatus = useCallback(async (loanId, status) => {
    try {
      await api.put(`/loans/${loanId}/${status}`)
      setLoans((current) =>
        current.map((loan) =>
          loan.id === loanId
            ? {
                ...loan,
                status,
              }
            : loan,
        ),
      )
      setActionMessage(`Loan ${loanId} marked as ${status}.`)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || 'Unable to update loan status.')
      throw error
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setLoans([])
      setLoading(false)
      setRefreshing(false)
      setErrorMessage('')
      return
    }

    fetchLoans(true)
  }, [fetchLoans, isAuthenticated])

  const value = useMemo(
    () => ({
      loans,
      loading,
      refreshing,
      actionMessage,
      errorMessage,
      setActionMessage,
      setErrorMessage,
      fetchLoans,
      applyLoan,
      updateLoanStatus,
    }),
    [loans, loading, refreshing, actionMessage, errorMessage, fetchLoans, applyLoan, updateLoanStatus],
  )

  return <LoansContext.Provider value={value}>{children}</LoansContext.Provider>
}

export function useLoans() {
  const context = useContext(LoansContext)

  if (!context) {
    throw new Error('useLoans must be used within LoansProvider')
  }

  return context
}
