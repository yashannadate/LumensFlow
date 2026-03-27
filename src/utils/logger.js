/**
 * LumensFlow — Production Logger & Monitor
 * 
 * Structured logging utility for tracking:
 * - Transaction success/failure rates
 * - RPC latency measurements
 * - User session events
 * - Error diagnostics
 * 
 * All logs are stored in-memory and can be exported via the Metrics dashboard.
 */

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }
const CURRENT_LEVEL = LOG_LEVELS.INFO

// In-memory ring buffer (keeps last N entries)
const MAX_LOG_ENTRIES = 500
const logBuffer = []

// Metrics counters
const metrics = {
  txSubmitted: 0,
  txSuccess: 0,
  txFailed: 0,
  rpcCalls: 0,
  rpcErrors: 0,
  rpcLatencySum: 0,
  rpcLatencyCount: 0,
  sessionStart: Date.now(),
  uniqueWallets: new Set(),
  events: { created: 0, withdrawal: 0, cancelled: 0 },
}

function createEntry(level, category, message, data = null) {
  return {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    data,
  }
}

function pushLog(entry) {
  if (logBuffer.length >= MAX_LOG_ENTRIES) logBuffer.shift()
  logBuffer.push(entry)

  // Also output to console in non-production
  const consoleFn = entry.level === 'ERROR' ? console.error
    : entry.level === 'WARN' ? console.warn
    : console.log
  consoleFn(`[${entry.level}] [${entry.category}] ${entry.message}`, entry.data ?? '')
}

// ─── Public API ───────────────────────────────────────────────────────────

export const logger = {
  debug(category, message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) pushLog(createEntry('DEBUG', category, message, data))
  },
  info(category, message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) pushLog(createEntry('INFO', category, message, data))
  },
  warn(category, message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) pushLog(createEntry('WARN', category, message, data))
  },
  error(category, message, data) {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) pushLog(createEntry('ERROR', category, message, data))
  },
}

// ─── Transaction Tracking ─────────────────────────────────────────────────

export function trackTransaction(type, success, txHash = null, error = null) {
  metrics.txSubmitted++
  if (success) {
    metrics.txSuccess++
    metrics.events[type] = (metrics.events[type] || 0) + 1
    logger.info('TX', `${type} succeeded`, { txHash })
  } else {
    metrics.txFailed++
    logger.error('TX', `${type} failed`, { error: error?.message || error })
  }
}

// ─── RPC Latency Tracking ─────────────────────────────────────────────────

export function trackRpcCall(startTime, success = true) {
  const latency = Date.now() - startTime
  metrics.rpcCalls++
  metrics.rpcLatencySum += latency
  metrics.rpcLatencyCount++
  if (!success) metrics.rpcErrors++
  logger.debug('RPC', `Call completed in ${latency}ms`, { success, latency })
}

// ─── Wallet Tracking ──────────────────────────────────────────────────────

export function trackWalletConnection(address) {
  if (address) {
    metrics.uniqueWallets.add(address)
    logger.info('WALLET', `Connected: ${address.slice(0, 8)}...`)
  }
}

// ─── Metrics Getters ──────────────────────────────────────────────────────

export function getMetrics() {
  return {
    transactions: {
      submitted: metrics.txSubmitted,
      success: metrics.txSuccess,
      failed: metrics.txFailed,
      successRate: metrics.txSubmitted > 0
        ? ((metrics.txSuccess / metrics.txSubmitted) * 100).toFixed(1) + '%'
        : 'N/A',
    },
    rpc: {
      totalCalls: metrics.rpcCalls,
      errors: metrics.rpcErrors,
      avgLatency: metrics.rpcLatencyCount > 0
        ? Math.round(metrics.rpcLatencySum / metrics.rpcLatencyCount) + 'ms'
        : 'N/A',
    },
    users: {
      uniqueWallets: metrics.uniqueWallets.size,
      sessionUptime: Math.round((Date.now() - metrics.sessionStart) / 1000) + 's',
    },
    events: { ...metrics.events },
  }
}

export function getLogBuffer() {
  return [...logBuffer]
}

export function getMetricsSnapshot() {
  return {
    ...getMetrics(),
    logs: getLogBuffer().slice(-50), // last 50 logs
    snapshotTime: new Date().toISOString(),
  }
}
