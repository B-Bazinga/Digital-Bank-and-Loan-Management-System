import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { SelectField } from '../components/ui/SelectField'
import { Button } from '../components/ui/Button'
import { AlertStrip } from '../components/ui/AlertStrip'
import { useAuth } from '../context/AuthContext'

const roleOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'employee', label: 'Employee' },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, authLoading, authError, setAuthError } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [formError, setFormError] = useState('')

  const validationError = useMemo(() => {
    if (!name.trim()) return 'Name is required.'
    if (!email.trim()) return 'Email is required.'
    if (password.length < 6) return 'Password must contain at least 6 characters.'
    return ''
  }, [name, email, password])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError('')
    setAuthError('')

    try {
      await register({ name, email, password, role })
      navigate('/', { replace: true })
    } catch {
      // handled by auth context
    }
  }

  return (
    <div className="page-transition auth-shell w-full max-w-3xl">
      <Card className="auth-card space-y-7 rounded-2xl p-6 sm:p-8">
        <header className="space-y-3 border-b border-[var(--color-border)] pb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Onboarding</p>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">Create Account</h1>
          <p className="mx-auto max-w-2xl text-sm text-[var(--color-text-muted)]">New customers can apply for loans. Employees can moderate pending requests after admin approval.</p>
        </header>

        {formError ? <AlertStrip tone="error">{formError}</AlertStrip> : null}
        {authError ? <AlertStrip tone="error">{authError}</AlertStrip> : null}

        <form className="grid gap-6 rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_72%,transparent)] p-4 sm:p-5 lg:grid-cols-12" onSubmit={handleSubmit} noValidate>
          <TextField
            className="lg:col-span-6"
            id="name"
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
            autoComplete="name"
          />
          <TextField
            className="lg:col-span-6"
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@bank.com"
            autoComplete="username"
          />
          <TextField
            className="lg:col-span-6"
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <SelectField
            className="lg:col-span-6"
            id="role"
            label="Role"
            options={roleOptions}
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
          <div className="lg:col-span-12">
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link className="font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
