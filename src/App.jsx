import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { WalletProvider, useWallet } from './hooks/useWallet.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateStream from './pages/CreateStream.jsx'
import StreamDetails from './pages/StreamDetails.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Explorer from './pages/Explorer.jsx'

function ProtectedRoute({ children }) {
  const { isConnected } = useWallet()
  const location = useLocation()

  if (!isConnected) {
    return <Navigate to="/" replace state={{ from: location }} />
  }
  return children
}

function AppRoutes() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateStream />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stream/:id"
            element={
              <ProtectedRoute>
                <StreamDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  )
}

export default App