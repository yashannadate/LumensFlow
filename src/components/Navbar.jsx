import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../utils/stellar.js'
import { Wallet, LogOut, Copy, Check, X, ChevronDown } from 'lucide-react'

const LINKS = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Dashboard', to: '/dashboard' },
]

function WalletModal({ address, balance, onDisconnect, onClose }) {
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  const copy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '84px 28px 0' }}>
      <div ref={ref} style={{
        background: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: '24px',
        width: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.10)',
        animation: 'fade-in 0.2s ease'
      }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)', color: 'rgba(255, 255, 255, 0.60)' }}>
            Connected Wallet
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '4px' }}>
            <X size={15} color="rgba(255, 255, 255, 0.50)" />
          </button>
        </div>

        <div style={{ background: 'rgba(63, 0, 0, 0.11)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600, letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Address
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', lineHeight: '1.7', color: '#ffffff', marginBottom: '12px' }}>
            {address}
          </div>
          <button onClick={copy} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: copied ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.10)',
            border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.35)' : 'rgba(255, 255, 255, 0.18)'}`,
            borderRadius: '10px',
            padding: '8px',
            color: copied ? '#22c55e' : '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-body)'
          }}>
            {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} color="#ffffff" />}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        <div style={{ background: 'rgba(63, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600, letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Balance
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-body)' }}>
            {balance} <span style={{ fontSize: '14px', opacity: 0.45, fontWeight: 400 }}>XLM</span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', marginTop: '4px' }}>
            Stellar Testnet
          </div>
        </div>

        <button onClick={() => { onDisconnect(); onClose() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '14px',
            padding: '12px',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-body)'
          }}>
          <LogOut size={14} color="#ef4444" /> Disconnect Wallet
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { address, isConnected, connect, disconnect, connecting, balance } = useWallet()
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)

  const handleConnect = async () => { await connect(); navigate('/dashboard') }
  const active = (to) => location.pathname === to

  return (
    <>
      {/* Floating navbar with blue gradient theme */}
      <header className="navbar">

        {/* Logo with Archivo Black font */}
        <Link to={isConnected ? '/dashboard' : '/'} className="navbar-brand">
          <span className="navbar-brand-name">LumensFlow</span>
        </Link>

        {/* Nav links */}
        <nav className="navbar-links">
          {LINKS.map(({ label, to }) => (
            <Link key={to} to={to} className={active(to) ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Wallet button */}
        <div className="navbar-actions">
          {isConnected ? (
            <button onClick={() => setShowModal(true)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.10)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              borderRadius: '9999px',
              padding: '6px 14px 6px 6px',
              color: '#ffffff',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--btn-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Wallet size={13} color="#ffffff" />
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff'
              }}>
                {truncateAddress(address)}
              </div>
              <ChevronDown size={13} color="rgba(255, 255, 255, 0.50)" />
            </button>
          ) : (
            <button onClick={handleConnect} disabled={connecting} className="btn-nav">
              <Wallet size={14} />
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>

      </header>

      {showModal && <WalletModal address={address} balance={balance} onDisconnect={disconnect} onClose={() => setShowModal(false)} />}
    </>
  )
}