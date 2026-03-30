import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'

export function AppShell({ children, user, isAuthenticated, onLogout }) {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'
  const links =
    user?.role === 'admin'
      ? [{ to: '/', label: 'Dashboard' }]
      : user?.role === 'customer'
        ? [
            { to: '/loans', label: 'Loans' },
            { to: '/apply', label: 'Apply' },
          ]
        : [{ to: '/loans', label: 'Loans' }]

  return (
    <div className="app-grid-bg min-h-screen text-[var(--color-text)]">
      {!isAuthRoute ? (
        <header className="border-b border-[var(--color-border)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Loan Command Surface</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Financial Operations</p>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors',
                        isActive
                          ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                          : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <p className="border border-[var(--color-border)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    {user?.name || 'Account'} / {user?.role || 'unknown'}
                  </p>
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
      ) : null}
      <main
        className={cn(
          'mx-auto w-full',
          isAuthRoute
            ? 'flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8'
            : 'max-w-7xl px-4 py-6 sm:px-6 lg:px-8',
        )}
      >
        {children}
      </main>
    </div>
  )
}
