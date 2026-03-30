import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLoans } from '../context/LoansContext'
import { compactId, currency } from '../lib/format'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { LoanTimeline } from '../components/loan/LoanTimeline'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export function LoanDetailPage() {
  const navigate = useNavigate()
  const { loanId } = useParams()
  const { user } = useAuth()
  const { loans, updateLoanStatus } = useLoans()
  const canModerate = ['admin', 'employee'].includes(user?.role)
  const fallbackPath = user?.role === 'admin' ? '/' : '/loans'

  const loan = useMemo(() => loans.find((item) => item.id === loanId), [loans, loanId])

  if (!loan) {
    return (
      <Card className="grid min-h-60 place-items-center gap-3 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.08em]">Loan Not Found</h1>
        <p className="max-w-md text-sm text-[var(--color-text-muted)]">The selected loan is unavailable in local state. Refresh dashboard data and try again.</p>
        <Link className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent)] underline-offset-2 hover:underline" to={fallbackPath}>
          Return to workspace
        </Link>
      </Card>
    )
  }

  return (
    <div className="page-transition space-y-6">
      <Card className="space-y-6">
        <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Loan Detail</p>
            <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.08em]">Application {compactId(loan.id)}</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">Borrower {compactId(loan.userId)} requested {currency(loan.amount)}.</p>
          </div>
          <StatusBadge status={loan.status} className="self-start" />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Loan ID</p>
            <p className="mt-3 font-mono text-xs text-[var(--color-text)]">{loan.id}</p>
          </Card>
          <Card>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Borrower ID</p>
            <p className="mt-3 font-mono text-xs text-[var(--color-text)]">{loan.userId}</p>
          </Card>
          <Card>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Requested Amount</p>
            <p className="mt-3 text-2xl font-bold text-[var(--color-text)]">{currency(loan.amount)}</p>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Progress Timeline</h2>
          <LoanTimeline status={loan.status} />
        </section>

        <section className="flex flex-wrap gap-3 border-t border-[var(--color-border)] pt-5">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
          {canModerate ? (
            <>
              <Button variant="success" disabled={loan.status !== 'pending'} onClick={() => updateLoanStatus(loan.id, 'approve')}>
                Approve
              </Button>
              <Button variant="danger" disabled={loan.status !== 'pending'} onClick={() => updateLoanStatus(loan.id, 'reject')}>
                Reject
              </Button>
            </>
          ) : null}
        </section>
      </Card>
    </div>
  )
}
