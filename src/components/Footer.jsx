import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border)', 
      padding: '80px 24px',
      background: 'var(--bg)',
      marginTop: 'auto'
    }}>
      <div className="row-between" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', alignItems: 'flex-start' }}>
        <div className="stack" style={{ gap: '16px' }}>
           <div className="row" style={{ gap: '12px' }}>
              <Zap size={24} color="var(--purple)" fill="var(--purple)" />
              <span style={{ fontSize: '24px' }}>LumensFlow</span>
           </div>
           <p className="text-muted" style={{ fontSize: '16px', maxWidth: '300px', lineHeight: '1.6' }}>
             Continuous payment streaming infrastructure on the Stellar Network.
           </p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="text-muted" style={{ fontSize: '14px' }}>© 2026 LumensFlow Protocol</p>
          <p className="text-secondary" style={{ fontSize: '12px', opacity: 0.6 }}>
            Built for Rise In Stellar Journey to Mastery
          </p>
        </div>
      </div>
    </footer>
  )
}
