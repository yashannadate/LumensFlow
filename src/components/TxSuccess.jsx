import { useState } from 'react'
import { CheckCircle, ExternalLink, Copy, Check, X } from 'lucide-react'

const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx'

function shortHash(hash) {
  if (!hash || hash.length < 12) return hash || ''
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

/**
 * TxSuccess — inline success card shown after a confirmed transaction.
 *
 * Props:
 *   title       string  — e.g. "Withdrawal Successful"
 *   description string  — short action description
 *   txHash      string  — raw transaction hash
 *   onDismiss   fn      — called when user closes the card
 */
export default function TxSuccess({ title, description, txHash, onDismiss }) {
  const [copied, setCopied] = useState(false)

  if (!txHash) return null

  const explorerUrl = `${EXPLORER_BASE}/${txHash}`

  const copyHash = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'relative',
      padding: '16px 20px',
      background: 'rgba(34,197,94,0.07)',
      border: '1px solid rgba(34,197,94,0.25)',
      borderRadius: '14px',
      animation: 'slide-up 0.25s ease',
    }}>
      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', padding: '2px', display: 'flex',
          }}
        >
          <X size={14} />
        </button>
      )}

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <CheckCircle size={18} color="#22c55e" />
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#22c55e' }}>
          {title}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 12px', paddingLeft: '26px' }}>
          {description}
        </p>
      )}

      {/* Hash row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        paddingLeft: '26px', flexWrap: 'wrap',
      }}>
        {/* Hash pill */}
        <span style={{
          fontFamily: 'monospace', fontSize: '12px',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '6px', padding: '3px 8px',
          color: '#86efac',
        }}>
          {shortHash(txHash)}
        </span>

        {/* Copy */}
        <button
          onClick={copyHash}
          title="Copy full hash"
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: copied ? '#22c55e' : '#6b7280',
            fontSize: '12px', fontWeight: 500,
            fontFamily: 'var(--font-body)',
            transition: 'color 0.2s',
            padding: '2px 4px',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Explorer link */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: 600,
            color: '#a78bfa',
            textDecoration: 'none',
            padding: '3px 10px',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '6px',
            background: 'rgba(139,92,246,0.08)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; e.currentTarget.style.color = '#c4b5fd' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#a78bfa' }}
        >
          <ExternalLink size={11} /> View on Explorer
        </a>
      </div>
    </div>
  )
}
