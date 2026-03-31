import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Wallet, Send, Droplets, ArrowRight, Zap, 
  Shield, TrendingUp, XCircle, ChevronRight, 
  HelpCircle, Play, Pause, RotateCcw,
  CheckCircle2, Lock, Coins
} from 'lucide-react'

export default function HowItWorks() {
  const navigate = useNavigate()
  const [simulating, setSimulating] = useState(false)
  const [simAmount, setSimAmount] = useState(0)
  const FLOW_RATE = 0.0004629 // Sample rate: 1200 XLM / 30 days

  useEffect(() => {
    let interval
    if (simulating) {
      interval = setInterval(() => {
        setSimAmount(prev => prev + FLOW_RATE)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [simulating])

  const STEPS = [
    {
      icon: <Wallet size={24} />,
      title: 'Connect Wallet',
      desc: 'Securely link your Stellar wallet (Freighter/xBull). Your account stays in your control at all times.',
      color: '#8b5cf6'
    },
    {
      icon: <Send size={24} />,
      title: 'Set Parameters',
      desc: 'Define the recipient, total amount, and duration. LumensFlow calculates the per-second rate automatically.',
      color: '#86EE1E'
    },
    {
      icon: <Lock size={24} />,
      title: 'Deploy Contract',
      desc: 'Funds are moved into a non-custodial Soroban escrow contract that releases value linearly.',
      color: '#3b82f6'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Real-Time Flow',
      desc: 'Once started, XLM flows to the recipient at every ledger entry. No manual interaction needed.',
      color: '#fbbf24'
    }
  ]

  const resetSim = () => {
    setSimulating(false)
    setSimAmount(0)
  }

  return (
    <div style={{ padding: '80px 24px 120px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '9999px', padding: '6px 16px', marginBottom: '24px'
        }}>
          <HelpCircle size={14} color="#8b5cf6" />
          <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#fff' }}>Interactive Guide</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 52px)', letterSpacing: '-0.04em', marginBottom: '16px' }}>Mastering <span style={{ color: '#86EE1E' }}>Real-Time</span> Flow</h1>
        <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Lumens<span style={{ color: '#86EE1E' }}>Flow</span> transforms standard payments into a continuous stream of value. Experience the mechanics below.
        </p>
      </div>

      {/* Interactive Simulation Card */}
      <div className="card" style={{ 
        padding: '48px', marginBottom: '80px', 
        background: 'linear-gradient(135deg, rgba(13,17,23,0.8), rgba(20,27,38,0.8))',
        border: '1px solid #1f2937', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.05 }}>
           <Zap size={200} color="#86EE1E" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '32px', textAlign: 'center' }}>Protocol Live Simulator</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: '48px' }} className="grid-2-mobile">
            
            {/* Simulation Canvas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(139,92,246,0.1)', border: '2px solid #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Wallet color="#8b5cf6" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Sender</div>
                </div>

                <div style={{ flex: 1, height: '2px', background: '#1f2937', margin: '0 20px', position: 'relative', borderRadius: '10px' }}>
                   {simulating && (
                     <div style={{ 
                       position: 'absolute', top: '-4px', left: 0, width: '10px', height: '10px', 
                       borderRadius: '50%', background: '#86EE1E', boxShadow: '0 0 10px #86EE1E',
                       animation: 'simFlow 1.5s linear infinite' 
                     }} />
                   )}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(134,238,30,0.1)', border: '2px solid #86EE1E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Coins color="#86EE1E" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Recipient</div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#fff', letterSpacing: '-0.05em' }}>
                  {simAmount.toFixed(6)} <span style={{ fontSize: '20px', color: '#6b7280' }}>XLM</span>
                </div>
                <div style={{ fontSize: '11px', color: '#86EE1E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                  Currently Streaming
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '32px', borderRadius: '24px', border: '1px solid #1f2937' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '20px' }}>Simulate Stream</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => setSimulating(!simulating)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', 
                    padding: '14px', borderRadius: '12px', background: simulating ? 'rgba(239,68,68,0.1)' : 'rgba(134,238,30,0.1)',
                    border: `1px solid ${simulating ? '#ef4444' : '#86EE1E'}`, color: simulating ? '#ef4444' : '#86EE1E',
                    cursor: 'pointer', fontWeight: 700
                  }}
                >
                  {simulating ? <><Pause size={16} /> Stop Stream</> : <><Play size={16} /> Start Stream</>}
                </button>
                <button 
                  onClick={resetSim}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', 
                    padding: '14px', borderRadius: '12px', background: 'transparent',
                    border: '1px solid #1f2937', color: '#6b7280',
                    cursor: 'pointer', fontWeight: 700
                  }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
              <div style={{ marginTop: '24px', fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
                Flow rate set to <strong>0.0004629 XLM/s</strong> (Equivalent to 1,200 XLM per month).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Step Timeline */}
      <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '40px', textAlign: 'center' }}>Protocol Implementation Path</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {STEPS.map((step, i) => (
          <div key={i} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.3s' }}>
             <div style={{ 
               width: '48px', height: '48px', borderRadius: '12px', background: `${step.color}15`, 
               border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color
             }}>
               {step.icon}
             </div>
             <div>
                <div style={{ fontSize: '10px', color: step.color, fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>PHASE 0{i+1}</div>
                <h3 style={{ fontSize: '17px', color: '#fff', fontWeight: 700, marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6 }}>{step.desc}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Why LumensFlow Section */}
      <div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="grid-2-mobile">
        <div>
           <h2 style={{ fontSize: '32px', color: '#fff', marginBottom: '24px', letterSpacing: '-0.02em' }}>Built for the <span style={{ color: '#86EE1E' }}>New Economy</span></h2>
           <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
             Traditional banking waits for settlement. LumensFlow enables capital efficiency by allowing value to be used the moment it is earned. 
           </p>
           <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: <Shield size={16} />, text: "Non-custodial Soroban escrows" },
                { icon: <TrendingUp size={16} />, text: "Linear second-by-second release" },
                { icon: <Zap size={16} />, text: "Zero network fees (sponsored)" }
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#fff' }}>
                  <div style={{ color: '#86EE1E' }}>{item.icon}</div>
                  {item.text}
                </li>
              ))}
           </ul>
        </div>
        <div style={{ padding: '40px', background: 'rgba(139,92,246,0.05)', border: '1px solid #1f2937', borderRadius: '32px' }}>
           <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>The Core Advantage</h3>
           <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.8 }}>
             By distributing payments over time, organizations reduce liquidation risk while employees gain immediate liquidity. It's a win-win for the Stellar ecosystem.
           </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '18px 60px', borderRadius: '9999px', fontSize: '17px', fontWeight: 700 }}>
          Experience the Flow <ArrowRight size={20} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes simFlow {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}} />

    </div>
  )
}
