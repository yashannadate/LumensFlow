import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { ArrowRight, Zap, Shield, Droplets, BarChart3, Globe, Clock, ShieldCheck, Gauge, RefreshCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// ── Particle component ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${8 + i * 9}%`,
  size: `${4 + (i % 5)}px`,
  delay: `${(i * 0.7).toFixed(1)}s`,
  dur: `${6 + (i % 5)}s`,
  opacity: 0.4 + (i % 3) * 0.15,
}))

// ── Wave SVG paths ──────────────────────────────────────────────────────────
function WaveLayer({ color, opacity, duration, direction = 1, yOffset = 0 }) {
  return (
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 1440 120"
      style={{
        position: 'absolute', bottom: `${yOffset}px`, left: 0, width: '200%', height: '120px',
        animation: `waveScroll${direction > 0 ? 'R' : 'L'} ${duration}s linear infinite`,
        opacity,
      }}
    >
      <defs>
        <linearGradient id={`wg${duration}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#wg${duration})`}
        d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,20 1440,60 L1440,120 L0,120 Z"
      />
    </svg>
  )
}

export default function Landing() {
  const { isConnected, connect } = useWallet()
  const navigate = useNavigate()
  const [cyclingWord, setCyclingWord] = useState('Second')
  const [wordVisible, setWordVisible] = useState(true)

  const handleStart = async () => {
    if (!isConnected) {
      const success = await connect()
      if (!success) return
    }
    navigate('/dashboard')
  }

  useEffect(() => {
    const words = ['Second', 'Minute', 'Hour', 'Day']
    let index = 0
    const interval = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        index = (index + 1) % words.length
        setCyclingWord(words[index])
        setWordVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>

      <style>{`
        @keyframes waveScrollR { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes waveScrollL { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: var(--p-op); }
          100% { transform: translateY(-120vh) scale(0.6); opacity: 0; }
        }
        @keyframes wordSlideIn  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wordSlideOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-14px); } }
        @keyframes ripple { 0%,100%{transform:scale(1);opacity:0.6;} 50%{transform:scale(2);opacity:0;} }
        @keyframes badge-glow { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0);} 50%{box-shadow:0 0 16px 4px rgba(139,92,246,0.2);} }

        .word-in  { animation: wordSlideIn  0.30s ease both; }
        .word-out { animation: wordSlideOut 0.30s ease both; }

        .feature-card { transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease !important; }
        .feature-card:hover {
          border-color: rgba(139,92,246,0.40) !important;
          box-shadow: 0 0 28px rgba(139,92,246,0.18) !important;
          transform: translateY(-3px) !important;
        }
        .step-card { transition: border-color 0.2s, box-shadow 0.2s; }
        .step-card:hover { border-color: rgba(139,92,246,0.30) !important; }

        .cta-btn-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(139,92,246,0.40) !important; }
        .cta-btn-ghost:hover { background: rgba(139,92,246,0.08) !important; border-color: #8b5cf6 !important; }
      `}</style>

      {/* ── Particles ── */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          bottom: '-12px',
          left: p.left,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: `rgba(139, 92, 246, ${p.opacity})`,
          boxShadow: `0 0 ${parseInt(p.size) + 2}px rgba(139,92,246,0.4)`,
          animation: `floatUp ${p.dur} ${p.delay} linear infinite`,
          '--p-op': p.opacity,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* ── Hero Glow ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '80vh', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.14) 0%, transparent 65%)',
      }} />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '95vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        textAlign: 'center', padding: '100px 24px 80px',
      }}>


        {/* Heading */}
        <h1 style={{ marginBottom: '12px', maxWidth: '880px' }}>
          Stream Every
        </h1>
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '28px' }}>
          <span
            key={cyclingWord}
            className="word-in"
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #e0d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}
          >
            {cyclingWord}
          </span>
        </div>

        {/* Subtitle */}
        <p style={{ fontSize: '17px', color: '#9ca3af', maxWidth: '520px', lineHeight: 1.75, marginBottom: '48px', fontFamily: 'var(--font-body)' }}>
          Stream real-time XLM payments on the Stellar Network. Every second earns.
        </p>


        {/* CTAs */}
        <div className="flex-col-mobile mobile-gap-sm" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          <button
            onClick={handleStart}
            className="cta-btn-primary mobile-w-full"
            style={{
              background: '#8b5cf6', color: '#fff', border: 'none',
              borderRadius: '9999px', padding: '14px 32px',
              fontFamily: 'var(--font-label)', fontSize: '15px', fontWeight: 600,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Start Streaming <ArrowRight size={17} />
          </button>
          <button
            onClick={() => navigate('/how-it-works')}
            className="cta-btn-ghost mobile-w-full"
            style={{
              background: 'transparent', color: '#8b5cf6',
              border: '1px solid rgba(139,92,246,0.40)',
              borderRadius: '9999px', padding: '14px 32px',
              fontFamily: 'var(--font-label)', fontSize: '15px', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            How It Works
          </button>
        </div>

        {/* Animated wave band */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', overflow: 'hidden', pointerEvents: 'none' }}>
          <WaveLayer opacity={0.25} duration={8} direction={1} yOffset={0} color="#8b5cf6" />
          <WaveLayer opacity={0.15} duration={13} direction={-1} yOffset={20} color="#7c3aed" />
          <WaveLayer opacity={0.10} duration={20} direction={1} yOffset={40} color="#a78bfa" />
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════════════ */}
      <style>{`
        .stats-bar-scroll {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 0;
          padding: 0 16px;
        }
        .stats-bar-scroll::-webkit-scrollbar { display: none; }
        
        .stats-bar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 40px;
          flex-shrink: 0;
          justify-content: center;
        }
        .stats-bar-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); flex-shrink: 0; }
        
        @media (min-width: 1024px) {
          .stats-bar-scroll { justify-content: center; padding: 0; }
        }
      `}</style>
      <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', background: 'rgba(17,24,39,0.70)', backdropFilter: 'blur(20px)' }}>
        <div className="stats-bar-scroll">
          {[
            { icon: RefreshCcw, n: 'Real-Time', s: 'Every Second' },
            { icon: ShieldCheck, n: '100% On-Chain', s: 'Verified' },
            { icon: Zap, n: 'Gasless', s: 'Fee Sponsored' },
            { icon: Gauge, n: '5s Finality', s: 'Stellar Speed' },
          ].map((stat, i, arr) => {
            const Icon = stat.icon
            return (
              <React.Fragment key={i}>
                <div className="stats-bar-item">
                  <Icon size={18} color="#86EE1E" style={{ flexShrink: 0 }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>{stat.n}</span>
                    <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'var(--font-label)', fontWeight: 500 }}>{stat.s}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="stats-bar-divider" />}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 0 80px' }}>
        <div className="page-wrap" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b5cf6', fontFamily: 'var(--font-label)', marginBottom: '16px' }}>
              Getting Started
            </div>
            <h2 style={{ color: '#ffffffff' }}>How It Works</h2>
          </div>

          {/* Cards with dashed connector */}
          <style>{`
            .how-it-works-scroll {
              display: grid;
              grid-template-columns: repeat(3, minmax(280px, 1fr));
              gap: 24px;
              width: 100%;
              transition: all 0.3s;
            }
            @media (max-width: 960px) {
              .how-it-works-scroll {
                display: flex;
                overflow-x: auto;
                padding: 10px 20px 30px;
                scroll-snap-type: x mandatory;
                scrollbar-width: thin;
                scrollbar-color: var(--primary) transparent;
              }
              .how-it-works-scroll > div {
                flex: 0 0 calc(100% - 40px);
                scroll-snap-align: center;
              }
              .dashed-line { display: none !important; }
            }
          `}</style>
          
          <div className="how-it-works-scroll" style={{ position: 'relative', maxWidth: '1060px', margin: '0 auto' }}>
            {/* Dashed connector line */}
            <div className="hide-mobile dashed-line" style={{ position: 'absolute', top: '32px', left: 'calc(16.66% + 12px)', right: 'calc(16.66% + 12px)', height: '1px', borderTop: '2px dashed rgba(139,92,246,0.35)', zIndex: 0, pointerEvents: 'none' }} />

            {[
              { num: '01', Icon: Shield, title: 'Connect Wallet', desc: 'Link your Stellar wallet (Freighter / xBull) in one click.', iconColor: '#8b5cf6' },
              { num: '02', Icon: Zap, title: 'Create Stream', desc: 'Set recipient, amount per second, and duration. Done in seconds.', iconColor: '#86EE1E' },
              { num: '03', Icon: BarChart3, title: 'Earn Live', desc: 'Watch XLM flow in real-time. Withdraw any time.', iconColor: '#22c55e' },
            ].map((step, i) => {
              const Icon = step.Icon
              return (
                <div key={i} className="step-card" style={{
                  background: 'rgba(17,24,39,0.80)', border: '1px solid #1f2937',
                  borderRadius: '24px', padding: '32px 24px', textAlign: 'center',
                  backdropFilter: 'blur(16px)', position: 'relative', zIndex: 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: step.iconColor === '#22c55e' ? 'rgba(34,197,94,0.10)' : 'rgba(139,92,246,0.10)',
                      border: `1px solid ${step.iconColor === '#22c55e' ? 'rgba(34,197,94,0.25)' : 'rgba(139,92,246,0.25)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={24} color={step.iconColor} />
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', fontFamily: 'var(--font-label)', letterSpacing: '0.08em', marginBottom: '8px' }}>STEP {step.num}</div>
                  <h3 style={{ fontSize: '17px', fontFamily: 'var(--font-brand)', marginBottom: '10px', color: '#86EE1E' }}>{step.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURES GRID ═════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.05) 0%, transparent 65%)' }}>
        <div className="page-wrap" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b5cf6', fontFamily: 'var(--font-label)', marginBottom: '16px' }}>
              Built Different
            </div>
            <h2 style={{ color: '#ffffffff' }}>Everything You Need</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', maxWidth: '1060px', margin: '0 auto' }}>
            {[
              { Icon: Droplets, title: 'Real-Time Streaming', desc: 'Funds flow every second with zero manual inputs — time does the work.' },
              { Icon: ShieldCheck, title: 'Non-Custodial Escrow', desc: 'Your keys, your funds. Stellar Soroban smart contract holds everything.' },
              { Icon: Zap, title: 'Gasless Transactions', desc: 'Fee Sponsorship covers network costs — stream without worrying about gas fees.', isNew: true },
              { Icon: BarChart3, title: 'Live Dashboard', desc: 'Track all streams with real-time metrics and live XLM counters.' },
              { Icon: Globe, title: 'Fully On-Chain', desc: '100% transparent, every action verifiable on the Stellar ledger.' },
              { Icon: Clock, title: 'Flexible Duration', desc: 'Stream for minutes, days, or months. Cancel anytime with auto-refund.' },
            ].map(({ Icon, title, desc, isNew }, i) => (
              <div key={i} className="feature-card" style={{
                background: 'rgba(17,24,39,0.75)', border: '1px solid #1f2937',
                borderRadius: '24px', padding: '32px',
                backdropFilter: 'blur(16px)',
                position: 'relative',
              }}>
                {isNew && (
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(134,238,30,0.12)',
                    border: '1px solid rgba(134,238,30,0.30)',
                    color: '#86EE1E', fontSize: '9px', fontWeight: 800,
                    fontFamily: 'var(--font-label)', letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px',
                  }}>NEW</div>
                )}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                }}>
                  <Icon size={24} color="#8b5cf6" />
                </div>
                <h3 style={{ fontSize: '17px', fontFamily: 'var(--font-brand)', marginBottom: '10px', color: '#86EE1E' }}>{title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 0 130px', textAlign: 'center' }}>
        <div className="page-wrap" style={{ maxWidth: '680px', width: '100%' }}>
          <div style={{
            background: 'rgba(17,24,39,0.85)', border: '1px solid rgba(139,92,246,0.20)',
            borderRadius: '28px', padding: '64px 48px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 40px rgba(139,92,246,0.08)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b5cf6', fontFamily: 'var(--font-label)', marginBottom: '20px' }}>
              Get Started Now
            </div>
            <h2 style={{ marginBottom: '16px' }}>Ready to stream?</h2>
            <p style={{ color: '#9ca3af', marginBottom: '36px', fontSize: '16px', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
              Start your first payment stream in under 60 seconds.
            </p>
            <button
              onClick={handleStart}
              className="cta-btn-primary"
              style={{
                background: '#8b5cf6', color: '#fff', border: 'none',
                borderRadius: '9999px', padding: '14px 36px',
                fontFamily: 'var(--font-label)', fontSize: '15px', fontWeight: 600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Stream Now <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}