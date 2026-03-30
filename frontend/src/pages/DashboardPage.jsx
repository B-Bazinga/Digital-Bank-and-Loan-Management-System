import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoans } from '../context/LoansContext'
import { compactId, currency } from '../lib/format'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { SelectField } from '../components/ui/SelectField'
import { Button } from '../components/ui/Button'
import { AlertStrip } from '../components/ui/AlertStrip'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

const statusOptions = [
  { value: 'all', label: 'All status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { loans, loading, refreshing, errorMessage, actionMessage, fetchLoans } = useLoans()
  const [statusFilter, setStatusFilter] = useState('all')
  const [adminReport, setAdminReport] = useState(null)
  const [customers, setCustomers] = useState([])
  const [adminLoading, setAdminLoading] = useState(true)
  const [adminError, setAdminError] = useState('')

  const isAdmin = user?.role === 'admin'

  const filteredLoans = useMemo(() => {
    if (statusFilter === 'all') return loans
    return loans.filter((loan) => loan.status === statusFilter)
  }, [loans, statusFilter])

  const summary = useMemo(() => {
    return {
      total: loans.length,
      approved: loans.filter((loan) => loan.status === 'approved').length,
      rejected: loans.filter((loan) => loan.status === 'rejected').length,
      pending: loans.filter((loan) => loan.status === 'pending').length,
    }
  }, [loans])

  const approvalRate = useMemo(() => {
    if (!summary.total) return 0
    return Math.round((summary.approved / summary.total) * 100)
  }, [summary.approved, summary.total])

  const pendingRate = useMemo(() => {
    if (!summary.total) return 0
    return Math.round((summary.pending / summary.total) * 100)
  }, [summary.pending, summary.total])

  const columns = [
    { key: 'id', label: 'Loan ID', render: (loan) => <span className="font-mono text-xs">{compactId(loan.id)}</span> },
    { key: 'userId', label: 'User', render: (loan) => <span className="font-mono text-xs text-[var(--color-text-muted)]">{compactId(loan.userId)}</span> },
    { key: 'amount', label: 'Amount', render: (loan) => <span className="text-base font-semibold">{currency(loan.amount)}</span> },
    { key: 'status', label: 'Status', render: (loan) => <StatusBadge status={loan.status} /> },
  ]

  const customerColumns = [
    { key: 'name', label: 'Name', render: (customer) => <span className="font-semibold">{customer.name}</span> },
    { key: 'email', label: 'Email', render: (customer) => <span className="font-mono text-xs text-[var(--color-text-muted)]">{customer.email}</span> },
    { key: 'role', label: 'Role', render: (customer) => <StatusBadge status={customer.role} /> },
  ]

  const fetchAdminData = useCallback(async () => {
    if (!isAdmin) {
      setAdminLoading(false)
      setAdminError('')
      setAdminReport(null)
      setCustomers([])
      return
    }

    setAdminLoading(true)

    try {
      const [reportResponse, customersResponse] = await Promise.all([
        api.get('/admin/reports'),
        api.get('/admin/customers'),
      ])

      setAdminReport(reportResponse?.data || null)
      setCustomers(Array.isArray(customersResponse?.data) ? customersResponse.data : [])
      setAdminError('')
    } catch (error) {
      setAdminError(error?.response?.data?.detail || 'Unable to fetch admin data.')
    } finally {
      setAdminLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    let active = true

    const run = async () => {
      await fetchAdminData()
      if (!active) {
        return
      }
    }

    run()

    return () => {
      active = false
    }
  }, [fetchAdminData])

  if (!isAdmin) {
    return (
      <Card className="grid min-h-60 place-items-center gap-3 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.08em]">Admin Access Required</h1>
        <p className="max-w-md text-sm text-[var(--color-text-muted)]">The dashboard is restricted to admin accounts. Use the loan application workspace for customer actions.</p>
        <Button onClick={() => navigate('/apply')}>Go To Loan Application</Button>
      </Card>
    )
  }

  return (
    <div className="page-transition admin-dashboard space-y-6">
      {adminError ? <AlertStrip tone="error">{adminError}</AlertStrip> : null}

      <Card className="admin-hero overflow-hidden rounded-2xl border p-0">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Administration Console</p>
            <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">Operations Overview</h1>
            <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">Track customer activity, monitor loan health, and inspect records in one control surface built for admins.</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Role: {user?.role || 'admin'}</span>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Approval Rate: {approvalRate}%</span>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Pending Share: {pendingRate}%</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Button variant="ghost" onClick={fetchAdminData} disabled={adminLoading}>
              {adminLoading ? 'Refreshing Admin...' : 'Refresh Admin Data'}
            </Button>
            <Button variant="ghost" onClick={() => fetchLoans(false)} disabled={refreshing || loading}>
              {refreshing || loading ? 'Refreshing Loans...' : 'Refresh Loan Feed'}
            </Button>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-5">
        <Card className="rounded-xl border-l-2 border-l-[var(--color-accent)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Total Users</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-text)]">{adminLoading ? '...' : adminReport?.users ?? 0}</p>
        </Card>
        <Card className="rounded-xl border-l-2 border-l-[var(--color-success)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Customers</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-success)]">{adminLoading ? '...' : adminReport?.customers ?? 0}</p>
        </Card>
        <Card className="rounded-xl border-l-2 border-l-[var(--color-warning)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Employees</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-warning)]">{adminLoading ? '...' : adminReport?.employees ?? 0}</p>
        </Card>
        <Card className="rounded-xl border-l-2 border-l-[var(--color-accent)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Total Loans</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-text)]">{adminLoading ? '...' : adminReport?.total_loans ?? 0}</p>
        </Card>
        <Card className="rounded-xl border-l-2 border-l-[var(--color-accent)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Total Loan Amount</p>
          <p className="mt-3 text-2xl font-bold text-[var(--color-accent)]">{adminLoading ? '...' : currency(adminReport?.total_loan_amount ?? 0)}</p>
        </Card>
      </section>

      <Card className="space-y-5 rounded-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Directory</p>
            <h2 className="mt-1 font-heading text-2xl font-bold uppercase tracking-[0.08em]">Customers</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">Live customer records from admin API.</p>
          </div>
          <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Count: {customers.length}</span>
        </div>

        <DataTable columns={customerColumns} rows={customers.map((item) => ({ ...item, id: item._id || item.id }))} />
      </Card>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Loan Records</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-text)]">{summary.total}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Approved</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-success)]">{summary.approved}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Pending</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-warning)]">{summary.pending}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Rejected</p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-danger)]">{summary.rejected}</p>
        </Card>
      </section>

      <Card className="space-y-5 rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Monitoring</p>
            <h1 className="mt-1 font-heading text-3xl font-bold uppercase tracking-[0.08em]">Loan Surveillance Grid</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">Select a row to inspect details. Loan moderation controls are available inside detail view only.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <SelectField id="status" label="Filter Status" options={statusOptions} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} />
            <Button variant="ghost" onClick={() => fetchLoans(false)} disabled={refreshing || loading}>
              {refreshing || loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {errorMessage ? <AlertStrip tone="error">{errorMessage}</AlertStrip> : null}
        {actionMessage ? <AlertStrip tone="success">{actionMessage}</AlertStrip> : null}

        {loading ? (
          <div className="grid min-h-56 place-items-center border border-[var(--color-border)]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Loading loan ledger...</p>
          </div>
        ) : (
          <DataTable columns={columns} rows={filteredLoans} onRowClick={(loan) => navigate(`/loans/${loan.id}`)} />
        )}
      </Card>
    </div>
  )
}
