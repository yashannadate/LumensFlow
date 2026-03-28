# LumensFlow — Technical Documentation

> **Version:** 1.0 · **Network:** Stellar Testnet · **Stack:** Rust + Soroban + React + Vite

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Smart Contract Reference](#smart-contract-reference)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Indexing Layer](#data-indexing-layer)
5. [Fee Sponsorship System](#fee-sponsorship-system)
6. [API Reference](#api-reference)
7. [Security Model](#security-model)
8. [Deployment](#deployment)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Known Limitations](#known-limitations)

---

## Architecture Overview
```
┌─────────────────────────────────────────────────────────┐
│                  React / Vite Frontend                  │
│        (Vanilla CSS · Stellar Wallets Kit)              │
└────────┬──────────────┬──────────────┬──────────────────┘
         │              │              │
   Soroban RPC    Soroban RPC    Horizon REST
         │              │              │
┌────────▼──────────────▼──┐  ┌────────▼─────────────────┐
│   LumensFlow Contract    │  │    Stellar Testnet        │
│   (Soroban / Rust)       │  │    (Account / Ledger)     │
│                          │  │                           │
│  create_stream()         │  │  Transaction History      │
│  withdraw()   ───────────┼──►  XLM Transfers            │
│  cancel_stream()         │  │  Fee Bump Txns            │
│  get_stream()            │  │                           │
└──────────────────────────┘  └───────────────────────────┘
```

**Key Constants:**

| Constant | Value |
|----------|-------|
| Contract ID | `CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR` |
| Network Passphrase | `Test SDF Network ; September 2015` |
| Soroban RPC | `https://soroban-testnet.stellar.org` |
| Horizon URL | `https://horizon-testnet.stellar.org` |
| Sponsor Key | `GB6B6QEJFY4HAKATRO6MI77WDZ66W4FFPJN6AYLISJEHTLXYFPHQFFTV` |

---

## Smart Contract Reference

**Language:** Rust · **SDK:** soroban-sdk · **Tests:** 8/8 passing

### Data Structures
```rust
pub struct Stream {
    pub sender: Address,
    pub receiver: Address,
    pub deposit_amount: i128,    // in stroops (1 XLM = 10,000,000)
    pub withdrawn_amount: i128,
    pub start_time: u64,         // Unix timestamp (ledger time)
    pub end_time: u64,
    pub status: StreamStatus,
}

pub enum StreamStatus {
    Active,
    Cancelled,
}
```

### Contract Functions

#### `create_stream(env, receiver, amount, duration)`
Locks XLM into escrow and initialises a new stream.

| Parameter | Type | Description |
|-----------|------|-------------|
| `receiver` | `Address` | Recipient wallet address |
| `amount` | `i128` | Total deposit in stroops |
| `duration` | `u64` | Stream length in seconds |

- Requires sender authorisation
- Transfers XLM from sender to contract
- Stores stream in contract storage
- Returns `stream_id: u32`

#### `withdraw(env, stream_id)`
Allows receiver to pull accrued funds.
```
accrued = (elapsed_seconds / total_seconds) × deposit_amount - withdrawn_amount
```

- Only callable by stream receiver
- Calculates precisely accrued amount using ledger timestamp
- Updates `withdrawn_amount` in storage
- Transfers XLM to receiver

#### `cancel_stream(env, stream_id)`
Terminates stream and distributes funds.

- Only callable by stream sender
- Sends accrued amount to receiver
- Refunds remainder to sender
- Sets `status = Cancelled`

#### `get_stream(env, stream_id)`
Returns full stream state. Read-only.

---

## Frontend Architecture

**Stack:** React 19 · Vite 8 · Vanilla CSS · lucide-react

### Directory Structure
```
src/
├── components/        # Reusable UI components
│   ├── AppHeader.jsx  # Authenticated app header
│   ├── Sidebar.jsx    # Dashboard navigation
│   ├── StreamCard.jsx # Stream display card
│   ├── GaslessBadge.jsx # Fee sponsorship UI
│   └── Toast.jsx      # Notification system
├── hooks/
│   ├── useWallet.jsx  # Wallet connection (Stellar Wallets Kit)
│   ├── useStream.jsx  # Stream CRUD operations
│   └── useActivityFeed.jsx # Real-time activity
├── pages/
│   ├── Dashboard.jsx  # Main dashboard
│   ├── CreateStream.jsx # Stream creation form
│   ├── History.jsx    # Indexed stream history
│   ├── Metrics.jsx    # Analytics dashboard
│   ├── StreamDetails.jsx # Individual stream view
│   └── Docs.jsx       # Technical documentation
└── utils/
    ├── stellar.js     # Soroban RPC interaction layer
    ├── indexer.js     # Stream history indexing
    ├── sponsorService.js # Fee bump transactions
    ├── logger.js      # Production logging
    └── time.js        # Time formatting utilities
```

### Design System

| Token | Value |
|-------|-------|
| Primary | `#8b5cf6` (purple) |
| Accent | `#86EE1E` (neon green) |
| Background | `#06060d` |
| Card BG | `rgba(255,255,255,0.03)` |
| Border | `rgba(255,255,255,0.08)` |
| Font Brand | Unbounded |
| Font Body | DM Sans |
| Font Mono | IBM Plex Mono |

---

## Data Indexing Layer

**File:** `src/utils/indexer.js`

The indexer queries Horizon REST API to build an enriched stream history for connected wallets.

### Key Functions
```js
// Fetch paginated transactions from Horizon
fetchContractTransactions({ limit, cursor, order })

// Build enriched history from raw stream data
buildStreamHistory(streams, userAddress)

// Filter history by status, role, search query
filterHistory(items, query, statusFilter, roleFilter)

// Aggregate stats from history data
getHistoryStats(items)
```

### Cache Strategy

- In-memory cache with 30-second TTL
- Cache invalidated on manual re-index
- Cursor-based pagination for large histories

### Normalised Transaction Object
```js
{
  id, hash, createdAt, sourceAccount,
  fee, feeXLM, operationCount,
  successful, ledger, feeBump,
  feeAccount, pagingToken
}
```

---

## Fee Sponsorship System

**File:** `src/utils/sponsorService.js`

LumensFlow uses Stellar's native **Fee Bump Transactions** (SEP-0015) to sponsor all user transaction fees.

### Flow
```
User signs inner transaction (0 fee)
         ↓
sponsorService wraps with FeeBumpTransaction
         ↓
Sponsor account pays the fee
         ↓
Transaction submitted to Soroban RPC
```

### Implementation
```js
// Core sponsorship wrapper
async function sponsorTransaction(innerTx) {
  const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    BASE_FEE,
    innerTx,
    NETWORK_PASSPHRASE
  )
  feeBumpTx.sign(sponsorKeypair)
  return server.sendTransaction(feeBumpTx)
}
```

**Sponsor account:** `GB6B6QEJFY4HAKATRO6MI77WDZ66W4FFPJN6AYLISJEHTLXYFPHQFFTV`

---

## API Reference

### Soroban RPC Calls

All contract calls go through `src/utils/stellar.js`:
```js
// Read stream data (no wallet needed)
getStream(streamId)
getStreamsForUser(walletAddress)

// Write operations (wallet signature required, fee bumped)
invokeSponsoredContract('create_stream', [receiver, amount, duration])
invokeSponsoredContract('withdraw', [streamId])
invokeSponsoredContract('cancel_stream', [streamId])
```

### Horizon REST Endpoints Used

| Endpoint | Usage |
|----------|-------|
| `GET /accounts/{id}/transactions` | Stream history indexing |
| `GET /transactions/{hash}/operations` | Operation detail lookup |
| `GET /accounts/{id}` | Wallet balance check |

---

## Security Model

See `docs/SECURITY.md` for the full checklist. Key principles:

- **Non-custodial** — funds are held in the smart contract, not by LumensFlow
- **No admin keys** — no privileged account can pause or drain streams
- **On-chain math** — balance calculations use ledger timestamps, not off-chain servers
- **Fee sponsor isolation** — sponsor account signs fee bumps only, never inner transactions
- **Input validation** — all amounts and durations validated before contract invocation
- **Address truncation** — wallet addresses are never displayed in full in the UI

---

## Deployment

**Hosting:** Vercel (automatic deploys from `main` branch)
```json
// vercel.json — SPA routing config
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Build command:** `npm run build`
**Output directory:** `dist/`
**Node version:** 18+

**Contract deployment (Testnet):**
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/lumensflow_stream.wasm \
  --network testnet
```

---

## CI/CD Pipeline

**File:** `.github/workflows/ci.yml`

Runs on every push to `main` and all pull requests:

1. Checkout repository
2. Install Node 18
3. `npm ci` — install dependencies
4. `npm run build` — verify production build passes
5. Report build status

---

## Known Limitations

| Limitation | Details |
|------------|---------|
| Testnet only | Contract is deployed on Stellar Testnet — not mainnet |
| Single token | Only XLM streaming is supported currently |
| No stream updates | Streams cannot be modified after creation — cancel and recreate |
| Horizon rate limits | History indexing may be slow under heavy load due to Horizon API limits |
| Browser only | No mobile native app — PWA support planned |