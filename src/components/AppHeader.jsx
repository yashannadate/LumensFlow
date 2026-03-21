import { Search, Wallet, ChevronDown, Bell, LogOut, Menu } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { useState } from 'react'

export default function AppHeader({ onMenuClick }) {
  const { isConnected, address, balance, disconnect, connect } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ''

  return (
    <header className="app-header" style={{ 
      background: 'rgba(6, 6, 13, 0.85)', 
      backdropFilter: 'blur(16px)', 
      padding: '0 32px',
      borderBottom: '1px solid #1f2937',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Mobile Toggle */}
        <button 
          className="show-mobile"
          onClick={onMenuClick}
          style={{ 
            background: 'none', border: 'none', color: '#fff', 
            cursor: 'pointer', padding: '8px', marginLeft: '-8px'
          }}
        >
          <Menu size={24} />
        </button>

        {/* Search feature temporarily disabled until global search logic exists */}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Network status - Hidden on mobile */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '9999px' }}>
           <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
           <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Testnet <span style={{ color: '#22c55e' }}>Optimal</span>
           </span>
        </div>
        
        {isConnected ? (
          <div 
            onClick={() => setIsModalOpen(!isModalOpen)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              padding: '6px 6px 6px 16px', background: '#111827', 
              border: '1px solid #1f2937', borderRadius: '9999px',
              cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1f2937'}
          >
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>{shortAddress}</div>
                <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 700 }}>{parseFloat(balance).toLocaleString()} XLM</div>
             </div>
             <div style={{ 
               width: '32px', height: '32px', borderRadius: '50%', 
               background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
               display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
             }}>
               <Wallet size={16} />
             </div>
             {isModalOpen && (
               <div style={{
                 position: 'absolute', top: '120%', right: 0, width: '200px',
                 background: '#0d1117', border: '1px solid #1f2937', borderRadius: '16px',
                 padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000
               }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #1f2937', marginBottom: '8px' }}>
                     <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connected as</div>
                     <div style={{ fontSize: '12px', color: '#fff', fontWeight: 600, wordBreak: 'break-all', marginTop: '2px' }}>{address}</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); disconnect(); setIsModalOpen(false); }}
                    style={{ 
                      width: '100%', padding: '10px', borderRadius: '8px', 
                      background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
                    }}
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
               </div>
             )}
          </div>
        ) : (
          <button onClick={connect} className="btn-primary" style={{ borderRadius: '9999px', padding: '10px 24px', fontSize: '13px' }}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )
}
