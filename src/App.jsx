import { useState, useEffect, useRef } from 'react'
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

/* ── Animated page wrapper ──────────────────────────────── */
function PageTransition({ children, locationKey }) {
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)
  const prevKey = useRef(null)

  useEffect(() => {
    if (prevKey.current === locationKey) return
    prevKey.current = locationKey

    // Fade out
    setVisible(false)
    const t1 = setTimeout(() => {
      setShow(true)
      // Tiny delay to let DOM paint before fading in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    }, 180)

    return () => clearTimeout(t1)
  }, [locationKey])

  // Initial mount
  useEffect(() => {
    const t = setTimeout(() => { setShow(true); setVisible(true) }, 20)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.30s cubic-bezier(0.4, 0, 0.2, 1), transform 0.30s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
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
            <PageTransition locationKey={location.pathname}>
              <Routes location={location}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateStream />} />
                <Route path="/stream/:id" element={<StreamDetails />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </PageTransition>
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
        <PageTransition locationKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/docs" element={<Docs />} />
            {/* Catch-all: redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
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