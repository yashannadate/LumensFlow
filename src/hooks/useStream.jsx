import { useState, useCallback } from 'react'
import { useWallet } from './useWallet'
import {
  createStream,
  withdraw,
  cancelStream,
  getStream,
  getWithdrawableAmount,
  getStreamsForUser,
  getErrorMessage,
} from '../utils/stellar.js'

export function useStream() {
  const { address, signTransaction } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [txHash,  setTxHash]  = useState(null)

  const handleAction = useCallback(async (actionFn) => {
    setLoading(true)
    setError(null)
    setTxHash(null)
    try {
      const result = await actionFn()
      if (result?.txHash) setTxHash(result.txHash)
      return result
    } catch (e) {
      console.error('Stream action failed:', e)
      setError(getErrorMessage(e))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createAction = useCallback((receiver, amountXLM, durationSec) =>
    handleAction(() =>
      createStream(address, receiver, amountXLM, durationSec, signTransaction)
    ),
  [address, signTransaction, handleAction])

  const withdrawAction = useCallback((streamId) =>
    handleAction(() => withdraw(Number(streamId), address, signTransaction)),
  [address, signTransaction, handleAction])

  const cancelAction = useCallback((streamId) =>
    handleAction(() => cancelStream(Number(streamId), address, signTransaction)),
  [address, signTransaction, handleAction])

  const fetchStream = useCallback(async (streamId) => {
    try { return await getStream(streamId, address) } catch { return null }
  }, [address])

  const fetchWithdrawable = useCallback(async (streamId) => {
    try { return await getWithdrawableAmount(streamId, address) } catch { return 0n }
  }, [address])

  const fetchUserStreams = useCallback(async () => {
    if (!address) return []
    try { return await getStreamsForUser(address) } catch { return [] }
  }, [address])

  return {
    loading,
    error,
    txHash,
    create:          createAction,
    withdraw:        withdrawAction,
    cancel:          cancelAction,
    fetchStream,
    fetchWithdrawable,
    fetchUserStreams,
  }
}
