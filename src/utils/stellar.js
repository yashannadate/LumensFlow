import {
  Contract, TransactionBuilder, BASE_FEE,
  rpc, scValToNative, nativeToScVal, Address, xdr,
} from '@stellar/stellar-sdk'

export const CONTRACT_ID = 'CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR'
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
// XLM Stellar Asset Contract on Testnet (56-char SAC address)
export const XLM_TOKEN_CONTRACT = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'

const server = new rpc.Server(RPC_URL)

// ─── ScVal helpers ────────────────────────────────────────────────────────
const addr = (a) => nativeToScVal(a, { type: 'address' })
const u32 = (n) => nativeToScVal(Number(n), { type: 'u32' })
const u64 = (n) => nativeToScVal(BigInt(n), { type: 'u64' })
const i128 = (n) => nativeToScVal(BigInt(n), { type: 'i128' })

export const xlmToStroops = (xlm) => BigInt(Math.round(parseFloat(xlm) * 10_000_000))
export const stroopsToXlm = (s) => (Number(s) / 10_000_000).toFixed(7)

// ─── Transaction invoker ──────────────────────────────────────────────────
async function invokeContract(method, args, sourceAddress, signTransaction) {
  const account = await server.getAccount(sourceAddress)
  const contract = new Contract(CONTRACT_ID)
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build()

  const prepared = await server.prepareTransaction(tx)
  const signed = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  const signedXdr = signed?.signedTxXdr ?? signed

  const submitted = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  )

  if (submitted.status === 'ERROR') {
    throw new Error('Transaction submission failed: ' + JSON.stringify(submitted))
  }

  let result = submitted
  while (result.status === 'PENDING' || result.status === 'NOT_FOUND') {
    await new Promise(r => setTimeout(r, 1500))
    try {
      result = await server.getTransaction(submitted.hash)
    } catch (e) {
      if (e?.message?.includes('Bad union switch')) {
        console.warn('Swallowed SDK XDR parsing bug for confirmed transaction:', e)
        result = { status: 'SUCCESS', hash: submitted.hash }
        break
      }
      throw e
    }
  }

  if (result.status === 'FAILED') {
    throw new Error('Transaction failed on-chain: ' + JSON.stringify(result))
  }

  // Attach the tx hash to the result for UI display
  result.txHash = submitted.hash
  return result
}

// ─── Simulator for read-only calls ───────────────────────────────────────
async function simulateContract(method, args, sourceAddress) {
  const source = sourceAddress || 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN'
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
    id: Number(raw.id ?? raw[0] ?? 0),
    sender: String(raw.sender ?? raw[1] ?? ''),
    receiver: String(raw.receiver ?? raw[2] ?? ''),
    deposit_amount: BigInt(raw.deposit_amount ?? raw[3] ?? 0),
    flow_rate: BigInt(raw.flow_rate ?? raw[4] ?? 0),
    start_time: BigInt(raw.start_time ?? raw[5] ?? 0),
    end_time: BigInt(raw.end_time ?? raw[6] ?? 0),
    withdrawn_amount: BigInt(raw.withdrawn_amount ?? raw[7] ?? 0),
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
    const rawPromise = simulateContract('get_stream', [u32(streamId)], sourceAddress)
    const withdrawablePromise = simulateContract('withdrawable_amount', [u32(streamId)], sourceAddress)

    const [raw, wAmount] = await Promise.all([
      rawPromise.catch(() => null),
      withdrawablePromise.catch(() => 0n)
    ])

    const stream = parseStream(raw)
    if (stream) {
      stream.contract_withdrawable = BigInt(wAmount || 0n)
    }
    return stream
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

// ─── Contract Event Fetcher ───────────────────────────────────────────────
// Fetches and normalises Soroban contract events for the activity feed.
export async function fetchContractEvents(limit = 100) {
  try {
    const latestLedger = await server.getLatestLedger()
    let startLedger = Math.max(1, latestLedger.sequence - 10000)

    let result = await server.getEvents({
      startLedger,
      filters: [{ type: 'contract', contractIds: [CONTRACT_ID] }],
      limit,
    }).catch(() => null)

    if (!result || !result.events?.length) {
      startLedger = Math.max(1, latestLedger.sequence - 20000)
      result = await server.getEvents({
        startLedger,
        filters: [{ type: 'contract', contractIds: [CONTRACT_ID] }],
        limit,
      }).catch(() => null)
    }

    const eventsCount = result?.events?.length || 0
    console.log('Total events fetched:', eventsCount)

    if (!eventsCount) {
      console.log('No contract events found — check CONTRACT_ID or ledger range')
      return []
    }

    const activities = result.events
      .map((ev) => {
        try {
          // Derive event type from the first topic
          const topics = ev.topic?.map((t) => {
            try { return scValToNative(t) } catch { return null }
          }) ?? []

          const firstTopic = String(topics[0] ?? '')
          let type = 'unknown'
          if (firstTopic.includes('created') || firstTopic.includes('create'))  type = 'created'
          else if (firstTopic.includes('withdraw'))                               type = 'withdrawal'
          else if (firstTopic.includes('cancel'))                                 type = 'cancelled'
          else return null // skip unknown events

          // Parse payload value
          let payload = null
          try { payload = scValToNative(ev.value) } catch { /* ignore */ }

          // Extract fields based on contract event topologies
          let sender = ''
          let receiver = ''
          let rawAmount = 0
          let flowRateRaw = 0
          const isMap = payload && typeof payload === 'object' && !Array.isArray(payload)

          if (type === 'created') {
            sender      = String(isMap ? (payload.sender || '') : (payload?.[0] || ''))
            receiver    = String(isMap ? (payload.receiver || '') : (payload?.[1] || ''))
            rawAmount   = isMap ? (payload.deposit_amount || 0) : (payload?.[2] || 0)
            flowRateRaw = isMap ? (payload.flow_rate || 0) : (payload?.[3] || 0)
          } else if (type === 'withdrawal') {
            receiver    = String(isMap ? (payload.receiver || '') : (payload?.[0] || ''))
            rawAmount   = isMap ? (payload.withdrawable || 0) : (payload?.[1] || 0)
          } else if (type === 'cancelled') {
            sender      = String(isMap ? (payload.sender || '') : (payload || ''))
          }

          const amountXlm    = rawAmount ? (Number(rawAmount) / 1e7).toFixed(4) : null
          const streamId     = Number(topics[1] ?? 0)

          const flowRate    = flowRateRaw ? (Number(flowRateRaw) / 1e7).toFixed(7) : null

          const durationRaw = payload?.duration ?? payload?.end_time ?? 0
          const duration    = durationRaw > 86400
            ? `${Math.floor(Number(durationRaw) / 86400)}d`
            : durationRaw > 3600
              ? `${Math.floor(Number(durationRaw) / 3600)}h`
              : durationRaw > 0
                ? `${Math.floor(Number(durationRaw) / 60)}m`
                : null

          return {
            id:        ev.id ?? `${ev.ledger}-${ev.ledgerClosedAt}`,
            type,
            txHash:    ev.txHash ?? '',
            ledger:    ev.ledger ?? 0,
            timestamp: ev.ledgerClosedAt ? new Date(ev.ledgerClosedAt).getTime() : Date.now(),
            sender,
            receiver,
            streamId,
            amountXlm,
            flowRate,
            duration,
          }
        } catch {
          return null
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp)

    console.log('Parsed events count:', activities.length)
    const uniqueUsersCount = new Set(activities.flatMap(a => [a.sender, a.receiver]).filter(Boolean)).size
    console.log('Unique users count from events:', uniqueUsersCount)

    return activities
  } catch (err) {
    console.warn('fetchContractEvents failed:', err)
    return []
  }
}