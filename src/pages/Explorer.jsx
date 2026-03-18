import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStream } from '../utils/stellar.js'
import { truncateAddress, stroopsToXlm } from '../utils/stellar.js'
import { Search, RefreshCw, Activity, ArrowRight, TrendingUp } from 'lucide-react'

const ANON = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'

async function fetchAllStreams() {
  const streams = []
  let id = 0
  while (true) {
    try {
      const stream = await getStream(id, ANON)
      if (!stream) break
      streams.push({ ...stream, id })
      id++
    } catch {
      break
    }
  }
  return streams.reverse() // newest first
}

function StatusBadge({ stream }) {
  const now = Math.floor(Date.now() / 1000)
  let label = 'Active'
  let color = '#22c55e'
  let bg = 'rgba(34,197,94,0.1)'
  if (!stream.is_active) { label = 'Cancelled'; color = '#ef4444'; bg = 'rgba(239,68,68,0.1)' }
  else if (now >= Number(stream.end_time)) { label = 'Completed'; color = '#9ca3af'; bg = 'rgba(156,163,175,0.1)' }
  return (
    <span style={{ fontSize: '11px', fontWeight: 500, color, background: bg, padding: '3px 10px', borderRadius: '50px', border: `1px solid ${color}44`, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

export default function Explorer() {
  const navigate = useNavigate()
  const [streams, setStreams] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [lastRefresh, setLastRefresh] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllStreams()
      setStreams(data)
      setFiltered(data)
      setLastRefresh(new Date())
    } catch (e) {
      console.error('Explorer fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    const q = search.trim().toLowerCase()
    if (!q) { setFiltered(streams); return }
    const num = parseInt(q)
    setFiltered(streams.filter(s =>
      s.sender?.toLowerCase().includes(q) ||
      s.receiver?.toLowerCase().includes(q) ||
      (!isNaN(num) && s.id === num)
    ))
  }, [search, streams])

  const activeCount  = streams.filter(s => s.is_active && Math.floor(Date.now() / 1000) < Number(s.end_time)).length
  const totalXlm     = streams.reduce((acc, s) => acc + (Number(s.deposit_amount) / 1e7), 0)

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 60px', background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.08) 0%, transparent 60%)' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid var(--purple)', color: 'var(--purple-light)',
          borderRadius: '50px', padding: '6px 20px', fontSize: '11px',
          fontWeight: 600, letterSpacing: '2px', marginBottom: '32px',
        }}>
          LIVE ON STELLAR TESTNET
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-1px' }}>LumensFlow Explorer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 400, margin: 0 }}>
          Live payment streams on Stellar Testnet
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '40px',
        }}>
          {[
            { label: 'Total Streams',  value: streams.length,      icon: <Activity size={20} color="var(--purple)" /> },
            { label: 'Active Streams', value: activeCount,          icon: <TrendingUp size={20} color="var(--green)" /> },
            { label: 'Total XLM',      value: `${totalXlm.toFixed(2)} XLM`, icon: <RefreshCw size={20} color="var(--purple-light)" /> },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{ padding: '10px', background: 'rgba(139,92,246,0.08)', borderRadius: '12px' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{loading ? '—' : stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Refresh */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: '44px' }}
              placeholder="Search by stream ID or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={load}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '14px 20px',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: '14px', fontWeight: 500,
              fontFamily: 'Unbounded, sans-serif',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
        {lastRefresh && (
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 400, marginBottom: '24px' }}>
            Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 30s
          </p>
        )}

        {/* Stream Cards / Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px', color: 'var(--purple)' }} />
            <p style={{ fontWeight: 400 }}>Scanning Stellar Testnet...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '24px',
          }}>
            <Activity size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>{search ? 'No results found' : 'No streams yet'}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 400, fontSize: '14px' }}>
              {search ? 'Try a different search term' : 'Be the first to create a stream!'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/create')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--purple)', color: 'white', border: 'none',
                  borderRadius: '50px', padding: '12px 28px',
                  fontSize: '14px', fontWeight: 600,
                  fontFamily: 'Unbounded, sans-serif', cursor: 'pointer',
                }}
              >
                Create Stream <ArrowRight size={16} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((stream) => {
              const total = Number(stream.deposit_amount) / 1e7
              const now = Math.floor(Date.now() / 1000)
              const start = Number(stream.start_time)
              const end = Number(stream.end_time)
              const dur = end - start
              const elapsed = Math.min(now, end) - start
              const streamed = dur > 0 ? (total * elapsed) / dur : 0
              const flowRate = dur > 0 ? total / dur : 0

              return (
                <div
                  key={stream.id}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '24px 28px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, transform 0.15s',
                  }}
                  onClick={() => navigate(`/stream/${stream.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Left info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Stream #{stream.id}</span>
                        <StatusBadge stream={stream} />
                      </div>
                      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>SENDER</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>{truncateAddress(stream.sender)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>RECEIVER</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>{truncateAddress(stream.receiver)}</div>
                        </div>
                      </div>
                    </div>
                    {/* Right stats */}
                    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>TOTAL</div>
                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{total.toFixed(2)} XLM</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>STREAMED</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--purple)' }}>{streamed.toFixed(4)} XLM</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>FLOW RATE</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--purple-light)' }}>{flowRate.toFixed(6)}/s</div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: 'var(--purple)', fontSize: '13px', fontWeight: 600,
                      }}>
                        View Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ marginTop: '16px', background: '#1f2937', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (streamed / total) * 100)}%`, background: 'linear-gradient(90deg, var(--purple), var(--purple-light))', borderRadius: '4px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
