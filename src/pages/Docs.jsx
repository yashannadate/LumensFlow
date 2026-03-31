import { useState, useEffect } from 'react'
import { 
  BookOpen, Zap, Droplets, Shield, Clock, 
  HelpCircle, ChevronRight, Info, AlertCircle, 
  Code, Activity, Terminal, ExternalLink,
  Wallet, Send, Settings, UserCheck, Lock, Cpu,
  ArrowRight, Coins, CheckCircle2, History,
  Globe, Rocket, Layers, Briefcase, CreditCard, Landmark
} from 'lucide-react'

const DOCS_SECTIONS = [
  {
    id: 'what-is-lumensflow',
    title: 'What is LumensFlow?',
    icon: <Rocket size={18} />,
    content: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 280px', gap: '32px' }} className="grid-2-mobile">
          <div>
            <p style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', fontWeight: 600 }}>The Real-Time Liquidity Layer</p>
            <p>LumensFlow is a decentralized asset streaming protocol built on the Stellar Network. It allows users to lock XLM into smart contracts that release funds continuously, second-by-second, to any recipient on the network.</p>
            <p style={{ marginTop: '16px' }}>By moving away from "lumpy" payments to "fluid" cash flows, LumensFlow increases capital efficiency and provides immediate liquidity for receivers.</p>
          </div>
          <div style={{ 
            background: 'rgba(134, 238, 30, 0.03)', border: '1px solid rgba(134, 238, 30, 0.1)', 
            borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' 
          }}>
            <h4 style={{ fontSize: '13px', color: '#86EE1E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Specs</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={16} color="#86EE1E" />
              <span style={{ fontSize: '13px', color: '#fff' }}>Stellar Soroban Mainnet</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={16} color="#86EE1E" />
              <span style={{ fontSize: '13px', color: '#fff' }}>100% Non-Custodial</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={16} color="#86EE1E" />
              <span style={{ fontSize: '13px', color: '#fff' }}>Gasless Transactions</span>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'use-cases',
    title: 'Real-World Use Cases',
    icon: <Layers size={18} />,
    content: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { 
              icon: <Briefcase color="#86EE1E" />, 
              title: "On-Chain Payroll", 
              desc: "Pay employees by the second. Instead of waiting for bi-weekly cycles, workers gain immediate access to their earned capital.",
              tag: "Continuity"
            },
            { 
              icon: <CreditCard color="#8b5cf6" />, 
              title: "Subscriptions", 
              desc: "Renew services with zero friction. Automate recurring micro-payments without the risk of over-charging or manual billing.",
              tag: "Automation"
            },
            { 
              icon: <Landmark color="#3b82f6" />, 
              title: "Trustless Vesting", 
              desc: "Unlock tokens gradually for founders and investors. Smart contracts enforce linear cliffs and release schedules automatically.",
              tag: "Security"
            }
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#6b7280', border: '1px solid #1f2937', padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                  {item.tag}
                </span>
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'money-streaming',
    title: 'How It Works (Really)',
    icon: <Settings size={18} />,
    content: (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <p>The magic of LumensFlow isn't in complex transactions, but in **Linear Accumulation**. Instead of sending thousands of small transactions, we use one smart contract to define a flow.</p>
          
          {/* Visual Lifecycle Diagram */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px',
            padding: '32px', background: '#0d1117', border: '1px solid #1f2937', borderRadius: '24px' 
          }}>
            {[
              { icon: <Lock />, title: "Secure Escrow", desc: "Sender locks XLM to start." },
              { icon: <Activity />, title: "Active Flow", desc: "Contract calculates accruals." },
              { icon: <Coins />, title: "Instant Access", desc: "Recipient pulls earnings." },
              { icon: <CheckCircle2 />, title: "Settlement", desc: "Stream ends flawlessly." }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '16px', 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid #1f2937',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                  color: '#8b5cf6'
                }}>
                  {item.icon}
                </div>
                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '24px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.1)' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="#8b5cf6" /> The Mathematics
            </h4>
            <p style={{ fontSize: '14px', margin: 0 }}>Recipients don't wait for "blocks". Balance is calculated using the simple logic: **Static Balance + (Flow Rate × Time Delta)**. This ensures that every fraction of a second is accounted for on-chain.</p>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'story',
    title: 'Alice & Bob Scenario',
    icon: <UserCheck size={18} />,
    content: (
      <>
        <div style={{ 
          padding: '40px', background: 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.08), transparent)', 
          border: '1px solid #1f2937', borderRadius: '32px', position: 'relative', overflow: 'hidden'
        }}>
          {/* Visual Flow Diagram */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', position: 'relative' }}>
            {/* Alice */}
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ 
                width: '72px', height: '72px', borderRadius: '24px', 
                background: '#131920', border: '2px solid #8b5cf6', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '32px' }}>👩‍💻</span>
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Alice (Sender)</div>
            </div>

            {/* Connecting Stream */}
            <div style={{ flex: 1, height: '4px', background: 'rgba(139, 92, 246, 0.1)', margin: '0 24px', position: 'relative', borderRadius: '10px' }}>
               <div style={{ position: 'absolute', top: '-14px', left: '0', right: '0', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(134, 238, 30, 0.1)', border: '1px solid rgba(134, 238, 30, 0.3)', borderRadius: '9999px', padding: '4px 12px', fontSize: '10px', color: '#86EE1E', fontWeight: 800 }}>
                     <Zap size={12} className="animate-pulse" /> LIVE STREAMING
                  </div>
               </div>
               <div style={{ 
                 position: 'absolute', top: '-6px', left: '0', width: '16px', height: '16px', 
                 borderRadius: '50%', background: '#86EE1E', boxShadow: '0 0 15px #86EE1E',
                 animation: 'particleFlow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' 
               }} />
            </div>

            {/* Bob */}
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ 
                width: '72px', height: '72px', borderRadius: '24px', 
                background: '#131920', border: '2px solid #86EE1E', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '32px' }}>👨‍🎨</span>
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Bob (Receiver)</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2-mobile">
            <div style={{ padding: '24px', background: '#0d1117', borderRadius: '20px', border: '1px solid #1f2937' }}>
               <h5 style={{ color: '#fff', fontSize: '13px', marginBottom: '12px', opacity: 0.7 }}>The Setup</h5>
               <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>Alice locks <strong>1,200 XLM</strong> for worker compensation over a 30-day period.</p>
            </div>
            <div style={{ padding: '24px', background: 'rgba(134, 238, 30, 0.03)', borderRadius: '20px', border: '1px solid rgba(134, 238, 30, 0.1)' }}>
               <h5 style={{ color: '#86EE1E', fontSize: '13px', marginBottom: '12px' }}>Bob's Experience</h5>
               <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>Bob stops waiting for payday. He sees <strong>~0.00046 XLM</strong> land in his wallet every second.</p>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'technical',
    title: 'Developer Interface',
    icon: <Terminal size={18} />,
    content: (
      <>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { fn: 'create_stream', desc: 'Securely locks funds and initializes flow state.' },
            { fn: 'withdraw', desc: 'Settle and pull currently accrued amount.' },
            { fn: 'cancel_stream', desc: 'Full settlement and refund of unused capital.' }
          ].map((item, i) => (
            <div key={i} style={{ 
              padding: '20px', background: 'rgba(255,255,255,0.02)', 
              border: '1px solid #1f2937', borderRadius: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#8b5cf6', fontWeight: 600 }}>{item.fn}()</div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>{item.desc}</p>
              </div>
              <Code size={14} color="#1f2937" />
            </div>
          ))}
        </div>
      </>
    )
  }
]

export default function Docs() {
  const [activeSection, setActiveSection] = useState('what-is-lumensflow')

  const scrollTo = (id) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      for (const section of DOCS_SECTIONS) {
        const el = document.getElementById(section.id)
        if (el && el.offsetTop - 150 < scrollY) {
          setActiveSection(section.id)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="docs-page-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 120px', display: 'flex', gap: '80px' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '280px', position: 'sticky', top: '120px', 
        height: 'calc(100vh - 160px)', flexShrink: 0
      }} className="hide-mobile docs-sidebar">
        <div style={{ marginBottom: '32px' }}>
           <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', marginBottom: '16px' }}>Documentation</h3>
           <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {DOCS_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px',
                  border: 'none', background: activeSection === s.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: activeSection === s.id ? '#fff' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  fontSize: '14px', fontWeight: activeSection === s.id ? 700 : 500
                }}
              >
                <span style={{ opacity: activeSection === s.id ? 1 : 0.6 }}>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ paddingTop: '32px', borderTop: '1px solid #1f2937' }}>
           <a 
             href="https://github.com/yashannadate/LumensFlow" 
             target="_blank" rel="noreferrer"
             style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}
           >
             <Code size={16} /> Protocol Source <ExternalLink size={12} />
           </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, color: '#9ca3af', fontSize: '16px', lineHeight: 1.8, paddingTop: '40px' }}>
        <div style={{ marginBottom: '80px' }}>
           <h1 style={{ fontSize: 'clamp(40px, 8vw, 56px)', color: '#fff', letterSpacing: '-0.04em', marginBottom: '20px' }}>Technical <span style={{ color: '#86EE1E' }}>Protocol</span></h1>
           <p style={{ fontSize: '19px', maxWidth: '640px', lineHeight: 1.6 }}>The comprehensive guide to mastering real-time liquidity and asset streaming on Stellar.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
          {DOCS_SECTIONS.map(section => (
            <section key={section.id} id={section.id} className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#86EE1E' }}>
                   {section.icon}
                </div>
                <h2 style={{ fontSize: '24px', color: '#fff', letterSpacing: '-0.02em', fontWeight: 800 }}>{section.title}</h2>
              </div>
              <div className="docs-content">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Support Section */}
        <div style={{ 
          marginTop: '120px', padding: '64px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)', 
          borderRadius: '32px', border: '1px solid #1f2937', textAlign: 'center' 
        }}>
           <h3 style={{ color: '#fff', fontSize: '28px', marginBottom: '16px', fontWeight: 800 }}>Start Streaming Today</h3>
           <p style={{ marginBottom: '40px', maxWidth: '440px', margin: '0 auto 40px' }}>Go from theory to practice. Deploy your first programmable cash flow in under 60 seconds.</p>
           <button onClick={() => window.location.href = '/dashboard'} className="btn-primary" style={{ padding: '16px 40px', borderRadius: '9999px', fontSize: '16px' }}>
              Launch App <ChevronRight size={18} />
           </button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes particleFlow {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}} />
    </div>
  )
}
