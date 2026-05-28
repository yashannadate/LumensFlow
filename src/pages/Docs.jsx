import { useState, useEffect } from 'react'
import { 
  Rocket, Layers, Settings, UserCheck, Terminal,
  ExternalLink, Zap, Shield, Info, Code,
  ChevronRight, Lock, Activity, Coins, CheckCircle2,
  Briefcase, CreditCard, Landmark, Globe
} from 'lucide-react'

const DOCS_SECTIONS = [
  {
    id: 'what-is-lumensflow',
    title: 'What is LumensFlow?',
    icon: <Rocket size={18} />,
    content: (
      <>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          <div className="md:col-span-8">
            <p className="text-lg text-primary mb-4 font-bold">The Real-Time Liquidity Layer</p>
            <p className="text-on-surface-variant leading-relaxed">LumensFlow is a decentralized asset streaming protocol built on the Stellar Network. It allows users to lock XLM into smart contracts that release funds continuously, second-by-second, to any recipient on the network.</p>
            <p className="text-on-surface-variant leading-relaxed mt-4">By moving away from "lumpy" payments to "fluid" cash flows, LumensFlow increases capital efficiency and provides immediate liquidity for receivers.</p>
          </div>
          <div className="md:col-span-4 bg-secondary/10 border border-secondary/35 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Core Specs</h4>
            <div className="flex items-center gap-3 text-primary">
              <Globe size={16} />
              <span className="text-sm font-semibold">Stellar Soroban Mainnet</span>
            </div>
            <div className="flex items-center gap-3 text-primary">
              <Shield size={16} />
              <span className="text-sm font-semibold">100% Non-Custodial</span>
            </div>
            <div className="flex items-center gap-3 text-primary">
              <Zap size={16} className="fill-current" />
              <span className="text-sm font-semibold">Gasless Transactions</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { 
              icon: <Briefcase size={20} className="text-primary" />, 
              title: "On-Chain Payroll", 
              desc: "Pay employees by the second. Instead of waiting for bi-weekly cycles, workers gain immediate access to their earned capital.",
              tag: "Continuity"
            },
            { 
              icon: <CreditCard size={20} className="text-primary" />, 
              title: "Subscriptions", 
              desc: "Renew services with zero friction. Automate recurring micro-payments without the risk of over-charging or manual billing.",
              tag: "Automation"
            },
            { 
              icon: <Landmark size={20} className="text-primary" />, 
              title: "Trustless Vesting", 
              desc: "Unlock tokens gradually for founders and investors. Smart contracts enforce linear cliffs and release schedules automatically.",
              tag: "Security"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-outline-variant/65 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[9px] font-bold text-on-surface-variant border border-outline-variant/60 px-2.5 py-0.5 rounded-full uppercase">
                  {item.tag}
                </span>
              </div>
              <div>
                <h4 className="text-primary font-bold text-base mb-2">{item.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed m-0">{item.desc}</p>
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
        <div className="flex flex-col gap-6 text-left">
          <p className="text-on-surface-variant leading-relaxed">The magic of LumensFlow isn't in complex transactions, but in **Linear Accumulation**. Instead of sending thousands of small transactions, we use one smart contract to define a flow.</p>
          
          {/* Visual Lifecycle Diagram */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-container-low border border-outline-variant/60 rounded-2xl">
            {[
              { icon: <Lock size={20} />, title: "Secure Escrow", desc: "Sender locks XLM to start." },
              { icon: <Activity size={20} />, title: "Active Flow", desc: "Contract calculates accruals." },
              { icon: <Coins size={20} />, title: "Instant Access", desc: "Recipient pulls earnings." },
              { icon: <CheckCircle2 size={20} />, title: "Settlement", desc: "Stream ends flawlessly." }
            ].map((item, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <div className="w-11 h-11 rounded-xl bg-white border border-outline-variant/40 flex items-center justify-center mb-3 text-primary shadow-xs">
                  {item.icon}
                </div>
                <h4 className="text-primary font-bold text-xs mb-1">{item.title}</h4>
                <p className="text-[11px] text-on-surface-variant/80 m-0">{item.desc}</p>
              </div>
            ))}
          </div>
 
          <div className="p-5 bg-secondary/10 border border-secondary/35 rounded-2xl flex gap-3">
            <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-primary font-bold text-sm mb-1">The Mathematics</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed m-0">Recipients don't wait for "blocks". Balance is calculated using the simple logic: **Static Balance + (Flow Rate × Time Delta)**. This ensures that every fraction of a second is accounted for on-chain.</p>
            </div>
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
        <div className="p-8 border border-outline-variant/65 rounded-2xl bg-white relative overflow-hidden text-left shadow-xs">
          {/* Visual Flow Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 relative">
            {/* Alice */}
            <div className="text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low border-2 border-primary flex items-center justify-center mb-3 mx-auto shadow-xs">
                <span className="text-2xl">👩‍💻</span>
              </div>
              <div className="font-bold text-primary text-xs">Alice (Sender)</div>
            </div>
 
            {/* Connecting Stream */}
            <div className="flex-1 w-full md:w-auto h-1 bg-surface-container-low relative rounded-full mx-4">
               <div className="absolute top-[-16px] left-0 right-0 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider select-none shadow-xs">
                     <Zap size={11} className="fill-current" /> LIVE STREAMING
                  </div>
               </div>
               <div className="absolute top-[-6px] left-0 w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_#1DFF00]" 
                 style={{ animation: 'particleFlow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} 
               />
            </div>
 
            {/* Bob */}
            <div className="text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low border-2 border-secondary flex items-center justify-center mb-3 mx-auto shadow-xs">
                <span className="text-2xl">👨‍🎨</span>
              </div>
              <div className="font-bold text-primary text-xs">Bob (Receiver)</div>
            </div>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-xl">
               <h5 className="text-primary font-bold text-xs mb-2">The Setup</h5>
               <p className="text-xs text-on-surface-variant leading-relaxed m-0">Alice locks <strong>1,200 XLM</strong> for worker compensation over a 30-day period.</p>
            </div>
            <div className="p-5 bg-secondary/10 border border-secondary/35 rounded-xl">
               <h5 className="text-primary font-bold text-xs mb-2">Bob's Experience</h5>
               <p className="text-xs text-on-surface-variant leading-relaxed m-0">Bob stops waiting for payday. He sees <strong>~0.00046 XLM</strong> land in his wallet every second.</p>
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
        <div className="grid grid-cols-1 gap-3 text-left">
          {[
            { fn: 'create_stream', desc: 'Securely locks funds and initializes flow state.' },
            { fn: 'withdraw', desc: 'Settle and pull currently accrued amount.' },
            { fn: 'cancel_stream', desc: 'Full settlement and refund of unused capital.' }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white border border-outline-variant/65 rounded-xl flex justify-between items-center shadow-xs">
              <div>
                <div className="font-mono text-sm text-primary font-bold">{item.fn}()</div>
                <p className="text-[11px] text-on-surface-variant m-0 mt-1">{item.desc}</p>
              </div>
              <Code size={14} className="text-on-surface-variant/40" />
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
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 text-left">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-28 md:h-[calc(100vh-160px)] flex flex-col justify-between hide-mobile">
          <div className="mb-8">
             <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-4">Documentation</h3>
             <nav className="flex flex-col gap-1.5">
              {DOCS_SECTIONS.map(s => {
                const isActive = activeSection === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-label-sm text-xs font-semibold border-none cursor-pointer transition-all duration-200 text-left border-l-4 ${
                      isActive 
                        ? 'bg-secondary text-on-secondary border-secondary font-bold shadow-xs' 
                        : 'bg-transparent text-on-surface-variant border-transparent hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    <span className={isActive ? 'text-on-secondary' : 'text-on-surface-variant/70'}>{s.icon}</span>
                    {s.title}
                  </button>
                )
              })}
            </nav>
          </div>
 
          <div className="pt-6 border-t border-outline-variant/40">
             <a 
               href="https://github.com/yashannadate/LumensFlow" 
               target="_blank" rel="noreferrer"
               className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold no-underline"
             >
               <Code size={16} /> Protocol Source <ExternalLink size={12} />
             </a>
          </div>
        </aside>
 
        {/* Main Content Area */}
        <main className="flex-1 color-on-surface-variant pt-4 flex flex-col gap-16">
          <div>
             <h1 className="font-display-lg text-[40px] md:text-5xl text-primary tracking-tight mb-2">
               Technical <span className="text-secondary-fixed-dim">Protocol</span>
             </h1>
             <p className="font-body-md text-on-surface-variant text-base leading-relaxed max-w-2xl m-0">The comprehensive guide to mastering real-time liquidity and asset streaming on Stellar.</p>
          </div>
 
          <div className="flex flex-col gap-16">
            {DOCS_SECTIONS.map(section => (
              <section key={section.id} id={section.id} className="animate-section">
                <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant/65 flex items-center justify-center text-primary shadow-xs">
                     {section.icon}
                  </div>
                  <h2 className="font-headline-lg text-xl text-primary font-bold m-0">{section.title}</h2>
                </div>
                <div className="docs-content">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
 
          {/* Support Section */}
          <div className="bg-white border border-outline-variant/65 rounded-2xl p-10 text-center flex flex-col items-center shadow-xs">
             <h3 className="font-display-lg text-primary text-2xl font-bold mb-2">Start Streaming Today</h3>
             <p className="text-on-surface-variant text-sm max-w-md mb-6 leading-relaxed">Go from theory to practice. Deploy your first programmable cash flow in under 60 seconds.</p>
             <button 
               onClick={() => window.location.href = '/dashboard'} 
               className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold btn-hover-glow-neon border-none cursor-pointer text-sm flex items-center gap-2"
             >
                Launch App <ChevronRight size={16} />
             </button>
          </div>
        </main>
      </div>
 
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
