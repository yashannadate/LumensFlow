import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Waves, HelpCircle, Plus, BookOpen, LifeBuoy, Zap } from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',    to: '/dashboard' },
  { icon: Waves,           label: 'Create Stream', to: '/create'    },
  { icon: HelpCircle,      label: 'How It Works',  to: '/how-it-works' },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="app-sidebar" style={{ background: '#0a0a0f', borderRight: '1px solid #1f2937' }}>

      {/* Logo matching Landing Page */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1f2937' }}>
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
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV.map(({ icon: Icon, label, to }) => {
          const isActive = pathname === to || (to === '/dashboard' && pathname.startsWith('/stream'))
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 16px', 
                fontFamily: 'var(--font-label)', fontSize: '13.5px', fontWeight: 500,
                color: isActive ? '#fff' : '#9ca3af',
                background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
                borderRadius: '0 9999px 9999px 0',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={17} color={isActive ? '#8b5cf6' : 'currentColor'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* CTA + footer */}
      <div style={{ padding: '20px 16px', borderTop: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Link to="/create" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '13px', borderRadius: '9999px',
            background: '#8b5cf6', border: 'none',
            color: '#fff', fontFamily: 'var(--font-brand)', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(139,92,246,0.30)',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            <Plus size={15} /> Create
          </button>
        </Link>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
           <a href="#" style={{ color: '#6b7280', fontSize: '10.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Docs</a>
           <a href="#" style={{ color: '#6b7280', fontSize: '10.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Support</a>
        </div>
      </div>
    </aside>
  )
}
