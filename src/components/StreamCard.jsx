import { useState, useEffect } from 'react'
import { Zap, ArrowUp } from 'lucide-react'
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
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-white border border-outline-variant/65 rounded-2xl hover:border-secondary hover:shadow-[0_0_20px_rgba(29,255,0,0.15)] transition-all duration-300 relative overflow-hidden no-underline cursor-pointer group"
    >
      {/* SECTION A: Recipient Info */}
      <div className="flex items-center gap-4 w-full md:w-auto flex-shrink-0">
        <div className="w-11 h-11 rounded-full bg-surface-container-low border border-outline-variant/40 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-on-secondary transition-all">
          {isIncoming ? <ArrowUp size={20} className="rotate-[-45deg]" /> : <Zap size={20} />}
        </div>
        <div className="flex flex-col">
          <div className="font-mono text-sm text-primary font-bold">
            {shortAddress}
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-semibold text-xs mt-0.5">
            <Zap size={10} className="text-secondary fill-secondary" /> {flowRate} XLM/s
          </div>
        </div>
      </div>

      {/* SECTION B: Progress */}
      <div className="flex-1 w-full flex flex-col gap-2">
        <div className="w-full h-1 bg-surface-container-low rounded-full overflow-hidden">
          <div 
            style={{ width: `${progress}%` }} 
            className="h-full bg-secondary transition-all duration-1000"
          />
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant font-mono uppercase tracking-wider font-semibold">
          <span>Started {formatDistanceToNow(Number(stream.start_time) * 1000)} ago</span>
          <span>∞ Ongoing</span>
        </div>
      </div>

      {/* SECTION C: Live Counter */}
      <div className="text-left md:text-right w-full md:w-auto flex-shrink-0">
        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
          Total Available
        </div>
        <div className="font-display-lg text-[22px] font-extrabold text-primary tracking-tight flex items-baseline md:justify-end gap-1">
          {withdrawable.toFixed(4)} <span className="text-xs font-normal opacity-60">XLM</span>
        </div>
        <div className="flex items-center md:justify-end gap-1 text-secondary-fixed-dim font-bold text-xs mt-0.5">
          <ArrowUp size={10} /> +{flowRate} XLM/s
        </div>
      </div>

      {/* SECTION D: Status + Actions */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto flex-shrink-0">
        <div className={`text-[10px] font-bold rounded-full px-3 py-1 border flex items-center gap-1.5 uppercase ${
          status === 'Active' 
            ? 'bg-secondary text-on-secondary border-secondary' 
            : status === 'Completed' 
              ? 'bg-surface-variant border-outline text-on-surface-variant font-bold' 
              : 'bg-surface-container-low border-outline-variant text-on-surface-variant/70'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-currentColor animate-pulse" />
          {status}
        </div>
      </div>

    </Link>
  )
}
