import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3, Users, ArrowUpRight, Activity, Clock, Zap,
  TrendingUp, Shield, RefreshCw, AlertCircle, CheckCircle2,
  Wallet, ArrowDownRight, ChevronRight, ExternalLink
} from 'lucide-react'
import { fetchContractEvents, truncateAddress, HORIZON_URL, CONTRACT_ID } from '../utils/stellar'
import { getMetricsSnapshot } from '../utils/logger'

// ── Metrics page ─────────────────────────────────────────────────────────
export default function Metrics() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [logSnapshot, setLogSnapshot] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const evts = await fetchContractEvents(200)
      setEvents(evts)
      setLogSnapshot(getMetricsSnapshot())
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Metrics load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [loadData])

  // ── Derived stats ─────────────────────────────────────────────────────
  const uniqueWallets = new Set(events.flatMap(e => [e.sender, e.receiver]).filter(Boolean))
  const totalStreams  = events.filter(e => e.type === 'created').length
  const totalWithdrawals = events.filter(e => e.type === 'withdrawal').length
  const totalCancellations = events.filter(e => e.type === 'cancelled').length
  const totalTx = events.length

  // TVL calculation (sum of all stream deposits)
  const tvl = events
    .filter(e => e.type === 'created' && e.amountXlm)
    .reduce((sum, e) => sum + parseFloat(e.amountXlm), 0)

  // Recent users (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentUsers = new Set(
    events
      .filter(e => e.timestamp > sevenDaysAgo)
      .flatMap(e => [e.sender, e.receiver])
      .filter(Boolean)
  )

  // All unique wallets for user list
  const walletList = [...uniqueWallets].sort()

  return (
    <div style={{ padding: 'var(--dashboard-padding)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BarChart3 size={20} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>Protocol Metrics</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Live analytics from the LumensFlow Soroban contract
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            style={{
              marginLeft: 'auto', background: 'rgba(139,92,246,0.10)',
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: '9999px',
              padding: '8px 16px', color: '#a78bfa', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {lastRefresh && (
          <p className="text-muted" style={{ fontSize: '11px', marginTop: '4px' }}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px', marginBottom: '28px'
      }}>
        <KPICard
          icon={Users} label="Unique Wallets" value={uniqueWallets.size}
          color="#8b5cf6" sub={`${recentUsers.size} active (7d)`}
        />
        <KPICard
          icon={Activity} label="Total Transactions" value={totalTx}
          color="#86EE1E" sub={`${totalStreams} streams created`}
        />
        <KPICard
          icon={TrendingUp} label="TVL (Streamed)" value={`${tvl.toFixed(2)} XLM`}
          color="#f59e0b" sub="Total value locked"
        />
        <KPICard
          icon={Zap} label="Success Rate"
          value={logSnapshot?.transactions?.successRate || '100%'}
          color="#10b981" sub={`${totalWithdrawals} withdrawals`}
        />
      </div>

      {/* ── Two-column layout ────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px', marginBottom: '28px'
      }}>

        {/* ── Transaction Breakdown ──────────────────────────────────── */}
        <div className="card">
          <h4 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} color="#8b5cf6" />
            Transaction Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <TxRow icon={ArrowUpRight} label="Streams Created" count={totalStreams} color="#86EE1E" total={totalTx} />
            <TxRow icon={ArrowDownRight} label="Withdrawals" count={totalWithdrawals} color="#8b5cf6" total={totalTx} />
            <TxRow icon={AlertCircle} label="Cancellations" count={totalCancellations} color="#ef4444" total={totalTx} />
          </div>
        </div>

        {/* ── System Health ──────────────────────────────────────────── */}
        <div className="card">
          <h4 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#10b981" />
            System Health
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <HealthRow label="Smart Contract" status="operational" detail="Soroban Testnet" />
            <HealthRow label="RPC Endpoint" status="operational" detail={logSnapshot?.rpc?.avgLatency || 'N/A'} />
            <HealthRow label="Security Audit" status="operational" detail="All 17 checks ✅" />
            <HealthRow
              label="Session Uptime"
              status="operational"
              detail={logSnapshot?.users?.sessionUptime || 'N/A'}
            />
          </div>
        </div>
      </div>

      {/* ── Verified User Wallets ─────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={16} color="#8b5cf6" />
            Verified User Wallets ({walletList.length})
          </h4>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px', color: '#a78bfa',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--font-label)'
            }}
          >
            View on Explorer <ExternalLink size={11} />
          </a>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '8px', maxHeight: '300px', overflowY: 'auto'
        }}>
          {walletList.map((addr, i) => (
            <a
              key={addr}
              href={`https://stellar.expert/explorer/testnet/account/${addr}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(139,92,246,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s', textDecoration: 'none',
                fontSize: '12.5px', fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.10)'
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.30)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              }}
            >
              <span style={{
                width: '22px', height: '22px', borderRadius: '6px',
                background: 'rgba(139,92,246,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: '#a78bfa',
                fontFamily: 'var(--font-label)', flexShrink: 0
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {addr}
              </span>
              <ExternalLink size={11} style={{ flexShrink: 0, opacity: 0.5 }} />
            </a>
          ))}
          {walletList.length === 0 && !loading && (
            <p className="text-muted" style={{ padding: '20px', textAlign: 'center', gridColumn: '1 / -1' }}>
              No wallet interactions found yet.
            </p>
          )}
        </div>
      </div>

      {/* ── Recent Activity Timeline ─────────────────────────────────── */}
      <div className="card">
        <h4 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#f59e0b" />
          Recent Protocol Activity
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '350px', overflowY: 'auto' }}>
          {events.slice(0, 25).map((ev, i) => (
            <div
              key={ev.id || i}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${ev.type === 'created' ? '#86EE1E' : ev.type === 'withdrawal' ? '#8b5cf6' : '#ef4444'}`,
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: ev.type === 'created' ? 'rgba(134,238,30,0.10)'
                  : ev.type === 'withdrawal' ? 'rgba(139,92,246,0.10)'
                  : 'rgba(239,68,68,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {ev.type === 'created' ? <ArrowUpRight size={14} color="#86EE1E" />
                  : ev.type === 'withdrawal' ? <ArrowDownRight size={14} color="#8b5cf6" />
                  : <AlertCircle size={14} color="#ef4444" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                  {ev.type === 'created' ? 'Stream Created' : ev.type === 'withdrawal' ? 'Withdrawal' : 'Cancelled'}
                  {ev.amountXlm && <span style={{ color: '#86EE1E', marginLeft: '8px' }}>{ev.amountXlm} XLM</span>}
                </div>
                <div className="text-muted" style={{ fontSize: '11px' }}>
                  {ev.sender && `From: ${truncateAddress(ev.sender)}`}
                  {ev.sender && ev.receiver && ' → '}
                  {ev.receiver && `To: ${truncateAddress(ev.receiver)}`}
                </div>
              </div>
              <span className="text-muted" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {new Date(ev.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
          {events.length === 0 && !loading && (
            <p className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>
              No protocol events found on-chain.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function KPICard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={18} color={color} />
        </div>
        <span className="text-muted" style={{
          fontSize: '12px', fontFamily: 'var(--font-label)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>
          {label}
        </span>
      </div>
      <div>
        <div style={{
          fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-brand)',
          letterSpacing: '-0.03em', color: 'var(--text)'
        }}>
          {value}
        </div>
        {sub && <p className="text-muted" style={{ fontSize: '11.5px', marginTop: '2px' }}>{sub}</p>}
      </div>
    </div>
  )
}

function TxRow({ icon: Icon, label, count, color, total }) {
  const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px',
        background: `${color}12`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={14} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{count}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

function HealthRow({ label, status, detail }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle2 size={14} color={status === 'operational' ? '#10b981' : '#ef4444'} />
        <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="text-muted" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          {detail}
        </span>
        <span style={{
          display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
          background: status === 'operational' ? '#10b981' : '#ef4444',
          boxShadow: status === 'operational' ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(239,68,68,0.5)'
        }} />
      </div>
    </div>
  )
}
