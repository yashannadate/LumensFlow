import { CheckCircle, PauseCircle, Plus, ArrowDownLeft, TrendingUp, HelpCircle, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { CONTRACT_ID } from '../utils/stellar.js'

const ICONS = {
  'created': { icon: Plus, color: '#000000', bg: '#1DFF00' },
  'withdrawal':      { icon: ArrowDownLeft, color: '#000000', bg: '#1DFF00' },
  'cancelled':{ icon: PauseCircle, color: '#4c4546', bg: '#e2e2e5' },
}

export default function ActivityFeed({ activities, loading }) {
  return (
    <div className="bg-white border border-outline-variant/65 rounded-2xl p-6 flex flex-col gap-5 shadow-xs text-left">
      
      <div className="flex items-center justify-between">
        <h3 className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary flex flex-col gap-1">
          Live Testnet Ledger
          <span className="font-body-md text-[10px] text-on-surface-variant tracking-normal normal-case font-normal">Data directly from public Stellar Testnet</span>
        </h3>
        <HelpCircle size={14} className="text-on-surface-variant/60" />
      </div>

      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 items-center opacity-50">
              <div className="w-7 h-7 rounded-full bg-surface-container-low animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/5 h-2.5 bg-surface-container-low rounded animate-pulse" />
                <div className="w-2/5 h-2 bg-surface-container-low rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="text-center py-5 text-on-surface-variant font-mono text-xs">
            No activity yet
          </div>
        ) : (
          activities.slice(0, 10).map((activity, i) => {
            const config = ICONS[activity.type] || { icon: TrendingUp, color: '#000000', bg: '#1DFF00' }
            const Icon = config.icon
            
            const shortAddr = (addr) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ''

            return (
              <div key={i} className={`flex gap-3 items-center pb-4 ${i < 9 ? 'border-b border-outline-variant/30' : ''}`}>
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-primary truncate">
                      {activity.type === 'created' ? `Created Stream #${activity.streamId}` : 
                       activity.type === 'withdrawal' ? `Withdrew Funds #${activity.streamId}` : 
                       activity.type === 'cancelled' ? `Cancelled Stream #${activity.streamId}` : activity.type}
                    </span>
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      title="View on Block Explorer"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  
                  <div className="text-[10px] text-primary/80 font-mono font-semibold mt-0.5 flex items-center gap-1">
                    {activity.type === 'created' ? (
                      <>{shortAddr(activity.sender)} <span className="opacity-40">→</span> {shortAddr(activity.receiver)}</>
                    ) : activity.type === 'withdrawal' ? (
                       <>{shortAddr(activity.receiver)} <span className="opacity-40">(Recipient)</span></>
                    ) : (
                       <>{shortAddr(activity.sender)} <span className="opacity-40">(Sender)</span></>
                    )}
                  </div>

                  <div className="text-[10px] text-on-surface-variant/60 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <a 
        href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} 
        target="_blank" 
        rel="noreferrer" 
        className="text-center text-[10px] text-primary hover:text-secondary font-bold font-mono uppercase tracking-wider pt-2"
      >
        View All ↗
      </a>
    </div>
  )
}
