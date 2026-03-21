# ⚡ LumensFlow

![Network](https://img.shields.io/badge/Network-Stellar%20Testnet-86EE1E?style=flat-square&logo=stellar&logoColor=black)
![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=flat-square&logo=react&logoColor=black)
![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-8b5cf6?style=flat-square&logo=stellar&logoColor=white)
[![CI Status](https://github.com/yashannadate/LumensFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/yashannadate/LumensFlow/actions)

> Real-time payment streaming on the Stellar Network — powered by Soroban Smart Contracts.

LumensFlow enables continuous, second-by-second XLM payment streaming. Funds are locked in a non-custodial Soroban smart contract and flow in realtime to the recipient. From payroll to token vesting — every second earns.

---

## 🔴 Live Demo

**[▶ Launch LumensFlow](https://your-vercel-link.vercel.app)** ← *Add your deployment link here*

---

## 🎥 Demo Video

**[▶ Watch 2-Minute Demo](https://youtube.com/your-link)** ← *Add your demo video link here*

---

## 📸 Application Screenshots

### 🏠 Landing Page
> *Insert your landing page screenshot here*
<!-- ![Landing Page](https://github.com/user-attachments/assets/YOUR-SCREENSHOT-ID) -->

### ❓ How It Works
> *Insert your How It Works page screenshot here*
<!-- ![How It Works](https://github.com/user-attachments/assets/YOUR-SCREENSHOT-ID) -->

### ⚡ LumensFlow Features
> *Insert your Features section screenshot here*
<!-- ![Features](https://github.com/user-attachments/assets/YOUR-SCREENSHOT-ID) -->

### 📊 Main Dashboard
> *Insert your Dashboard screenshot here*
<!-- ![Dashboard](https://github.com/user-attachments/assets/YOUR-SCREENSHOT-ID) -->

### ➕ Create Stream
> *Insert your Create Stream page screenshot here*
<!-- ![Create Stream](https://github.com/user-attachments/assets/YOUR-SCREENSHOT-ID) -->

---

## ⚡ Core Features

**Real-Time Payment Streaming**
Set a deposit amount and a duration. The smart contract calculates the per-second flow rate and unlocks funds dynamically every second.

**Multi-Wallet Support**
Integrated with `@creit.tech/stellar-wallets-kit`. LumensFlow supports **Freighter**, **xBull**, and **LOBSTR** out of the box.

**100% On-Chain & Verifiable**
Every stream is deployed as an immutable Soroban contract invocation. The dashboard shows a **Live Testnet Ledger** anyone can verify on Stellar Expert.

**Privacy-Conscious UI**
Public keys are truncated and amounts are hidden from the public feed. Explorer links are available for independent verification via a subtle icon.

**Flexible Durations**
Stream XLM for 1 hour, 1 day, 7 days, or 30 days. Cancel anytime — remaining funds are auto-refunded instantly.

---

## 📝 Soroban Contract

| Contract | ID | Explorer |
|---|---|---|
| **LumensFlow Core** | `CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR` | [View ↗](https://stellar.expert/explorer/testnet/contract/CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR) |

For a full breakdown of the system design, data flow, and file structure — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 👥 Testnet Participants

The following Stellar Testnet addresses were used for live testing and verification:

| # | Wallet Address | Role |
|---|---|---|
| 1 | *(add address)* | Sender |
| 2 | *(add address)* | Recipient |
| 3 | *(add address)* | Sender |
| 4 | *(add address)* | Recipient |
| 5 | *(add address)* | Observer |

User feedback and iteration log: [docs/FEEDBACK.md](docs/FEEDBACK.md)

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A Stellar Wallet: [Freighter](https://www.freighter.app/), [xBull](https://xbull.app/) or [LOBSTR](https://lobstr.co/)
- Set your wallet to **Testnet**
- Fund with Testnet XLM via the [Stellar Laboratory Faucet](https://laboratory.stellar.org/#account-creator?network=test)

### Run Locally
```bash
git clone https://github.com/yashannadate/LumensFlow.git
cd LumensFlow
npm install
npm run dev
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite |
| **Smart Contracts** | Rust, Soroban SDK |
| **Wallet Layer** | `@creit.tech/stellar-wallets-kit` |
| **Network** | Stellar Testnet |
| **Styling** | Vanilla CSS (Dark/Neon Theme) |
| **CI/CD** | GitHub Actions |

---

<p align="center">Built with ⚡ on the Stellar Network</p>
