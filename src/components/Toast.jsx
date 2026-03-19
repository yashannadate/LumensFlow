import {
  createContext, useContext, useState, useCallback, useRef,
} from 'react'
import { CheckCircle, XCircle, X, ExternalLink } from 'lucide-react'

/* ─── Context ─────────────────────────────────────────────────────────── */
const ToastContext = createContext(null)

const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx'

let _id = 0
const nextId = () => ++_id

/* ─── Single Toast ────────────────────────────────────────────────────── */
function Toast({ toast, onRemove }) {
  const isSuccess = toast.type === 'success'
  const color = isSuccess ? '#22c55e' : '#ef4444'
  const bg = isSuccess ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'
  const border = isSuccess ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'
  const shortHash = toast.txHash
    ? `${toast.txHash.slice(0, 6)}…${toast.txHash.slice(-4)}`
    : null

  return (
    <div style={{
      background: '#111827',
      border: `1px solid ${border}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: '12px',
      padding: '14px 16px',
      minWidth: '320px',
      maxWidth: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      animation: 'toast-in 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'relative',
    }}>
      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6b7280', padding: '2px', display: 'flex',
        }}
      >
        <X size={13} />
      </button>

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '20px' }}>
        {isSuccess
          ? <CheckCircle size={16} color={color} />
          : <XCircle size={16} color={color} />
        }
        <span style={{ fontWeight: 700, fontSize: '13px', color }}>
          {toast.title}
        </span>
      </div>

      {/* Description */}
      {toast.description && (
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, paddingLeft: '24px' }}>
          {toast.description}
        </p>
      )}

      {/* TxHash + Explorer */}
      {shortHash && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: '11px',
            background: bg, border: `1px solid ${border}`,
            borderRadius: '5px', padding: '2px 7px', color: '#86efac',
          }}>
            {shortHash}
          </span>
          <a
            href={`${EXPLORER_BASE}/${toast.txHash}`}
            target="_blank" rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              fontSize: '11px', fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#fca5a5',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
          >
            <ExternalLink size={10} /> Explorer
          </a>
        </div>
      )}
    </div>
  )
}

/* ─── Container ───────────────────────────────────────────────────────── */
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null
  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-end',
    }}>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

/* ─── Provider ────────────────────────────────────────────────────────── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id])
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((toast, duration = 6000) => {
    const id = nextId()
    setToasts(prev => [...prev, { ...toast, id }])
    timers.current[id] = setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  const success = useCallback((title, description, txHash) =>
    add({ type: 'success', title, description, txHash }),
    [add])

  const error = useCallback((title, description) =>
    add({ type: 'error', title, description }, 8000),
    [add])

  return (
    <ToastContext.Provider value={{ success, error, remove }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

/* ─── Hook ─────────────────────────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
