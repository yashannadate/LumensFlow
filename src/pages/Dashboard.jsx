import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StreamCard from '../components/StreamCard.jsx'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { Plus, RefreshCw, Activity, Zap, Droplets, Send, Globe } from 'lucide-react'

export default function Dashboard() {
  const { isConnected, address } = useWallet()
  const { fetchUserStreams } = useStream()
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!isConnected) { setLoading(false); return }
    setLoading(true)
    try {
      const data = await fetchUserStreams()
      setStreams(data.sort((a,b) => Number(b.start_time)-Number(a.start_time)))
    } catch (e) {
      console.error('Dashboard fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [isConnected])

  const now         = Math.floor(Date.now() / 1000)
  const incoming    = streams.filter(s => s.receiver === address)
  const outgoing    = streams.filter(s => s.sender   === address)
  const totalXlm    = streams.reduce((acc,s) => acc + Number(s.deposit_amount)/1e7, 0)
  const activeCount = streams.filter(s => s.status === 'Active' && now < Number(s.end_time)).length

  const StatCard = ({ icon, label, value, color }) => (
    <div className="stat-card">
      <div style={{ padding:'10px',background:'rgba(139,92,246,0.08)',borderRadius:'12px',border:'1px solid rgba(139,92,246,0.1)',flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:'22px',fontWeight:700,fontFamily:'var(--font-display)',color:color||'white' }}>
          {loading ? '—' : value}
        </div>
        <div style={{ fontSize:'12px',color:'var(--text-muted)',fontWeight:500 }}>{label}</div>
      </div>
    </div>
  )

  const EmptySlot = ({ label, sub, cta }) => (
    <div className="card center" style={{ padding:'60px 40px',minHeight:'200px',opacity:.7 }}>
      <Activity size={32} style={{ color:'var(--text-dim)',marginBottom:'14px' }}/>
      <p style={{ fontWeight:600,fontSize:'15px',marginBottom:'6px' }}>{label}</p>
      <p style={{ fontSize:'13px',color:'var(--text-muted)',marginBottom:'16px' }}>{sub}</p>
      {cta}
    </div>
  )

  return (
    <div style={{ padding:'88px 28px 80px',maxWidth:'1160px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'36px' }}>

      {/* Header */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px' }}>
        <div>
          <h2 style={{ marginBottom:'4px' }}>Dashboard</h2>
          <div style={{ display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'var(--text-muted)' }}>
            <Globe size={13}/> Stellar Testnet
          </div>
        </div>
        <div style={{ display:'flex',gap:'10px' }}>
          <button onClick={load} disabled={loading} className="btn-ghost" style={{ borderRadius:'12px' }}>
            <RefreshCw size={14} style={{ animation:loading?'spin 1s linear infinite':'none' }}/> Refresh
          </button>
          <Link to="/create" style={{ textDecoration:'none' }}>
            <button className="btn-primary" style={{ borderRadius:'12px' }}><Plus size={16}/> New Stream</button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px' }} className="stats-3-grid">
        <StatCard icon={<Activity size={20} color="var(--purple)"/>}    label="Total Streams"  value={streams.length}                color="var(--purple-light)"/>
        <StatCard icon={<Zap     size={20} color="var(--green)"/>}      label="Active Streams" value={activeCount}                   color="var(--green)"/>
        <StatCard icon={<Droplets size={20} color="var(--purple-light)"/>} label="Total XLM"   value={`${totalXlm.toFixed(2)} XLM`} color="white"/>
      </div>

      {/* Streams grid */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'40px' }} className="dashboard-grid">

        {/* Incoming */}
        <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div style={{ width:'36px',height:'36px',borderRadius:'12px',background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Droplets size={18} color="var(--purple)"/>
            </div>
            <h3 style={{ fontSize:'16px' }}>Incoming</h3>
            <div style={{ marginLeft:'auto',fontSize:'12px',padding:'3px 10px',borderRadius:'50px',background:'rgba(139,92,246,0.08)',color:'var(--purple-light)',border:'1px solid rgba(139,92,246,0.15)' }}>
              {incoming.length}
            </div>
          </div>

          {loading ? (
            <div className="card center" style={{ padding:'60px' }}>
              <RefreshCw size={28} className="animate-spin" style={{ color:'var(--purple)',marginBottom:'12px' }}/>
              <span style={{ color:'var(--text-muted)',fontSize:'13px' }}>Syncing…</span>
            </div>
          ) : incoming.length === 0 ? (
            <EmptySlot label="No incoming streams" sub="Your receiver streams appear here"/>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
              {incoming.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load}/>)}
            </div>
          )}
        </div>

        {/* Outgoing */}
        <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div style={{ width:'36px',height:'36px',borderRadius:'12px',background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Send size={18} color="var(--purple)"/>
            </div>
            <h3 style={{ fontSize:'16px' }}>Outgoing</h3>
            <div style={{ marginLeft:'auto',fontSize:'12px',padding:'3px 10px',borderRadius:'50px',background:'rgba(139,92,246,0.08)',color:'var(--purple-light)',border:'1px solid rgba(139,92,246,0.15)' }}>
              {outgoing.length}
            </div>
          </div>

          {loading ? (
            <div className="card center" style={{ padding:'60px' }}>
              <RefreshCw size={28} className="animate-spin" style={{ color:'var(--purple)',marginBottom:'12px' }}/>
              <span style={{ color:'var(--text-muted)',fontSize:'13px' }}>Syncing…</span>
            </div>
          ) : outgoing.length === 0 ? (
            <EmptySlot
              label="No outgoing streams"
              sub="Start streaming XLM to anyone"
              cta={
                <Link to="/create" style={{ textDecoration:'none' }}>
                  <button className="btn-primary" style={{ borderRadius:'10px',padding:'9px 20px',fontSize:'13px' }}>
                    <Plus size={14}/> Create Stream
                  </button>
                </Link>
              }
            />
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
              {outgoing.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
