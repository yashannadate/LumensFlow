// All functions must mirror contract math exactly

export const STROOPS_PER_XLM = 10_000_000

export function calculateFlowRate(depositStroops, durationSeconds) {
  const perSecond = depositStroops / durationSeconds
  const perHour = perSecond * 3600
  const perDay = perSecond * 86400
  return { perSecond, perHour, perDay }
}

export function calculateWithdrawable(stream, nowSeconds) {
  // Mirror contract _withdrawable() with fix for Completed streams
  // Contract returns 0 when is_active=false BUT funds still claimable
  // So we calculate locally for both Active and Completed

  const status = getStreamStatus(stream, nowSeconds)

  // Cancelled = nothing to withdraw (contract already settled)
  if (status === 'Cancelled') return 0n

  const start = BigInt(stream.start_time)
  const end = BigInt(stream.end_time)
  const deposit = BigInt(stream.deposit_amount)
  const withdrawn = BigInt(stream.withdrawn_amount)

  const duration = end - start
  if (duration <= 0n) return 0n

  // For Completed: use full duration (end - start)
  // For Active: use clamped current time
  const nowBig = BigInt(Math.floor(nowSeconds))
  const clampedNow = nowBig > end ? end : nowBig
  const elapsed = clampedNow > start ? clampedNow - start : 0n

  if (elapsed === 0n) return 0n

  // Precise: deposit * elapsed / duration (mirrors contract exactly)
  let streamed = (deposit * elapsed) / duration
  if (streamed > deposit) streamed = deposit

  const withdrawable = streamed - withdrawn
  return withdrawable < 0n ? 0n : withdrawable
}

export function calculateProgress(stream, nowSeconds) {
  const status = getStreamStatus(stream, nowSeconds)

  // Completed always 100%
  if (status === 'Completed') return 100

  // Cancelled — show how far it got
  if (status === 'Cancelled') {
    const total = Number(stream.end_time) - Number(stream.start_time)
    if (total <= 0) return 0
    const withdrawn = Number(stream.withdrawn_amount)
    const deposit = Number(stream.deposit_amount)
    if (deposit <= 0) return 0
    return Math.min(100, Math.max(0, (withdrawn / deposit) * 100))
  }

  // Active — time-based progress
  const total = Number(stream.end_time) - Number(stream.start_time)
  const elapsed = Math.min(nowSeconds, Number(stream.end_time))
    - Number(stream.start_time)
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

export function getStreamStatus(stream, nowSeconds) {
  // Prefer explicit status field from contract enum
  const s = stream.status
  if (s === 'Cancelled') return 'Cancelled'
  if (s === 'Completed') return 'Completed'
  if (s === 'Paused') return 'Paused'

  // If Active or missing — check if time elapsed
  if (nowSeconds >= Number(stream.end_time)) return 'Completed'

  // Backward compat: only is_active bool present
  if (stream.is_active === false && !s) return 'Cancelled'

  return 'Active'
}

export function formatDuration(seconds) {
  const s = Number(seconds)
  if (s <= 0) return '0s'

  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)

  const parts = []
  if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`)
  if (hours) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`)
  if (minutes) parts.push(`${minutes} min`)

  if (!parts.length) return `${s}s`
  return parts.join(' ')
}

export function formatStroops(stroops) {
  return (Number(stroops) / STROOPS_PER_XLM).toFixed(7)
}

export function xlmToStroops(xlm) {
  return BigInt(Math.round(parseFloat(xlm) * STROOPS_PER_XLM))
}

export function formatAddress(address) {
  if (!address || address.length <= 10) return address || ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}