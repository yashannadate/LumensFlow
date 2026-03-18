import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { 
  ArrowRight, Zap, Shield, Rocket, Activity, Globe, Clock, Wallet, 
  Droplets, BarChart3, TrendingUp 
} from 'lucide-react'

export default function Landing() {
  const { isConnected, connect } = useWallet()
  const navigate = useNavigate()

  const handleStart = async () => {
    if (!isConnected) {
      await connect()
    }
    navigate('/dashboard')
  }

  return (
    <div className="landing-page" style={{ position: 'relative' }}>
      {/* Hero Section */}
      <section className="hero center" style={{ 
        minHeight: '100vh', 
        paddingTop: '120px',
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)'
      }}>
        <div className="badge-active" style={{ 
          letterSpacing: '3px', 
          fontSize: '12px', 
          padding: '6px 20px',
          marginBottom: '32px',
          borderColor: 'var(--purple)',
          color: 'var(--purple-light)',
          background: 'transparent',
          borderRadius: '50px',
          border: '1px solid var(--purple)'
        }}>
          STELLAR TESTNET LIVE
        </div>
        
        <h1 style={{ 
          fontSize: '96px', 
          fontWeight: '400', 
          lineHeight: '1', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Earn Every<br /><span style={{ color: 'var(--purple)' }}>Second</span>
        </h1>
        
        <p className="text-muted" style={{ 
          fontSize: '20px', 
          maxWidth: '600px', 
          lineHeight: '1.6',
          marginBottom: '48px',
          textAlign: 'center'
        }}>
          Stream XLM payments continuously. Cancel anytime.<br />
          Withdraw instantly. 100% On-Chain.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '0' }}>
          <button onClick={handleStart} className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px', borderRadius: '50px' }}>
            Start Streaming <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/how-it-works')}
            className="btn-ghost"
            style={{ padding: '16px 32px', fontSize: '16px', border: '1px solid var(--border)', borderRadius: '50px', color: 'var(--text)' }}
          >
            See How It Works
          </button>
          <button
            onClick={() => navigate('/explorer')}
            className="btn-ghost"
            style={{ padding: '16px 24px', fontSize: '16px', color: 'var(--purple-light)', borderRadius: '50px' }}
          >
            Explorer ↗
          </button>
        </div>


        {/* Arc SVG */}
        <div style={{ marginTop: '60px', width: '100%', maxWidth: '800px' }}>
          <svg viewBox="0 0 800 300" style={{ width: '100%' }}>
            <defs>
              <linearGradient id="arc-gradient" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0"/>
                <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 50 280 Q 400 20 750 280"
              stroke="url(#arc-gradient)" strokeWidth="32"
              fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ 
        background: 'var(--card)', 
        borderTop: '1px solid var(--border)', 
        borderBottom: '1px solid var(--border)',
        padding: '32px 0'
      }}>
        <div className="row-between" style={{ maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center', gap: '60px' }}>
          <div className="row" style={{ gap: '12px' }}>
            <Zap size={24} color="var(--purple)" />
            <div>
              <div style={{ fontWeight: '400', fontSize: '18px' }}>&lt;0.003 XLM</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Per Transaction</div>
            </div>
          </div>
          <div className="row" style={{ gap: '12px' }}>
            <Globe size={24} color="var(--purple)" />
            <div>
              <div style={{ fontWeight: '400', fontSize: '18px' }}>100% On-Chain</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Stellar Soroban</div>
            </div>
          </div>
          <div className="row" style={{ gap: '12px' }}>
            <Clock size={24} color="var(--purple)" />
            <div>
              <div style={{ fontWeight: '400', fontSize: '18px' }}>Real-Time</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Streaming Tech</div>
            </div>
          </div>
        </div>
      </div>

      {/* 60 Second Guide */}
      <section className="center" style={{ padding: '80px 24px' }}>
        <h2 style={{ fontSize: '40px', marginBottom: '16px' }}>Get Started in 60 Seconds</h2>
        <p className="text-muted" style={{ fontSize: '18px', marginBottom: '64px' }}>No experience needed. Just a wallet and testnet XLM.</p>

        <div className="row" style={{ gap: '40px', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { num: '01', icon: <Wallet size={32} />, title: 'Install Wallet', desc: 'Get Freighter or any Stellar wallet.' },
            { num: '02', icon: <Rocket size={32} />, title: 'Get XLM', desc: 'Use Friendbot for free testnet XLM.', btn: true },
            { num: '03', icon: <Activity size={32} />, title: 'Stream Live', desc: 'Create your first stream instantly.' },
          ].map((step, i) => (
            <div key={i} className="card stack" style={{ width: '280px', textAlign: 'left' }}>
              <div style={{ fontSize: '40px', color: 'var(--purple)', opacity: 0.3, marginBottom: '8px' }}>{step.num}</div>
              <div style={{ marginBottom: '16px', color: 'var(--purple-light)' }}>{step.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{step.title}</h3>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
              {step.btn && (
                <a href="https://laboratory.stellar.org/#account-creator?network=testnet" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn-ghost" style={{ marginTop: '16px', fontSize: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px' }}>
                    Get Free Testnet XLM ↗
                  </button>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="center" style={{ padding: '80px 24px', background: '#0d0d14' }}>
        <h2 style={{ fontSize: '40px', marginBottom: '64px' }}>Why LumensFlow?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%', maxWidth: '1200px' }}>
          {[
            { icon: <Droplets size={32} color="var(--purple)" />, title: 'Real-Time Streaming', desc: 'Funds flow every second automatically without manual approvals.' },
            { icon: <Shield size={32} color="var(--purple)" />, title: 'Non-Custodial', desc: 'Your keys, your funds, always. We never touch your private keys.' },
            { icon: <Zap size={32} color="var(--purple)" />, title: 'Soroban Powered', desc: 'Leveraging Stellar\'s next-gen smart contracts for ultra-low fees.' },
            { icon: <BarChart3 size={32} color="var(--purple)" />, title: 'Live Dashboard', desc: 'Track all your incoming and outgoing streams with real-time visualization.' },
            { icon: <Globe size={32} color="var(--purple)" />, title: 'Stellar Network', desc: 'Fully operational on the Stellar Testnet for secure experimentation.' },
            { icon: <Clock size={32} color="var(--purple)" />, title: 'Flexible Duration', desc: 'Configure streams for minutes, days, or years as per your needs.' },
          ].map((f, i) => (
            <div key={i} className="card stack" style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{f.title}</h3>
              <p className="text-muted" style={{ lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
