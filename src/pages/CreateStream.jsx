import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStream } from '../hooks/useStream.jsx'
import { useWallet } from '../hooks/useWallet.jsx'
import { getErrorMessage } from '../utils/stellar.js'
import { User, Banknote, Clock, ArrowRight, Zap, Send } from 'lucide-react'

const isValidStellarAddress = (addr) =>
  /^G[A-Z0-9]{55}$/.test(addr?.trim() || '')

export default function CreateStream() {
  const navigate = useNavigate()
  const { address } = useWallet()
  const { create, loading: creating } = useStream()

  const [receiver, setReceiver] = useState('')
  const [amount,   setAmount]   = useState('')
  const [duration, setDuration] = useState('')
  const [error,    setError]    = useState(null)

  const presets = [
    { label: '1 min',  value: 60 },
    { label: '1 hr',   value: 3600 },
    { label: '1 day',  value: 86400 },
    { label: '7 days', value: 604800 },
    { label: '30 days',value: 2592000 },
  ]

  const isEmpty = !amount || !duration

  const metrics = useMemo(() => {
    const amt = parseFloat(amount) || 0
    const dur = parseInt(duration)  || 0
    if (amt <= 0 || dur <= 0) return null
    const xlmPerSec = amt / dur
    return {
      sec:     xlmPerSec.toFixed(6),
      hr:      (xlmPerSec * 3600).toFixed(3),
      day:     (xlmPerSec * 86400).toFixed(1),
      endDate: new Date(Date.now() + dur * 1000).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }),
    }
  }, [amount, duration])

  const isSubmittable =
    isValidStellarAddress(receiver) &&
    receiver.trim() !== address &&
    parseFloat(amount) > 0 &&
    parseInt(duration) >= 60

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (receiver.trim() === address) { setError('Cannot stream to your own address'); return }
    try {
      const success = await create(receiver.trim(), amount, parseInt(duration))
      if (success) navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="center" style={{ padding: '100px 24px 80px', minHeight: '100vh' }}>
      <div className="stack" style={{ width: '100%', maxWidth: '480px', gap: '24px' }}>

        {/* Header */}
        <div className="center" style={{ gap: '6px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>Send Stream</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Funds flow second by second</p>
        </div>

        <div className="card stack" style={{ gap: '20px', padding: '24px' }}>
          <form onSubmit={handleSubmit} className="stack" style={{ gap: '20px' }}>

            {error && (
              <div style={{ color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            {/* Receiver */}
            <div className="stack" style={{ gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Receiver Wallet Address
              </label>
              <input
                required
                className="input"
                placeholder="G... Stellar address"
                value={receiver}
                onChange={e => setReceiver(e.target.value)}
              />
              {receiver && !isValidStellarAddress(receiver) && (
                <span style={{ fontSize: '12px', color: 'var(--red)' }}>Must be a valid G... Stellar address</span>
              )}
            </div>

            {/* Amount */}
            <div className="stack" style={{ gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Banknote size={14} /> Amount (XLM)
              </label>
              <input
                required
                type="number"
                step="any"
                min="0"
                className="input"
                placeholder="e.g. 100"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="stack" style={{ gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Duration (seconds)
              </label>
              <input
                required
                type="number"
                min="60"
                className="input"
                placeholder="e.g. 3600"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {presets.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setDuration(p.value.toString())}
                    style={{
                      padding: '5px 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      background: duration === p.value.toString() ? 'rgba(139,92,246,0.12)' : 'transparent',
                      color:      duration === p.value.toString() ? 'var(--purple)' : 'var(--text-muted)',
                      borderColor: duration === p.value.toString() ? 'var(--purple)' : 'var(--border)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stream Preview */}
            <div style={{
              background: '#0d0d14',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={13} /> Stream Preview
              </div>
              <div className="stack" style={{ gap: '8px', fontSize: '13px' }}>
                {[
                  { label: 'Flow Rate', value: metrics ? `${metrics.sec} XLM/sec` : '—' },
                  { label: 'Total',     value: metrics ? `${parseFloat(amount).toFixed(2)} XLM locked` : '—' },
                  { label: 'Ends',      value: metrics ? metrics.endDate : '—' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ color: metrics ? 'white' : 'var(--text-muted)', fontFamily: 'monospace' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={creating || !isSubmittable}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
            >
              {creating ? (
                <><Zap size={16} className="animate-pulse" /> Sending Stream...</>
              ) : (
                <>Send Stream <Send size={16} /></>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
