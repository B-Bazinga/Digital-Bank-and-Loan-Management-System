import { Navigate, useLocation } from 'react-router-dom'
import { Card } from '../ui/Card'
import { useAuth } from '../../context/AuthContext'

function defaultPathForRole(role) {
  if (role === 'admin') return '/'
  if (role === 'customer') return '/loans'
  if (role === 'employee') return '/loans'
  return '/login'
}

export function ProtectedRoute({ children, allowedRoles = [], redirectTo }) {
  const location = useLocation()
  const { isAuthenticated, authLoading, user } = useAuth()

  if (authLoading) {
    return (
      <Card className="grid min-h-60 place-items-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Authenticating session...</p>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate replace to={redirectTo || defaultPathForRole(user?.role)} />
  }

  return children
}
