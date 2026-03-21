import { useState, useEffect } from 'react'
import { Zap, Play, Pause, XCircle, ExternalLink, MoreHorizontal, ArrowUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

export default function StreamCard({ stream, onAction }) {
  const [withdrawable, setWithdrawable] = useState(0)
  const isIncoming = stream.isIncoming // Assuming this is passed or determined

  // ── Status and Virtual Status ──────────────────────────────────────────
  const now = Math.floor(Date.now() / 1000)
  const status = (stream.status === 'Active' && now >= Number(stream.end_time)) ? 'Completed' : stream.status

  // ── Calculate live withdrawable amount ──────────────────────────
  useEffect(() => {
    if (status !== 'Active') {
      const total = Number(stream.deposit_amount) / 1e7
      const withdrawn = Number(stream.withdrawn_amount) / 1e7
      // If completed, receiver might still have funds. If cancelled, withdrawn is set to streamed.
      setWithdrawable(status === 'Completed' ? Math.max(0, total - withdrawn) : 0)
      return
    }

    const interval = setInterval(() => {
      const currentNow = Math.floor(Date.now() / 1000)
      const start = Number(stream.start_time)
      const end = Number(stream.end_time)
      const deposit = Number(stream.deposit_amount)
      const withdrawn = Number(stream.withdrawn_amount)

      if (currentNow <= start) {
        setWithdrawable(0)
      } else if (currentNow >= end) {
        setWithdrawable((deposit - withdrawn) / 1e7)
        clearInterval(interval)
      } else {
        const elapsed = currentNow - start
        const totalDuration = end - start
        const accrued = (deposit * elapsed) / totalDuration
        setWithdrawable(Math.max(0, (accrued - withdrawn) / 1e7))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [stream, status])

  const totalAmt = Number(stream.deposit_amount) / 1e7
  const withdrawnAmt = Number(stream.withdrawn_amount) / 1e7
  const progress = totalAmt > 0 ? Math.min(100, ((withdrawnAmt + withdrawable) / totalAmt) * 100) : 0
  const addressToShow = isIncoming ? stream.sender : stream.receiver
  const shortAddress = addressToShow ? `${addressToShow.slice(0, 4)}...${addressToShow.slice(-4)}` : 'Unknown'
  const flowRate = (Number(stream.deposit_amount) / (Number(stream.end_time) - Number(stream.start_time)) / 1e7).toFixed(5)

  return (
    <Link 
      to={`/stream/${stream.id}`} 
      className="card stream-card-container" 
      style={{
        padding: '20px 24px',
        background: 'rgba(13, 17, 23, 0.70)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #1f2937',
        borderRadius: '24px',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1f2937';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* SECTION A: Recipient Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 0 180px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a2030, #0d1117)',
          border: '1px solid #1f2937',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#8b5cf6', flexShrink: 0
        }}>
          {isIncoming ? <ArrowUp size={20} style={{ transform: 'rotate(-45deg)' }} /> : <Zap size={20} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff', fontWeight: 500 }}>
            {shortAddress}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6', fontSize: '11px', fontWeight: 600 }}>
            <Zap size={10} /> {flowRate} XLM/s
          </div>
        </div>
      </div>

      {/* SECTION B: Progress */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ width: '100%', height: '4px', background: '#1f2937', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #8b5cf6, #22c55e)',
            transition: 'width 1s linear'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Started {formatDistanceToNow(Number(stream.start_time) * 1000)} ago</span>
          <span>∞ Ongoing</span>
        </div>
      </div>

      {/* SECTION C: Live Counter */}
      <div style={{ textAlign: 'right', flex: '1 0 160px' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>
          Total Available
        </div>
        <div style={{ fontFamily: 'var(--font-brand)', fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px' }}>
          {withdrawable.toFixed(4)} <span style={{ fontSize: '12px', opacity: 0.6 }}>XLM</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#22c55e', fontSize: '11px', fontWeight: 600 }}>
          <ArrowUp size={10} /> +{flowRate} XLM/s
        </div>
      </div>

      {/* SECTION D: Status + Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '80px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 700, borderRadius: '9999px', padding: '4px 12px',
          background: status === 'Active' ? 'rgba(34,197,94,0.12)' : status === 'Completed' ? 'rgba(139,92,246,0.12)' : 'rgba(148,163,184,0.08)',
          border: `1px solid ${status === 'Active' ? 'rgba(34,197,94,0.3)' : status === 'Completed' ? 'rgba(139,92,246,0.3)' : 'rgba(148,163,184,0.2)'}`,
          color: status === 'Active' ? '#22c55e' : status === 'Completed' ? '#8b5cf6' : '#94a3b8',
          display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase'
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
          {status}
        </div>
        <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
          <MoreHorizontal size={18} />
        </button>
      </div>

    </Link>
  )
}
