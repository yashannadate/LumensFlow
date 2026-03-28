import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { WalletProvider, useWallet } from './hooks/useWallet.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import AppHeader from './components/AppHeader.jsx'
import Footer from './components/Footer.jsx'

import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateStream from './pages/CreateStream.jsx'
import StreamDetails from './pages/StreamDetails.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Docs from './pages/Docs.jsx'
import Metrics from './pages/Metrics.jsx'
import History from './pages/History.jsx'

// Routes that use the sidebar shell layout
const APP_ROUTES = ['/dashboard', '/create', '/stream', '/metrics', '/history']

function ProtectedRoute({ children }) {
  const { isConnected } = useWallet()
  const location = useLocation()
  if (!isConnected) return <Navigate to="/" replace state={{ from: location }} />
  return children
}

function AppRoutes() {
  const location = useLocation()
  const isAppRoute = APP_ROUTES.some(r => location.pathname.startsWith(r))

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  if (isAppRoute) {
    return (
      <div className="app-authenticated">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop show-mobile"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="app-content">
          <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="app-main">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreateStream /></ProtectedRoute>} />
              <Route path="/stream/:id" element={<ProtectedRoute><StreamDetails /></ProtectedRoute>} />
              <Route path="/metrics" element={<ProtectedRoute><Metrics /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    )
  }

  // Public pages with floating navbar
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main" style={{ paddingTop: '88px' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/docs" element={<Docs />} />
          {/* Catch-all: redirect to dashboard or home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </ToastProvider>
  )
}

export default App