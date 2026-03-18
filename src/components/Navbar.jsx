import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../utils/stellar.js'
import { Zap, LogOut, Copy, Check, X, ChevronDown } from 'lucide-react'

const LINKS = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Dashboard',    to: '/dashboard' },
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
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(6px)',zIndex:3000,display:'flex',alignItems:'flex-start',justifyContent:'flex-end',padding:'80px 24px 0' }}>
      <div ref={ref} style={{ background:'rgba(10,10,24,0.95)',backdropFilter:'blur(24px)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'24px',padding:'24px',width:'340px',display:'flex',flexDirection:'column',gap:'16px',boxShadow:'0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(139,92,246,0.08)',animation:'fade-in 0.2s ease' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <span style={{ fontSize:'13px',fontWeight:600,fontFamily:'var(--font-display)',opacity:.7 }}>Connected Wallet</span>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:'#4b5563',display:'flex',padding:'4px' }}><X size={15}/></button>
        </div>

        {/* Address block */}
        <div style={{ background:'rgba(5,5,14,0.8)',border:'1px solid rgba(139,92,246,0.1)',borderRadius:'14px',padding:'16px' }}>
          <div style={{ fontSize:'10px',color:'var(--text-muted)',fontWeight:600,letterSpacing:'1.5px',marginBottom:'8px',textTransform:'uppercase' }}>Address</div>
          <div style={{ fontFamily:'monospace',fontSize:'11px',wordBreak:'break-all',lineHeight:'1.7',color:'#c4b5fd',marginBottom:'12px' }}>{address}</div>
          <button onClick={copy} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',background:copied?'rgba(34,197,94,0.1)':'rgba(139,92,246,0.1)',border:`1px solid ${copied?'rgba(34,197,94,0.3)':'rgba(139,92,246,0.2)'}`,borderRadius:'10px',padding:'8px',color:copied?'var(--green)':'var(--purple-light)',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'var(--font-body)',transition:'all .2s' }}>
            {copied ? <Check size={13}/> : <Copy size={13}/>}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Balance block */}
        <div style={{ background:'rgba(5,5,14,0.8)',border:'1px solid rgba(139,92,246,0.1)',borderRadius:'14px',padding:'16px',textAlign:'center' }}>
          <div style={{ fontSize:'10px',color:'var(--text-muted)',fontWeight:600,letterSpacing:'1.5px',marginBottom:'6px',textTransform:'uppercase' }}>Balance</div>
          <div style={{ fontSize:'32px',fontWeight:700,color:'var(--purple-light)',fontFamily:'var(--font-display)' }}>
            {balance} <span style={{ fontSize:'14px',opacity:.5,fontWeight:400 }}>XLM</span>
          </div>
          <div style={{ fontSize:'11px',color:'var(--text-dim)',marginTop:'4px' }}>Stellar Testnet</div>
        </div>

        <button onClick={() => { onDisconnect(); onClose() }}
          style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'14px',padding:'12px',color:'#ef4444',cursor:'pointer',fontSize:'13px',fontWeight:600,fontFamily:'var(--font-body)',transition:'all .2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.12)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.06)'}>
          <LogOut size={14}/> Disconnect Wallet
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { address, isConnected, connect, disconnect, connecting, balance } = useWallet()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [showModal, setShowModal] = useState(false)

  const handleConnect = async () => { await connect(); navigate('/dashboard') }
  const active = (to) => location.pathname === to

  return (
    <>
      <header style={{ position:'fixed',top:0,width:'100%',zIndex:1000,background:'rgba(5,5,14,0.8)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:'1px solid rgba(139,92,246,0.1)',height:'68px',display:'flex',alignItems:'center' }}>
        <div style={{ width:'100%',maxWidth:'1160px',margin:'0 auto',padding:'0 28px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>

          {/* Logo */}
          <Link to={isConnected?'/dashboard':'/'} style={{ textDecoration:'none',color:'white',display:'flex',alignItems:'center',gap:'10px' }}>
            <div style={{ background:'var(--gradient-btn)',borderRadius:'10px',padding:'7px',display:'flex',boxShadow:'0 4px 16px rgba(139,92,246,0.4)' }}>
              <Zap size={16} color="white"/>
            </div>
            <span style={{ fontWeight:700,fontSize:'17px',letterSpacing:'-0.5px',fontFamily:'var(--font-display)' }}>LumensFlow</span>
          </Link>

          {/* Nav */}
          <nav style={{ display:'flex',alignItems:'center',gap:'4px' }}>
            {LINKS.map(({label,to}) => (
              <Link key={to} to={to} style={{ textDecoration:'none',padding:'7px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:500,color:active(to)?'white':'var(--text-muted)',background:active(to)?'rgba(139,92,246,0.12)':'transparent',transition:'all .2s' }}
                onMouseEnter={e=>{ if(!active(to)){ e.currentTarget.style.color='white'; e.currentTarget.style.background='rgba(139,92,246,0.06)' }}}
                onMouseLeave={e=>{ if(!active(to)){ e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent' }}}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Wallet */}
          {isConnected ? (
            <button onClick={() => setShowModal(true)} style={{ display:'flex',alignItems:'center',gap:'10px',background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'50px',padding:'8px 16px 8px 10px',color:'white',cursor:'pointer',transition:'all .2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(139,92,246,0.5)'; e.currentTarget.style.background='rgba(139,92,246,0.14)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(139,92,246,0.2)'; e.currentTarget.style.background='rgba(139,92,246,0.08)' }}>
              <div style={{ width:'28px',height:'28px',borderRadius:'50%',background:'var(--gradient-btn)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <Zap size={13} color="white"/>
              </div>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:'monospace',fontSize:'12px',fontWeight:600 }}>{truncateAddress(address)}</div>
                <div style={{ fontSize:'10px',color:'var(--purple-light)',fontFamily:'monospace' }}>{balance} XLM</div>
              </div>
              <ChevronDown size={13} style={{ color:'var(--text-muted)' }}/>
            </button>
          ) : (
            <button onClick={handleConnect} disabled={connecting} className="btn-primary" style={{ borderRadius:'50px',padding:'9px 20px',fontSize:'13px' }}>
              <Zap size={14}/> {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      {showModal && <WalletModal address={address} balance={balance} onDisconnect={disconnect} onClose={() => setShowModal(false)}/>}
    </>
  )
}
