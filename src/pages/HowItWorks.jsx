import { useNavigate } from 'react-router-dom'
import { Wallet, Send, Droplets, ArrowRight, Zap, Shield, TrendingUp, XCircle, ChevronRight, HelpCircle } from 'lucide-react'

export default function HowItWorks() {
  const navigate = useNavigate()

  const STEPS = [
    {
      icon: <Wallet size={28} color="#8b5cf6" />,
      title: 'Connect Stellar Wallet',
      desc: 'Link your Freighter or xBull wallet to the Stellar Testnet. This is your identity on LumensFlow.',
      color: '#8b5cf6'
    },
    {
      icon: <Send size={28} color="#8b5cf6" />,
      title: 'Set Stream Parameters',
      desc: 'Enter the recipient address, total XLM amount, and the time duration (hours, days, or months).',
      color: '#8b5cf6'
    },
    {
      icon: <Droplets size={28} color="#8b5cf6" />,
      title: 'Deploy Escrow Contract',
      desc: 'Confirm the transaction. A non-custodial Soroban smart contract is deployed to manage your funds.',
      color: '#8b5cf6'
    },
    {
      icon: <TrendingUp size={28} color="#22c55e" />,
      title: 'Real-Time Flow',
      desc: 'XLM begins flowing to the recipient every second. Both parties can track progress on the live dashboard.',
      color: '#22c55e'
    },
    {
      icon: <XCircle size={28} color="#ef4444" />,
      title: 'Cancel or Withdraw',
      desc: 'Recipients can withdraw accrued funds at any time. Senders can cancel to refund remaining balance.',
      color: '#ef4444'
    }
  ]

  return (
    <div style={{ padding: '80px 24px 120px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '9999px', padding: '6px 16px', marginBottom: '24px'
        }}>
          <HelpCircle size={14} color="#8b5cf6" />
          <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#fff' }}>Protocol Guide</span>
        </div>
        <h1 style={{ fontSize: '52px', letterSpacing: '-0.04em', marginBottom: '16px' }}>How <span style={{ color: '#86EE1E' }}>LumensFlow</span> Works</h1>
        <p style={{ color: '#9ca3af', fontSize: '17px', maxWidth: '540px', margin: '0 auto' }}>
          Lumens<span style={{ color: '#86EE1E' }}>Flow</span> leverages Stellar Soroban smart contracts to enable continuous, second-by-second payments.
        </p>
      </div>

      {/* Steps Logic */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {STEPS.map((step, i) => (
          <div key={i} className="card" style={{
            padding: '40px', display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '40px',
            alignItems: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <div aria-hidden style={{
              position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
              background: `linear-gradient(to bottom, ${step.color}, transparent)`
            }} />

            <div style={{
              width: '100px', height: '100px', borderRadius: '24px',
              background: 'rgba(17,24,39,0.80)', border: '1px solid #1f2937',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-brand)', color: step.color,
              flexShrink: 0, backdropFilter: 'blur(8px)'
            }}>
              {i + 1}
            </div>

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(139,92,246,0.10)', borderRadius: '9999px',
                padding: '4px 14px', marginBottom: '16px',
                fontSize: '10px', fontWeight: 700, color: step.color,
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em'
              }}>
                Phase {i + 1}
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', fontFamily: 'var(--font-brand)' }}>{step.title}</h2>
              <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.7, maxWidth: '640px' }}>{step.desc}</p>

              <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Action Required</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Visual Element */}
      <div className="card" style={{ marginTop: '64px', padding: '48px', textAlign: 'center', background: 'radial-gradient(circle at top right, rgba(139,92,246,0.12), transparent)' }}>
        <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-brand)' }}>The Streaming Equation</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ padding: '20px 32px', background: '#131920', border: '1px solid #1f2937', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Total Deposit</div>
            <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', color: '#fff' }}>1,000 XLM</div>
          </div>
          <ChevronRight size={24} color="#1f2937" />
          <div style={{ padding: '20px 32px', background: '#131920', border: '1px solid #1f2937', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Duration (Days)</div>
            <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', color: '#fff' }}>30 Days</div>
          </div>
          <div style={{ fontSize: '24px', color: '#1f2937' }}>=</div>
          <div style={{ padding: '20px 32px', background: 'rgba(139,92,246,0.12)', border: '1px solid #8b5cf6', borderRadius: '16px', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px' }}>Flow Rate</div>
            <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', color: '#86EE1E', fontWeight: 700 }}>0.000386 <span style={{ fontSize: '12px' }}>XLM/s</span></div>
          </div>
        </div>
        <p style={{ marginTop: '32px', color: '#6b7280', fontSize: '13px', fontStyle: 'italic' }}>* Calculated per second: Total XLM / (Days * 86,400 seconds)</p>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '16px 48px', borderRadius: '9999px', fontSize: '16px' }}>
          Get Started Now <ArrowRight size={18} />
        </button>
      </div>

    </div>
  )
}
