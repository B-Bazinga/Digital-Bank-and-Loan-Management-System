import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoansProvider, useLoans } from './context/LoansContext'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { LoanApplicationPage } from './pages/LoanApplicationPage'
import { LoanDetailPage } from './pages/LoanDetailPage'
import { LoansWorkspacePage } from './pages/LoansWorkspacePage'
import { RegisterPage } from './pages/RegisterPage'

function AnimatedRoutes() {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const { setActionMessage } = useLoans()

  const handleLogout = () => {
    logout()
    setActionMessage('')
  }

  return (
    <AppShell user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={isAuthenticated ? <Navigate replace to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate replace to="/" /> : <RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectTo="/loans">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <ProtectedRoute allowedRoles={['customer', 'employee']} redirectTo="/">
              <LoansWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute allowedRoles={['customer']} redirectTo="/loans">
              <LoanApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/:loanId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
              <LoanDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <AuthProvider>
      <LoansProvider>
        <AnimatedRoutes />
      </LoansProvider>
    </AuthProvider>
  )
}

export default App
