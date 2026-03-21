import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StreamCard from '../components/StreamCard.jsx'
import ActiveUsers from '../components/ActiveUsers.jsx'
import ActivityFeed from '../components/ActivityFeed.jsx'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useActivityFeed } from '../hooks/useActivityFeed.jsx'
import { Plus, RefreshCw, Activity, Zap, Droplets, Send, Globe, Rocket, Wallet } from 'lucide-react'

export default function Dashboard() {
  const { isConnected, address } = useWallet()
  const { fetchUserStreams } = useStream()
  const { activities, loading: feedLoading, refresh: refreshFeed } = useActivityFeed()
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  const load = async () => {
    if (!isConnected) { setLoading(false); return }
    setLoading(true)
    try {
      const data = await fetchUserStreams()
      setStreams(data.sort((a, b) => Number(b.start_time) - Number(a.start_time)))
    } catch (e) {
      console.error('Dashboard fetch failed:', e)
    } finally {
      setLoading(false)
    }
    refreshFeed()
  }

  useEffect(() => { load() }, [isConnected])

  useEffect(() => {
    if (streams && streams.length > 0) {
      const s = new Set()
      streams.forEach(st => { if (st.sender) s.add(st.sender); if (st.receiver) s.add(st.receiver) })
      setUsers(Array.from(s))
    } else {
      setUsers([])
    }
  }, [streams])

  const now = Math.floor(Date.now() / 1000)
  const incoming = streams.filter(s => s.receiver === address)
  const outgoing = streams.filter(s => s.sender === address)
  const totalXlm = streams.reduce((acc, s) => acc + Number(s.deposit_amount) / 1e7, 0)
  const activeCount = streams.filter(s => s.status === 'Active' && now < Number(s.end_time)).length

  /* ── Sub-components ────────────────────────────────────────── */
  const StatCard = ({ icon, label, value, badge, accent = 'var(--primary)' }) => (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
       <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.30),transparent)', pointerEvents: 'none' }} />
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
          {badge}
       </div>
       <div>
          <div style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 900, fontFamily: 'var(--font-brand)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            {loading ? '—' : value}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
       </div>
    </div>
  )

  const SectionHeader = ({ icon, title, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--primary)', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: '8px', padding: '3px 10px', textTransform: 'uppercase' }}>
        {count}
      </div>
      <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-brand)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</h3>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #1f2937, transparent)' }} />
    </div>
  )

  return (
    <div style={{ 
      padding: 'var(--dashboard-padding, 40px 32px 80px)', 
      maxWidth: '1240px', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '40px', 
      position: 'relative', 
      zIndex: 1 
    }} className="dashboard-container">

      {/* ── Page header ───────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', letterSpacing: '-0.04em' }}>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={load} disabled={loading} className="btn-ghost" style={{ padding: '12px 24px', fontSize: '13px', borderRadius: '9999px' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <Link to="/create" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '9999px' }}>
              <Plus size={16} /> Create Stream
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stat row ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }} className="stats-3-grid">
        <StatCard 
          icon={<Activity size={16} color="var(--primary)" />}  
          label="Total Streams" 
          value={streams.length}
          badge={<div style={{ fontSize: '10px', color: '#22c55e', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>+12.4%</div>}
        />
        <StatCard 
          icon={<Zap size={16} color="#86EE1E" />} 
          label="Active Payment Streams" 
          value={activeCount}
          badge={<div style={{ fontSize: '10px', color: '#86EE1E', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>LIVE</div>}
        />
        <StatCard 
          icon={<Droplets size={16} color="#a78bfa" />}  
          label="Estimated Flow Value"     
          value={`${totalXlm.toFixed(2)}`}
          badge={<div style={{ fontSize: '10px', color: '#a78bfa', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>XLM</div>}
        />
      </div>

      {/* ── Main content sections ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }} className="dashboard-two-col">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Incoming */}
          <section>
            <SectionHeader title="Incoming Streams" count={incoming.length} />
            {loading ? (
              <div className="card center" style={{ padding: '48px' }}><RefreshCw className="animate-spin" color="var(--primary)" /></div>
            ) : incoming.length === 0 ? (
              <div className="card center" style={{ padding: '48px', opacity: 0.6 }}>No incoming streams detected</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {incoming.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
              </div>
            )}
          </section>

          {/* Outgoing */}
          <section>
            <SectionHeader title="Outgoing Streams" count={outgoing.length} />
            {loading ? (
              <div className="card center" style={{ padding: '48px' }}><RefreshCw className="animate-spin" color="var(--primary)" /></div>
            ) : outgoing.length === 0 ? (
              <div className="card center" style={{ padding: '48px', opacity: 0.6 }}>No outgoing streams found</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {outgoing.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Actions</div>
              <Link to="/create" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '9999px', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-brand)' }}>
                   ＋ Create Stream
                </button>
              </Link>
           </div>

           <ActivityFeed activities={activities} loading={feedLoading} />
           
           <ActiveUsers streams={streams} />
        </div>

      </div>
    </div>
  )
}
