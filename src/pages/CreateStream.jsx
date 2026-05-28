import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useStream } from '../hooks/useStream'
import { Zap, Info, ShieldCheck, ChevronRight, Wallet } from 'lucide-react'
import { useToast } from '../components/Toast.jsx'
import { GaslessBadge, SponsorshipBanner, FeeComparisonRow } from '../components/GaslessBadge.jsx'

export default function CreateStream() {
  const { isConnected, connect } = useWallet()
  const { create: createStream } = useStream()
  const navigate = useNavigate()
  const toast = useToast()

  // Guard — if not connected, redirect to dashboard connect screen
  useEffect(() => {
    if (!isConnected) {
      navigate('/dashboard', { replace: true })
    }
  }, [isConnected, navigate])


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
    <div className="bg-surface font-body-md text-on-surface min-h-screen py-12 px-6 md:px-container-margin max-w-[1000px] mx-auto flex flex-col gap-10">

      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <GaslessBadge />
        </div>
        <h1 className="font-display-lg text-[40px] tracking-tight text-primary mb-2">Create New Stream</h1>
        <p className="font-body-md text-on-surface-variant text-sm max-w-[480px] mx-auto">Deploy a real-time payment streaming contract on the Stellar network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-outline-variant/65 rounded-2xl p-8 flex flex-col gap-6 shadow-xs">

          {/* Sponsorship Banner */}
          <SponsorshipBanner />

          <div className="flex flex-col gap-2 text-left">
            <label className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Recipient Address</label>
            <input
              type="text"
              placeholder="G..."
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 text-primary font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-on-surface-variant/40"
            />
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Stream Amount (XLM)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 pr-16 text-primary font-mono text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-on-surface-variant/40"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-mono font-bold text-xs">XLM</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <label className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Stream Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {durations.map(d => {
                const isActive = duration === d.value
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className={`p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'bg-secondary text-on-secondary border-secondary ring-1 ring-secondary/30' 
                        : 'bg-surface-container-low border-outline-variant/60 text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-bold flex items-center justify-center gap-2 btn-hover-glow-neon transition-all active:scale-95 border-none cursor-pointer text-base mt-2"
          >
            {loading ? 'Deploying Contract...' : isConnected ? 'Deploy Stream' : 'Connect Wallet to Stream'}
          </button>
        </form>

        {/* Info panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="bg-white border border-outline-variant/65 rounded-2xl p-6 flex flex-col gap-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-primary">
              <ShieldCheck size={20} className="text-secondary fill-secondary/20" />
              <h3 className="font-headline-lg text-base font-bold">Stream Preview</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-xs text-on-surface-variant">Flow Rate</span>
                <span className="text-sm font-bold text-primary font-mono">{flowRate.toFixed(6)} XLM/s</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-xs text-on-surface-variant">Total Duration</span>
                <span className="text-sm font-bold text-primary">{durations.find(d => d.value === duration)?.label}</span>
              </div>
              <FeeComparisonRow />
            </div>
            <div className="mt-4 p-4 bg-surface-container-low rounded-xl flex gap-3">
              <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed font-normal">Streams are non-custodial. Funds are locked in a Stellar Soroban contract and flow second-by-second to the recipient.</p>
            </div>
          </div>

          <div className="px-3">
            <h4 className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Common Use Cases</h4>
            <div className="flex flex-col gap-3">
              {[
                { t: 'Payroll', d: 'Pay employees by the second' },
                { t: 'Subscriptions', d: 'Renew services with zero friction' },
                { t: 'Vesting', d: 'Unlock tokens gradually' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white border border-outline-variant/40 rounded-xl hover:border-secondary transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <div>
                      <div className="text-xs font-bold text-primary">{c.t}</div>
                      <div className="text-[10px] text-on-surface-variant">{c.d}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-on-surface-variant/40" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}