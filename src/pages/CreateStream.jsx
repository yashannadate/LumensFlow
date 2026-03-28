import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useStream } from '../hooks/useStream'
import { Zap, Info, ShieldCheck, ChevronRight } from 'lucide-react'
import { useToast } from '../components/Toast.jsx'
import { GaslessBadge, SponsorshipBanner, FeeComparisonRow } from '../components/GaslessBadge.jsx'

export default function CreateStream() {
  const { isConnected, connect, address: userAddress } = useWallet()
  const { create: createStream } = useStream()
  const navigate = useNavigate()
  const toast = useToast()

  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('3600') // seconds
  const [loading, setLoading] = useState(false)

  const durations = [
    { label: '1 Hour', value: '3600' },
    { label: '1 Day', value: '86400' },
    { label: '7 Days', value: '604800' },
    { label: '30 Days', value: '2592000' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConnected) { await connect(); return }
    if (!address || !amount) { toast.error('Please fill in all fields'); return }

    const isValidAddress = address.length === 56 && address.startsWith('G') && /^[A-Z2-7]+$/.test(address)
    if (!isValidAddress) {
      toast.error('Invalid Stellar receiver address (must start with G and be 56 chars)')
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be greater than 0 XLM')
      return
    }

    setLoading(true)
    try {
      const result = await createStream(address, parsedAmount, parseInt(duration))
      if (result) {
        toast.success('Stream Created Successfully!', 'Your payment stream has been deployed to Stellar.', result?.txHash)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Creation error:', error)
      toast.error('Failed to create stream')
    } finally {
      setLoading(false)
    }
  }

  const flowRate = (parseFloat(amount) || 0) / (parseInt(duration) || 1)

  return (
    <div style={{ padding: 'var(--dashboard-padding, 40px 32px 100px)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <GaslessBadge />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 42px)', letterSpacing: '-0.04em', marginBottom: '12px' }}>Create New Stream</h1>
        <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>Deploy a real-time payment streaming contract on the Stellar network.</p>
      </div>

      <div className="grid-2 dashboard-two-col" style={{ display: 'grid', gap: '32px', alignItems: 'start' }}>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Sponsorship Banner */}
          <SponsorshipBanner />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recipient Address</label>
            <input
              type="text"
              placeholder="G..."
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                background: '#131920', border: '1px solid #1f2937', borderRadius: '12px',
                padding: '16px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '14px',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#8b5cf6'}
              onBlur={e => e.target.style.borderColor = '#1f2937'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stream Amount (XLM)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: '#131920', border: '1px solid #1f2937', borderRadius: '12px',
                  padding: '16px 60px 16px 16px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '18px',
                  outline: 'none', fontWeight: 600
                }}
                onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                onBlur={e => e.target.style.borderColor = '#1f2937'}
              />
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8b5cf6', fontWeight: 700, fontSize: '12px', fontFamily: 'var(--font-mono)' }}>XLM</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stream Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {durations.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  style={{
                    padding: '12px', borderRadius: '10px',
                    background: duration === d.value ? 'rgba(139,92,246,0.12)' : '#131920',
                    border: `1px solid ${duration === d.value ? '#8b5cf6' : '#1f2937'}`,
                    color: duration === d.value ? '#fff' : '#6b7280',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mobile-w-full"
            style={{ width: '100%', padding: '18px', borderRadius: '9999px', fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-brand)', marginTop: '8px', justifyContent: 'center' }}
          >
            {loading ? 'Deploying Contract...' : isConnected ? 'Deploy Stream' : 'Connect Wallet to Stream'}
          </button>
        </form>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(139,92,246,0.06), transparent)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#fff' }}>
              <ShieldCheck size={20} color="#8b5cf6" />
              <h3 style={{ fontSize: '15px', fontFamily: 'var(--font-brand)' }}>Stream Preview</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Flow Rate</span>
                <span style={{ fontSize: '14px', color: '#86EE1E', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{flowRate.toFixed(6)} XLM/s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Duration</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{durations.find(d => d.value === duration)?.label}</span>
              </div>
              <FeeComparisonRow />
            </div>
            <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(139,92,246,0.06)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
              <Info size={16} color="#8b5cf6" style={{ marginTop: '2px' }} />
              <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.6 }}>Streams are non-custodial. Funds are locked in a Stellar Soroban contract and flow second-by-second to the recipient.</p>
            </div>
          </div>

          <div style={{ padding: '0 12px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '16px' }}>Common Use Cases</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { t: 'Payroll', d: 'Pay employees by the second' },
                { t: 'Subscriptions', d: 'Renew services with zero friction' },
                { t: 'Vesting', d: 'Unlock tokens gradually' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf633', border: '1px solid #8b5cf666' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{c.t}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{c.d}</div>
                  </div>
                  <ChevronRight size={14} color="#1f2937" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}