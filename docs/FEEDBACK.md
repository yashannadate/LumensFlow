# 💬 LumensFlow — User Feedback

> **Validation Status: 9/5 Participants Completed (High-Volume Validation Phase)**

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
