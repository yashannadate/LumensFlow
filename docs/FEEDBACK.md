# 💬 LumensFlow — User Feedback

> **Validation Status: 11/5 Participants Completed (High-Volume Validation Phase)**

## Testing Participants

| # | Wallet Address (Testnet) | Role | Status | Verification |
|---|---|---|---|---|
| 1 | `GB4AZ4KLH746OLPIDH74CKNCHRT2C3EXK5PQ2NL2UBBMZMS7OAGYDGKJ` | Sender | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GB4AZ4KLH746OLPIDH74CKNCHRT2C3EXK5PQ2NL2UBBMZMS7OAGYDGKJ) |
| 2 | `GDDZIUEPJYRZDMGQ45TELZLYN24AWS6KYAMXCLDXNSFNMYSIND3CYJMA` | Sender | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GDDZIUEPJYRZDMGQ45TELZLYN24AWS6KYAMXCLDXNSFNMYSIND3CYJMA) |
| 3 | `GALIEC3IEJY5UP3KDOF5GV4BTBMAREELZJ2SONU33MGOPX5IB7WINPQL` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GALIEC3IEJY5UP3KDOF5GV4BTBMAREELZJ2SONU33MGOPX5IB7WINPQL) |
| 4 | `GBQAQ3MOFYIXGWRHB7ROIKQ5UFGDEGGNBXP2P3QB25DTPTR6ISEZKF44` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GBQAQ3MOFYIXGWRHB7ROIKQ5UFGDEGGNBXP2P3QB25DTPTR6ISEZKF44) |
| 5 | `GB6CD6ZNFDAMQFUBDLZTF7QVQZL4ZL3AF43KSFLUDH6C5P53PGKEEJ3P` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GB6CD6ZNFDAMQFUBDLZTF7QVQZL4ZL3AF43KSFLUDH6C5P53PGKEEJ3P) |
| 6 | `GACXDFSKXNL5BN76JZWQESBAHEY4OA57OAJZXY5FH7OPTLIWFNJ6427N` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GACXDFSKXNL5BN76JZWQESBAHEY4OA57OAJZXY5FH7OPTLIWFNJ6427N) |
| 7 | `GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6) |
| 8 | `GA7U4LNT7R2CRWHCTQGGLML2SQHDPB2IN5W663VDK6PZFD7LJYMUAPL6` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GA7U4LNT7R2CRWHCTQGGLML2SQHDPB2IN5W663VDK6PZFD7LJYMUAPL6) |
| 9 | `GAYJALSDDA3QYIIQDFESHZCHNKGWV43C76Y2MSL6MZS6RCGO7YO3HTMQ` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GAYJALSDDA3QYIIQDFESHZCHNKGWV43C76Y2MSL6MZS6RCGO7YO3HTMQ) |
| 10 | `GC7DC266YWPG6KVP6I6MJVOLY5WJGVYBQUDQVDCRXEPTVJ6EHEO3NAGN` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GC7DC266YWPG6KVP6I6MJVOLY5WJGVYBQUDQVDCRXEPTVJ6EHEO3NAGN) |
| 11 | `GDOQ2JNYGS2YTGEB2OAZ4WUZXI4DA2SFVBO7BG2Y6LDVHHB4NHSV5EGZ` | Tester | ✅ **Done** | [View Entry ↗](https://stellar.expert/explorer/testnet/account/GDOQ2JNYGS2YTGEB2OAZ4WUZXI4DA2SFVBO7BG2Y6LDVHHB4NHSV5EGZ) |

---

## 🔗 Project Insights
- **[📝 Official Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSeZDIj-q9VYGrWRbhM8iAc02VlIoCNVQZJvPPkH50NJ-ZzVnw/viewform)**
- **[📊 Responses Spreadsheet](https://docs.google.com/spreadsheets/d/1vS4LrcrGObBwGvAJduHcXkqA9MUO1aLDiEvXXnIrWYw/edit?usp=sharing)**

---

## Summary of Iterations Based on Feedback

| Feedback | Change Made |
|---|---|
| Wallet modal hidden unsupported wallets | Forced visibility of all wallets via `hideUnsupportedWallets: false` |
| Sensitive amounts visible in public feed | Removed amounts from activity feed; truncated addresses to `GB4A...DGKJ` |
| Closing connect popup caused redirect | Added route guards in Landing.jsx to prevent empty dashboard redirect |
| Lack of Explorer visibility | Added `[↗]` icon to every activity card for direct on-chain verification |
| UI responsiveness issues on mobile | Improved mobile responsiveness to resolve layout issues on smaller screens while maintaining a smooth experience across devices : Fixed ✅ (Commit: `d6f14d7`) |
| Lack of documentation clarity | Improved documentation clarity by adding a step-by-step workflow and example visuals for understanding for new users: Fixed ✅ (Commit: `88c833b`) |

---

## 🎯 Selected User Feedback & Implementation Details

Based on collected feedback, the following two key suggestions were selected and implemented:

---

### 🔹 Feedback 1: Mobile Responsiveness Issue

**Wallet Address:** `GC7DC266YWPG6KVP6I6MJVOLY5WJGVYBQUDQVDCRXEPTVJ6EHEO3NAGN`  

**Feedback Statement:**  
"Please fix the UI responsiveness on mobile, it is slightly conflicting. Overall, the application works well on PC."

**Implementation:**  
Improved mobile responsiveness by restructuring layout components, optimizing spacing, and ensuring proper rendering across different screen sizes using a granular utility-first CSS approach.

**Commit ID:** `d6f14d7`  

---

### 🔹 Feedback 2: Documentation Clarity

**Wallet Address:** `GDOQ2JNYGS2YTGEB2OAZ4WUZXI4DA2SFVBO7BG2Y6LDVHHB4NHSV5EGZ`  

**Feedback Statement:**  
"The documentation should be clearer and easier for new users. Adding a workflow example would improve understanding."

**Implementation:**  
Enhanced documentation by adding a step-by-step workflow along with example visuals (e.g., "Alice & Bob") to simplify onboarding for new users in `Docs.jsx`.

**Commit ID:** `88c833b`  

---

### ✅ Impact
- Improved mobile usability  
- Better onboarding experience  
- Direct integration of real user feedback into the product  

These improvements directly reflect selected user feedback and enhance the overall platform experience.
