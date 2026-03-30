/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getStoredToken, setStoredToken } from '../lib/api'
import { useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      if (!token) {
        if (active) {
          setUser(null)
          setAuthLoading(false)
        }
        return
      }

      if (active) {
        setAuthLoading(true)
      }

      try {
        const response = await api.get('/auth/me')
        if (active) {
          setUser(response.data)
          setAuthError('')
        }
      } catch {
        if (active) {
          setStoredToken('')
          setToken('')
          setUser(null)
          setAuthError('Session expired. Please sign in again.')
        }
      } finally {
        if (active) {
          setAuthLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [token])

  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true)

    try {
      const payload = new URLSearchParams()
      payload.set('username', email)
      payload.set('password', password)

      const tokenResponse = await api.post('/auth/login', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const nextToken = tokenResponse?.data?.access_token || ''
      if (!nextToken) {
        throw new Error('Missing token in login response.')
      }

      setStoredToken(nextToken)
      setToken(nextToken)

      const meResponse = await api.get('/auth/me')
      setUser(meResponse.data)
      setAuthError('')
      return meResponse.data
    } catch (error) {
      setAuthError(error?.response?.data?.detail || 'Unable to sign in with provided credentials.')
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, password, role }) => {
    setAuthLoading(true)

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      })

      return await login({ email, password })
    } catch (error) {
      setAuthError(error?.response?.data?.detail || 'Unable to register account.')
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [login])

  const logout = useCallback(() => {
    setStoredToken('')
    setToken('')
    setUser(null)
    setAuthError('')
    setAuthLoading(false)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      authLoading,
      authError,
      setAuthError,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user, authLoading, authError, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
