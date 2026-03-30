import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoans } from '../context/LoansContext'
import { Card } from '../components/ui/Card'
import { TextField } from '../components/ui/TextField'
import { Button } from '../components/ui/Button'
import { AlertStrip } from '../components/ui/AlertStrip'
import { useAuth } from '../context/AuthContext'

export function LoanApplicationPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { applyLoan, setActionMessage, setErrorMessage } = useLoans()
  const [name, setName] = useState('')
  const [income, setIncome] = useState('')
  const [amount, setAmount] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canApply = user?.role === 'customer'

  const validation = useMemo(() => {
    const parsedIncome = Number(income)
    const parsedAmount = Number(amount)

    if (!name.trim()) {
      return 'Name is required.'
    }

    if (!parsedIncome || parsedIncome <= 0) {
      return 'Income must be greater than 0.'
    }

    if (!parsedAmount || parsedAmount <= 0) {
      return 'Loan amount must be greater than 0.'
    }

    const maxAllowed = parsedIncome * 10

    if (parsedAmount > maxAllowed) {
      return `Loan amount exceeds limit. Maximum allowed is ${maxAllowed.toLocaleString()}.`
    }

    return ''
  }, [name, income, amount])

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!canApply) {
      setSubmitError('Only customer accounts can submit loan applications.')
      return
    }

    if (validation) {
      setSubmitError(validation)
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      setErrorMessage('')
      const created = await applyLoan({ amount })
      setActionMessage(`Application submitted for ${name}.`)
      navigate(`/loans/${created.id}`)
    } catch (error) {
      setSubmitError(error?.response?.data?.detail || 'Loan application failed. Verify token and role.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-transition">
      <Card className="mx-auto max-w-4xl space-y-7">
        <header className="space-y-2 border-b border-[var(--color-border)] pb-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Customer Intake</p>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.08em]">New Loan Application</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Validation guardrail: requested amount cannot exceed 10x declared income.</p>
        </header>

        {submitError ? <AlertStrip tone="error">{submitError}</AlertStrip> : null}
        {!canApply ? <AlertStrip tone="neutral">Current role is {user?.role || 'unknown'}. Switch to a customer account to submit a loan.</AlertStrip> : null}

        <form className="grid gap-6 lg:grid-cols-12" onSubmit={onSubmit} noValidate>
          <TextField
            className="lg:col-span-7"
            id="name"
            label="Applicant Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter full legal name"
            autoComplete="name"
            error={!name.trim() && submitError ? 'Please provide your name.' : ''}
          />
          <TextField
            className="lg:col-span-5"
            id="income"
            label="Annual Income"
            value={income}
            onChange={(event) => setIncome(event.target.value)}
            placeholder="e.g. 85000"
            inputMode="decimal"
          />
          <TextField
            className="lg:col-span-7"
            id="amount"
            label="Requested Loan Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 300000"
            inputMode="decimal"
            description="Rule: loan amount must be less than or equal to income x 10."
          />
          <div className="flex items-end lg:col-span-5">
            <Button className="w-full" type="submit" disabled={isSubmitting || !canApply}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
