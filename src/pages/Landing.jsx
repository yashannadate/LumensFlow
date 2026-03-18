import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { ArrowRight, Zap, Shield, Droplets, BarChart3, Globe, Clock } from 'lucide-react'

export default function Landing() {
  const { isConnected, connect } = useWallet()
  const navigate = useNavigate()

  const handleStart = async () => {
    if (!isConnected) await connect()
    navigate('/dashboard')
  }

  return (
    <div style={{ position:'relative' }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="center" style={{ minHeight:'100vh',paddingTop:'120px',paddingBottom:'80px',textAlign:'center',background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.14) 0%, transparent 70%)' }}>

        <div className="badge-pill" style={{ marginBottom:'32px' }}>
          <span style={{ width:'6px',height:'6px',borderRadius:'50%',background:'var(--green)',display:'inline-block',animation:'pulse 2s infinite' }}/>
          LIVE ON STELLAR TESTNET
        </div>

        <h1 style={{ fontSize:'clamp(52px,9vw,100px)',fontWeight:800,letterSpacing:'-3px',lineHeight:1,marginBottom:'24px',maxWidth:'900px' }}>
          Stream XLM<br/><span style={{ color:'var(--purple)',textShadow:'0 0 60px rgba(139,92,246,0.4)' }}>Every Second</span>
        </h1>

        <p style={{ fontSize:'18px',color:'var(--text-muted)',maxWidth:'520px',lineHeight:1.7,marginBottom:'48px',fontWeight:400 }}>
          Continuous on-chain payments. Withdraw in real-time.<br/>Powered by Stellar Soroban smart contracts.
        </p>

        <div style={{ display:'flex',gap:'14px',flexWrap:'wrap',justifyContent:'center',marginBottom:'80px' }}>
          <button onClick={handleStart} className="btn-primary" style={{ borderRadius:'50px',padding:'15px 40px',fontSize:'15px' }}>
            Start Streaming <ArrowRight size={18}/>
          </button>
          <button onClick={() => navigate('/how-it-works')} className="btn-outline-purple" style={{ borderRadius:'50px',padding:'15px 32px',fontSize:'15px' }}>
            How It Works
          </button>
        </div>

        {/* Live stream visualiser */}
        <div style={{ width:'100%',maxWidth:'720px',position:'relative' }}>
          <div style={{ background:'rgba(15,15,30,0.8)',backdropFilter:'blur(20px)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'24px',padding:'28px 32px',textAlign:'left' }}>
            <div style={{ fontSize:'11px',color:'var(--text-muted)',letterSpacing:'2px',fontWeight:600,marginBottom:'20px' }}>LIVE DEMO STREAM</div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'20px',flexWrap:'wrap',gap:'12px' }}>
              <div>
                <div style={{ fontSize:'11px',color:'var(--text-muted)',marginBottom:'4px' }}>Flow Rate</div>
                <div style={{ fontFamily:'monospace',fontSize:'22px',fontWeight:700,color:'var(--purple-light)' }}>
                  0.0000386 <span style={{ fontSize:'13px',opacity:.6 }}>XLM/sec</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'11px',color:'var(--text-muted)',marginBottom:'4px' }}>Streamed</div>
                <div className="live-amount" style={{ fontFamily:'monospace',fontSize:'22px',fontWeight:700 }}>
                  33.3333 XLM
                </div>
              </div>
            </div>
            <div className="progress-bar" style={{ height:'6px' }}>
              <div className="progress-fill progress-animated" style={{ width:'33%' }}/>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',marginTop:'10px',fontSize:'12px',color:'var(--text-muted)' }}>
              <span>100 XLM total</span>
              <span className="badge-active">● Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(139,92,246,0.08)',borderBottom:'1px solid rgba(139,92,246,0.08)',background:'rgba(10,10,20,0.6)',backdropFilter:'blur(20px)',padding:'28px 0' }}>
        <div style={{ maxWidth:'900px',margin:'0 auto',padding:'0 28px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'40px',textAlign:'center' }}>
          {[
            { n:'<0.003 XLM',  s:'Per Transaction' },
            { n:'100%',         s:'On-Chain & Trustless' },
            { n:'Real-Time',    s:'Second-by-Second' },
          ].map((stat,i) => (
            <div key={i}>
              <div style={{ fontSize:'22px',fontWeight:700,fontFamily:'var(--font-display)',color:'white' }}>{stat.n}</div>
              <div style={{ fontSize:'12px',color:'var(--text-muted)',marginTop:'4px' }}>{stat.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 Steps ───────────────────────────────────────────────────── */}
      <section className="center" style={{ padding:'100px 28px' }}>
        <h2 style={{ textAlign:'center',marginBottom:'12px' }}>Get Started in 3 Steps</h2>
        <p style={{ color:'var(--text-muted)',marginBottom:'64px',textAlign:'center' }}>No experience needed — just a wallet and testnet XLM.</p>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'20px',width:'100%',maxWidth:'860px' }}>
          {[
            { num:'01', title:'Install Wallet',   desc:'Get Freighter, xBull, or Lobstr from the browser extension store.' },
            { num:'02', title:'Get Testnet XLM',  desc:'Use Stellar Friendbot to receive free testnet XLM instantly.' },
            { num:'03', title:'Create a Stream',  desc:'Enter receiver address, amount, and duration — done in seconds.' },
          ].map((step,i) => (
            <div key={i} className="card" style={{ padding:'28px' }}>
              <div style={{ fontSize:'44px',fontWeight:800,fontFamily:'var(--font-display)',color:'var(--purple)',opacity:.2,lineHeight:1,marginBottom:'16px' }}>{step.num}</div>
              <h3 style={{ fontSize:'17px',marginBottom:'10px' }}>{step.title}</h3>
              <p style={{ color:'var(--text-muted)',fontSize:'13px',lineHeight:1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why LumensFlow ────────────────────────────────────────────── */}
      <section id="features" className="center" style={{ padding:'80px 28px',background:'radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, transparent 70%)' }}>
        <h2 style={{ textAlign:'center',marginBottom:'64px' }}>Why LumensFlow?</h2>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'16px',width:'100%',maxWidth:'1100px' }}>
          {[
            { Icon:Droplets, title:'Real-Time Streaming',     desc:'Funds flow every second with zero manual inputs — time does the work.' },
            { Icon:Shield,   title:'Non-Custodial',           desc:'Your keys, your funds. The smart contract holds, never us.' },
            { Icon:Zap,      title:'Soroban Powered',         desc:'Stellar Soroban smart contracts with sub-cent fees and instant finality.' },
            { Icon:BarChart3,title:'Live Dashboard',          desc:'Track all streams with real-time metrics — no refresh needed.' },
            { Icon:Globe,    title:'Stellar Testnet',         desc:'Fully live on Stellar Testnet — production-ready architecture.' },
            { Icon:Clock,    title:'Flexible Duration',       desc:'Stream for minutes, days, or years. Cancel anytime for instant refund.' },
          ].map(({Icon,title,desc},i) => (
            <div key={i} className="card" style={{ padding:'28px' }}>
              <div style={{ width:'44px',height:'44px',borderRadius:'12px',background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px' }}>
                <Icon size={22} color="var(--purple)"/>
              </div>
              <h3 style={{ fontSize:'16px',marginBottom:'8px' }}>{title}</h3>
              <p style={{ color:'var(--text-muted)',fontSize:'13px',lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="center" style={{ padding:'100px 28px' }}>
        <div style={{ background:'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(124,58,237,0.04) 100%)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'32px',padding:'64px 48px',textAlign:'center',maxWidth:'680px',width:'100%',backdropFilter:'blur(20px)' }}>
          <h2 style={{ marginBottom:'12px' }}>Ready to stream?</h2>
          <p style={{ color:'var(--text-muted)',marginBottom:'32px' }}>Start your first payment stream in under 60 seconds.</p>
          <button onClick={handleStart} className="btn-primary" style={{ borderRadius:'50px',padding:'15px 48px',fontSize:'15px' }}>
            Launch App <ArrowRight size={18}/>
          </button>
        </div>
      </section>
    </div>
  )
}
