import { Link } from 'react-router-dom'
import React from 'react'
import logoBlack from '../assets/logo_black_cropped.png'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant py-section-gap relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-container-margin">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logoBlack} alt="LumensFlow" className="h-7 w-auto object-contain" />
            </Link>
            <p className="font-body-md text-on-surface-variant max-w-xs">
              The protocol for continuous payment streaming on Stellar. Built with Soroban.
            </p>
          </div>
          <div>
            <span className="font-label-sm font-bold text-primary block mb-6 uppercase tracking-wider">Platform</span>
            <ul className="space-y-4">
              <li><Link className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" to="/dashboard">Dashboard</Link></li>
              <li><Link className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" to="/docs">Documentation</Link></li>
              <li><Link className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" to="/">Features</Link></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" href="#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div>
            <span className="font-label-sm font-bold text-primary block mb-6 uppercase tracking-wider">Resources</span>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" href="https://stellar.expert" target="_blank" rel="noreferrer">Stellar Expert</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" href="https://soroban.stellar.org" target="_blank" rel="noreferrer">Soroban Docs</a></li>
              <li><a className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm font-semibold" href="https://laboratory.stellar.org" target="_blank" rel="noreferrer">Network Laboratory</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-outline-variant/30 gap-6">
          <p className="font-label-sm text-on-surface-variant">© 2026 LUMENSFLOW PROTOCOL</p>
          <div className="flex gap-8">
            <a className="font-label-sm text-on-surface-variant hover:text-secondary font-semibold" href="#privacy">Privacy Policy</a>
            <a className="font-label-sm text-on-surface-variant hover:text-secondary font-semibold" href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}