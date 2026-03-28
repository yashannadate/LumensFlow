/**
 * GaslessBadge — shows sponsorship status in the UI.
 * Used in CreateStream form and StreamDetails actions.
 */
import { Zap, ShieldCheck, Info } from 'lucide-react'
import { getSponsorshipInfo } from '../utils/sponsorService'

export function GaslessBadge({ style = {} }) {
  const info = getSponsorshipInfo()

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '5px 14px',
      background: 'linear-gradient(135deg, rgba(134,238,30,0.08), rgba(134,238,30,0.04))',
      border: '1px solid rgba(134,238,30,0.25)',
      borderRadius: '9999px',
      ...style,
    }}>
      <Zap size={12} color="#86EE1E" />
      <span style={{
        fontSize: '11px', fontFamily: 'var(--font-label)', fontWeight: 700,
        color: '#86EE1E', textTransform: 'uppercase', letterSpacing: '0.06em'
      }}>
        Gasless
      </span>
    </div>
  )
}

export function SponsorshipBanner() {
  const info = getSponsorshipInfo()

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '14px 18px',
      background: 'linear-gradient(135deg, rgba(134,238,30,0.06), rgba(139,92,246,0.06))',
      border: '1px solid rgba(134,238,30,0.15)',
      borderRadius: '14px',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
        background: 'rgba(134,238,30,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ShieldCheck size={16} color="#86EE1E" />
      </div>
      <div>
        <div style={{
          fontSize: '12.5px', fontWeight: 700, color: '#86EE1E',
          marginBottom: '3px', fontFamily: 'var(--font-label)'
        }}>
          Fee Sponsorship Active
        </div>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          {info.description}
        </p>
      </div>
    </div>
  )
}

export function FeeComparisonRow() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: '12px', color: '#6b7280' }}>Your Network Fee</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '11px', color: '#6b7280',
          textDecoration: 'line-through', fontFamily: 'var(--font-mono)'
        }}>
          ~0.003 XLM
        </span>
        <span style={{
          fontSize: '13px', fontWeight: 700, color: '#86EE1E',
          fontFamily: 'var(--font-mono)'
        }}>
          FREE ✓
        </span>
      </div>
    </div>
  )
}
