import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StreamCard from '../components/StreamCard.jsx'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { getStreamsForUser } from '../utils/stellar.js'
import {
  Plus, AlertCircle, Zap,
  Droplets, Send, Wallet, RefreshCw, Globe, Activity,
} from 'lucide-react'

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
      setStreams(data.sort((a, b) => Number(b.start_time) - Number(a.start_time)))
    } catch (e) {
      console.error('Failed to load streams:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [isConnected])

  const now      = Math.floor(Date.now() / 1000)
  const incoming = streams.filter(s => s.receiver === address)
  const outgoing = streams.filter(s => s.sender   === address)

  const totalXlm   = streams.reduce((acc, s) => acc + Number(s.deposit_amount) / 1e7, 0)
  const activeCount = streams.filter(s => s.is_active && now < Number(s.end_time)).length

  return (
    <div style={{ padding: '100px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Dashboard</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <Globe size={14} /> Stellar Testnet
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={load} disabled={loading} className="btn-ghost" style={{ border: '1px solid var(--border)', borderRadius: '12px' }}>
              <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
            </button>
            <Link to="/create" style={{ textDecoration: 'none' }}>
              <button className="btn-primary"><Plus size={18} /> Send Stream</button>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Streams',   value: streams.length,             icon: <Activity size={20} color="var(--purple)" />,       color: 'var(--purple)' },
            { label: 'Active Streams',  value: activeCount,                icon: <Zap size={20} color="var(--green)" fill="var(--green)" />, color: 'var(--green)' },
            { label: 'Total XLM',       value: `${totalXlm.toFixed(2)} XLM`, icon: <Droplets size={20} color="var(--purple-light)" />, color: 'var(--purple-light)' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{ padding: '10px', background: 'rgba(139,92,246,0.08)', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>
                  {loading ? '—' : stat.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Streams Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

          {/* Incoming */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Droplets size={24} color="var(--purple)" />
              <h3 style={{ margin: 0 }}>Incoming</h3>
              <div className="badge-active" style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '50px' }}>
                {incoming.length}
              </div>
            </div>

            {loading ? (
              <div className="card center" style={{ padding: '60px' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px', color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Syncing with Stellar…</p>
              </div>
            ) : incoming.length === 0 ? (
              <div className="card center" style={{ padding: '60px', opacity: 0.6 }}>
                <AlertCircle size={32} style={{ marginBottom: '16px' }} />
                <p style={{ marginBottom: '4px' }}>No incoming streams</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Ready to receive payments</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {incoming.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
              </div>
            )}
          </div>

          {/* Outgoing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Send size={24} color="var(--purple)" />
              <h3 style={{ margin: 0 }}>Outgoing</h3>
              <div style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '50px', background: 'var(--border)', color: 'var(--text-muted)' }}>
                {outgoing.length}
              </div>
            </div>

            {loading ? (
              <div className="card center" style={{ padding: '60px' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px', color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Syncing with Stellar…</p>
              </div>
            ) : outgoing.length === 0 ? (
              <div className="card center" style={{ padding: '60px', opacity: 0.6 }}>
                <Wallet size={32} style={{ marginBottom: '16px' }} />
                <p style={{ marginBottom: '4px' }}>No outgoing streams</p>
                <Link to="/create" style={{ color: 'var(--purple)', fontSize: '12px', textDecoration: 'none' }}>
                  Start your first stream →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {outgoing.map(s => <StreamCard key={s.id.toString()} stream={s} onAction={load} />)}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
