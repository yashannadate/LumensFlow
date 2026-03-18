import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../utils/stellar.js'
import { LogOut, Zap, Copy, Check, X } from 'lucide-react'

const StellarLogo = () => (
  <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    <circle cx="16" cy="16" r="16" fill="#8b5cf6"/>
    <path d="M24.7 10.6l-1.7.9-13.4 7.1-.9-1.7 13.4-7.1 1.7-.9.9 1.7z" fill="white"/>
    <path d="M7.3 21.4l1.7-.9 13.4-7.1.9 1.7-13.4 7.1-1.7.9-.9-1.7z" fill="white"/>
    <circle cx="16" cy="16" r="2" fill="white"/>
  </svg>
)

const NAV_LINKS = [
  { label: 'Features',     to: '/#features' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Explorer',     to: '/explorer' },
  { label: 'Dashboard',    to: '/dashboard' },
]

function WalletModal({ address, balance, onDisconnect, onClose }) {
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const copy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 2000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
      padding: '80px 24px 0',
    }}>
      <div ref={ref} style={{
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '20px',
        padding: '24px',
        width: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        animation: 'fade-in 0.15s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StellarLogo />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Connected Wallet</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Address */}
        <div style={{ background: '#0d0d14', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Wallet Address
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', lineHeight: '1.6', color: '#e2e8f0', marginBottom: '12px' }}>
            {address}
          </div>
          <button
            onClick={copy}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(139,92,246,0.2)'}`,
              borderRadius: '8px',
              padding: '7px 12px',
              color: copied ? '#22c55e' : '#a78bfa',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Balance */}
        <div style={{ background: '#0d0d14', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px', textTransform: 'uppercase' }}>
            Balance
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#a78bfa', fontFamily: 'var(--font-display)' }}>
            {balance} <span style={{ fontSize: '14px', opacity: 0.7, fontWeight: 400 }}>XLM</span>
          </div>
          <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>Stellar Testnet</div>
        </div>

        {/* Disconnect */}
        <button
          onClick={() => { onDisconnect(); onClose() }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
            padding: '12px',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
        >
          <LogOut size={14} /> Disconnect Wallet
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { address, isConnected, connect, disconnect, connecting, balance } = useWallet()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showModal, setShowModal] = useState(false)

  const handleConnect = async () => {
    await connect()
    navigate('/dashboard')
  }

  const isActive = (to) => {
    if (to === '/dashboard')    return location.pathname === '/dashboard'
    if (to === '/how-it-works') return location.pathname === '/how-it-works'
    if (to === '/explorer')     return location.pathname === '/explorer'
    if (to === '/#features')    return location.pathname === '/'
    return false
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: '72px', display: 'flex', alignItems: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to={isConnected ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
            <Zap size={22} color="var(--purple)" fill="var(--purple)" />
            <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px', fontFamily: 'var(--font-display)' }}>LumensFlow</span>
          </Link>

          {/* Center Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive(to) ? 700 : 500,
                  color: isActive(to) ? 'white' : '#9ca3af',
                  background: isActive(to) ? 'rgba(139,92,246,0.1)' : 'transparent',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = '#9ca3af' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Wallet Button */}
          {isConnected ? (
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '50px',
                padding: '10px 20px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.background = '#111827' }}
              title="Click to manage wallet"
            >
              <StellarLogo />
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {truncateAddress(address)}
              </span>
              <span style={{ fontSize: '11px', color: '#a78bfa', fontFamily: 'monospace' }}>
                {balance} XLM
              </span>
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#8b5cf6',
                border: 'none',
                borderRadius: '50px',
                padding: '10px 20px',
                color: 'white',
                cursor: connecting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                opacity: connecting ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!connecting) e.currentTarget.style.background = '#7c3aed' }}
              onMouseLeave={e => { if (!connecting) e.currentTarget.style.background = '#8b5cf6' }}
            >
              <StellarLogo />
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      {showModal && (
        <WalletModal
          address={address}
          balance={balance}
          onDisconnect={disconnect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
