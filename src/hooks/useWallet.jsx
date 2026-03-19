import {
  createContext, useContext, useState,
  useCallback, useEffect, useRef,
} from 'react'
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import { fetchXlmBalance } from '../utils/stellar.js'

const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
const WalletContext = createContext(null)

function initKit() {
  StellarWalletsKit.init({
    modules: [new FreighterModule(), new xBullModule(), new LobstrModule()],
    selectedWalletId: 'freighter',
    network: NETWORK_PASSPHRASE,
  })
}

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState('0.00')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)
  const kitInitialized = useRef(false)

  useEffect(() => {
    if (!kitInitialized.current) {
      initKit()
      kitInitialized.current = true
    }
  }, [])

  // Hydrate address from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem('lumensflow:address')
    if (stored) setAddress(stored)
  }, [])

  // Fetch XLM balance whenever address changes
  const refreshBalance = useCallback(async (addr) => {
    if (!addr) { setBalance('0.00'); return }
    const bal = await fetchXlmBalance(addr)
    setBalance(bal)
  }, [])

  useEffect(() => {
    refreshBalance(address)
    // Re-poll every 15 s while connected
    if (!address) return
    const t = setInterval(() => refreshBalance(address), 15_000)
    return () => clearInterval(t)
  }, [address, refreshBalance])

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    try {
      const { address: pubKey } = await StellarWalletsKit.authModal()
      setAddress(pubKey)
      window.localStorage.setItem('lumensflow:address', pubKey)
    } catch (e) {
      if (e?.code !== -1) {
        console.error('Wallet connect error:', e)
        setError(e?.message || 'Failed to connect wallet')
      }
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setBalance('0.00')
    setError(null)
    window.localStorage.removeItem('lumensflow:address')
    StellarWalletsKit.disconnect()
  }, [])

  // Returns a bare XDR string so invokeContract can use it directly
  const signTransaction = useCallback(async (xdr, opts) => {
    if (!address) throw new Error('Wallet not connected')
    const result = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      address,
      ...opts,
    })
    // StellarWalletsKit may return { signedTxXdr } or the raw xdr string
    return result?.signedTxXdr ?? result
  }, [address])

  const value = {
    address,
    isConnected: !!address,
    connect,
    disconnect,
    signTransaction,
    connecting,
    error,
    balance,
    refreshBalance: () => refreshBalance(address),
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}