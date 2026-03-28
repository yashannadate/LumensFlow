/**
 * LumensFlow — Stream History Indexer
 *
 * Queries Horizon REST API to build a transaction history for
 * the LumensFlow contract. Provides search, filter, and pagination
 * capabilities for the History page.
 *
 * Data Sources:
 *  - Horizon /transactions endpoint (filtered by contract account)
 *  - Local stream data from getStreamsForUser (Soroban RPC)
 *  - In-memory cache to reduce redundant API calls
 */

import { HORIZON_URL, CONTRACT_ID } from './stellar.js'
import { logger } from './logger.js'

// ─── Cache ─────────────────────────────────────────────────────────────────
const cache = {
  transactions: [],
  lastFetched: 0,
  TTL: 30_000, // 30 second cache
}

// ─── Fetch contract transactions from Horizon ──────────────────────────────
/**
 * Fetches recent transactions for the contract from Horizon.
 * Returns an array of normalised transaction objects.
 *
 * @param {Object} options
 * @param {number} options.limit - Max results (default 50)
 * @param {string} options.cursor - Pagination cursor
 * @param {string} options.order - 'asc' or 'desc' (default 'desc')
 * @returns {Promise<{records: Array, nextCursor: string|null}>}
 */
export async function fetchContractTransactions({ limit = 50, cursor = '', order = 'desc' } = {}) {
  try {
    const now = Date.now()
    if (!cursor && cache.transactions.length > 0 && now - cache.lastFetched < cache.TTL) {
      logger.info('INDEXER', 'Returning cached transactions', { count: cache.transactions.length })
      return { records: cache.transactions, nextCursor: null }
    }

    const params = new URLSearchParams({
      limit: String(limit),
      order,
      include_failed: 'false',
    })
    if (cursor) params.set('cursor', cursor)

    const url = `${HORIZON_URL}/accounts/${CONTRACT_ID}/transactions?${params}`
    logger.info('INDEXER', 'Fetching from Horizon', { url })

    const res = await fetch(url)
    if (!res.ok) {
      // Contract account may not exist on Horizon — fallback gracefully
      if (res.status === 404) {
        logger.warn('INDEXER', 'Contract account not found on Horizon, returning empty')
        return { records: [], nextCursor: null }
      }
      throw new Error(`Horizon error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const records = (data?._embedded?.records || []).map(normalizeTx)

    // Update cache for first page
    if (!cursor) {
      cache.transactions = records
      cache.lastFetched = Date.now()
    }

    // Extract next cursor
    const links = data?._links?.next?.href || ''
    const nextCursor = links ? new URL(links, HORIZON_URL).searchParams.get('cursor') : null

    return { records, nextCursor }
  } catch (err) {
    logger.error('INDEXER', 'Failed to fetch contract transactions', { error: err.message })
    return { records: [], nextCursor: null }
  }
}

// ─── Normalize a Horizon transaction record ────────────────────────────────
function normalizeTx(tx) {
  return {
    id: tx.id,
    hash: tx.hash,
    createdAt: tx.created_at,
    sourceAccount: tx.source_account,
    sourceAccountTruncated: truncateAddress(tx.source_account),
    fee: tx.fee_charged,
    feeXLM: (parseInt(tx.fee_charged || '0') / 10_000_000).toFixed(7),
    operationCount: tx.operation_count,
    memo: tx.memo || null,
    successful: tx.successful,
    ledger: tx.ledger,
    envelopeXdr: tx.envelope_xdr,
    resultXdr: tx.result_xdr,
    feeBump: !!tx.fee_account && tx.fee_account !== tx.source_account,
    feeAccount: tx.fee_account || tx.source_account,
    pagingToken: tx.paging_token,
  }
}

// ─── Fetch operations for a specific transaction ───────────────────────────
export async function fetchTransactionOperations(txHash) {
  try {
    const res = await fetch(`${HORIZON_URL}/transactions/${txHash}/operations?limit=10`)
    if (!res.ok) return []
    const data = await res.json()
    return (data?._embedded?.records || []).map(op => ({
      id: op.id,
      type: op.type,
      typeI: op.type_i,
      sourceAccount: op.source_account,
      createdAt: op.created_at,
      // Soroban-specific fields
      function: op.function || null,
      parameters: op.parameters || null,
    }))
  } catch (err) {
    logger.error('INDEXER', 'Failed to fetch tx operations', { txHash, error: err.message })
    return []
  }
}

// ─── Build enriched stream history ─────────────────────────────────────────
/**
 * Combines on-chain Horizon data with Soroban stream data to build
 * an enriched, filterable stream history for a user.
 *
 * @param {Array} streams - Array of stream objects from getStreamsForUser
 * @param {string} userAddress - The connected wallet address
 * @returns {Array} Enriched history items
 */
export function buildStreamHistory(streams, userAddress) {
  if (!streams || !Array.isArray(streams)) return []

  return streams.map(stream => {
    const depositXLM = (Number(stream.deposit_amount) / 1e7).toFixed(4)
    const withdrawnXLM = (Number(stream.withdrawn_amount || 0) / 1e7).toFixed(4)
    const startDate = new Date(Number(stream.start_time) * 1000)
    const endDate = new Date(Number(stream.end_time) * 1000)
    const now = Math.floor(Date.now() / 1000)
    const isActive = stream.status === 'Active' && now < Number(stream.end_time)
    const isCompleted = stream.status === 'Active' && now >= Number(stream.end_time)
    const isCancelled = stream.status === 'Cancelled'

    const role = stream.sender === userAddress ? 'sender' : 'receiver'

    return {
      streamId: stream.stream_id ?? stream.id,
      sender: stream.sender,
      senderTruncated: truncateAddress(stream.sender),
      receiver: stream.receiver,
      receiverTruncated: truncateAddress(stream.receiver),
      depositXLM,
      withdrawnXLM,
      startDate: startDate.toLocaleDateString(),
      startTime: startDate.toLocaleTimeString(),
      endDate: endDate.toLocaleDateString(),
      endTime: endDate.toLocaleTimeString(),
      startTimestamp: Number(stream.start_time),
      endTimestamp: Number(stream.end_time),
      status: isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending',
      role,
      ratePerSecond: (Number(stream.deposit_amount) / 1e7 / (Number(stream.end_time) - Number(stream.start_time))).toFixed(7),
      rawStream: stream,
    }
  }).sort((a, b) => b.startTimestamp - a.startTimestamp) // newest first
}

// ─── Search & Filter ───────────────────────────────────────────────────────
/**
 * Filters history items by search query and status filter.
 *
 * @param {Array} items - Enriched history items
 * @param {string} query - Search text (matches addresses, IDs)
 * @param {string} statusFilter - 'all' | 'Active' | 'Completed' | 'Cancelled'
 * @param {string} roleFilter - 'all' | 'sender' | 'receiver'
 * @returns {Array} Filtered items
 */
export function filterHistory(items, query = '', statusFilter = 'all', roleFilter = 'all') {
  let filtered = items

  if (statusFilter !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter)
  }

  if (roleFilter !== 'all') {
    filtered = filtered.filter(item => item.role === roleFilter)
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim()
    filtered = filtered.filter(item =>
      item.sender?.toLowerCase().includes(q) ||
      item.receiver?.toLowerCase().includes(q) ||
      String(item.streamId).includes(q) ||
      item.status.toLowerCase().includes(q)
    )
  }

  return filtered
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr || ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

/**
 * Get aggregate stats from history data.
 */
export function getHistoryStats(items) {
  const total = items.length
  const active = items.filter(i => i.status === 'Active').length
  const completed = items.filter(i => i.status === 'Completed').length
  const cancelled = items.filter(i => i.status === 'Cancelled').length
  const totalVolume = items.reduce((sum, i) => sum + parseFloat(i.depositXLM), 0)
  const uniqueAddresses = new Set()
  items.forEach(i => { uniqueAddresses.add(i.sender); uniqueAddresses.add(i.receiver) })

  return {
    total,
    active,
    completed,
    cancelled,
    totalVolumeXLM: totalVolume.toFixed(2),
    uniqueParticipants: uniqueAddresses.size,
  }
}
