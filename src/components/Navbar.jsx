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
    { label: 'Protocol',    to: 'https://soroban.stellar.org', external: true },
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
        }}>LumensFlow</span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-desktop">
        {navLinks.map(link => <NavItem key={link.label} {...link} />)}
      </div>

      {/* Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isConnected ? (
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '9999px', fontSize: '13px' }}>
              Launch App <ArrowRight size={14} />
            </button>
          </Link>
        ) : (
          <button 
            onClick={async () => {
              const success = await connect()
              if (success) {
                navigate('/dashboard')
              }
            }}
            className="btn-primary" 
            style={{ padding: '10px 24px', borderRadius: '9999px', fontSize: '13px' }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}