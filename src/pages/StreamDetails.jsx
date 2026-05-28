import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { useToast } from '../components/Toast.jsx'

import { getErrorMessage, truncateAddress, getStream, fetchContractEvents, CONTRACT_ID } from '../utils/stellar.js'
import {
  ArrowLeft, Download, XCircle,
  Copy, Check, ExternalLink,
  ArrowUpRight, ArrowDownLeft, RefreshCw, Zap, Info
} from 'lucide-react'

const ANON = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'

function SkeletonBox({ h = '50px', w = '100%' }) {
  return (
    <div 
      className="bg-surface-container-low rounded-2xl relative overflow-hidden animate-pulse"
      style={{ height: h, width: w }}
    />
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
    <div className="max-w-[800px] mx-auto px-6 py-20 flex flex-col gap-6 text-left">
      <div className="flex items-center gap-2 text-on-surface-variant font-mono text-sm">
        <RefreshCw size={14} className="animate-spin" /> Synchronizing with Stellar Ledger...
      </div>
      <div className="flex flex-col gap-5">
        <SkeletonBox h="120px" />
        <div className="grid grid-cols-3 gap-4">
          <SkeletonBox h="100px" /> 
          <SkeletonBox h="100px" /> 
          <SkeletonBox h="100px" />
        </div>
        <SkeletonBox h="240px" />
      </div>
    </div>
  )

  if (error && !stream) return (
    <div className="max-w-[680px] mx-auto py-24 text-center">
      <XCircle size={48} className="text-red-500 mx-auto mb-6" />
      <h2 className="font-headline-lg text-primary text-2xl font-bold mb-3">Stream Not Found</h2>
      <p className="text-on-surface-variant mb-8">{error}</p>
      <Link to="/dashboard">
        <button className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold btn-hover-glow-neon border-none cursor-pointer">
          Back to Dashboard
        </button>
      </Link>
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
    <div className="bg-surface font-body-md text-on-surface min-h-screen py-12 px-6 md:px-container-margin max-w-[1000px] mx-auto flex flex-col gap-6 text-left">
      
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary no-underline font-semibold font-mono text-xs uppercase tracking-wider mb-4">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Display Card */}
          <div className="bg-white border border-outline-variant/65 rounded-2xl p-8 flex flex-col items-center shadow-xs text-center relative overflow-hidden group">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/60 rounded-full mb-6">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  status === 'Active' ? 'bg-secondary animate-pulse' : status === 'Completed' ? 'bg-primary' : 'bg-red-500' 
                }`} />
                <span className="text-[11px] font-bold text-primary capitalize font-mono">{status}</span>
              </div>

             <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Withdrawable Now</div>
             <div className="font-display-lg text-[44px] font-extrabold text-primary tracking-tight mb-2 tabular-nums">
                {withdrawable.toFixed(7)} <span className="text-lg font-normal opacity-60">XLM</span>
             </div>
             <div className="flex items-center justify-center gap-1.5 text-secondary-fixed-dim font-bold text-xs mb-8">
                <Zap size={12} className="fill-current" /> +{flowRate.toFixed(6)} XLM/s Flow
             </div>
 
             <div className="w-full mb-6">
                <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden mb-2">
                   <div 
                     style={{ width: `${progress}%` }} 
                     className="h-full bg-secondary transition-all duration-1000" 
                   />
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-mono uppercase tracking-wider font-bold">
                   <span>{progress.toFixed(2)}% Streamed</span>
                   <span>Target: {total.toFixed(2)} XLM</span>
                </div>
             </div>
 
             <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/30 text-left">
                <div>
                   <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Started</div>
                   <div className="text-sm font-bold text-primary">{new Date(start * 1000).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                   <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Ends</div>
                   <div className="text-sm font-bold text-primary">{new Date(end * 1000).toLocaleDateString()}</div>
                </div>
             </div>
          </div>

          {/* Parties Card */}
          <div className="bg-white border border-outline-variant/65 rounded-2xl p-6 shadow-xs">
             <h3 className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-5">Stream Counterparties</h3>
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4 p-3 bg-surface-container-low rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant/40 flex items-center justify-center text-primary flex-shrink-0">
                         <ArrowUpRight size={18} />
                      </div>
                      <div>
                         <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Sender</div>
                         <div className="text-xs font-bold text-primary font-mono">{truncateAddress(stream.sender)}</div>
                      </div>
                   </div>
                   <button 
                     onClick={() => copy(stream.sender, 's')} 
                     className="bg-none border-none cursor-pointer text-on-surface-variant hover:text-primary p-1"
                   >
                      {copied === 's' ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
                   </button>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 bg-surface-container-low rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant/40 flex items-center justify-center text-primary flex-shrink-0">
                         <ArrowDownLeft size={18} />
                      </div>
                      <div>
                         <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Recipient</div>
                         <div className="text-xs font-bold text-primary font-mono">{truncateAddress(stream.receiver)}</div>
                      </div>
                   </div>
                   <button 
                     onClick={() => copy(stream.receiver, 'r')} 
                     className="bg-none border-none cursor-pointer text-on-surface-variant hover:text-primary p-1"
                   >
                      {copied === 'r' ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           
           {/* Summary Stats */}
           <div className="bg-white border border-outline-variant/65 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex justify-between border-b border-outline-variant/30 pb-3">
                 <span className="text-xs text-on-surface-variant">Deposited</span>
                 <span className="text-sm font-bold text-primary font-mono">{total.toFixed(2)} XLM</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-3">
                 <span className="text-xs text-on-surface-variant">Withdrawn</span>
                 <span className="text-sm font-bold text-primary font-mono">{withdrawn.toFixed(4)} XLM</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-xs text-on-surface-variant">Remaining</span>
                 <span className="text-sm font-extrabold text-primary font-mono bg-secondary px-1.5 py-0.5 rounded-sm">{(total - (withdrawn + withdrawable)).toFixed(4)} XLM</span>
              </div>
           </div>

           {/* Dynamic Actions */}
           {(canWithdraw || canCancel) && (
              <div className="flex flex-col gap-3">
                 {canWithdraw && (
                    <button 
                      disabled={working}
                      onClick={handleWithdraw}
                      className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-bold flex items-center justify-center gap-2 btn-hover-glow-neon transition-all active:scale-95 border-none cursor-pointer text-base shadow-xs"
                    >
                       <Download size={18} /> {working ? 'Processing...' : `Withdraw ${withdrawable.toFixed(4)} XLM`}
                    </button>
                 )}
                 {canCancel && (
                    <button 
                      disabled={working}
                      onClick={handleCancel}
                      className="w-full bg-red-50 border border-red-200 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors active:scale-95 cursor-pointer text-sm shadow-xs"
                    >
                       <XCircle size={18} /> {working ? 'Processing...' : 'Cancel Stream'}
                    </button>
                 )}
              </div>
           )}

           {/* Identity Context */}
           <div className="p-5 bg-surface-container-low border border-outline-variant/50 rounded-2xl flex gap-3">
              <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed font-normal">
                 {isReceiver ? 'You are the recipient of this stream. You can withdraw accrued funds in real-time.' : 
                  isSender ? 'You are the creator of this stream. You can cancel it to refund the remaining balance.' : 
                  'You are viewing this stream as a public observer on the Stellar network.'}
              </p>
           </div>

           <a 
             href={txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} 
             target="_blank" 
             rel="noreferrer" 
             className="w-full border border-outline hover:bg-surface-container-low py-3.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 justify-center text-xs uppercase tracking-wider bg-white no-underline text-primary"
           >
              View on Explorer <ExternalLink size={14} />
           </a>
        </div>

      </div>
    </div>
  )
}