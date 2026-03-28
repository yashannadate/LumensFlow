import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Search, Filter, ArrowUpRight, ArrowDownRight,
  AlertCircle, RefreshCw, ExternalLink, ChevronRight,
  Database, Activity, Users, Layers
} from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { useStream } from '../hooks/useStream'
import { buildStreamHistory, filterHistory, getHistoryStats } from '../utils/indexer'

export default function History() {
  const { address } = useWallet()
  const { fetchUserStreams } = useStream()

  const [history, setHistory] = useState([])
  const [filtered, setFiltered] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const streams = await fetchUserStreams()
      const enriched = buildStreamHistory(streams, address)
      setHistory(enriched)
      setStats(getHistoryStats(enriched))
    } catch (err) {
      console.error('History load error:', err)
    } finally {
      setLoading(false)
    }
  }, [address, fetchUserStreams])

  useEffect(() => { loadHistory() }, [loadHistory])

  // Apply filters whenever data or filters change
  useEffect(() => {
    setFiltered(filterHistory(history, searchQuery, statusFilter, roleFilter))
  }, [history, searchQuery, statusFilter, roleFilter])

  const statusColors = {
    Active: '#86EE1E',
    Completed: '#8b5cf6',
    Cancelled: '#ef4444',
    Pending: '#f59e0b',
  }

  const statusBgColors = {
    Active: 'rgba(134,238,30,0.08)',
    Completed: 'rgba(139,92,246,0.08)',
    Cancelled: 'rgba(239,68,68,0.08)',
    Pending: 'rgba(245,158,11,0.08)',
  }

  return (
    <div style={{ padding: 'var(--dashboard-padding)', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Database size={20} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h3 style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>Stream History</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Indexed transaction data from on-chain stream activity
            </p>
          </div>
          <button
            onClick={loadHistory}
            disabled={loading}
            style={{
              background: 'rgba(139,92,246,0.10)',
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: '9999px',
              padding: '8px 16px', color: '#a78bfa', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Indexing...' : 'Re-index'}
          </button>
        </div>
      </div>

      {/* ── Stats Overview ───────────────────────────────────────────── */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px', marginBottom: '24px',
        }}>
          <StatPill icon={Layers} label="Total" value={stats.total} color="#8b5cf6" />
          <StatPill icon={Activity} label="Active" value={stats.active} color="#86EE1E" />
          <StatPill icon={ArrowUpRight} label="Completed" value={stats.completed} color="#a78bfa" />
          <StatPill icon={AlertCircle} label="Cancelled" value={stats.cancelled} color="#ef4444" />
          <StatPill icon={Database} label="Volume" value={`${stats.totalVolumeXLM} XLM`} color="#f59e0b" />
          <StatPill icon={Users} label="Participants" value={stats.uniqueParticipants} color="#10b981" />
        </div>
      )}

      {/* ── Search & Filters ─────────────────────────────────────────── */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={14} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by address or stream ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '38px', borderRadius: '10px', fontSize: '13px' }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={13} color="#6b7280" />
            {['all', 'Active', 'Completed', 'Cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 14px', borderRadius: '9999px', fontSize: '11.5px',
                  fontFamily: 'var(--font-label)', fontWeight: 600, cursor: 'pointer',
                  border: statusFilter === s ? '1px solid rgba(139,92,246,0.40)' : '1px solid rgba(255,255,255,0.10)',
                  background: statusFilter === s ? 'rgba(139,92,246,0.12)' : 'transparent',
                  color: statusFilter === s ? '#a78bfa' : '#9ca3af',
                  transition: 'all 0.2s',
                }}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          {/* Role filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['all', 'sender', 'receiver'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: '6px 14px', borderRadius: '9999px', fontSize: '11.5px',
                  fontFamily: 'var(--font-label)', fontWeight: 600, cursor: 'pointer',
                  border: roleFilter === r ? '1px solid rgba(134,238,30,0.40)' : '1px solid rgba(255,255,255,0.10)',
                  background: roleFilter === r ? 'rgba(134,238,30,0.08)' : 'transparent',
                  color: roleFilter === r ? '#86EE1E' : '#9ca3af',
                  transition: 'all 0.2s',
                }}
              >
                {r === 'all' ? 'All Roles' : r === 'sender' ? 'Sent' : 'Received'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────── */}
      <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="text-muted" style={{ fontSize: '12px' }}>
          Showing {filtered.length} of {history.length} streams
        </p>
      </div>

      {/* ── Stream History List ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading && history.length === 0 && (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <RefreshCw size={28} color="#8b5cf6" className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p className="text-muted">Indexing stream history...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <Database size={32} color="#6b7280" style={{ margin: '0 auto 14px', opacity: 0.4 }} />
            <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No streams found</p>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              {history.length > 0 ? 'Try adjusting your filters.' : 'Create your first stream to see history here.'}
            </p>
          </div>
        )}

        {filtered.map(item => (
          <Link
            key={item.streamId}
            to={`/stream/${item.streamId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className="card"
              style={{
                padding: '20px 22px',
                display: 'flex', alignItems: 'center', gap: '16px',
                cursor: 'pointer', transition: 'all 0.2s',
                borderLeft: `3px solid ${statusColors[item.status] || '#6b7280'}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.40)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--card-border)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: statusBgColors[item.status], flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.status === 'Active' ? <Activity size={16} color="#86EE1E" />
                  : item.status === 'Completed' ? <ArrowUpRight size={16} color="#8b5cf6" />
                  : <AlertCircle size={16} color="#ef4444" />}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Stream #{item.streamId}
                  </span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '9999px', fontSize: '10px',
                    fontWeight: 700, fontFamily: 'var(--font-label)',
                    background: statusBgColors[item.status],
                    color: statusColors[item.status],
                    border: `1px solid ${statusColors[item.status]}30`,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {item.status}
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: '9999px', fontSize: '9px',
                    fontWeight: 600, fontFamily: 'var(--font-label)',
                    background: item.role === 'sender' ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
                    color: item.role === 'sender' ? '#f59e0b' : '#10b981',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    {item.role}
                  </span>
                </div>
                <div className="text-muted" style={{ fontSize: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>{item.senderTruncated} → {item.receiverTruncated}</span>
                  <span>{item.startDate}</span>
                </div>
              </div>

              {/* Amount + Arrow */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: '#86EE1E', marginBottom: '2px',
                }}>
                  {item.depositXLM} XLM
                </div>
                <div className="text-muted" style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}>
                  {item.ratePerSecond} /s
                </div>
              </div>
              <ChevronRight size={16} color="#6b7280" style={{ flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Sub-component ────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '14px 16px', borderRadius: '14px',
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '9px',
        background: `${color}12`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={15} color={color} />
      </div>
      <div>
        <div style={{
          fontSize: '18px', fontWeight: 800,
          fontFamily: 'var(--font-brand)', letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}>
          {value}
        </div>
        <div className="text-muted" style={{
          fontSize: '10px', fontFamily: 'var(--font-label)',
          fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}
