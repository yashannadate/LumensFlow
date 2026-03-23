import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { ArrowRight, LogOut, Wallet, User, Zap, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { isConnected, address, balance, connect, disconnect } = useWallet()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Docs', to: '/docs' },
    { label: 'Protocol', to: 'https://soroban.stellar.org', external: true },
  ]

  const NavItem = ({ label, to, external }) => (
    <Link
      to={to}
      target={external ? '_blank' : '_self'}
      style={{
        color: pathname === to ? '#fff' : '#9ca3af',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'var(--font-label)',
        transition: 'color 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = pathname === to ? '#fff' : '#9ca3af'}
    >
      {label}
    </Link>
  )

  return (
    <nav style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '1100px',
      height: '64px',
      background: isScrolled ? 'rgba(6, 6, 13, 0.85)' : 'rgba(13, 17, 23, 0.40)',
      backdropFilter: 'blur(16px)',
      border: `1px solid ${isScrolled ? '#1f2937' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 2000,
      transition: 'all 0.3s'
    }}>

      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={18} color="white" />
        </div>
        <span style={{
          fontFamily: 'var(--font-brand)', fontSize: '18px', fontWeight: 900,
          color: '#fff', letterSpacing: '-0.02em'
        }}>Lumens<span style={{ color: '#86EE1E' }}>Flow</span></span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hide-mobile">
        {navLinks.map(link => <NavItem key={link.label} {...link} />)}
      </div>

      {/* Auth & Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="hide-mobile">
          {isConnected ? (
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '9999px', fontSize: '13px' }}>
                Dashboard <ArrowRight size={14} />
              </button>
            </Link>
          ) : (
            <button
              onClick={async () => {
                const success = await connect()
                if (success) navigate('/dashboard')
              }}
              className="btn-primary"
              style={{ padding: '10px 24px', borderRadius: '9999px', fontSize: '13px' }}
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="show-mobile"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none', border: 'none', color: '#fff',
            cursor: 'pointer', padding: '8px'
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '80px', left: '16px', right: '16px',
          background: 'rgba(9, 20, 33, 0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
          padding: '24px', zIndex: 3000, display: 'flex', flexDirection: 'column',
          gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          animation: 'fade-in 0.2s ease-out'
        }}>
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              target={link.external ? '_blank' : '_self'}
              style={{
                fontSize: '18px', fontWeight: 600, color: '#fff',
                textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '10px' }}>
            {isConnected ? (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Dashboard <ArrowRight size={16} />
                </button>
              </Link>
            ) : (
              <button
                onClick={async () => {
                  setIsMobileMenuOpen(false)
                  const success = await connect()
                  if (success) navigate('/dashboard')
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}