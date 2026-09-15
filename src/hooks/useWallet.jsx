import {
  createContext, useContext, useState,
  useCallback, useEffect, useRef,
} from 'react'
import { StellarWalletsKit, KitEventType } from '@creit.tech/stellar-wallets-kit'
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo'
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import { RabetModule } from '@creit.tech/stellar-wallets-kit/modules/rabet'
import { HanaModule } from '@creit.tech/stellar-wallets-kit/modules/hana'
import { WalletConnectModule, WalletConnectTargetChain } from '@creit.tech/stellar-wallets-kit/modules/wallet-connect'
import { WatchWalletChanges } from '@stellar/freighter-api'
import { fetchXlmBalance } from '../utils/stellar.js'

const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
const WalletContext = createContext(null)

function initKit() {
  StellarWalletsKit.init({
    modules: [
      new FreighterModule(),
      new xBullModule(),
      new AlbedoModule(),
      new LobstrModule(),
      new RabetModule(),
      new HanaModule(),
      new WalletConnectModule({
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '84b82ab35c24d9c4fb2070fca68340d2',
        metadata: {
          name: 'LumensFlow',
          description: 'The Future of Programmable Cash Flows on Stellar',
          url: window.location.origin,
          icons: [window.location.origin + '/favicon.png']
        },
        allowedChains: [WalletConnectTargetChain.TESTNET]
      })
    ],
    network: NETWORK_PASSPHRASE,
    authModal: {
      hideUnsupportedWallets: false,
      showInstallLabel: true
    }
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

  // Real-time multi-account & wallet state listener
  useEffect(() => {
    let unsubState
    let unsubDisconnect
    try {
      unsubState = StellarWalletsKit.on(KitEventType.STATE_UPDATED, ({ payload }) => {
        if (payload?.address) {
          setAddress(payload.address)
          window.localStorage.setItem('lumensflow:address', payload.address)
        }
      })
    } catch (e) {
      console.warn('Could not subscribe to STATE_UPDATED:', e)
    }

    try {
      unsubDisconnect = StellarWalletsKit.on(KitEventType.DISCONNECT, () => {
        setAddress(null)
        setBalance('0.00')
        window.localStorage.removeItem('lumensflow:address')
      })
    } catch (e) {
      console.warn('Could not subscribe to DISCONNECT:', e)
    }

    // Freighter real-time active account watcher
    let watcher
    try {
      watcher = new WatchWalletChanges(2000)
      watcher.watch(({ address: newAddr }) => {
        if (newAddr) {
          setAddress(prev => {
            if (prev && prev !== newAddr) {
              window.localStorage.setItem('lumensflow:address', newAddr)
              return newAddr
            }
            return prev
          })
        }
      })
    } catch (e) {
      console.warn('Could not start WatchWalletChanges:', e)
    }

    return () => {
      if (typeof unsubState === 'function') unsubState()
      if (typeof unsubDisconnect === 'function') unsubDisconnect()
      if (watcher && typeof watcher.stop === 'function') watcher.stop()
    }
  }, [])

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    try {
      const res = await StellarWalletsKit.authModal()
      if (res?.address) {
        setAddress(res.address)
        window.localStorage.setItem('lumensflow:address', res.address)
        refreshBalance(res.address)
        return true
      }
      return false
    } catch (e) {
      if (e?.code !== -1) {
        console.error('Wallet connect error:', e)
        setError(e?.message || 'Failed to connect wallet')
      }
      return false
    } finally {
      setConnecting(false)
    }
  }, [refreshBalance])

  const disconnect = useCallback(async () => {
    setAddress(null)
    setBalance('0.00')
    setError(null)
    window.localStorage.removeItem('lumensflow:address')
    try {
      await StellarWalletsKit.disconnect()
    } catch (e) {
      console.warn('StellarWalletsKit disconnect:', e)
    }
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