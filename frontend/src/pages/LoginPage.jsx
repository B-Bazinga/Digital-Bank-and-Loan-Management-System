import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { Button } from '../components/ui/Button'
import { AlertStrip } from '../components/ui/AlertStrip'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, authLoading, authError, setAuthError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const nextPath = location.state?.from || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required.')
      return
    }

    setFormError('')
    setAuthError('')

    try {
      await login({ email, password })
      navigate(nextPath, { replace: true })
    } catch {
      // handled by auth context
    }
  }

  return (
    <div className="page-transition auth-shell w-full max-w-xl">
      <Card className="auth-card space-y-7 rounded-2xl p-6 sm:p-8">
        <header className="space-y-3 border-b border-[var(--color-border)] pb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Identity Access</p>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">Sign In</h1>
          <p className="mx-auto max-w-md text-sm text-[var(--color-text-muted)]">Authenticate to access customer and admin loan operations.</p>
        </header>

        {formError ? <AlertStrip tone="error">{formError}</AlertStrip> : null}
        {authError ? <AlertStrip tone="error">{authError}</AlertStrip> : null}

        <form className="grid gap-6 rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_72%,transparent)] p-4 sm:p-5" onSubmit={handleSubmit} noValidate>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@bank.com"
            autoComplete="username"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          No account yet?{' '}
          <Link className="font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline" to="/register">
            Create account
          </Link>
        </p>
      </Card>
    </div>
  )
}
