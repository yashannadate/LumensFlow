import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import React, { useState } from 'react'
import logoBlack from '../assets/logo_black_cropped.png'

export default function Navbar() {
  const { isConnected, connect } = useWallet()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLaunch = async () => {
    if (!isConnected) {
      const success = await connect()
      if (!success) return
    }
    navigate('/dashboard')
  }

  const handleScrollTo = (elementId) => {
    setIsMobileMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(elementId.replace('#', ''))
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const element = document.getElementById(elementId.replace('#', ''))
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const NavLink = ({ to, children, onClick }) => {
    const active = to ? isActive(to) : false
    const baseClass = `relative text-sm font-semibold transition-colors duration-200 pb-1 bg-transparent border-none cursor-pointer`
    const activeClass = active
      ? 'text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black after:rounded-full'
      : 'text-black/50 hover:text-black'

    if (onClick) {
      return (
        <button onClick={onClick} className={`${baseClass} ${activeClass}`} style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
          {children}
        </button>
      )
    }
    return (
      <Link to={to} className={`${baseClass} ${activeClass} no-underline`} style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
        {children}
      </Link>
    )
  }

  return (
    <nav style={{
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)', maxWidth: '1200px', zIndex: 1000,
      background: 'rgba(249, 249, 252, 0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '9999px',
      padding: '10px 12px 10px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.80)'
    }}>
      {/* Logo */}
      <Link to="/" className="flex items-center no-underline flex-shrink-0">
        <img
          src={logoBlack}
          alt="LumensFlow"
          style={{ height: '28px', width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink onClick={() => handleScrollTo('#how-it-works')}>How It Works</NavLink>
        <NavLink to="/docs">Docs</NavLink>
        <NavLink onClick={() => handleScrollTo('#how-it-works')}>Protocol</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </div>

      {/* Action Button & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLaunch}
          style={{
            background: '#000000', color: '#ffffff', border: 'none',
            borderRadius: '9999px', padding: '10px 22px',
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1c1c1c'}
          onMouseLeave={e => e.currentTarget.style.background = '#000000'}
        >
          {isConnected ? 'Dashboard' : 'Launch App'}
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-black focus:outline-none flex items-center"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '20px', padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)'
        }}>
          {[
            { label: 'How It Works', onClick: () => handleScrollTo('#how-it-works') },
            { label: 'Docs', to: '/docs' },
            { label: 'Protocol', onClick: () => handleScrollTo('#how-it-works') },
            { label: 'Dashboard', to: '/dashboard' },
          ].map(item => (
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '12px 16px', borderRadius: '12px',
                  textDecoration: 'none', fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: '15px', fontWeight: 600,
                  color: isActive(item.to) ? '#000000' : 'rgba(26,28,30,0.60)',
                  background: isActive(item.to) ? 'rgba(0,0,0,0.04)' : 'transparent',
                  borderBottom: isActive(item.to) ? '2px solid #000000' : 'none',
                }}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.onClick}
                style={{
                  padding: '12px 16px', borderRadius: '12px', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: '15px', fontWeight: 600,
                  color: 'rgba(26,28,30,0.60)',
                }}
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </nav>
  )
}