import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SIM_PRESETS = {
  payroll: {
    key: 'payroll',
    label: 'Employee Payroll',
    icon: 'payments',
    rate: 0.0009645,
    schedule: '2,500 XLM / Month',
    desc: 'Pay your team precisely for every second of work.',
    calc: '~2,500 XLM released periodically.'
  },
  sub: {
    key: 'sub',
    label: 'Subscription',
    icon: 'autorenew',
    rate: 0.0000192,
    schedule: '50 XLM / Month',
    desc: 'Continuous billing for exactly the seconds a service is used.',
    calc: '~50 XLM / month prorated to the second.'
  },
  vesting: {
    key: 'vesting',
    label: 'Token Vesting',
    icon: 'lock_clock',
    rate: 0.0003170,
    schedule: '10,000 XLM / 1 Year',
    desc: 'Gradual release schedules for team allocation over 12 months.',
    calc: '~10,000 XLM released linearly over 1 year.'
  }
}

const PHASES = [
  {
    num: '01',
    icon: 'account_balance_wallet',
    title: 'Connect Wallet',
    desc: 'Securely link your Stellar wallet (Freighter/xBull). Your account stays in your control at all times.',
    accent: false
  },
  {
    num: '02',
    icon: 'settings_input_component',
    title: 'Set Parameters',
    desc: 'Define the recipient, total amount, and duration. LumensFlow calculates the per-second rate automatically.',
    accent: false
  },
  {
    num: '03',
    icon: 'rocket_launch',
    title: 'Deploy Contract',
    desc: 'Funds are moved into a non-custodial Soroban escrow contract that releases value linearly.',
    accent: false
  },
  {
    num: '04',
    icon: 'speed',
    title: 'Real-Time Flow',
    desc: 'Once started, XLM flows to the recipient at every ledger entry. No manual interaction needed.',
    accent: true
  }
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('payroll')
  const [accrued, setAccrued] = useState(0)
  const [simulating, setSimulating] = useState(true)

  const preset = SIM_PRESETS[activeKey]

  // Reset counter when preset changes
  useEffect(() => {
    setAccrued(0)
  }, [activeKey])

  // Smooth counter
  useEffect(() => {
    if (!simulating) return
    const interval = setInterval(() => {
      setAccrued(prev => prev + preset.rate / 20)
    }, 50)
    return () => clearInterval(interval)
  }, [simulating, activeKey, preset.rate])

  return (
    <div style={{ background: '#f9f9fc', fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh' }}>
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px 96px' }}>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section style={{
          background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '24px', padding: '56px 48px', marginBottom: '48px',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Neon glow accent */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,255,0,0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-block', background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.10)', borderRadius: '9999px',
              padding: '6px 16px', fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              color: 'rgba(26,28,30,0.55)', marginBottom: '24px'
            }}>Interactive Guide</span>
            <h1 style={{
              fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.08,
              color: '#000000', marginBottom: '16px'
            }}>
              Mastering Real-Time Flow
            </h1>
            <p style={{
              fontSize: '17px', color: 'rgba(26,28,30,0.55)', lineHeight: 1.65,
              maxWidth: '640px', margin: 0
            }}>
              LumensFlow transforms standard payments into a continuous stream of value. Experience the mechanics below.
            </p>
          </div>
        </section>

        {/* ── Live Simulator ─────────────────────────────────────── */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#000000', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Protocol Live Simulator
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,28,30,0.55)', margin: 0 }}>
              Select a use-case to see the exact second-by-second flow rate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {/* Preset selector */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.values(SIM_PRESETS).map(p => (
                <button
                  key={p.key}
                  onClick={() => setActiveKey(p.key)}
                  style={{
                    padding: '10px 22px', borderRadius: '9999px', cursor: 'pointer',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '13px', fontWeight: 700,
                    border: activeKey === p.key ? '2px solid #000000' : '1px solid rgba(0,0,0,0.12)',
                    background: activeKey === p.key ? '#000000' : '#ffffff',
                    color: activeKey === p.key ? '#ffffff' : 'rgba(26,28,30,0.65)',
                    transition: 'all 0.20s cubic-bezier(0.4,0,0.2,1)',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Simulator card */}
            <div style={{
              background: '#000000', borderRadius: '24px', padding: '40px 44px',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Subtle glow */}
              <div style={{
                position: 'absolute', top: '-40px', right: '-40px', width: '300px', height: '300px',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,255,0,0.10) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Flow diagram */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', marginBottom: '40px' }}>
                  {/* Sender */}
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      border: '2px solid rgba(29,255,0,0.40)',
                      background: 'rgba(29,255,0,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#1DFF00', fontSize: '28px' }}>account_balance</span>
                    </div>
                    <p style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 3px' }}>Sender</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Treasury.xlm</p>
                  </div>

                  {/* Stream line */}
                  <div style={{ flex: 1, position: 'relative', paddingTop: '28px' }}>
                    {/* Flow rate label */}
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                      <p style={{ fontSize: '9px', fontWeight: 700, color: '#1DFF00', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 3px' }}>Flow Rate</p>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                        {preset.rate.toFixed(7)} XLM/s
                      </p>
                    </div>
                    {/* Animated line */}
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '9999px',
                        background: 'linear-gradient(90deg, rgba(29,255,0,0.3), #1DFF00)',
                        width: simulating ? '100%' : '0%',
                        transition: simulating ? 'width 1.5s ease-in-out' : 'width 0.3s ease',
                        animation: simulating ? 'flow-gradient 1.5s linear infinite' : 'none',
                        backgroundSize: '200% 100%'
                      }} />
                    </div>
                    {/* Flowing dots */}
                    {simulating && (
                      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '6px' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: '5px', height: '5px', borderRadius: '50%', background: '#1DFF00',
                            opacity: 0.7, animation: `ping 1.2s ease-in-out ${i * 0.3}s infinite`
                          }} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recipient */}
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px'
                    }}>
                      <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.60)', fontSize: '28px' }}>person</span>
                    </div>
                    <p style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 3px' }}>Recipient</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Employee.xlm</p>
                  </div>
                </div>

                {/* Accrued counter */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: '32px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#1DFF00', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 8px' }}>
                    Accrued Flow Value
                  </p>
                  <p style={{
                    fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#ffffff',
                    letterSpacing: '-0.04em', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1
                  }}>
                    {accrued.toFixed(7)} <span style={{ color: '#1DFF00', fontSize: '60%' }}>XLM</span>
                  </p>
                </div>

                {/* Preset info & controls */}
                <div style={{
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                  gap: '20px', marginTop: '28px', flexWrap: 'wrap'
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>{preset.label}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 10px' }}>{preset.desc}</p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: '8px', padding: '6px 12px'
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#1DFF00', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Estimated Flow Rate</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{preset.rate.toFixed(7)} XLM/s</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <button
                      onClick={() => setSimulating(s => !s)}
                      style={{
                        padding: '10px 22px', borderRadius: '10px', cursor: 'pointer', border: 'none',
                        fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '13px', fontWeight: 700,
                        background: simulating ? 'rgba(186,26,26,0.12)' : '#1DFF00',
                        color: simulating ? '#ff6b6b' : '#000000',
                        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.18s ease'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {simulating ? 'pause' : 'play_arrow'}
                      </span>
                      {simulating ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => setAccrued(0)}
                      style={{
                        padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                        color: 'rgba(255,255,255,0.55)', transition: 'all 0.18s ease',
                        fontFamily: 'Hanken Grotesk, sans-serif', display: 'flex', alignItems: 'center'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', margin: '16px 0 0', fontStyle: 'italic' }}>
                  Calculation: {preset.calc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Protocol Implementation Path ───────────────────────── */}
        <section style={{
          background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '24px', padding: '48px', marginBottom: '48px'
        }}>
          <h2 style={{
            fontSize: '26px', fontWeight: 800, color: '#000000',
            letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '40px'
          }}>
            Protocol Implementation Path
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {PHASES.map((phase) => (
              <div key={phase.num} style={{
                background: phase.accent ? '#000000' : '#f9f9fc',
                border: phase.accent ? '2px solid #1DFF00' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px', padding: '28px 24px', position: 'relative',
                transition: 'transform 0.20s ease, box-shadow 0.20s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = phase.accent ? '0 8px 32px rgba(29,255,0,0.15)' : '0 8px 24px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Phase badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: phase.accent ? '#1DFF00' : '#000000',
                  color: phase.accent ? '#000000' : '#ffffff',
                  borderRadius: '8px', padding: '4px 10px',
                  fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: '20px'
                }}>
                  PHASE {phase.num}
                </div>

                <span className="material-symbols-outlined" style={{
                  fontSize: '28px', color: phase.accent ? '#1DFF00' : '#000000',
                  display: 'block', marginBottom: '14px'
                }}>{phase.icon}</span>

                <h3 style={{
                  fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em',
                  color: phase.accent ? '#ffffff' : '#000000', marginBottom: '8px'
                }}>{phase.title}</h3>

                <p style={{
                  fontSize: '13px', lineHeight: 1.6,
                  color: phase.accent ? 'rgba(255,255,255,0.55)' : 'rgba(26,28,30,0.55)',
                  margin: 0
                }}>{phase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Built for the New Economy ───────────────────────────── */}
        <section style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px',
          marginBottom: '48px', alignItems: 'start'
        }}>
          <div>
            <h2 style={{
              fontSize: '30px', fontWeight: 800, color: '#000000',
              letterSpacing: '-0.025em', marginBottom: '20px'
            }}>Built for the New Economy</h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,28,30,0.55)', lineHeight: 1.7, marginBottom: '28px' }}>
              Traditional banking waits for settlement. LumensFlow enables capital efficiency by allowing value to be used the moment it is earned.
            </p>
            {[
              'Non-custodial Soroban escrows',
              'Linear second-by-second release',
              'Zero network fees (sponsored)',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '6px', background: '#1DFF00',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#000000', fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1c1e' }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '20px', padding: '36px 32px'
          }}>
            <h3 style={{
              fontSize: '20px', fontWeight: 800, color: '#000000',
              letterSpacing: '-0.02em', marginBottom: '16px'
            }}>The Core Advantage</h3>
            <p style={{ fontSize: '14px', color: 'rgba(26,28,30,0.55)', lineHeight: 1.7, margin: 0 }}>
              By distributing payments over time, organizations reduce liquidation risk while employees gain immediate liquidity. It's a win-win for the Stellar ecosystem.
            </p>

            {/* Visual stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '28px' }}>
              {[
                { label: 'Settlement Time', value: '~5s' },
                { label: 'Network Fees', value: '$0.00' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Custody', value: 'None' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#f9f9fc', border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '12px', padding: '16px 18px'
                }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,28,30,0.40)', margin: '0 0 4px' }}>{s.label}</p>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: '#000000', margin: 0, letterSpacing: '-0.02em' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Experience the Flow CTA ─────────────────────────────── */}
        <section style={{
          background: '#000000', borderRadius: '24px',
          padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
            width: '500px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(29,255,0,0.10) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#ffffff',
              letterSpacing: '-0.035em', marginBottom: '16px', lineHeight: 1.05
            }}>Experience the Flow</h2>
            <p style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.65,
              maxWidth: '480px', margin: '0 auto 36px'
            }}>
              Join the protocol that's redefining how capital moves across the globe. Simple, secure, and second-by-second.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: '#1DFF00', color: '#000000', border: 'none',
                  borderRadius: '9999px', padding: '14px 32px', cursor: 'pointer',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '14px', fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'all 0.20s ease', boxShadow: '0 4px 20px rgba(29,255,0,0.25)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(29,255,0,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(29,255,0,0.25)' }}
              >
                Launch App
              </button>
              <button
                onClick={() => navigate('/docs')}
                style={{
                  background: 'transparent', color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '9999px', padding: '14px 32px', cursor: 'pointer',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '14px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.20s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)' }}
              >
                Documentation
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
