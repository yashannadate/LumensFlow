import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StreamCard from '../components/StreamCard.jsx'
import ActivityFeed from '../components/ActivityFeed.jsx'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useActivityFeed } from '../hooks/useActivityFeed.jsx'
import { 
  Plus, RefreshCw, Activity, Zap, Droplets, 
  Send, Globe, Rocket, Wallet, ArrowUpRight, 
  ArrowDownRight, ChevronRight 
} from 'lucide-react'
import { GaslessBadge } from '../components/GaslessBadge.jsx'

export default function Dashboard() {
  const { isConnected, address } = useWallet()
  const { fetchUserStreams } = useStream()
  const { activities, loading: feedLoading, refresh: refreshFeed } = useActivityFeed()
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  
  // State for toggling expanded views per user request for "Easy Access"
  const [expandedSection, setExpandedSection] = useState('none') // 'none', 'incoming', 'outgoing'

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
      streams.forEach(st => { 
        if (st.sender) s.add(st.sender)
        if (st.receiver) s.add(st.receiver) 
      })
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

  const CategoryToggleCard = ({ title, count, icon: Icon, type, active, color }) => (
    <div 
      onClick={() => setExpandedSection(expandedSection === type ? 'none' : type)}
      className={`card ${active ? 'active' : ''}`}
      style={{
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.05)',
        background: active ? `${color}08` : 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: active ? color : 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s'
        }}>
          <Icon size={20} color={active ? '#000' : color} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '2px' }}>{title}</h3>
          <p className="text-muted" style={{ fontSize: '12px' }}>{count} total streams found</p>
        </div>
      </div>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px',
        color: active ? color : 'var(--text-muted)',
        transition: 'all 0.3s'
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{active ? 'HIDE' : 'VIEW ALL'}</span>
        <ChevronRight size={18} style={{ transform: active ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
      </div>
      {active && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px',
          background: color
        }} />
      )}
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
      <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 38px)', letterSpacing: '-0.04em' }}>Dashboard</h1>
        </div>
        <div className="mobile-w-full" style={{ display: 'flex', gap: '12px' }}>
          <button onClick={load} disabled={loading} className="btn-ghost mobile-w-full" style={{ padding: '12px 24px', fontSize: '13px', borderRadius: '9999px', justifyContent: 'center' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <Link to="/create" className="mobile-w-full" style={{ textDecoration: 'none' }}>
            <button className="btn-primary mobile-w-full" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '9999px', justifyContent: 'center' }}>
              <Plus size={16} /> Create Stream
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stat row ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Grouped Interaction Cards for "Easy Access" per Feedback #15 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="flex-col-mobile">
            <CategoryToggleCard 
              title="Outgoing Streams" 
              count={outgoing.length} 
              icon={ArrowUpRight} 
              type="outgoing" 
              active={expandedSection === 'outgoing'}
              color="#86EE1E" 
            />
            <CategoryToggleCard 
              title="Incoming Streams" 
              count={incoming.length} 
              icon={ArrowDownRight} 
              type="incoming" 
              active={expandedSection === 'incoming'}
              color="#8b5cf6" 
            />
          </div>

          {/* Conditional Rendering Area for Expanded Streams */}
          <div style={{ marginTop: '24px' }}>
            {expandedSection === 'outgoing' && (
              <section className="fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <ArrowUpRight size={20} color="#86EE1E" />
                  <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Manage Outgoing Streams</h4>
                </div>
                {loading ? (
                  <div className="card center" style={{ padding: '48px' }}><RefreshCw className="animate-spin" color="var(--primary)" /></div>
                ) : outgoing.length === 0 ? (
                  <div className="card center" style={{ padding: '48px', opacity: 0.6 }}>No outgoing streams found. Start by creating one!</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {outgoing.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
                  </div>
                )}
              </section>
            )}

            {expandedSection === 'incoming' && (
              <section className="fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <ArrowDownRight size={20} color="#8b5cf6" />
                  <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Vew Incoming Streams</h4>
                </div>
                {loading ? (
                  <div className="card center" style={{ padding: '48px' }}><RefreshCw className="animate-spin" color="var(--primary)" /></div>
                ) : incoming.length === 0 ? (
                  <div className="card center" style={{ padding: '48px', opacity: 0.6 }}>No incoming streams detected yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {incoming.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
                  </div>
                )}
              </section>
            )}

            {expandedSection === 'none' && !loading && (
              <div className="card center fade-in" style={{ padding: '60px 40px', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' }}>
                <Activity size={32} color="#6b7280" style={{ marginBottom: '16px', opacity: 0.3 }} />
                <h4 style={{ color: '#9ca3af', fontWeight: 700, marginBottom: '8px' }}>Select a category above</h4>
                <p className="text-muted" style={{ fontSize: '13px', maxWidth: '300px' }}>
                  Easily access and manage your incoming or outgoing streams by clicking the cards above.
                </p>
              </div>
            )}
          </div>
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

            {/* Gasless Status */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(134,238,30,0.06), rgba(134,238,30,0.02))',
              border: '1px solid rgba(134,238,30,0.18)',
              borderRadius: '14px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(134,238,30,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color="#86EE1E" />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#86EE1E', marginBottom: '2px', fontFamily: 'var(--font-label)' }}>
                  Gasless Mode Active
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Network fees are sponsored. You only spend what you stream.
                </div>
              </div>
            </div>
          </div>

          <ActivityFeed activities={activities} loading={feedLoading} />


        </div>

      </div>
    </div>
  )
}
