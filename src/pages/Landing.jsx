import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { ArrowRight, Zap, Shield, Droplets, BarChart3, Globe, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Landing() {
  const { isConnected, connect } = useWallet()
  const navigate = useNavigate()
  const [cyclingWord, setCyclingWord] = useState('Second')

  const handleStart = async () => {
    if (!isConnected) await connect()
    navigate('/dashboard')
  }

  // Cycling text animation
  useEffect(() => {
    const words = ['Second', 'Minute', 'Hour', 'Day']
    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % words.length
      setCyclingWord(words[index])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="center" style={{ minHeight: '90vh', paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>

        <h3 style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          fontWeight: 500,
          letterSpacing: '2px',
          lineHeight: 1.4,
          marginBottom: '32px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase'
        }}>
          Your Money, Your Schedule
        </h3>

        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(48px, 8vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-2.5px',
          lineHeight: 1.2,
          marginBottom: '48px',
          maxWidth: '920px',
          padding: '0 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <span>Stream Money</span>
          <span
            key={cyclingWord}
            style={{
              color: 'var(--accent-red)',
              display: 'inline-block',
              minWidth: '200px',
              animation: 'smoothFade 2.5s ease-in-out'
            }}
          >
            {cyclingWord}
          </span>
        </h1>

        <style>{`
          @keyframes smoothFade {
            0% { 
              opacity: 0;
              filter: blur(4px);
              transform: translateY(8px) scale(0.98);
            }
            15% {
              opacity: 1;
              filter: blur(0px);
              transform: translateY(0) scale(1);
            }
            85% {
              opacity: 1;
              filter: blur(0px);
              transform: translateY(0) scale(1);
            }
            100% { 
              opacity: 0;
              filter: blur(4px);
              transform: translateY(-8px) scale(0.98);
            }
          }
        `}</style>

        <p style={{
          fontSize: '17px',
          color: 'var(--text-muted)',
          maxWidth: '640px',
          lineHeight: 1.75,
          marginBottom: '56px',
          fontWeight: 400,
          padding: '0 20px'
        }}>
          Welcome to LumensFlow, the protocol for money streaming. Join thousands of users earning, investing, and trading by the second on Stellar.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          <button onClick={handleStart} className="btn-primary">
            Start Streaming <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/how-it-works')} className="btn-ghost">
            How It Works
          </button>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(20, 20, 20, 0.60)',
        backdropFilter: 'blur(24px)',
        padding: '32px 0',
        marginBottom: '40px'
      }}>
        <div className="page-wrap">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            textAlign: 'center'
          }}>
            {[
              { n: '<0.003 XLM', s: 'Per Transaction' },
              { n: '100%', s: 'On-Chain & Trustless' },
              { n: 'Real-Time', s: 'Second-by-Second' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--accent-red)',
                  marginBottom: '6px'
                }}>
                  {stat.n}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  letterSpacing: '0.3px'
                }}>
                  {stat.s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Get Started in 3 Steps ────────────────────────────────────── */}
      <section className="center" style={{ padding: '80px 0' }}>
        <div className="page-wrap" style={{ width: '100%' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '16px',
            fontSize: '42px'
          }}>
            Get Started in 3 Steps
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            marginBottom: '56px',
            textAlign: 'center',
            fontSize: '16px',
            maxWidth: '600px',
            margin: '0 auto 56px'
          }}>
            Stream money with just a wallet and testnet XLM.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {[
              {
                num: '01',
                title: 'Install Wallet',
                desc: 'Get Freighter, xBull, or Lobstr from the browser extension store.',
                icon: Shield
              },
              {
                num: '02',
                title: 'Get Testnet XLM',
                desc: 'Use Stellar Friendbot to receive free testnet XLM instantly.',
                icon: Zap
              },
              {
                num: '03',
                title: 'Create a Stream',
                desc: 'Enter receiver address, amount, and duration — done in seconds.',
                icon: Droplets
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="card" style={{ padding: '32px', textAlign: 'left' }}>
                  <div style={{
                    fontSize: '52px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--accent-red)',
                    opacity: 0.15,
                    lineHeight: 1,
                    marginBottom: '20px'
                  }}>
                    {step.num}
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <Icon size={24} color="var(--accent-red)" />
                  </div>
                  <h3 style={{
                    fontSize: '19px',
                    marginBottom: '12px',
                    fontWeight: 600
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    fontWeight: 400
                  }}>
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Why LumensFlow? ───────────────────────────────────────────── */}
      <section id="features" className="center" style={{
        padding: '80px 0',
        background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.04) 0%, transparent 70%)'
      }}>
        <div className="page-wrap" style={{ width: '100%' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '64px',
            fontSize: '42px'
          }}>
            Why LumensFlow?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                Icon: Droplets,
                title: 'Real-Time Streaming',
                desc: 'Funds flow every second with zero manual inputs — time does the work.'
              },
              {
                Icon: Shield,
                title: 'Non-Custodial',
                desc: 'Your keys, your funds. The smart contract holds, never us.'
              },
              {
                Icon: Zap,
                title: 'Soroban Powered',
                desc: 'Stellar Soroban smart contracts with sub-cent fees and instant finality.'
              },
              {
                Icon: BarChart3,
                title: 'Live Dashboard',
                desc: 'Track all streams with real-time metrics — no refresh needed.'
              },
              {
                Icon: Globe,
                title: 'Stellar Testnet',
                desc: 'Fully live on Stellar Testnet — production-ready architecture.'
              },
              {
                Icon: Clock,
                title: 'Flexible Duration',
                desc: 'Stream for minutes, days, or months. Cancel anytime with refund.'
              },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: '32px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Icon size={26} color="var(--accent-red)" strokeWidth={2} />
                </div>
                <h3 style={{
                  fontSize: '18px',
                  marginBottom: '10px',
                  fontWeight: 600
                }}>
                  {title}
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  fontWeight: 400
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="center" style={{ padding: '100px 0 120px' }}>
        <div className="page-wrap" style={{
          maxWidth: '720px',
          width: '100%'
        }}>
          <div style={{
            background: 'rgba(30, 30, 30, 0.60)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '28px',
            padding: '64px 48px',
            textAlign: 'center',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.30)'
          }}>
            <h2 style={{
              marginBottom: '16px',
              fontSize: '38px'
            }}>
              Ready to stream?
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              marginBottom: '36px',
              fontSize: '16px',
              lineHeight: 1.6
            }}>
              Start your first payment stream in under 60 seconds.
            </p>
            <button onClick={handleStart} className="btn-primary" style={{ fontSize: '16px' }}>
              Stream now<ArrowRight size={19} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}