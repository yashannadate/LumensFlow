# 🌊 LumensFlow

![Network](https://img.shields.io/badge/Network-Stellar%20Testnet-86EE1E?style=flat-square&logo=stellar&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-FF6B35?style=flat-square&logo=stellar&logoColor=white)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

> **Continuous, Second-by-Second Payment Streaming Protocol on Stellar Soroban.**

LumensFlow is a non-custodial real-time payment protocol that enables continuous XLM flows between participants. Built on the Stellar Network using Soroban smart contracts, LumensFlow ensures mathematical precision and instant liquidity for payroll, subscriptions, and vesting.

---

## 🟢 Live Demo
**[https://lumens-flow-app.vercel.app/](https://lumens-flow-app.vercel.app/)** *(Placeholder)*

---

## 🚀 Key Features

### 🕒 Real-Time Streaming
Payments flow incrementally every second. Recipients can withdraw accrued funds instantly at any time, while senders maintain full control with on-chain cancellation and auto-refund logic.

### 🛡️ Non-Custodial Architecture
LumensFlow leverages Soroban smart contracts to hold funds in escrow. No central party ever has access to the capital — it is locked and managed entirely by the protocol logic.

### 📊 Live Analytics Dashboard
- **Activity Feed**: Real-time tracking of protocol-wide events (Stream Creation, Withdrawals, Cancellations).
- **Precise Counters**: Frontend engine calculates withdrawable balances down to 7 decimal places in real-time.
- **Protocol Insights**: Track unique users and total protocol liquidity live from the ledger.

### 📱 Premium Mobile Experience
Fully responsive design with a dedicated mobile drawer navigation, hamburger menus, and fluid scaling across all device viewports.

---

## 📝 Smart Contract Interface

The LumensFlow core contract manages the logic of every stream, ensuring that funds are distributed accurately according to the defined flow rate.

| Function | Description |
|---|---|
| `create_stream` | Initializes a new stream by locking XLM in a non-custodial escrow. |
| `withdraw` | Allows the recipient to pull accrued funds to their wallet instantly. |
| `cancel_stream` | Stops the flow; pays pending funds to recipient and refunds the rest to sender. |
| `get_stream` | Retrieves on-chain state, timestamps, and contract balances. |

**Contract ID:** `CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR`  
🔍 [View on StellarExpert ↗](https://stellar.expert/explorer/testnet/contract/CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR)

---

## 📸 Dashboard Preview

*(Insert Dashboard Screenshot Here)*

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Freighter Wallet](https://www.freighter.app/) or [xBull](https://xbull.app/)
- Network: **Stellar Testnet**
- Testnet XLM: Fund via [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

### Run Locally
```bash
# Clone the repository
git clone https://github.com/yashannadate/lumensflow.git
cd lumensflow

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React v18 + Vite |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Styling** | Modern CSS + Responsive Framework |
| **Smart Contracts** | Rust + Soroban SDK |
| **Wallet Integration** | Stellar Wallets Kit |
| **Network** | Stellar Testnet |
| **Icons** | Lucide React |

---

<p align="center">Built with 🤍 for the Stellar Ecosystem | 2026</p>
