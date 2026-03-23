import { useState, useEffect } from 'react'
import { 
  BookOpen, Zap, Droplets, Shield, Clock, 
  HelpCircle, ChevronRight, Info, AlertCircle, 
  Code, Activity, Terminal, ExternalLink 
} from 'lucide-react'

const DOCS_SECTIONS = [
  {
    id: 'intro',
    title: 'Introduction',
    icon: <BookOpen size={18} />,
    content: (
      <>
        <p>LumensFlow is a revolutionary asset streaming protocol built on the Stellar Network using Soroban smart contracts. It enables the continuous, second-by-second transfer of value, bringing payroll, subscriptions, and vesting to the Stellar ecosystem.</p>
        <p style={{ marginTop: '16px' }}>Unlike traditional one-time transactions, LumensFlow creates a "fluid" movement of capital, allowing both senders and receivers to manage their cash flow with unprecedented precision.</p>
        
        <div style={{ 
          marginTop: '32px', padding: '24px', background: 'rgba(139, 92, 246, 0.05)', 
          border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '16px', display: 'flex', gap: '16px' 
        }}>
          <Info size={24} color="#8b5cf6" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>The "Continuous" Paradigm</h4>
            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6 }}>In a standard transaction, value moves in a single block. In a stream, value moves at every ledger update, calculated second-by-second on-chain.</p>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'money-streaming',
    title: 'Money Streaming',
    icon: <Droplets size={18} />,
    content: (
      <>
        <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '16px' }}>What is a "Stream"?</h3>
        <p>A stream is a continuous transfer of tokens from a sender to a receiver at a defined per-second rate. This process is managed by a non-custodial Soroban escrow contract that holds the total deposited amount and releases it linearly over time.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px' }}>
          {[
            { label: 'Non-Interactive', desc: 'No continuous transactions required. Math handles the release.' },
            { label: 'Permissionless', desc: 'No central authority can stop or redirect your stream.' },
            { label: 'On-Chain Finality', desc: 'Every second is backed by the security of the Stellar network.' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '20px', background: '#131920', border: '1px solid #1f2937', borderRadius: '12px' }}>
              <h5 style={{ color: '#fff', fontSize: '13px', marginBottom: '8px' }}>{item.label}</h5>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'terminology',
    title: 'Core Terminology',
    icon: <Activity size={18} />,
    content: (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { term: 'Flow Rate', def: 'The volume of XLM transferred from sender to receiver per second.' },
            { term: 'Netflow', def: "The rate of change of an account's balance (Inbound - Outbound streams)." },
            { term: 'Real-Time Balance', def: 'The amount currently available to be withdrawn since the last interaction.' },
            { term: 'CRUD Timestamp', def: 'The exact ledger time when a stream was Created, Updated, or Deleted.' },
            { term: 'Protocol Escrow', def: 'The Soroban contract instance holding the locked capital.' }
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
              <span style={{ color: '#86EE1E', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>{item.term}</span>
              <p style={{ marginTop: '4px', fontSize: '14px', color: '#9ca3af' }}>{item.def}</p>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'computation',
    title: 'Computation & Math',
    icon: <Zap size={18} />,
    content: (
      <>
        <p>LumensFlow avoids the gas costs of repeated transactions by using a simple but powerful linear formula. Your balance at any given time (T) is calculated as:</p>
        
        <div style={{ 
          margin: '32px 0', padding: '32px', background: 'rgba(0,0,0,0.3)', 
          border: '2px dashed #1f2937', borderRadius: '16px', textAlign: 'center' 
        }}>
          <code style={{ fontSize: '20px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
            CurrentBalance = StaticBalance + (FlowRate × ElapsedTime)
          </code>
        </div>

        <h4 style={{ color: '#fff', marginBottom: '16px' }}>Example Workout</h4>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', color: '#9ca3af' }}>
          <li><strong>Initial Deposit:</strong> 1,000 XLM</li>
          <li><strong>Duration:</strong> 30 Days (2,592,000 seconds)</li>
          <li><strong>Flow Rate:</strong> 0.0003858 XLM / sec</li>
          <li><strong>After 1 Day:</strong> ~33.33 XLM has flowed to the receiver.</li>
        </ul>
      </>
    )
  },
  {
    id: 'escrow',
    title: 'Escrow & Buffers',
    icon: <Shield size={18} />,
    content: (
      <>
        <p>Security is the bedrock of LumensFlow. Every stream is backed by an isolation-based escrow system.</p>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div className="card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.02)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <AlertCircle size={18} color="#ef4444" />
                <h4 style={{ color: '#fff', fontSize: '15px' }}>Solvency Protection</h4>
              </div>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Streams automatically pause if the sender's balance is insufficient. The protocol utilizes a "Buffer" system where a small portion of XLM is reserved to cover the network cost of closing critical streams.</p>
           </div>
           
           <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <Shield size={18} color="#22c55e" />
                <h4 style={{ color: '#fff', fontSize: '15px' }}>Self-Custody</h4>
              </div>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Only the specified 'Receiver' can withdraw funds from the stream. Only the 'Sender' can cancel the stream and refund the remaining balance. No one else, including LumensFlow admins, can touch the funds.</p>
           </div>
        </div>
      </>
    )
  },
  {
    id: 'developer',
    title: 'Developer SDK',
    icon: <Terminal size={18} />,
    content: (
      <>
        <p>Integrating LumensFlow into your own dApp is simple using the `@stellar/stellar-sdk` and our contract client.</p>
        
        <div style={{ marginTop: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', right: '16px', top: '16px', color: '#6b7280' }}><Code size={14} /></div>
          <pre style={{ 
            background: '#0a0f16', padding: '24px', borderRadius: '12px', 
            overflowX: 'auto', border: '1px solid #1f2937', color: '#a5b4fc', fontSize: '13px' 
          }}>
{`// Create a Stream on Stellar Testnet
const tx = await contract.invoke("create_stream", {
  receiver: "G...",
  amount: 100000000, // 10 XLM (stroops)
  duration: 3600      // 1 hour
});`}
          </pre>
        </div>
      </>
    )
  }
]

export default function Docs() {
  const [activeSection, setActiveSection] = useState('intro')

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

  // Handle scroll detection for sidebar highlighting
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 120px', display: 'flex', gap: '64px' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '260px', position: 'sticky', top: '120px', 
        height: 'calc(100vh - 160px)', flexShrink: 0 
      }} className="hide-mobile">
        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', marginBottom: '24px' }}>Documentation</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {DOCS_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                border: 'none', background: activeSection === s.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                color: activeSection === s.id ? '#fff' : '#6b7280',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                fontSize: '14px', fontWeight: activeSection === s.id ? 600 : 500
              }}
            >
              <span style={{ opacity: activeSection === s.id ? 1 : 0.6 }}>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid #1f2937' }}>
           <a 
             href="https://github.com/yashannadate/LumensFlow" 
             target="_blank" rel="noreferrer"
             style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}
           >
             <Code size={14} /> View Source <ExternalLink size={12} />
           </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, color: '#9ca3af', fontSize: '16px', lineHeight: 1.8 }}>
        <div style={{ marginBottom: '64px' }}>
           <h1 style={{ fontSize: '48px', color: '#fff', letterSpacing: '-0.04em', marginBottom: '16px' }}>Technical <span style={{ color: '#86EE1E' }}>Manual</span></h1>
           <p style={{ fontSize: '18px', maxWidth: '600px' }}>Deep dive into the architecture, mathematics, and security of the LumensFlow protocol.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {DOCS_SECTIONS.map(section => (
            <section key={section.id} id={section.id} style={{ 
              paddingTop: '20px', animate: 'fadeIn 0.5s ease-out' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                   {section.icon}
                </div>
                <h2 style={{ fontSize: '28px', color: '#fff', letterSpacing: '-0.02em' }}>{section.title}</h2>
              </div>
              <div className="docs-content">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div style={{ 
          marginTop: '100px', padding: '48px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)', 
          borderRadius: '24px', border: '1px solid #1f2937', textAlign: 'center' 
        }}>
           <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '16px' }}>Ready to start your first stream?</h3>
           <p style={{ marginBottom: '32px' }}>Navigate to the dashboard and deploy your first Soroban smart contract today.</p>
           <button onClick={() => window.location.href = '/dashboard'} className="btn-primary" style={{ padding: '16px 40px', borderRadius: '9999px' }}>
              Launch App <ChevronRight size={18} />
           </button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .docs-content p { margin-bottom: 20px; }
        .docs-content strong { color: #fff; }
      `}} />
    </div>
  )
}
