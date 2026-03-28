# LumensFlow — User Guide

> **Version:** 1.0 · **Network:** Stellar Testnet · **Last Updated:** 2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Connecting Your Wallet](#connecting-your-wallet)
3. [Creating a Payment Stream](#creating-a-payment-stream)
4. [Withdrawing from a Stream](#withdrawing-from-a-stream)
5. [Cancelling a Stream](#cancelling-a-stream)
6. [Viewing Stream History](#viewing-stream-history)
7. [Gasless Transactions](#gasless-transactions)
8. [Metrics Dashboard](#metrics-dashboard)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## Getting Started

LumensFlow is a non-custodial payment streaming dApp on the Stellar network. It lets you stream XLM continuously — second by second — to any Stellar wallet address using Soroban smart contracts.

**What you need:**
- A Stellar testnet wallet (Freighter, xBull, or LOBSTR)
- Testnet XLM (free from [Stellar Friendbot](https://friendbot.stellar.org))
- A modern browser (Chrome or Firefox recommended)

**Live app:** https://lumensflow.vercel.app

---

## Connecting Your Wallet

1. Visit [lumensflow.vercel.app](https://lumensflow.vercel.app)
2. Click **"Launch App"** on the landing page
3. A wallet selection modal will appear — choose your wallet:
   - **Freighter** — Most popular Stellar browser extension
   - **xBull** — Feature-rich Stellar wallet
   - **LOBSTR** — Mobile-first Stellar wallet
4. Approve the connection request in your wallet extension
5. You will be redirected to your **Dashboard** automatically

> **Tip:** Make sure your wallet is set to **Testnet** mode before connecting.

---

## Creating a Payment Stream

1. Click **"Create Stream"** in the sidebar or the purple **"+ Create"** button
2. Fill in the stream details:
   - **Recipient Address** — The Stellar wallet address of the receiver (starts with `G`)
   - **Total Amount** — Total XLM to stream (minimum 1 XLM)
   - **Duration** — How long the stream runs (hours, days, or weeks)
3. Review the **real-time flow rate** shown below the form (XLM per second)
4. Check the **Gasless badge** — your transaction fee is sponsored automatically
5. Click **"Create Stream"** and approve the transaction in your wallet
6. Your stream is live immediately — funds begin flowing per second

**What happens on-chain:**
- Your XLM is locked into a Soroban escrow contract
- The contract calculates the receiver's balance mathematically every second
- No repeated transactions are required — the math handles it all

---

## Withdrawing from a Stream

As a **receiver**, you can withdraw your accrued balance at any time:

1. Open your **Dashboard** — active incoming streams are listed under "Received Streams"
2. Click on a stream to open its **Stream Details** page
3. The **"Withdraw"** button shows your current accrued balance
4. Click **"Withdraw"** and approve the transaction in your wallet
5. The precise accrued amount is transferred to your wallet instantly

> **Note:** You can withdraw multiple times. The contract tracks your last withdrawal timestamp and calculates exactly what has accrued since then.

---

## Cancelling a Stream

As a **sender**, you can cancel an active stream at any time:

1. Open your **Dashboard** and find the stream under "Sent Streams"
2. Click on the stream to open its **Stream Details** page
3. Click **"Cancel Stream"** and confirm in your wallet
4. The contract will:
   - Send all **accrued funds** to the receiver instantly
   - Refund the **remaining balance** back to you immediately

> **Note:** Cancellation is final. Once cancelled, a stream cannot be restarted — create a new stream if needed.

---

## Viewing Stream History

The **History** page shows a full indexed record of all your stream activity:

1. Click **"History"** in the sidebar (Database icon)
2. View all streams you have sent or received
3. Use the **search bar** to find streams by address or stream ID
4. Filter by **status**: Active, Completed, or Cancelled
5. Filter by **role**: Sent or Received
6. Click any stream row to open its full **Stream Details** page

**Stats shown:**
- Total streams, Active count, Volume in XLM, Unique participants

---

## Gasless Transactions

LumensFlow uses **Fee Bump Transactions** (Stellar's native fee sponsorship) to make every interaction gasless for users.

- The **GaslessBadge** on the Create Stream page confirms sponsorship is active
- You pay **0 XLM** in fees — the protocol sponsor covers all transaction costs
- This is fully non-custodial — the sponsor only covers fees, never touches your funds

Look for the green **"Gasless · Fee Sponsored"** badge throughout the app to confirm you are in gasless mode.

---

## Metrics Dashboard

The **Metrics** page shows live protocol analytics:

1. Click **"Metrics"** in the sidebar (chart icon)
2. View:
   - **Daily Active Users (DAU)** — unique wallets active per day
   - **Transaction Count** — total on-chain interactions
   - **Retention Rate** — returning user percentage
   - **Volume Chart** — XLM streamed over time

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wallet won't connect | Ensure wallet extension is installed and set to **Testnet** |
| Transaction fails | Check you have enough XLM for the stream amount (fees are sponsored) |
| Stream not showing | Refresh the dashboard; Soroban RPC may have a brief delay |
| Balance not updating | Real-time balance updates every 5 seconds automatically |
| History page empty | Connect your wallet first; history is wallet-specific |

---

## FAQ

**Q: Is LumensFlow custodial?**
A: No. Your funds are locked in a Soroban smart contract. No team member or admin can access them.

**Q: Can I stream to multiple people at once?**
A: Yes — create separate streams for each recipient from the Create Stream page.

**Q: What happens if I run out of XLM mid-stream?**
A: The stream will show as underfunded. The receiver can withdraw accrued funds and the sender can cancel to recover the remainder.

**Q: Are streams reversible?**
A: Only via cancellation. Once cancelled, accrued funds go to the receiver and the remainder returns to you.

**Q: What network is LumensFlow on?**
A: Currently on Stellar **Testnet**. Contract: `CCNSPD63HFJLCKUJSAJOBRY4HAAOQ2BOS73VIU3S2ZINCVXGDY3B5DWR`

**Q: How is the flow rate calculated?**
A: `Flow Rate = Total Deposit ÷ Duration in Seconds`. The contract computes your balance as `FlowRate × ElapsedSeconds` at every interaction.