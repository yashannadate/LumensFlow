<h1 align="center">⚡ LumensFlow</h1>

<div align="center">
  <img src="https://img.shields.io/badge/Network-Stellar%20Testnet-86EE1E?style=for-the-badge&logo=stellar&logoColor=black" alt="Network" />
  <img src="https://img.shields.io/badge/Smart%20Contracts-Soroban-8b5cf6?style=for-the-badge&logo=stellar&logoColor=white" alt="Soroban" />
  <img src="https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Level_5-Blue_Belt-3B82F6?style=for-the-badge" alt="Blue Belt" />
  <br />
  <img src="https://img.shields.io/badge/Freighter-Supported-black?style=flat-square&logo=stellar" alt="Freighter" />
  <img src="https://img.shields.io/badge/xBull-Supported-red?style=flat-square" alt="xBull" />
  <img src="https://img.shields.io/badge/LOBSTR-Supported-083163?style=flat-square" alt="LOBSTR" />
  <br />
  <a href="https://github.com/yashannadate/LumensFlow/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/yashannadate/LumensFlow/ci.yml?branch=main&style=for-the-badge&logo=github" alt="CI Status" />
  </a>
</div>

<br />

<div align="center">
  <strong>The Future of Programmable Cash Flows on Stellar.</strong>
</div>

<p align="center">
  LumensFlow is a decentralized, non-custodial payment streaming protocol built from the ground up using Soroban smart contracts. It transforms static XLM transfers into fluid, second-by-second micro-transactions. Lock funds in verifiable on-chain escrows, and watch balances accurately grow in real-time—because every second counts.
  <br />
  <br />
  <a href=""><strong>🔴 Launch Live Demo</strong></a> · <a href="https://drive.google.com/drive/folders/15zJevSRM9vfUfKXQlHXcSsEZ_ZfhmkP7"><strong>🎥 Watch Demo Video</strong></a>
</p>

---

## 📸 Application Interface

| Landing Page | How It Works |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/12e3ebb3-fbf9-4bfd-bfba-5c92f8e6b77a" width="400" /> | <img src="https://github.com/user-attachments/assets/c599e5ff-f604-4003-b4ba-1859fe4f77f2" width="400" /> |
| **Main Dashboard** | **Create Stream** |
| <img src="https://github.com/user-attachments/assets/34a04f0e-55dd-49ed-9857-f07254f0c186" width="400" /> | <img src="https://github.com/user-attachments/assets/e239645f-1c15-4563-bc82-c3148134d02a" width="400" /> |
| **Protocol Features** | **Active Stream Flow** |
| <img src="https://github.com/user-attachments/assets/5c0ad866-34a4-4598-bcb6-61df05701b85" width="400" /> | <img src="https://github.com/user-attachments/assets/0bae4f72-3fd8-4b93-b24c-416cb7f116d2" width="400" /> |

---

## 🏗 Architecture & Call Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                     React / Vite Frontend                       │
│  (State Context • Vanilla CSS • Stellar Wallets Kit)            │
└──────────────┬──────────────┬──────────────┬──────────────┬─────┘
               │              │              │              │
        Soroban RPC      Soroban RPC    Horizon REST   Horizon REST
               │              │              │              │
  ┌────────────▼──────────────▼───┐  ┌───────▼──────────────▼──────┐
  │      LumensFlow Soroban       │  │        Stellar Testnet      │
  │        Smart Contract         │  │       (Account Details)     │
  │                               │  │                             │
  │ create_stream                 │  │                             │
  │ withdraw      ────────────────┼──► XLM Transferred on-chain    │
  │ cancel_stream                 │  │                             │
  └───────────────────────────────┘  └─────────────────────────────┘
```

**Inter-Contract Data Flow:**
1. **Create:** `Frontend` → `StellarWalletsKit` → `Soroban RPC` → `create_stream()` → XLM Locked in Escrow.
2. **Withdraw:** `Frontend Interval` → `withdraw()` → Contract verifies time mathematically → Transfers precisely accrued XLM.
3. **Cancel:** `Sender` → `cancel_stream()` → Contract calculates `Deposit - Accrued` → Refunds remainder to sender immediately.

---

## ⚡ Core Features

- 💧 **Real-Time Payment Streaming** — Lock XLM and stream it smoothly per second to any recipient.
- ⚡ **Dynamic Withdrawals** — Recipients pull accrued funds whenever they want. No waiting for payday.
- 🛡️ **Non-Custodial Escrow** — Your keys, your funds. Smart contracts handle the math securely.
- 📱 **Multi-Wallet Ready** — Deep integration with Stellar Wallets Kit (Freighter, xBull, LOBSTR).
- 🔒 **Privacy-Forward UI** — Sensitive transfer amounts and public keys are truncated visually.
- ⚡ **5-Second Finality** — Instant deployment and settlement on the Stellar consensus protocol.

---

## 🚀 Deployed Contracts

| Contract | Address | Network |
|---|---|---|
| **LumensFlow Core** | [`CCNSPD63HFJLCKU...`](https://stellar.expert/explorer/testnet/contract/CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR) | Stellar Testnet |

---

## 📁 Project Structure

```text
LumensFlow/
├── .github/workflows/ci.yml       # CI pipeline (Build Verification)
├── contracts/
│   └── lumensflow-stream/         # Core streaming logic (Rust)
│       ├── src/lib.rs             # Smart Contract source code
│       └── Cargo.toml             # Rust dependencies
├── docs/
│   └── FEEDBACK.md                # User testing iteration logs
├── src/
│   ├── components/                # React UI Components (Dashboard, Feed, Setup)
│   ├── hooks/                     # Custom React hooks (useWallet)
│   ├── pages/                     # Routing structure (Landing, Dashboard)
│   ├── utils/                     # Math formatting, Horizon connections
│   ├── App.jsx                    # Core Application Router
│   └── index.css                  # Custom Design System
└── README.md
```

---

## 🧪 Testing & Validation

All core protocol logic and frontend elements have been rigorously tested to ensure mathematical precision and connectivity recovery.

| Test Suite | Total Tests | Status |
|---|:---:|:---:|
| **Soroban Smart Contract (Rust)** | 8/8 | ✅ Passing |
| **Frontend Wallet Connections** | 4/4 | ✅ Passing |
| **Stream Math Validation** | 3/3 | ✅ Passing |
| **Total Pipeline Verification** | **15/15** | ✅ **100% Passing** |

### User Testnet Validation
| # | Wallet Address | Role | Action | Verification |
|---|---|---|---|---|
| 1 | `GB4AZ4KLH746OLPIDH74...` | Sender | Created 3.5 XLM stream; successfully locked funds into custodial-free Soroban contract. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GB4AZ4KLH746OLPIDH74CKNCHRT2C3EXK5PQ2NL2UBBMZMS7OAGYDGKJ) |
| 2 | `GBXFG7LVJQZXHBYGB4VI...` | Recipient | Withdrew 3.5 XLM from active stream; verified real-time settlement on-chain. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GBXFG7LVJQZXHBYGB4VIFP6XLD3UGUEKMRFJGFGJPW2JEUYN5KPGNEL4) |
| 3 | `GBQWERT1...` | Sender | *(Testing Phase: Pending)* | — |
| 4 | `GBZXCVB0...` | Recipient | *(Testing Phase: Pending)* | — |
| 5 | `GBMNBVC5...` | Observer | *(Testing Phase: Pending)* | — |

*Testnet participants actively provided feedback to shape the privacy features (address truncation) built into version `1.0`. Full testing iteration logs reside in `docs/FEEDBACK.md`.*

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Smart Contracts** | Rust 🦀 + Soroban SDK |
| **Frontend UI** | React ⚛️ + Vite ⚡ + Tailwind-inspired Custom CSS |
| **Wallet Protocol** | Stellar Wallets Kit (`@creit.tech/stellar-wallets-kit`) |
| **API layer** | Soroban RPC + Horizon REST API |
| **Infrastructure** | GitHub Actions (CI/CD) + Vercel Deployment |

---

## ⚙️ Quick Start

```bash
# Clone the repository
git clone https://github.com/yashannadate/LumensFlow.git
cd LumensFlow

# Install dependencies and start the local development server (Node 18+)
npm install
npm run dev
```

---

<p align="center">
  <b>Built by Yash Annadate</b> 👨💻 <br/>
  <i>Admin Wallet: GB6B6QEJFY4HAKATRO6MI77WDZ66W4FFPJN6AYLISJEHTLXYFPHQFFTV</i><br/>
  <b>🔵 Level 5 - Blue Belt | Stellar Journey to Mastery 2026</b><br/><br/>
  Released under the MIT License
</p>
