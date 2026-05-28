import { Wallet, LogOut, Menu, ChevronDown } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo_black_cropped.png'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/create': 'Create Stream',
  '/metrics': 'Analytics',
  '/history': 'History',
  '/how-it-works': 'How It Works',
  '/docs': 'Documentation',
}

export default function AppHeader({ onMenuClick }) {
  const { isConnected, address, balance, disconnect, connect } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  const pageTitle = PAGE_TITLES[location.pathname] || 'LumensFlow'
  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : ''

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(249, 249, 252, 0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      padding: '0 28px', height: '68px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
    }}>

      {/* Left: mobile menu + page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Toggle */}
        <button
          className="show-mobile"
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', color: '#000000', display: 'flex', alignItems: 'center'
          }}
        >
          <Menu size={22} />
        </button>

        {/* Logo - mobile only */}
        <Link to="/" className="show-mobile no-underline flex items-center">
          <img src={logo} alt="LumensFlow" style={{ height: '22px', width: 'auto', display: 'block' }} />
        </Link>

        {/* Page title — desktop only */}
        <span className="hide-mobile" style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '16px',
          fontWeight: 700, color: '#000000', letterSpacing: '-0.01em'
        }}>
          {pageTitle}
        </span>
      </div>

      {/* Right: network badge + wallet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Network badge */}
        <div className="hide-mobile" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(29,255,0,0.08)', border: '1px solid rgba(29,255,0,0.25)',
          borderRadius: '9999px', padding: '6px 14px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1DFF00' }} />
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px',
            fontWeight: 700, color: '#055300', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            Testnet · Optimal
          </span>
        </div>

        {/* Wallet section */}
        {isConnected ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#f3f3f6', border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '9999px', padding: '6px 10px 6px 14px',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px',
                  fontWeight: 700, color: '#000000'
                }}>{shortAddress}</span>
                <span style={{
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '10px',
                  fontWeight: 600, color: 'rgba(26,28,30,0.55)'
                }}>{parseFloat(balance || 0).toLocaleString()} XLM</span>
              </div>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Wallet size={15} color="#ffffff" />
              </div>
              <ChevronDown size={14} color="rgba(26,28,30,0.45)" style={{
                transition: 'transform 0.2s',
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
              }} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px', padding: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)', minWidth: '220px', zIndex: 1000
              }}>
                {/* Address display */}
                <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '6px' }}>
                  <div style={{
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '9px',
                    fontWeight: 700, color: 'rgba(26,28,30,0.40)',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px'
                  }}>Connected as</div>
                  <div style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px',
                    fontWeight: 600, color: '#000000', wordBreak: 'break-all', lineHeight: 1.4
                  }}>{address}</div>
                </div>

                {/* Disconnect button */}
                <button
                  onClick={() => { disconnect(); setIsDropdownOpen(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'rgba(186,26,26,0.05)', border: '1px solid rgba(186,26,26,0.15)',
                    color: '#ba1a1a', cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '13px', fontWeight: 700
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(186,26,26,0.10)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(186,26,26,0.05)'}
                >
                  <LogOut size={14} />
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connect}
            style={{
              background: '#000000', color: '#ffffff', border: 'none',
              borderRadius: '9999px', padding: '10px 20px', cursor: 'pointer',
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '13px', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <Wallet size={14} />
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )
}
