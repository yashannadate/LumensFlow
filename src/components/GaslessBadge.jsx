/**
 * GaslessBadge — shows sponsorship status in the UI.
 * Used in CreateStream form and StreamDetails actions.
 */
import { Zap, ShieldCheck } from 'lucide-react'
import { getSponsorshipInfo } from '../utils/sponsorService'

export function GaslessBadge({ style = {} }) {
  return (
    <div 
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-on-secondary rounded-full font-label-sm tracking-wider uppercase select-none text-[11px]"
      style={style}
    >
      <Zap size={11} className="fill-current" />
      <span>Gasless</span>
    </div>
  )
}

export function SponsorshipBanner() {
  const info = getSponsorshipInfo()

  return (
    <div className="flex items-start gap-3 p-4 bg-secondary/10 border border-secondary/35 rounded-xl text-left">
      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0 text-primary">
        <ShieldCheck size={16} />
      </div>
      <div>
        <div className="text-[12.5px] font-bold text-primary mb-0.5 font-label">
          Fee Sponsorship Active
        </div>
        <p className="text-[11.5px] text-on-surface-variant leading-relaxed m-0 font-normal">
          {info.description}
        </p>
      </div>
    </div>
  )
}

export function FeeComparisonRow() {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-on-surface-variant">Your Network Fee</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-on-surface-variant/60 line-through font-mono">
          ~0.003 XLM
        </span>
        <span className="text-xs font-bold text-primary font-mono bg-secondary px-1.5 py-0.5 rounded-sm">
          FREE ✓
        </span>
      </div>
    </div>
  )
}

