import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StreamCard from '../components/StreamCard.jsx'
import ActivityFeed from '../components/ActivityFeed.jsx'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useActivityFeed } from '../hooks/useActivityFeed.jsx'
import { 
  Plus, RefreshCw, Activity, Zap, Droplets, 
  ArrowUpRight, ArrowDownRight, ChevronRight, Wallet, Shield, Zap as ZapIcon
} from 'lucide-react'


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
  const StatCard = ({ icon, label, value, badge }) => (
    <div className="bg-white border border-outline-variant/65 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow transition-all relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary/20 flex items-center justify-center text-primary">
          {icon}
        </div>
        {badge}
      </div>
      <div>
        <div className="font-display-lg text-[32px] font-extrabold text-primary tracking-tight mb-1 tabular-nums">
          {loading ? '—' : value}
        </div>
        <div className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">{label}</div>
      </div>
    </div>
  )

  const CategoryToggleCard = ({ title, count, icon: Icon, type, active }) => (
    <div 
      onClick={() => setExpandedSection(expandedSection === type ? 'none' : type)}
      className={`bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-300 flex items-center justify-between relative overflow-hidden shadow-xs hover:shadow ${
        active ? 'border-secondary ring-1 ring-secondary/30 bg-secondary/5' : 'border-outline-variant/65 hover:border-primary/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          active ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface-variant'
        }`}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <h3 className="font-headline-lg text-primary text-lg font-bold mb-0.5">{title}</h3>
          <p className="text-on-surface-variant text-xs">{count} total streams found</p>
        </div>
      </div>
      <div className={`flex items-center gap-2 font-semibold text-xs ${
        active ? 'text-primary' : 'text-on-surface-variant/70'
      }`}>
        <span className="font-mono tracking-wider">{active ? 'HIDE' : 'VIEW ALL'}</span>
        <ChevronRight size={16} className={`transition-transform duration-300 ${active ? 'rotate-90' : ''}`} />
      </div>
    </div>
  )

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen py-12 px-6 md:px-container-margin max-w-[1280px] mx-auto flex flex-col gap-10">

      {/* ── Wallet not connected ─────────────────────────── */}
      {!isConnected && (
        <div style={{
          minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '28px', padding: '64px 48px', maxWidth: '460px', width: '100%',
            textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
          }}>
            {/* Icon */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: '#f3f3f6', border: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px'
            }}>
              <Wallet size={36} color="#000000" />
            </div>

            <h2 style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '26px',
              fontWeight: 800, color: '#000000', margin: '0 0 12px', letterSpacing: '-0.02em'
            }}>
              Connect Your Wallet
            </h2>
            <p style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '14px',
              color: 'rgba(26,28,30,0.55)', lineHeight: 1.6, margin: '0 0 36px'
            }}>
              Connect your Stellar wallet to access your real-time payment streams, create new ones, and track your earnings.
            </p>

            {/* Feature bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px', textAlign: 'left' }}>
              {[
                { icon: <Zap size={14} color="#000" />, label: 'Gasless transactions — fees sponsored' },
                { icon: <Shield size={14} color="#000" />, label: '100% on-chain — fully transparent' },
                { icon: <Activity size={14} color="#000" />, label: 'Real-time streams — every second' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: '#1DFF00', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {f.icon}
                  </div>
                  <span style={{
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '13px',
                    fontWeight: 600, color: 'rgba(26,28,30,0.75)'
                  }}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Connect button */}
            <button
              onClick={connect}
              style={{
                width: '100%', background: '#000000', color: '#ffffff', border: 'none',
                borderRadius: '14px', padding: '16px 24px', cursor: 'pointer',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '15px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <Wallet size={18} />
              Connect Wallet
            </button>

            <p style={{
              fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '11px',
              color: 'rgba(26,28,30,0.35)', marginTop: '16px'
            }}>
              Supports Freighter & Stellar wallets
            </p>
          </div>
        </div>
      )}

      {/* ── Dashboard (only when connected) ───────────────── */}
      {isConnected && (<>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/30 pb-6">
        <div className="text-left">
          <h1 className="font-display-lg text-[40px] tracking-tight text-primary">Dashboard Overview</h1>
          <p className="font-body-md text-on-surface-variant text-sm mt-0.5">Real-time payment streams on Stellar Soroban.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={load} 
            disabled={loading} 
            className="flex items-center justify-center gap-2 border border-outline px-6 py-3 font-label-sm text-label-sm font-semibold hover:bg-surface-container-low transition-all cursor-pointer bg-white active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
            Refresh
          </button>
          <Link to="/create" className="w-full md:w-auto text-decoration-none">
            <button className="w-full md:w-auto bg-secondary text-on-secondary px-8 py-3 rounded-xl font-title-md flex items-center justify-center gap-2 btn-hover-glow-neon transition-all active:scale-95 border-none cursor-pointer font-bold">
              <Plus size={16} /> Create Stream
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stat row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Activity size={18} />}
          label="Total Streams"
          value={streams.length}
          badge={<div className="text-[10px] text-primary/70 font-mono font-bold bg-surface-container-low px-2 py-0.5 rounded">HISTORIC</div>}
        />
        <StatCard
          icon={<Zap size={18} />}
          label="Active Payment Streams"
          value={activeCount}
          badge={<div className="text-[10px] text-on-secondary font-mono font-bold bg-secondary px-2 py-0.5 rounded animate-pulse">LIVE</div>}
        />
        <StatCard
          icon={<Droplets size={18} />}
          label="Estimated Flow Value"
          value={`${totalXlm.toFixed(2)}`}
          badge={<div className="text-[10px] text-primary/70 font-mono font-bold bg-surface-container-low px-2 py-0.5 rounded">XLM</div>}
        />
      </div>

      {/* ── Main content sections ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Grouped Interaction Cards for "Easy Access" per Feedback #15 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryToggleCard 
              title="Outgoing Streams" 
              count={outgoing.length} 
              icon={ArrowUpRight} 
              type="outgoing" 
              active={expandedSection === 'outgoing'}
            />
            <CategoryToggleCard 
              title="Incoming Streams" 
              count={incoming.length} 
              icon={ArrowDownRight} 
              type="incoming" 
              active={expandedSection === 'incoming'}
            />
          </div>

          {/* Conditional Rendering Area for Expanded Streams */}
          <div className="mt-4">
            {expandedSection === 'outgoing' && (
              <section className="animate-section transition-all duration-350">
                <div className="flex items-center gap-2 mb-4 text-left">
                  <ArrowUpRight size={20} className="text-primary" />
                  <h4 className="font-headline-lg text-lg text-primary font-bold">Manage Outgoing Streams</h4>
                </div>
                {loading ? (
                  <div className="bg-white border border-outline-variant/60 rounded-2xl p-16 flex items-center justify-center"><RefreshCw className="animate-spin text-primary" /></div>
                ) : outgoing.length === 0 ? (
                  <div className="bg-white border border-outline-variant/60 rounded-2xl p-16 text-center text-on-surface-variant font-medium">No outgoing streams found. Start by creating one!</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {outgoing.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
                  </div>
                )}
              </section>
            )}

            {expandedSection === 'incoming' && (
              <section className="animate-section transition-all duration-350">
                <div className="flex items-center gap-2 mb-4 text-left">
                  <ArrowDownRight size={20} className="text-primary" />
                  <h4 className="font-headline-lg text-lg text-primary font-bold">View Incoming Streams</h4>
                </div>
                {loading ? (
                  <div className="bg-white border border-outline-variant/60 rounded-2xl p-16 flex items-center justify-center"><RefreshCw className="animate-spin text-primary" /></div>
                ) : incoming.length === 0 ? (
                  <div className="bg-white border border-outline-variant/60 rounded-2xl p-16 text-center text-on-surface-variant font-medium">No incoming streams detected yet.</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {incoming.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
                  </div>
                )}
              </section>
            )}

            {expandedSection === 'none' && !loading && (
              <div className="bg-white border-2 border-dashed border-outline-variant/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
                <Activity size={32} className="text-on-surface-variant/40 mb-4" />
                <h4 className="text-primary font-bold text-base mb-1">Select a category above</h4>
                <p className="text-on-surface-variant text-sm max-w-[280px]">
                  Easily access and manage your incoming or outgoing streams by clicking the cards above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-outline-variant/65 rounded-2xl p-6 flex flex-col gap-4 text-left">
            <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Quick Actions</div>
            <Link to="/create" className="text-decoration-none">
              <button className="w-full bg-secondary text-on-secondary px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 btn-hover-glow-neon transition-all active:scale-95 border-none cursor-pointer">
                ＋ Create Stream
              </button>
            </Link>

            {/* Gasless Status */}
            <div className="flex items-start gap-3 p-4 bg-secondary/10 border border-secondary/35 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <Zap size={14} className="fill-current" />
              </div>
              <div>
                <div className="text-[12px] font-bold text-primary mb-0.5 font-label">
                  Gasless Mode Active
                </div>
                <div className="text-[11px] text-on-surface-variant leading-relaxed">
                  Network fees are sponsored. You only spend what you stream.
                </div>
              </div>
            </div>
          </div>

          <ActivityFeed activities={activities} loading={feedLoading} />

        </div>

      </div>
      </>)}
    </div>
  )
}
