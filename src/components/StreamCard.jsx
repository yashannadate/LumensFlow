import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useToast } from '../components/Toast.jsx'
import TxSuccess from '../components/TxSuccess.jsx'
import { truncateAddress } from '../utils/stellar.js'
import { getStreamStatus, calculateProgress } from '../utils/time.js'
import { ArrowRight, Download, XCircle, Zap } from 'lucide-react'

export default function StreamCard({ stream, onAction }) {
  const navigate = useNavigate()
  const { address } = useWallet()
  const { withdraw, cancel } = useStream()
  const toast = useToast()
  const [now,    setNow]    = useState(Math.floor(Date.now() / 1000))
  const [error,  setError]  = useState(null)
  const [busy,   setBusy]   = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [txType, setTxType] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  const isReceiver = address === stream.receiver
  const isSender   = address === stream.sender

  // 100% Contract Math — ZERO JS approximations for money
  const start = Number(stream.start_time)
  const end   = Number(stream.end_time)
  const dur   = end - start
  
  const status   = (stream.status === 'Active' && now >= end) ? 'Completed' : stream.status
  const isActive = status === 'Active'

  const total     = Number(stream.deposit_amount) / 1e7
  const withdrawn = Number(stream.withdrawn_amount) / 1e7
  const flowRate  = dur > 0 ? total / dur : 0

  let withdrawable = Number(stream.contract_withdrawable || 0n) / 1e7
  if (!isActive) withdrawable = 0 // Enforce status rule

  const streamed = withdrawn + withdrawable
  const progress = total > 0 ? Math.min(100, Math.max(0, (streamed / total) * 100)) : 0

  const handleWithdraw = async (e) => {
    e.stopPropagation()
    if (stream?.status !== 'Active') {
      toast.error('Withdrawal Failed', 'Stream is no longer active')
      return
    }
    if (busy) return
    setBusy(true); setError(null); setTxHash(null); setTxType('withdraw')
    try {
      console.log('Stream BEFORE action:', stream)
      const result = await withdraw(Number(stream.id))
      console.log('Stream AFTER action (txhash):', result?.txHash)
      
      const hash = result?.txHash || null
      setTxHash(hash)
      toast.success('Withdrawal Successful', 'Your money has been successfully withdrawn.', hash)
      if (onAction) onAction()
    } catch (err) {
      setError(err?.message || 'Withdraw failed')
      toast.error('Withdrawal Failed', err?.message || 'Transaction rejected')
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = async (e) => {
    e.stopPropagation()
    if (stream?.status !== 'Active') {
      toast.error('Cancel Failed', 'Stream is no longer active')
      return
    }
    if (busy) return
    setBusy(true); setError(null); setTxHash(null); setTxType('cancel')
    try {
      console.log('Stream BEFORE action:', stream)
      const result = await cancel(Number(stream.id))
      console.log('Stream AFTER action (txhash):', result?.txHash)

      const hash = result?.txHash || null
      setTxHash(hash)
      toast.success('Stream Cancelled', 'Your money stream has been successfully cancelled.', hash)
      if (onAction) onAction()
    } catch (err) {
      setError(err?.message || 'Cancel failed')
      toast.error('Cancel Failed', err?.message || 'Transaction rejected')
    } finally {
      setBusy(false)
    }
  }

  const badgeClass = `badge-${status.toLowerCase()}`

  return (
    <div className="card" style={{ padding:'20px',display:'flex',flexDirection:'column',gap:'14px',cursor:'default' }}>
      {/* Top row */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ fontSize:'12px',color:'var(--text-muted)',fontWeight:500,fontFamily:'var(--font-display)' }}>
          Stream #{Number(stream.id)}
        </span>
        <span className={badgeClass}>
          {isActive && <span style={{ width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',display:'inline-block',marginRight:'5px',animation:'pulse 1.5s infinite' }}/>}
          {status}
        </span>
      </div>

      {/* Direction + Amount */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <div>
          <div style={{ fontSize:'11px',color:'var(--text-muted)',marginBottom:'3px',textTransform:'uppercase',letterSpacing:'.8px' }}>{isSender?'→ To':'← From'}</div>
          <div style={{ fontFamily:'monospace',fontSize:'13px',color:'#c4b5fd' }}>
            {truncateAddress(isSender ? stream.receiver : stream.sender)}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'18px',fontWeight:700,fontFamily:'var(--font-display)' }}>{total.toFixed(2)} <span style={{ fontSize:'12px',opacity:.5,fontWeight:400 }}>XLM</span></div>
          <div style={{ fontSize:'11px',color:'var(--purple-light)',fontFamily:'monospace',display:'flex',alignItems:'center',gap:'3px',justifyContent:'flex-end' }}>
            <Zap size={10}/>{flowRate.toFixed(7)}/s
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="progress-bar">
          <div className={`progress-fill${isActive?' progress-animated':''}`} style={{ width:`${progress}%` }}/>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',marginTop:'6px',fontSize:'11px',color:'var(--text-muted)' }}>
          <span>{progress.toFixed(1)}% streamed</span>
          {isActive && <span style={{ color:'var(--purple-light)' }}>Withdrawable: {withdrawable.toFixed(4)}</span>}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px' }}>
        {[
          { label:'Streamed',  value:`${streamed.toFixed(4)} XLM`, color:isActive?'var(--purple-light)':'white' },
          { label:'Withdrawn', value:`${withdrawn.toFixed(4)} XLM`, color:'white' },
        ].map(m => (
          <div key={m.label} style={{ background:'rgba(5,5,14,0.6)',borderRadius:'10px',padding:'10px 12px' }}>
            <div style={{ fontSize:'10px',color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'3px' }}>{m.label}</div>
            <div style={{ fontSize:'13px',fontWeight:600,fontFamily:'monospace',color:m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* TxSuccess */}
      {txHash && (
        <TxSuccess
          title={txType==='withdraw'?'Withdrawal Successful':'Stream Cancelled'}
          description={txType==='withdraw'?'Your money has been successfully withdrawn.':'Your money stream has been successfully cancelled.'}
          txHash={txHash}
          onDismiss={() => { setTxHash(null); setTxType(null) }}
        />
      )}

      {/* Error */}
      {error && !txHash && (
        <div style={{ color:'var(--red)',fontSize:'12px',background:'rgba(239,68,68,0.08)',padding:'8px 12px',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'4px',borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex',gap:'8px' }}>
          {isReceiver && isActive && (
            <button onClick={handleWithdraw} disabled={busy||withdrawable<0.0000001} className="btn-primary" style={{ padding:'8px 16px',fontSize:'12px',borderRadius:'10px' }}>
              <Download size={13}/> {busy&&txType==='withdraw'?'…':'Withdraw'}
            </button>
          )}
          {isSender && isActive && (
            <button onClick={handleCancel} disabled={busy} className="btn-danger" style={{ padding:'8px 16px',fontSize:'12px',borderRadius:'10px' }}>
              <XCircle size={13}/> {busy&&txType==='cancel'?'…':'Cancel'}
            </button>
          )}
        </div>
        <button onClick={() => navigate(`/stream/${Number(stream.id)}`)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--purple)',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px',fontFamily:'var(--font-display)' }}>
          Details <ArrowRight size={12}/>
        </button>
      </div>
    </div>
  )
}
