import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useToast } from '../components/Toast.jsx'

import { getErrorMessage, truncateAddress, getStream, fetchContractEvents, CONTRACT_ID } from '../utils/stellar.js'
import { getStreamStatus, calculateProgress } from '../utils/time.js'
import {
  ArrowLeft, Download, XCircle, Clock,
  Copy, Check, ExternalLink,
  ArrowUpRight, ArrowDownLeft, RefreshCw, Zap, ShieldCheck, Info
} from 'lucide-react'

const ANON = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'

function SkeletonBox({ h = '50px', w = '100%' }) {
  return (
    <div style={{
      height: h, width: w,
      background: 'rgba(31, 41, 55, 0.4)',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
       <div style={{
         position: 'absolute', inset: 0,
         background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
         animation: 'shimmer 2s infinite',
         backgroundSize: '200% 100%'
       }} />
    </div>
  )
}

export default function StreamDetails() {
  const { id } = useParams()
  const streamId = Number(id)
  const { address } = useWallet()
  const { withdraw, cancel } = useStream()
  const toast = useToast()

  const [stream, setStream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))
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

        // Find creation transaction hash if available
        try {
          const events = await fetchContractEvents(100)
          const creation = events.find(e => e.type === 'created' && Number(e.streamId) === streamId)
          if (creation) setTxHash(creation.txHash)
        } catch (e) {
          console.warn('Could not locate creation tx hash.')
        }

      } catch (e) {
        setLoading(false)
        // setError('Failed to load stream: ' + e.message)
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
    setWorking(true)
    try {
      const result = await withdraw(streamId)
      const updatedStream = await getStream(streamId, address)
      if (updatedStream) setStream(updatedStream)
      toast.success('Withdrawal Successful', 'Your funds have been transferred to your wallet.', result?.txHash)
    } catch (e) {
      toast.error('Withdrawal Failed', getErrorMessage(e))
    } finally {
      setWorking(false)
    }
  }

  const handleCancel = async () => {
    setWorking(true)
    try {
      const result = await cancel(streamId)
      const updatedStream = await getStream(streamId, address)
      if (updatedStream) setStream(updatedStream)
      toast.success('Stream Cancelled', 'Remaining funds have been returned to sender.')
    } catch (e) {
      toast.error('Cancel Failed', getErrorMessage(e))
    } finally {
      setWorking(false)
    }
  }

  if (loading && !stream) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', color: '#6b7280', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
        <RefreshCw size={14} className="animate-spin" /> Synchronizing with Stellar Ledger...
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SkeletonBox h="120px" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <SkeletonBox h="100px" /> <SkeletonBox h="100px" /> <SkeletonBox h="100px" />
        </div>
        <SkeletonBox h="240px" />
      </div>
    </div>
  )

  if (error && !stream) return (
    <div style={{ maxWidth: '680px', margin: '100px auto', textAlign: 'center' }}>
      <XCircle size={48} color="#ef4444" style={{ marginBottom: '24px' }} />
      <h2 style={{ marginBottom: '12px' }}>Stream Not Found</h2>
      <p style={{ color: '#9ca3af', marginBottom: '32px' }}>{error}</p>
      <Link to="/dashboard"><button className="btn-primary">Back to Dashboard</button></Link>
    </div>
  )

  if (!stream) return null

  const isReceiver = address === stream.receiver
  const isSender = address === stream.sender
  const status = (stream.status === 'Active' && now >= Number(stream.end_time)) ? 'Completed' : stream.status
  
  const total = Number(stream.deposit_amount) / 1e7
  const withdrawn = Number(stream.withdrawn_amount) / 1e7
  const start = Number(stream.start_time)
  const end = Number(stream.end_time)
  const duration = end - start
  const flowRate = duration > 0 ? total / duration : 0

  let withdrawable = 0
  if (status === 'Active') {
    const elapsed = Math.min(now, end) - start
    withdrawable = Math.max(0, (flowRate * elapsed) - withdrawn)
  } else if (status === 'Completed') {
    withdrawable = Math.max(0, total - withdrawn)
  }

  const progress = total > 0 ? Math.min(100, ((withdrawn + withdrawable) / total) * 100) : 0
  const canWithdraw = isReceiver && status !== 'Cancelled' && withdrawable > 0.000001
  const canCancel = isSender && status === 'Active'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--dashboard-padding, 40px 32px 100px)', position: 'relative', zIndex: 1 }}>
      
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '32px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="dashboard-two-col" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Display Card */}
          <div className="card" style={{ padding: '40px 32px', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.10) 0%, transparent 75%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(31,41,55,0.4)', borderRadius: '99px', border: '1px solid #374151' }}>
                <div style={{ 
                  width: '6px', height: '6px', borderRadius: '50%', 
                  background: status === 'Active' ? '#22c55e' : status === 'Completed' ? '#8b5cf6' : '#ef4444' 
                }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>{status}</span>
              </div>

             <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Withdrawable Now</div>
             <div style={{ fontFamily: 'var(--font-brand)', fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: '8px' }}>
                {withdrawable.toFixed(7)} <span style={{ fontSize: '0.45em', opacity: 0.5, fontWeight: 400 }}>XLM</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#22c55e', fontSize: '13px', fontWeight: 600, marginBottom: '32px' }}>
                <Zap size={14} /> +{flowRate.toFixed(6)} XLM/s Flow
             </div>

             <div style={{ marginBottom: '24px' }}>
                <div style={{ width: '100%', height: '6px', background: '#131920', borderRadius: '9999px', overflow: 'hidden', marginBottom: '10px' }}>
                   <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #22c55e)', transition: 'width 1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                   <span>{progress.toFixed(2)}% Streamed</span>
                   <span>Target: {total.toFixed(2)} XLM</span>
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '24px', borderTop: '1px solid #1f2937' }}>
                <div style={{ textAlign: 'left' }}>
                   <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Started</div>
                   <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{new Date(start * 1000).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Ends</div>
                   <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{new Date(end * 1000).toLocaleDateString()}</div>
                </div>
             </div>
          </div>

          {/* Parties Card */}
          <div className="card" style={{ padding: '24px' }}>
             <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>Stream Counterparties</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowUpRight size={18} color="#8b5cf6" />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>Sender</div>
                      <div style={{ fontSize: '14px', color: '#fff', fontFamily: 'var(--font-mono)' }}>{truncateAddress(stream.sender)}</div>
                   </div>
                   <button onClick={() => copy(stream.sender, 's')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      {copied === 's' ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                   </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowDownLeft size={18} color="#22c55e" />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>Recipient</div>
                      <div style={{ fontSize: '14px', color: '#fff', fontFamily: 'var(--font-mono)' }}>{truncateAddress(stream.receiver)}</div>
                   </div>
                   <button onClick={() => copy(stream.receiver, 'r')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      {copied === 'r' ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           
           {/* Summary Stats */}
           <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
                 <span style={{ fontSize: '12px', color: '#6b7280' }}>Deposited</span>
                 <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{total.toFixed(2)} XLM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
                 <span style={{ fontSize: '12px', color: '#6b7280' }}>Withdrawn</span>
                 <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{withdrawn.toFixed(4)} XLM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '12px', color: '#6b7280' }}>Remaining</span>
                 <span style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: 700 }}>{(total - (withdrawn + withdrawable)).toFixed(4)} XLM</span>
              </div>
           </div>

           {/* Dynamic Actions */}
           {(canWithdraw || canCancel) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {canWithdraw && (
                    <button 
                      disabled={working}
                      onClick={handleWithdraw}
                      className="btn-primary" 
                      style={{ width: '100%', padding: '16px', borderRadius: '9999px', fontSize: '15px' }}
                    >
                       <Download size={18} /> {working ? 'Processing...' : `Withdraw ${withdrawable.toFixed(4)} XLM`}
                    </button>
                 )}
                 {canCancel && (
                    <button 
                      disabled={working}
                      onClick={handleCancel}
                      style={{ 
                        width: '100%', padding: '16px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600,
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                       <XCircle size={18} /> {working ? 'Processing...' : 'Cancel Stream'}
                    </button>
                 )}
              </div>
           )}

           {/* Identity Context */}
           <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed #1f2937' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <Info size={16} color="#6b7280" style={{ marginTop: '2px' }} />
                 <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
                    {isReceiver ? 'You are the recipient of this stream. You can withdraw accrued funds in real-time.' : 
                     isSender ? 'You are the creator of this stream. You can cancel it to refund the remaining balance.' : 
                     'You are viewing this stream as a public observer on the Stellar network.'}
                 </p>
              </div>
           </div>

           <a href={txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ justifyContent: 'center', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              View on Explorer <ExternalLink size={14} />
           </a>
        </div>

      </div>
    </div>
  )
}