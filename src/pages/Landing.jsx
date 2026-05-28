import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import React, { useEffect, useState, useRef } from 'react'

export default function Landing() {
  const { isConnected, connect } = useWallet()
  const navigate = useNavigate()
  
  // Cycling words for the hero title
  const WORDS = ['Seconds', 'Minute', 'Hour']
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      // Slide/fade out upward
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(prev => (prev + 1) % WORDS.length)
        // Slide/fade in from below
        setWordVisible(true)
      }, 500)
    }, 3200)
    return () => clearInterval(cycle)
  }, [])

  const handleStart = async () => {
    if (!isConnected) {
      const success = await connect()
      if (!success) return
    }
    navigate('/dashboard')
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-10')
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('.animate-section')
    sections.forEach(section => {
      observer.observe(section)
    })

    return () => {
      sections.forEach(section => {
        observer.unobserve(section)
      })
    }
  }, [])

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <main className="pt-12">
        
        {/* Hero Section */}
        <section className="animate-section transition-all duration-700 opacity-0 translate-y-10 max-w-[1280px] mx-auto px-6 md:px-container-margin py-section-gap flex flex-col items-center text-center">
          <span style={{
            background: '#1DFF00', color: '#000000',
            padding: '6px 18px', borderRadius: '9999px',
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: '28px', display: 'inline-block',
            userSelect: 'none'
          }}>
            EXPERIENCE THE FUTURE OF MONEY
          </span>
          <h1 style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: 'clamp(44px, 7.5vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#000000',
            marginBottom: '32px',
            letterSpacing: '-0.035em',
            maxWidth: '860px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px',
          }}>
            <span>Stream Every</span>
            <span
              key={WORDS[wordIndex]}
              style={{
                display: 'block',
                color: '#1DFF00',
                transition: 'opacity 0.50s cubic-bezier(0.16, 1, 0.3, 1), transform 0.50s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? 'translateY(0) scale(1)' : 'translateY(-18px) scale(0.96)',
                willChange: 'opacity, transform',
              }}
            >
              {WORDS[wordIndex]}
            </span>
          </h1>
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: '17px', fontWeight: 400, lineHeight: 1.65,
            color: 'rgba(26,28,30,0.60)', maxWidth: '560px', marginBottom: '44px',
            textAlign: 'center'
          }}>
            Watch your money grow in real time on the Stellar network. Send and receive continuous payments instantly - no more waiting for payday.
          </p>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleStart}
              style={{
                background: '#000000', color: '#ffffff', border: 'none',
                borderRadius: '9999px', padding: '14px 32px',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.18)', transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                letterSpacing: '-0.01em'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.22)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.18)' }}
            >
              Start Streaming
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
            <a
              href="#how-it-works"
              style={{
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '15px', fontWeight: 600,
                color: 'rgba(26,28,30,0.60)', textDecoration: 'none', letterSpacing: '-0.01em',
                transition: 'color 0.18s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#000000'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(26,28,30,0.60)'}
            >
              How It Works →
            </a>
          </div>
        </section>

        {/* Stats Section */}
        <section className="animate-section transition-all duration-700 opacity-0 translate-y-10 bg-surface-container-low py-20 border-y border-outline-variant/20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-container-margin grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">TOTAL STREAMED</span>
              <span className="font-display-lg text-[40px] md:text-headline-lg text-primary flex items-baseline gap-1">
                <span className="text-secondary">1,000+</span> XLM
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">ACTIVE USERS</span>
              <span className="font-display-lg text-[40px] md:text-headline-lg text-primary font-bold">
                30<span className="text-secondary">+</span>
              </span>
            </div>
          </div>
        </section>

        {/* Features Grid (Key Highlights) */}
        <section className="animate-section transition-all duration-700 opacity-0 translate-y-10 max-w-[1280px] mx-auto px-6 md:px-container-margin py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            {/* Bento 1: Real-Time / Every Second */}
            <div className="md:col-span-8 bg-surface-container-lowest border-t-2 border-secondary border-l border-r border-b border-outline-variant p-10 rounded-xl relative overflow-hidden group">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6 select-none" data-icon="update">update</span>
                <h3 className="font-headline-lg text-primary mb-4">Real-Time / Every Second</h3>
                <p className="font-body-md text-on-surface-variant max-w-md">
                  Watch your balance grow in real-time with continuous settlement on every block of the Stellar ledger.
                </p>
              </div>
              {/* Decorative pulse rings — no external image */}
              <div style={{
                position: 'absolute', right: '-20px', bottom: '-20px',
                width: '180px', height: '180px', pointerEvents: 'none'
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    position: 'absolute', inset: `${i * 22}px`,
                    borderRadius: '50%', border: '1.5px solid rgba(29,255,0,0.25)',
                    animation: `ping 2s ease-in-out ${i * 0.5}s infinite`,
                    opacity: 0.6 - i * 0.15
                  }} />
                ))}
                <div style={{
                  position: 'absolute', inset: '66px', borderRadius: '50%',
                  background: 'rgba(29,255,0,0.12)'
                }} />
              </div>
            </div>

            {/* Bento 2: 100% On-Chain / Verified */}
            <div className="md:col-span-4 bg-surface-container-lowest border-t-2 border-secondary border-l border-r border-b border-outline-variant p-10 rounded-xl hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-secondary text-4xl mb-6 select-none" data-icon="verified_user">verified_user</span>
              <h3 className="font-title-md text-primary mb-4 font-bold">100% On-Chain / Verified</h3>
              <p className="font-body-md text-on-surface-variant">
                Every payment and state change is fully transparent and verifiable on the Stellar Network.
              </p>
            </div>

            {/* Bento 3: Gasless / Fee Sponsored */}
            <div className="md:col-span-4 bg-surface-container-lowest border-t-2 border-secondary border-l border-r border-b border-outline-variant p-10 rounded-xl hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-secondary text-4xl mb-6 select-none" data-icon="volunteer_activism">volunteer_activism</span>
              <h3 className="font-title-md text-primary mb-4 font-bold">Gasless / Fee Sponsored</h3>
              <p className="font-body-md text-on-surface-variant">
                Enjoy a seamless experience with sponsored network fees. Stream without worrying about holding extra XLM for gas.
              </p>
            </div>

            {/* Bento 4: 5s Finality / Stellar Speed */}
            <div className="md:col-span-8 bg-primary text-on-primary p-10 rounded-xl flex flex-col justify-center border-l-4 border-secondary">
              <h3 className="font-headline-lg mb-6 text-white font-bold">5s Finality / Stellar Speed</h3>
              <div className="flex gap-4 flex-wrap">
                <span className="px-4 py-1 border border-secondary text-secondary rounded-full font-label-sm uppercase font-semibold">Instant</span>
                <span className="px-4 py-1 border border-secondary text-secondary rounded-full font-label-sm uppercase font-semibold">Secure</span>
                <span className="px-4 py-1 border border-secondary text-secondary rounded-full font-label-sm uppercase font-semibold">Soroban</span>
              </div>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="animate-section transition-all duration-700 opacity-0 translate-y-10 bg-surface-container-low py-section-gap" id="how-it-works">
          <div className="max-w-[1280px] mx-auto px-6 md:px-container-margin text-center">
            <h2 className="font-display-lg text-primary mb-16 tracking-tight">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-display-lg mb-6 font-bold select-none">1</div>
                <h3 className="font-headline-lg text-primary mb-4 font-bold text-2xl">Connect Wallet</h3>
                <p className="font-body-md text-on-surface-variant max-w-sm">Link your Stellar wallet (Freighter / xBull) in one click.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-display-lg mb-6 font-bold select-none">2</div>
                <h3 className="font-headline-lg text-primary mb-4 font-bold text-2xl">Create Stream</h3>
                <p className="font-body-md text-on-surface-variant max-w-sm">Set recipient, amount per second, and duration. Done in seconds.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-display-lg mb-6 font-bold select-none">3</div>
                <h3 className="font-headline-lg text-primary mb-4 font-bold text-2xl">Earn Live</h3>
                <p className="font-body-md text-on-surface-variant max-w-sm">Watch XLM flow in real-time. Withdraw any time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Built Different Section (Everything You Need) */}
        <section className="animate-section transition-all duration-700 opacity-0 translate-y-10 max-w-[1280px] mx-auto px-6 md:px-container-margin py-section-gap">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-primary mb-4 tracking-tight">Everything You Need</h2>
            <p className="font-body-md text-on-surface-variant font-semibold">Built Different on Stellar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl select-none" data-icon="bolt">bolt</span>
              <h4 className="font-title-md text-primary mb-2 font-bold">Real-Time Streaming</h4>
              <p className="font-body-md text-on-surface-variant">Funds flow every second with zero manual inputs — time does the work.</p>
            </div>
            <div className="p-8 border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl select-none" data-icon="lock">lock</span>
              <h4 className="font-title-md text-primary mb-2 font-bold">Non-Custodial Escrow</h4>
              <p className="font-body-md text-on-surface-variant">Your keys, your funds. Stellar Soroban smart contract holds everything.</p>
            </div>
            <div className="p-8 border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl select-none" data-icon="new_releases">new_releases</span>
              <h4 className="font-title-md text-primary mb-2 font-bold">NEW: Gasless Transactions</h4>
              <p className="font-body-md text-on-surface-variant">Fee Sponsorship covers network costs — stream without worrying about gas fees.</p>
            </div>
            <div className="p-8 border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl select-none" data-icon="dashboard_customize">dashboard_customize</span>
              <h4 className="font-title-md text-primary mb-2 font-bold">Live Dashboard</h4>
              <p className="font-body-md text-on-surface-variant">Track all streams with real-time metrics and live XLM counters.</p>
            </div>
            <div className="p-8 border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl select-none" data-icon="link">link</span>
              <h4 className="font-title-md text-primary mb-2 font-bold">Fully On-Chain</h4>
              <p className="font-body-md text-on-surface-variant">100% transparent, every action verifiable on the Stellar ledger.</p>
            </div>
            <div className="p-8 border border-outline-variant/30 rounded-xl hover:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl select-none" data-icon="calendar_today">calendar_today</span>
              <h4 className="font-title-md text-primary mb-2 font-bold">Flexible Duration</h4>
              <p className="font-body-md text-on-surface-variant">Stream for minutes, days, or months. Cancel anytime with auto-refund.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-section transition-all duration-700 opacity-0 translate-y-10 max-w-[1280px] mx-auto px-6 md:px-container-margin py-section-gap">
          <div className="bg-surface-container-high rounded-xl p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="max-w-xl relative z-10 text-left">
              <h2 className="font-headline-lg text-primary mb-4 tracking-tight">Get Started Now</h2>
              <p className="font-body-lg text-on-surface-variant">Ready to stream? Start your first payment stream in under 60 seconds.</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto relative z-10">
              <button 
                onClick={handleStart}
                className="bg-secondary text-on-secondary px-12 py-4 rounded-xl font-title-md btn-hover-glow-neon transition-all active:scale-95 border-none cursor-pointer font-bold"
              >
                Stream Now
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}