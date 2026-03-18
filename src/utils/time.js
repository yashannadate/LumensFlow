// All functions must mirror contract math exactly

export const STROOPS_PER_XLM = 10_000_000

export function calculateFlowRate(depositStroops, durationSeconds) {
  const perSecond = depositStroops / durationSeconds
  const perHour = perSecond * 3600
  const perDay = perSecond * 86400
  return { perSecond, perHour, perDay }
}

export function calculateWithdrawable(stream, nowSeconds) {
  // Mirror contract _withdrawable() — uses high-precision formula
  const status = stream.status ?? (stream.is_active ? 'Active' : 'Cancelled')
  if (status !== 'Active') return 0n

  const start    = Number(stream.start_time)
  const end      = Number(stream.end_time)
  const deposit  = BigInt(stream.deposit_amount)
  const withdrawn = BigInt(stream.withdrawn_amount)

  const duration = BigInt(end - start)
  if (duration <= 0n) return 0n

  const clampedNow = Math.min(nowSeconds, end)
  const elapsed    = BigInt(Math.max(0, clampedNow - start))
  if (elapsed === 0n) return 0n

  // Precise: deposit * elapsed / duration  (mirrors contract exactly)
  let streamed = (deposit * elapsed) / duration
  if (streamed > deposit) streamed = deposit

  const withdrawable = streamed - withdrawn
  return withdrawable < 0n ? 0n : withdrawable
}

export function calculateProgress(stream, nowSeconds) {
  const total = Number(stream.end_time) - Number(stream.start_time)
  const elapsed = Math.min(nowSeconds, Number(stream.end_time))
                  - Number(stream.start_time)
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

export function getStreamStatus(stream, nowSeconds) {
  // Prefer the explicit status field from contract enum
  const s = stream.status
  if (s === 'Cancelled') return 'Cancelled'
  if (s === 'Completed') return 'Completed'
  if (s === 'Paused')    return 'Paused'
  // If status is 'Active' (or not present), check if time has elapsed
  if (nowSeconds >= Number(stream.end_time)) return 'Completed'
  // Backward compat: if only is_active bool is present
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

  if (!parts.length) {
    return `${s}s`
  }

  return parts.join(' ')
}

export function formatStroops(stroops) {
  // Convert stroops to XLM: stroops / 10_000_000
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