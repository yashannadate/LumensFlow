import { Zap, Twitter, Github, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #1f2937',
      padding: '80px 28px 60px',
      background: 'rgba(6, 6, 13, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
        gap: '48px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '10px', padding: '7px', display: 'flex',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.30)'
            }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-brand)', color: '#fff', letterSpacing: '-0.02em' }}>
              Lumens<span style={{ color: '#86EE1E' }}>Flow</span>
            </span>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '14px', maxWidth: '280px', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            The protocol for continuous payment streaming on Stellar. Built with Soroban.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '24px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'Documentation', to: '/docs' },
              { label: 'Features', to: '/#features' },
              { label: 'How It Works', to: '/how-it-works' },
            ].map(link => (
              <Link key={link.label} to={link.to} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13.5px', transition: 'color 0.2s' }}>{link.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '24px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Resources</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Stellar Expert', to: 'https://stellar.expert' },
              { label: 'Soroban Docs', to: 'https://soroban.stellar.org' },
              { label: 'Network laboratory', to: 'https://laboratory.stellar.org' },
            ].map(link => (
              <a key={link.label} href={link.to} target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13.5px' }}>{link.label} ↗</a>
            ))}
          </div>
        </div>

        <div></div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '64px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>© 2026 LUMENS<span style={{ color: '#86EE1E' }}>FLOW</span> PROTOCOL</div>
        <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', gap: '20px' }}>
        </div>
      </div>
    </footer>
  )
}