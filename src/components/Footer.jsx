import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid rgba(139,92,246,0.1)',padding:'56px 28px',background:'rgba(5,5,14,0.8)',backdropFilter:'blur(20px)',marginTop:'auto' }}>
      <div style={{ maxWidth:'1160px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'32px' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div style={{ background:'var(--gradient-btn)',borderRadius:'10px',padding:'7px',display:'flex',boxShadow:'0 4px 16px rgba(139,92,246,0.3)' }}>
              <Zap size={16} color="white"/>
            </div>
            <span style={{ fontSize:'17px',fontWeight:700,fontFamily:'var(--font-display)' }}>LumensFlow</span>
          </div>
          <p style={{ color:'var(--text-muted)',fontSize:'13px',maxWidth:'280px',lineHeight:1.7 }}>
            Continuous payment streaming infrastructure built on Stellar Soroban smart contracts.
          </p>
        </div>
        <div style={{ display:'flex',gap:'48px',flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:'11px',color:'var(--text-dim)',fontWeight:600,letterSpacing:'1.5px',marginBottom:'12px',textTransform:'uppercase' }}>App</div>
            <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
              {[['Dashboard','/dashboard'],['Explorer','/explorer'],['Create Stream','/create']].map(([label, to]) => (
                <Link key={to} to={to} style={{ color:'var(--text-muted)',textDecoration:'none',fontSize:'13px',transition:'color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='white'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:'11px',color:'var(--text-dim)',fontWeight:600,letterSpacing:'1.5px',marginBottom:'12px',textTransform:'uppercase' }}>Resources</div>
            <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
              {[
                ['Stellar Testnet','https://stellar.org/testnet'],
                ['Friendbot','https://laboratory.stellar.org/#account-creator?network=testnet'],
                ['Soroban Docs','https://soroban.stellar.org'],
              ].map(([label,href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" style={{ color:'var(--text-muted)',textDecoration:'none',fontSize:'13px',transition:'color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='white'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                  {label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:'1160px',margin:'28px auto 0',paddingTop:'20px',borderTop:'1px solid rgba(139,92,246,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px' }}>
        <p style={{ fontSize:'12px',color:'var(--text-dim)' }}>© 2026 LumensFlow Protocol</p>
        <p style={{ fontSize:'11px',color:'var(--text-dim)',opacity:.6 }}>Built for Rise In Stellar Journey to Mastery</p>
      </div>
    </footer>
  )
}
