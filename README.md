<h1 align="center"><img width="985" alt="LumensFlow Logo" src="https://github.com/user-attachments/assets/2643f2bc-ba65-4da7-bbb7-91d457514ff3" /></h1>

<div align="center">
  <img src="https://img.shields.io/badge/Stellar-7D7D7D?style=for-the-badge&logo=stellar&logoColor=white" alt="Stellar" />
  <img src="https://img.shields.io/badge/Soroban-8b5cf6?style=for-the-badge&logo=stellar&logoColor=white" alt="Soroban" />
  <img src="https://img.shields.io/badge/React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Level_5-Blue_Belt-3B82F6?style=for-the-badge" alt="Blue Belt" />
  <br />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
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
  <a href="https://lumensflow.vercel.app"><strong>🔴 Launch Live Demo</strong></a> · <a href="https://drive.google.com/drive/folders/15zJevSRM9vfUfKXQlHXcSsEZ_ZfhmkP7"><strong>🎥 Watch Demo Video</strong></a>
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

### User Testnet Validation & Feedback

| # | Wallet Address | Role | Action | Verification |
|---|---|---|---|---|
| 1 | `GB4AZ4KLH746OLPIDH74...` | Sender | Created 3.5 XLM stream; successfully locked funds into custodial-free Soroban contract. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GB4AZ4KLH746OLPIDH74CKNCHRT2C3EXK5PQ2NL2UBBMZMS7OAGYDGKJ) |
| 2 | `GDDZIUEPJ...` | Sender | Locked (Sent) 10 XLM to the contract owner; explored the app and verified the transaction. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GDDZIUEPJYRZDMGQ45TELZLYN24AWS6KYAMXCLDXNSFNMYSIND3CYJMA) |
| 3 | `GALIEC3IEJY5UP3KD...` | Tester | Created multiple streams; successfully tested the cancel stream functionality. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GALIEC3IEJY5UP3KDOF5GV4BTBMAREELZJ2SONU33MGOPX5IB7WINPQL) |
| 4 | `GBQAQ3MOFYIXGWRHB7...` | Tester | Successfully withdrawn Lumens from locked contract funds. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GBQAQ3MOFYIXGWRHB7ROIKQ5UFGDEGGNBXP2P3QB25DTPTR6ISEZKF44) |
| 5 | `GB6CD6ZNF...` | Tester | Explored the application and created streams; successfully locked funds on-chain. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GB6CD6ZNFDAMQFUBDLZTF7QVQZL4ZL3AF43KSFLUDH6C5P53PGKEEJ3P) |
| 6 | `GACXDFSKX...` | Tester | Successfully created and tested multiple payment streams; verified on-chain settlement. | [Verify ↗](https://stellar.expert/explorer/testnet/account/GACXDFSKXNL5BN76JZWQESBAHEY4OA57OAJZXY5FH7OPTLIWFNJ6427N) |

**Community Insight:**
- **[📝 User Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSeZDIj-q9VYGrWRbhM8iAc02VlIoCNVQZJvPPkH50NJ-ZzVnw/viewform)**
- **[📊 Feedback Responses Spreadsheet](Pending Phase)**

*Testnet participants actively provided feedback to shape the privacy features (address truncation) built into version `1.0`. Full testing iteration logs reside in [docs/FEEDBACK.md](./docs/FEEDBACK.md).*

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
