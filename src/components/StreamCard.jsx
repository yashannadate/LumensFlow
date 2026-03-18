import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { truncateAddress } from '../utils/stellar.js'
import { getStreamStatus, calculateProgress } from '../utils/time.js'
import { ArrowRight, Download, XCircle, Clock, Zap } from 'lucide-react'

export default function StreamCard({ stream, onAction }) {
  const navigate = useNavigate()
  const { address } = useWallet()
  const { withdraw, cancel } = useStream()
  const [now,   setNow]   = useState(Math.floor(Date.now() / 1000))
  const [error, setError] = useState(null)
  const [busy,  setBusy]  = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  const isReceiver = address === stream.receiver
  const isSender   = address === stream.sender

  // Derive status from contract enum, with frontend time awareness
  const status   = getStreamStatus(stream, now)
  const isActive = status === 'Active'

  const total     = Number(stream.deposit_amount) / 1e7
  const start     = Number(stream.start_time)
  const end       = Number(stream.end_time)
  const dur       = end - start
  const withdrawn = Number(stream.withdrawn_amount) / 1e7
  const flowRate  = dur > 0 ? total / dur : 0

  // Precise frontend mirror: deposit * elapsed / duration
  const elapsed      = Math.max(0, Math.min(now, end) - start)
  const streamed     = dur > 0 ? (total * elapsed) / dur : 0
  const withdrawable = Math.max(0, streamed - withdrawn)
  const progress     = calculateProgress(stream, now)

  const endDate = new Date(end * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const handleWithdraw = async (e) => {
    e.stopPropagation()
    setBusy(true); setError(null)
    try {
      await withdraw(Number(stream.id))
      if (onAction) onAction()
    } catch (err) {
      setError(err?.message || 'Withdraw failed')
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = async (e) => {
    e.stopPropagation()
    setBusy(true); setError(null)
    try {
      await cancel(Number(stream.id))
      if (onAction) onAction()
    } catch (err) {
      setError(err?.message || 'Cancel failed')
    } finally {
      setBusy(false)
    }
  }

  const badgeClass = `badge-${status.toLowerCase()}`

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.2s, transform 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
          Stream #{Number(stream.id)}
        </span>
        <span className={badgeClass}>
          {isActive && <span style={{ marginRight: '4px', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', animation: 'pulse 2s infinite' }} />}
          {status}
        </span>
      </div>

      {/* Address + Amount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {isSender ? 'To' : 'From'}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
            {truncateAddress(isSender ? stream.receiver : stream.sender)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{total.toFixed(2)} XLM</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Zap size={10} color="var(--purple)" /> {flowRate.toFixed(6)}/s
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="progress-bar">
          <div className={`progress-fill${isActive ? ' progress-animated' : ''}`} style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--purple)' }}>Withdrawable: {withdrawable.toFixed(5)} XLM</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} /> {now < end ? endDate : 'Ended'}
          </span>
        </div>
      </div>

      {/* Remaining */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
        <span>Streamed: <strong style={{ color: 'white' }}>{streamed.toFixed(4)}</strong> XLM</span>
        <span>Withdrawn: <strong style={{ color: 'white' }}>{withdrawn.toFixed(4)}</strong> XLM</span>
      </div>

      {error && (
        <div style={{ color: 'var(--red)', fontSize: '12px', background: 'rgba(239,68,68,0.08)', padding: '6px 10px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isReceiver && isActive && (
            <button
              onClick={handleWithdraw}
              disabled={busy || withdrawable < 0.0000001}
              className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '13px', borderRadius: '8px' }}
            >
              <Download size={13} /> {busy ? '…' : 'Withdraw'}
            </button>
          )}
          {isSender && isActive && (
            <button
              onClick={handleCancel}
              disabled={busy}
              className="btn-danger"
              style={{ padding: '7px 14px', fontSize: '13px', borderRadius: '8px' }}
            >
              <XCircle size={13} /> {busy ? '…' : 'Cancel'}
            </button>
          )}
        </div>
        <button
          onClick={() => navigate(`/stream/${Number(stream.id)}`)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--purple)', fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'var(--font-body)',
          }}
        >
          Details <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}
