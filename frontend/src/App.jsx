import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MapView from './pages/MapView'
import ReportIssue from './pages/ReportIssue'
import IssueDetail from './pages/IssueDetail'
import Dashboard from './pages/Dashboard'
import MunicipalDash from './pages/MunicipalDash'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/"           element={<Home />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/map"        element={<MapView />} />
              <Route path="/issues/:id" element={<IssueDetail />} />

              {/* Citizen protected */}
              <Route path="/report"    element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Officer only */}
              <Route path="/municipal" element={<ProtectedRoute role="officer"><MunicipalDash /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App