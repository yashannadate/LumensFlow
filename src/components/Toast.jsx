import {
  createContext, useContext, useState, useCallback, useRef,
} from 'react'
import { CheckCircle, XCircle, X, ExternalLink, Zap, Info } from 'lucide-react'

/* ─── Context ─────────────────────────────────────────────────────────── */
const ToastContext = createContext(null)

const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx'

let _id = 0
const nextId = () => ++_id

/* ─── Single Toast ────────────────────────────────────────────────────── */
function Toast({ toast, onRemove }) {
  const isSuccess = toast.type === 'success'
  const color = isSuccess ? '#055300' : '#ba1a1a'
  const border = isSuccess ? 'rgba(29, 255, 0, 0.30)' : 'rgba(186, 26, 26, 0.20)'
  const bg = '#ffffff'
  
  const shortHash = toast.txHash
    ? `${toast.txHash.slice(0, 6)}…${toast.txHash.slice(-4)}`
    : null

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '16px',
      padding: '16px 20px',
      minWidth: '320px',
      maxWidth: '420px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.10), 0 0 20px ${isSuccess ? 'rgba(29, 255, 0, 0.06)' : 'rgba(186,26,26,0.04)'}`,
      animation: 'toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
    }}>
      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#7e7576', padding: '4px', display: 'flex',
          transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#1a1c1e'}
        onMouseLeave={e => e.currentTarget.style.color = '#7e7576'}
      >
        <X size={14} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '24px' }}>
        <div style={{ 
          width: '28px', height: '28px', borderRadius: '8px', 
          background: isSuccess ? 'rgba(29, 255, 0, 0.12)' : 'rgba(186, 26, 26, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isSuccess ? <CheckCircle size={16} color={color} /> : <XCircle size={16} color={color} />}
        </div>
        <span style={{ 
          fontWeight: 700, fontSize: '14px', color: '#1a1c1e', 
          fontFamily: 'Hanken Grotesk, sans-serif', letterSpacing: '-0.01em' 
        }}>
          {toast.title}
        </span>
      </div>

      {/* Description */}
      {toast.description && (
        <p style={{ 
          fontSize: '13px', color: '#4c4546', margin: 0, 
          paddingLeft: '38px', lineHeight: 1.5, fontFamily: 'Hanken Grotesk, sans-serif' 
        }}>
          {toast.description}
        </p>
      )}

      {/* Action / Explorer */}
      {shortHash && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '38px', marginTop: '4px' }}>
           <div style={{ 
             fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#7e7576',
             background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '6px'
           }}>
             {shortHash}
           </div>
           <a
             href={`${EXPLORER_BASE}/${toast.txHash}`}
             target="_blank" rel="noreferrer"
             style={{
               display: 'inline-flex', alignItems: 'center', gap: '6px',
               fontSize: '11px', fontWeight: 600, color: '#000000',
               textDecoration: 'none', fontFamily: 'Hanken Grotesk, sans-serif',
               textTransform: 'uppercase', letterSpacing: '0.05em'
             }}
           >
             Explorer <ExternalLink size={10} />
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
      bottom: '32px',
      right: '32px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'flex-end',
    }}>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(32px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
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
    add({ type: 'error', title, description }, 10000),
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
