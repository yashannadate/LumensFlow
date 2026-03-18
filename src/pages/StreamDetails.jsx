import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useToast } from '../components/Toast.jsx'
import TxSuccess from '../components/TxSuccess.jsx'
import { getErrorMessage, truncateAddress, getStream } from '../utils/stellar.js'
import { getStreamStatus, calculateProgress } from '../utils/time.js'
import {
  ArrowLeft, Download, XCircle, Clock,
  Copy, Check, ExternalLink,
  ArrowUpRight, ArrowDownLeft, RefreshCw,
} from 'lucide-react'

const ANON = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'

function SkeletonBox({ h = '50px', w = '100%' }) {
  return (
    <div style={{
      height: h, width: w,
      background: 'linear-gradient(90deg, #1f2937 25%, #2d3748 50%, #1f2937 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
    }} />
  )
}

export default function StreamDetails() {
  const { id } = useParams()
  const streamId = Number(id)
  const { address } = useWallet()
  const { withdraw, cancel } = useStream()
  const toast = useToast()

  const [stream,  setStream]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [copied,  setCopied]  = useState(null)
  const [now,     setNow]     = useState(Math.floor(Date.now() / 1000))
  const [txError, setTxError] = useState(null)
  const [txHash,  setTxHash]  = useState(null)
  const [txType,  setTxType]  = useState(null)
  const [working, setWorking] = useState(false)

  // 1-second clock
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  // Fetch on mount + 5s poll
  useEffect(() => {
    const source = address || ANON
    const load = async () => {
      try {
        setLoading(prev => stream === null ? true : prev)
        const data = await getStream(streamId, source)
        if (!data) { setError(`Stream #${streamId} not found on Stellar Testnet`); return }
        setStream(data)
        setError(null)
      } catch (e) {
        setError('Failed to load stream: ' + e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [streamId, address])

  const copy = (txt, key) => {
    navigator.clipboard.writeText(txt)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleWithdraw = async () => {
    if (stream?.status !== 'Active') {
      toast.error('Withdrawal Failed', 'Stream is no longer active')
      return
    }
    setWorking(true); setTxError(null); setTxHash(null); setTxType('withdraw')
    try {
      console.log('Stream BEFORE action:', stream)
      const result = await withdraw(streamId)
      const updatedStream = await getStream(streamId, address)
      if (updatedStream) setStream(updatedStream)
      console.log('Stream AFTER action:', updatedStream, 'txHash:', result?.txHash)
      
      const hash = result?.txHash || null
      setTxHash(hash)
      toast.success('Withdrawal Successful', 'Your money has been successfully withdrawn.', hash)
    } catch (e) {
      const msg = getErrorMessage(e)
      setTxError(msg)
      toast.error('Withdrawal Failed', msg)
    } finally {
      setWorking(false)
    }
  }

  const handleCancel = async () => {
    if (stream?.status !== 'Active') {
      toast.error('Cancel Failed', 'Stream is no longer active')
      return
    }
    setWorking(true); setTxError(null); setTxHash(null); setTxType('cancel')
    try {
      console.log('Stream BEFORE action:', stream)
      const result = await cancel(streamId)
      const updatedStream = await getStream(streamId, address)
      if (updatedStream) setStream(updatedStream)
      console.log('Stream AFTER action:', updatedStream, 'txHash:', result?.txHash)

      const hash = result?.txHash || null
      setTxHash(hash)
      toast.success('Stream Cancelled', 'Your money stream has been successfully cancelled.', hash)
    } catch (e) {
      const msg = getErrorMessage(e)
      setTxError(msg)
      toast.error('Cancel Failed', msg)
    } finally {
      setWorking(false)
    }
  }

  // Loading skeleton
  if (loading && !stream) return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
        <RefreshCw size={14} className="animate-spin" /> Loading stream data...
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SkeletonBox h="80px" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <SkeletonBox h="90px" /> <SkeletonBox h="90px" />
          <SkeletonBox h="90px" /> <SkeletonBox h="90px" />
        </div>
        <SkeletonBox h="160px" />
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )

  // Error state
  if (error && !stream) return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', marginBottom: '40px' }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
        <XCircle size={40} style={{ color: 'var(--red)', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{error}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>The stream may not exist or the network may be unavailable.</p>
        <Link to="/dashboard"><button className="btn-primary" style={{ margin: '0 auto' }}><ArrowLeft size={14} /> Back to Dashboard</button></Link>
      </div>
    </div>
  )

  if (!stream) return null

  // Compute live values
  const isReceiver = address === stream.receiver
  const isSender   = address === stream.sender
  const isGuest    = address && !isReceiver && !isSender
  const isAnon     = !address

  // 100% Contract Math — ZERO JS approximations for money
  const start     = Number(stream.start_time)
  const end       = Number(stream.end_time)
  const dur       = end - start

  const status   = (stream.status === 'Active' && now >= end) ? 'Completed' : stream.status
  const isActive = status === 'Active'

  const total     = Number(stream.deposit_amount) / 1e7
  const withdrawn = Number(stream.withdrawn_amount) / 1e7
  const flowRate  = dur > 0 ? total / dur : 0

  let withdrawable = Number(stream.contract_withdrawable || 0n) / 1e7
  if (!isActive) withdrawable = 0 // Enforce status rule

  const streamed = withdrawn + withdrawable
  const remaining = Math.max(0, total - streamed)
  const progress = total > 0 ? Math.min(100, Math.max(0, (streamed / total) * 100)) : 0

  const timeLeft    = end - now
  const tlDays      = Math.floor(timeLeft / 86400)
  const tlHours     = Math.floor((timeLeft % 86400) / 3600)
  const tlMins      = Math.floor((timeLeft % 3600) / 60)
  const timeLeftStr = timeLeft > 0
    ? `${tlDays > 0 ? tlDays + 'd ' : ''}${tlHours}h ${tlMins}m remaining`
    : 'Stream ended'

  const endDate = new Date(end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    + ' at ' + new Date(end * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const statCard = (label, value, sub, color) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: color || 'white' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )

  const badgeClass = `badge-${status.toLowerCase()}`

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Header Card */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Stream #{streamId}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={badgeClass}>{status}</span>
                <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none' }}>
                  <ExternalLink size={12} /> Testnet
                </a>
              </div>
            </div>
          </div>

          {/* Sender / Receiver */}
          {[
            { label: 'From', icon: <ArrowUpRight size={12} />, addr: stream.sender,   key: 's' },
            { label: 'To',   icon: <ArrowDownLeft size={12} />, addr: stream.receiver, key: 'r' },
          ].map(row => (
            <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>{row.icon} {row.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{truncateAddress(row.addr)}</span>
              </div>
              <button onClick={() => copy(row.addr, row.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}>
                {copied === row.key ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>

        {/* Guest / Anon notice */}
        {(isGuest || isAnon) && (
          <div style={{ padding: '12px 16px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
            {isAnon ? '🔒 Connect your wallet to interact with this stream.' : '👁 You are viewing this stream as a guest.'}
          </div>
        )}

        {/* Stats 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {statCard('Total Amount',  `${total.toFixed(7)} XLM`, null, null)}
          {statCard('Flow Rate',     `${flowRate.toFixed(6)} XLM/sec`, `${(flowRate * 3600).toFixed(4)} XLM/hr`, 'var(--purple-light)')}
          {statCard('Streamed',      `${streamed.toFixed(4)} XLM`, isActive ? 'live ↑' : null, isActive ? 'var(--purple)' : null)}
          {statCard('Withdrawn',     `${withdrawn.toFixed(4)} XLM`, null, null)}
          {statCard('Remaining',     `${remaining.toFixed(4)} XLM`, 'Left in stream', 'var(--green)')}
          {statCard('Progress',      `${progress.toFixed(1)}%`, null, null)}
        </div>

        {/* Withdrawable Card */}
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px', background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Withdrawable Now
          </div>
          <div className={isActive ? 'live-amount' : ''} style={{ fontSize: '36px', fontWeight: 700, marginBottom: '20px', color: isActive ? 'var(--purple)' : 'white' }}>
            {withdrawable.toFixed(7)} <span style={{ fontSize: '16px', opacity: 0.6, fontWeight: 400 }}>XLM</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div className="progress-bar">
              <div className={`progress-fill${isActive ? ' progress-animated' : ''}`} style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{progress.toFixed(1)}% streamed</span>
              <span>Target: {total.toFixed(2)} XLM</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {timeLeftStr}</span>
            <span>Ends: {endDate}</span>
          </div>
        </div>

        {/* TX Result — reusable component */}
        {txHash && (
          <TxSuccess
            title={txType === 'withdraw' ? 'Withdrawal Successful' : 'Stream Cancelled'}
            description={txType === 'withdraw' ? 'Your money has been successfully withdrawn.' : 'Your money stream has been successfully cancelled.'}
            txHash={txHash}
            onDismiss={() => { setTxHash(null); setTxType(null) }}
          />
        )}

        {/* TX Error */}
        {txError && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: 'var(--red)', fontSize: '13px' }}>
            {txError}
          </div>
        )}

        {/* Action buttons */}
        {(isReceiver || isSender) && isActive && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {isReceiver && (
              <button
                onClick={handleWithdraw}
                disabled={working || withdrawable < 0.0000001}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
              >
                <Download size={16} /> {working ? 'Processing…' : 'Withdraw Funds'}
              </button>
            )}
            {isSender && (
              <button
                onClick={handleCancel}
                disabled={working}
                className="btn-danger"
                style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
              >
                <XCircle size={16} /> {working ? 'Processing…' : 'Cancel Stream'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
