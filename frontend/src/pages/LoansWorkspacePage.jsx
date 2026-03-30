import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { SelectField } from '../components/ui/SelectField'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { AlertStrip } from '../components/ui/AlertStrip'
import { useLoans } from '../context/LoansContext'
import { useAuth } from '../context/AuthContext'
import { compactId, currency } from '../lib/format'

const statusOptions = [
  { value: 'all', label: 'All status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function LoansWorkspacePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { loans, loading, refreshing, errorMessage, actionMessage, fetchLoans } = useLoans()
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLoans = useMemo(() => {
    if (statusFilter === 'all') return loans
    return loans.filter((loan) => loan.status === statusFilter)
  }, [loans, statusFilter])

  const summary = useMemo(
    () => ({
      total: loans.length,
      pending: loans.filter((loan) => loan.status === 'pending').length,
      approved: loans.filter((loan) => loan.status === 'approved').length,
      rejected: loans.filter((loan) => loan.status === 'rejected').length,
    }),
    [loans],
  )

  const columns = [
    { key: 'id', label: 'Loan ID', render: (loan) => <span className="font-mono text-xs">{compactId(loan.id)}</span> },
    { key: 'userId', label: 'User', render: (loan) => <span className="font-mono text-xs text-[var(--color-text-muted)]">{compactId(loan.userId)}</span> },
    { key: 'amount', label: 'Amount', render: (loan) => <span className="text-base font-semibold">{currency(loan.amount)}</span> },
    { key: 'status', label: 'Status', render: (loan) => <StatusBadge status={loan.status} /> },
  ]

  return (
    <div className="page-transition space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Total Loans</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-text)]">{summary.total}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Pending</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-warning)]">{summary.pending}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Approved</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-success)]">{summary.approved}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Rejected</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-danger)]">{summary.rejected}</p>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.08em]">Loan Workspace</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {user?.role === 'employee'
                ? 'Review and inspect loan records. Approval decisions are available in detail view.'
                : 'Track your applications and open any record for full status detail.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <SelectField id="status" label="Filter Status" options={statusOptions} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} />
            <Button variant="ghost" onClick={() => fetchLoans(false)} disabled={refreshing || loading}>
              {refreshing || loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            {user?.role === 'customer' ? <Button onClick={() => navigate('/apply')}>Apply Loan</Button> : null}
          </div>
        </div>

        {errorMessage ? <AlertStrip tone="error">{errorMessage}</AlertStrip> : null}
        {actionMessage ? <AlertStrip tone="success">{actionMessage}</AlertStrip> : null}

        {loading ? (
          <div className="grid min-h-56 place-items-center border border-[var(--color-border)]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Loading loan records...</p>
          </div>
        ) : (
          <DataTable columns={columns} rows={filteredLoans} onRowClick={(loan) => navigate(`/loans/${loan.id}`)} />
        )}
      </Card>
    </div>
  )
}
