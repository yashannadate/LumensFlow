import {
  Contract, TransactionBuilder, BASE_FEE,
  rpc, scValToNative, Address, xdr,
} from '@stellar/stellar-sdk'

export const CONTRACT_ID        = 'CBGP4HWBJA4JXWYAU3OG533VPKUUCD5F6UQ4MZKNEIXQJWRV53BYLZAO'
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
export const RPC_URL            = 'https://soroban-testnet.stellar.org'
export const HORIZON_URL        = 'https://horizon-testnet.stellar.org'

const server = new rpc.Server(RPC_URL)

// ─── ScVal helpers ────────────────────────────────────────────────────────
const addr = (a) => Address.fromString(a).toScVal()
const u32  = (n) => xdr.ScVal.scvU32(Number(n))
const u64  = (n) => xdr.ScVal.scvU64(new xdr.Uint64(BigInt(n)))

const i128 = (n) => {
  const big = BigInt(n)
  const hi  = BigInt.asIntN(64,  big >> 64n)
  const lo  = BigInt.asUintN(64, big)
  return xdr.ScVal.scvI128(
    new xdr.Int128Parts({ hi: new xdr.Int64(hi), lo: new xdr.Uint64(lo) })
  )
}

export const xlmToStroops  = (xlm) => BigInt(Math.round(parseFloat(xlm) * 10_000_000))
export const stroopsToXlm  = (s)   => (Number(s) / 10_000_000).toFixed(7)

// ─── Transaction invoker ──────────────────────────────────────────────────
async function invokeContract(method, args, sourceAddress, signTransaction) {
  const account  = await server.getAccount(sourceAddress)
  const contract = new Contract(CONTRACT_ID)
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build()

  const prepared = await server.prepareTransaction(tx)

  // signTransaction may return { signedTxXdr } object or a bare XDR string
  const signed = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  const signedXdr = signed?.signedTxXdr ?? signed

  const submitted = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  )

  let result = submitted
  while (result.status === 'PENDING' || result.status === 'NOT_FOUND') {
    await new Promise(r => setTimeout(r, 1500))
    result = await server.getTransaction(submitted.hash)
  }
  if (result.status === 'FAILED') {
    throw new Error('Transaction failed: ' + JSON.stringify(result))
  }
  // Attach the tx hash to the result for UI display
  result.txHash = submitted.hash
  return result
}

// ─── Simulator for read-only calls ───────────────────────────────────────
async function simulateContract(method, args, sourceAddress) {
  const source  = sourceAddress || 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'
  const account = await server.getAccount(source)
  const contract = new Contract(CONTRACT_ID)
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build()

  const result = await server.simulateTransaction(tx)
  if (rpc.Api.isSimulationError(result)) {
    throw new Error('Simulation failed: ' + result.error)
  }
  return scValToNative(result.result.retval)
}

// ─── Stream parser ────────────────────────────────────────────────────────
// Handles named-field objects returned by scValToNative.
// The contract's StreamStatus enum is serialised to its variant name string.
function parseStream(raw) {
  if (!raw) return null

  // Resolve status from enum variant string (Active / Cancelled / Completed)
  const rawStatus = raw.status ?? raw[8]
  let status = 'Active'
  if (typeof rawStatus === 'string') {
    status = rawStatus
  } else if (typeof rawStatus === 'number') {
    status = ({ 0: 'Active', 1: 'Cancelled', 2: 'Completed' })[rawStatus] ?? 'Active'
  } else if (rawStatus && typeof rawStatus === 'object') {
    // Soroban may send { Active: undefined } style
    status = Object.keys(rawStatus)[0] ?? 'Active'
  }

  return {
    id:               Number(raw.id               ?? raw[0] ?? 0),
    sender:           String(raw.sender            ?? raw[1] ?? ''),
    receiver:         String(raw.receiver          ?? raw[2] ?? ''),
    deposit_amount:   BigInt(raw.deposit_amount    ?? raw[3] ?? 0),
    flow_rate:        BigInt(raw.flow_rate         ?? raw[4] ?? 0),
    start_time:       BigInt(raw.start_time        ?? raw[5] ?? 0),
    end_time:         BigInt(raw.end_time          ?? raw[6] ?? 0),
    withdrawn_amount: BigInt(raw.withdrawn_amount  ?? raw[7] ?? 0),
    status,
    // Backward-compat field so components that check is_active still work
    is_active: status === 'Active',
  }
}

// ─── WRITE functions ──────────────────────────────────────────────────────
export async function createStream(
  senderAddress, receiverAddress,
  amountXLM, durationSeconds, signTransaction
) {
  const stroops = xlmToStroops(amountXLM)
  return invokeContract(
    'create_stream',
    [addr(senderAddress), addr(receiverAddress), i128(stroops), u64(durationSeconds)],
    senderAddress,
    signTransaction,
  )
}

export async function withdraw(streamId, receiverAddress, signTransaction) {
  return invokeContract(
    'withdraw',
    [u32(streamId), addr(receiverAddress)],
    receiverAddress,
    signTransaction,
  )
}

export async function cancelStream(streamId, senderAddress, signTransaction) {
  return invokeContract(
    'cancel_stream',
    [u32(streamId), addr(senderAddress)],
    senderAddress,
    signTransaction,
  )
}

// ─── READ functions ───────────────────────────────────────────────────────
export async function getStream(streamId, sourceAddress) {
  try {
    const raw = await simulateContract('get_stream', [u32(streamId)], sourceAddress)
    return parseStream(raw)
  } catch {
    return null
  }
}

export async function getWithdrawableAmount(streamId, sourceAddress) {
  try {
    return await simulateContract('withdrawable_amount', [u32(streamId)], sourceAddress)
  } catch {
    return 0n
  }
}

export async function getStreamsForUser(userAddress) {
  const ids = await simulateContract(
    'get_streams_for_user',
    [addr(userAddress)],
    userAddress,
  )
  if (!ids || ids.length === 0) return []
  const streams = await Promise.all(
    ids.map(id => getStream(Number(id), userAddress))
  )
  return streams.filter(Boolean)
}

// ─── Wallet balance (Horizon API) ─────────────────────────────────────────
export async function fetchXlmBalance(address) {
  try {
    const resp = await fetch(`${HORIZON_URL}/accounts/${address}`)
    if (!resp.ok) return '0.00'
    const data = await resp.json()
    const native = data.balances?.find(b => b.asset_type === 'native')
    return native ? parseFloat(native.balance).toFixed(2) : '0.00'
  } catch {
    return '0.00'
  }
}

// ─── Error mapper ─────────────────────────────────────────────────────────
export function getErrorMessage(error) {
  const msg = error?.message || ''
  if (msg.includes('#2') || msg.includes('NotInitialized'))
    return 'Contract not initialized'
  if (msg.includes('#3') || msg.includes('NotActive'))
    return 'Stream is not active'
  if (msg.includes('#4') || msg.includes('NotReceiver'))
    return 'Only the receiver can withdraw'
  if (msg.includes('#5') || msg.includes('NotSender'))
    return 'Only the sender can cancel'
  if (msg.includes('#6') || msg.includes('NothingToWithdraw'))
    return 'Nothing to withdraw yet — wait for funds to stream'
  if (msg.includes('#7') || msg.includes('InvalidDeposit'))
    return 'Deposit amount must be greater than 0'
  if (msg.includes('#8') || msg.includes('InvalidDuration'))
    return 'Minimum duration is 60 seconds'
  if (msg.includes('#9') || msg.includes('SenderIsReceiver'))
    return 'Sender and receiver cannot be the same address'
  if (msg.includes('#10') || msg.includes('FlowRateZero'))
    return 'Amount too small for this duration. Increase amount or decrease duration.'
  if (msg.includes('#11') || msg.includes('StreamNotFound'))
    return 'Stream not found on-chain'
  return msg || 'Transaction failed. Please try again.'
}

// ─── Utilities ────────────────────────────────────────────────────────────
export function truncateAddress(address) {
  if (!address || address.length < 12) return address || ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}