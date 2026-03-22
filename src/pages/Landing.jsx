import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Shield, Zap, Clock, ArrowRight, Play, Globe, CheckCircle2, ChevronRight, Activity } from 'lucide-react'
import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D()

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // Subtle interactive background animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)
    resize()

    const render = () => {
      time += 0.002
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)'
      ctx.lineWidth = 1

      for (let i = 0; i < 15; i++) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 20) {
          const y = noise2D(x * 0.001 + i, time + i * 0.1) * 100 + (canvas.height / 15) * i
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="landing-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }} 
      />

      {/* ── Hero Section ───────────────────────────────────── */}
      <section style={{ 
        padding: '120px 24px 80px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '9999px',
          padding: '6px 16px',
          marginBottom: '32px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em' }}>
            Built on Soroban • Stellar Mainnet Ready
          </span>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(44px, 10vw, 84px)', 
          fontFamily: 'var(--font-brand)', 
          fontWeight: 900, 
          letterSpacing: '-0.05em',
          lineHeight: 0.95,
          color: '#fff',
          maxWidth: '900px',
          marginBottom: '24px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          The Protocol for <br/>Continuous <span style={{ color: 'var(--primary)' }}>Payments</span>
        </h1>

        <p style={{ 
          fontSize: 'clamp(17px, 3vw, 20px)', 
          color: '#9ca3af', 
          maxWidth: '640px', 
          lineHeight: 1.6,
          marginBottom: '48px',
          fontFamily: 'var(--font-body)',
          animation: 'fadeInUp 1s ease-out'
        }}>
          Lock funds once. Watch them flow second-by-second. Lumens<span style={{ color: '#86EE1E' }}>Flow</span> transforms static transfers into fluid, programmable cash streams.
        </p>

        <div style={{ display: 'flex', gap: '16px', animation: 'fadeInUp 1.2s ease-out' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '18px 42px', fontSize: '16px', borderRadius: '9999px' }}>
            Launch Application <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/how-it-works')} className="btn-ghost" style={{ padding: '18px 42px', fontSize: '16px', borderRadius: '9999px' }}>
            <Play size={18} fill="currentColor" /> How It Works
          </button>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'rgba(13, 17, 23, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #1f2937',
          borderRadius: '32px',
          padding: '24px 48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }} className="stats-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(134, 238, 30, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} color="#86EE1E" />
             </div>
             <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>&lt;0.003 XLM</div>
                <div style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Per Transaction</div>
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid #1f2937', borderRight: '1px solid #1f2937', padding: '0 40px' }}>
             <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={22} color="var(--primary)" />
             </div>
             <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>100% On-Chain</div>
                <div style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Escrows</div>
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} color="#22c55e" />
             </div>
             <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Real-Time</div>
                <div style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Every Second</div>
             </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
           <h2 style={{ fontSize: '42px', marginBottom: '16px' }}>Built for the <span style={{ color: 'var(--primary)' }}>Modern</span> Web</h2>
           <p style={{ color: '#9ca3af' }}>Experience the most fluid payment protocol on the Stellar network.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="features-grid">
          {[
            { 
              icon: <Activity color="#86EE1E" />, 
              title: 'Live Flow Analytics', 
              desc: 'Watch your balance grow decimal by decimal with zero-latency updates.' 
            },
            { 
              icon: <CheckCircle2 color="var(--primary)" />, 
              title: 'Non-Custodial', 
              desc: 'Contract-based escrows ensure that only the intended recipient can withdraw.' 
            },
            { 
              icon: <Globe color="#8b5cf6" />, 
              title: 'Global Settlements', 
              desc: 'Powered by Stellar for near-instant finality and extremely low fees.' 
            }
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {f.icon}
               </div>
               <div>
                 <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-brand)' }}>{f.title}</h3>
                 <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
               </div>
               <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                 Learn more <ChevronRight size={14} />
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer Link ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: '1px solid #1f2937' }}>
         <h2 style={{ fontSize: '32px', marginBottom: '32px' }}>Start your stream in seconds.</h2>
         <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '16px 48px', borderRadius: '9999px' }}>
            Get Started <ArrowRight size={18} />
         </button>
      </section>
    </div>
  )
}
