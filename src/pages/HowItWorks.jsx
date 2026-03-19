import { useNavigate } from 'react-router-dom'
import { Wallet, Send, Droplets, TrendingUp, XCircle, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: <Wallet size={28} color="var(--accent-red)" />,
    title: 'Connect Wallet',
    desc: 'Connect Freighter, xBull, or Lobstr — your wallet is your identity on Stellar Network.',
    note: null,
  },
  {
    icon: <Send size={28} color="var(--accent-red)" />,
    title: 'Create a Stream',
    desc: 'Enter receiver address, amount in XLM, and duration. Funds lock into the smart contract.',
    note: 'flow_rate = deposit ÷ duration (per second)',
  },
  {
    icon: <Droplets size={28} color="var(--accent-red)" />,
    title: 'Funds Stream Live',
    desc: 'Balance increases every second — no transaction needed. Time does the work.',
    note: null,
    liveCounter: true,
  },
  {
    icon: <TrendingUp size={28} color="var(--accent-red)" />,
    title: 'Receiver Withdraws',
    desc: 'Receiver can click Withdraw at any time, getting exactly what has streamed so far.',
    note: null,
  },
  {
    icon: <XCircle size={28} color="var(--accent-red)" />,
    title: 'Cancel Anytime',
    desc: 'Sender can cancel early. Receiver gets earned portion, sender gets remaining XLM back.',
    note: null,
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 80px', background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.08) 0%, transparent 60%)' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--accent-red)',
          color: 'white',
          borderRadius: '50px',
          padding: '6px 20px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '2px',
          marginBottom: '32px',
        }}>
          HOW IT WORKS
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
          How LumensFlow Works
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 400, maxWidth: '500px', margin: '0 auto' }}>
          Payment streaming, explained simply.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section 1 — The Concept */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.03))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '24px',
            padding: '40px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>What is Payment Streaming?</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px', fontWeight: 400 }}>
              Instead of paying someone once a month, funds flow continuously every second.
              Like a water tap — you control the flow rate and can shut it off anytime.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, width: '110px', flexShrink: 0 }}>Traditional</div>
                <div style={{ flex: 1, background: '#1f2937', borderRadius: '4px', height: '16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', background: '#6b7280', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>paid once</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--accent-red)', fontWeight: 500, width: '110px', flexShrink: 0 }}>Streaming</div>
                <div style={{ flex: 1, background: '#1f2937', borderRadius: '4px', height: '16px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #dc2626, #ef4444, #fca5a5)', borderRadius: '4px', animation: 'stream 3s linear infinite' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--accent-red)', whiteSpace: 'nowrap' }}>every second</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Step by Step Timeline */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '48px', textAlign: 'center' }}>Step by Step</h2>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '28px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--accent-red), transparent)',
              opacity: 0.3,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                  {/* Circle */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                  }}>
                    {step.icon}
                  </div>
                  {/* Content */}
                  <div style={{
                    flex: 1,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 10px', borderRadius: '50px' }}>Step {i + 1}</span>
                      <h3 style={{ margin: 0, fontWeight: 600, fontSize: '18px' }}>{step.title}</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7, fontWeight: 400, fontSize: '14px' }}>{step.desc}</p>
                    {step.note && (
                      <div style={{ marginTop: '12px', padding: '8px 14px', background: '#0d0d14', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', color: 'white' }}>
                        {step.note}
                      </div>
                    )}
                    {step.liveCounter && (
                      <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <span style={{ color: 'var(--accent-red)', fontFamily: 'monospace', fontWeight: 600 }}>+0.0000386 XLM</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/sec ↑</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — The Math */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>The Math</h2>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '40px',
          }}>
            <h3 style={{ fontWeight: 600, marginBottom: '24px', fontSize: '18px' }}>Example: 100 XLM over 30 days</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Flow Rate', value: '100 ÷ 2,592,000 sec', sub: '= 0.0000386 XLM/sec' },
                  { label: 'Per Hour', value: '0.138 XLM/hour', sub: null },
                  { label: 'Per Day', value: '3.33 XLM/day', sub: null },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#0d0d14', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px', letterSpacing: '1px' }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontFamily: 'monospace', color: 'var(--accent-red)', fontSize: '16px' }}>{item.value}</div>
                    {item.sub && <div style={{ fontFamily: 'monospace', color: 'white', fontSize: '13px', marginTop: '2px' }}>{item.sub}</div>}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'After 15 days', value: '50 XLM streamed', color: 'var(--accent-red)' },
                  { label: 'Receiver can get', value: '50 XLM', color: 'var(--green)' },
                  { label: 'Sender gets back', value: '50 XLM', color: '#9ca3af' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#0d0d14', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px', letterSpacing: '1px' }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontFamily: 'monospace', color: item.color, fontSize: '18px', fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>Ready to stream?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 400 }}>Start your first payment stream in under a minute.</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--accent-red)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-red)'; e.currentTarget.style.transform = 'none' }}
          >
            Start Streaming <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes stream {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  )
}
