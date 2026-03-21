import { CheckCircle, PauseCircle, Plus, ArrowDownLeft, TrendingUp, HelpCircle, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { CONTRACT_ID } from '../utils/stellar.js'

const ICONS = {
  'created': { icon: Plus, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'withdrawal':      { icon: ArrowDownLeft, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'cancelled':{ icon: PauseCircle, color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
}

export default function ActivityFeed({ activities, loading }) {
  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          Live Testnet Ledger
          <span style={{ fontSize: '9px', fontWeight: 500, color: '#6b7280', letterSpacing: 'normal', textTransform: 'none' }}>Data directly from public Stellar Testnet</span>
        </h3>
        <HelpCircle size={14} color="#6b7280" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.5 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1f2937' }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '60%', height: '10px', background: '#1f2937', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ width: '40%', height: '8px', background: '#1f2937', borderRadius: '4px' }} />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            No activity yet
          </div>
        ) : (
          activities.slice(0, 10).map((activity, i) => {
            const config = ICONS[activity.type] || { icon: TrendingUp, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' }
            const Icon = config.icon
            
            const shortAddr = (addr) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ''

            return (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: i < 9 ? '16px' : '0', borderBottom: i < 9 ? '1px solid rgba(31,41,55,0.6)' : 'none' }}>
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '50%', 
                  background: config.bg, border: `1px solid ${config.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <Icon size={14} color={config.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                      {activity.type === 'created' ? `Created Stream #${activity.streamId}` : 
                       activity.type === 'withdrawal' ? `Withdrew Funds #${activity.streamId}` : 
                       activity.type === 'cancelled' ? `Cancelled Stream #${activity.streamId}` : activity.type}
                    </span>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`} target="_blank" rel="noreferrer" style={{ color: '#4b5563', display: 'flex', alignItems: 'center', transition: 'color 0.2s', cursor: 'pointer' }} title="View on Block Explorer">
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  
                  <div style={{ fontSize: '10px', color: '#8b5cf6', fontFamily: 'var(--font-mono)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {activity.type === 'created' ? (
                      <>{shortAddr(activity.sender)} <span style={{ opacity: 0.5 }}>→</span> {shortAddr(activity.receiver)}</>
                    ) : activity.type === 'withdrawal' ? (
                       <>{shortAddr(activity.receiver)} <span style={{ opacity: 0.5 }}>(Recipient)</span></>
                    ) : (
                       <>{shortAddr(activity.sender)} <span style={{ opacity: 0.5 }}>(Sender)</span></>
                    )}
                  </div>

                  <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '2px' }}>
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <a href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} target="_blank" rel="noreferrer" style={{ 
        textAlign: 'center', fontSize: '11px', color: '#8b5cf6', fontWeight: 600, textDecoration: 'none', 
        fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '4px' 
      }}>
        View All ↗
      </a>
    </div>
  )
}
