/**
 * LumensFlow — Fee Sponsorship Service
 *
 * Implements Stellar's FeeBumpTransaction pattern (SEP / protocol 15).
 * A "sponsor" account wraps an inner transaction and pays its network fee,
 * making the experience gasless for end-users.
 *
 * Architecture:
 *  User signs the inner transaction (their contract call).
 *  Sponsor signs the outer FeeBumpTransaction (covers the fee).
 *  Only the outer fee is charged — to the sponsor.
 *
 * In production:
 *  The sponsor signing would happen on a secure backend API.
 *  For this demo, sponsorship is simulated client-side using the sponsor's
 *  public key and a clearly labelled dev key (never used on mainnet).
 *
 * Usage:
 *  const sponsored = await wrapWithFeeBump(innerSignedXDR)
 *  await server.sendTransaction(sponsored)
 */

import {
  TransactionBuilder,
  FeeBumpTransaction,
  Networks,
  Keypair,
} from '@stellar/stellar-sdk'

// ─── Sponsor Config ───────────────────────────────────────────────────────────
// This is a TESTNET-ONLY sponsor account funded via Friendbot.
// On mainnet, sponsorship signing must happen on a secure server.
export const SPONSOR_PUBLIC_KEY = 'GDKD2P2E5SQWW7L6GBD2AXWVBZ7FVMUJPMVTVWXVPQ7CR2GXKXLVWYFX'
export const SPONSOR_SECRET_KEY = 'SCKVSEZZUJL4REC3HORBXZU2IG3GR4LZWMVDJGD4TL4U4MKEMSGNAM2J'
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'

// Fee the sponsor pays (in stroops). 10x base fee for priority inclusion.
const SPONSOR_FEE = '1000'

// ─── State ───────────────────────────────────────────────────────────────────
let sponsorshipEnabled = true     // can be toggled by user
let sponsorActive = false         // true when a sponsored tx is in-flight

// ─── Core: Wrap a signed inner tx in a FeeBumpTransaction ────────────────────
/**
 * Wraps a signed inner XDR with a FeeBump.
 * Returns the FeeBumpTransaction ready to be submitted.
 *
 * In production: send `innerSignedXDR` to your backend which builds + signs
 * the FeeBump and returns the final XDR to submit.
 */
export async function buildFeeBumpTransaction(innerSignedXDR) {
  try {
    // Parse the inner signed transaction from XDR
    const innerTx = TransactionBuilder.fromXDR(innerSignedXDR, NETWORK_PASSPHRASE)

    // Build the FeeBump wrapper
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      SPONSOR_PUBLIC_KEY,   // fee account (sponsor)
      SPONSOR_FEE,          // max fee (stroops)
      innerTx,              // inner signed tx
      NETWORK_PASSPHRASE,
    )

    return feeBumpTx
  } catch (err) {
    console.error('[SponsorService] Failed to build FeeBumpTransaction:', err)
    throw new Error('Fee sponsorship failed: ' + (err.message || err))
  }
}

/**
 * Simulate signing the FeeBump (for testnet demo only).
 * In production, this POST call goes to a backend that holds the sponsor key.
 *
 * Returns the signed FeeBumpTransaction XDR string.
 */
export async function signFeeBumpSimulated(feeBumpTx, sponsorKeypair) {
  feeBumpTx.sign(sponsorKeypair)
  return feeBumpTx.toXDR()
}

// ─── Higher-level helpers ─────────────────────────────────────────────────────

/** Returns whether sponsor service is currently enabled */
export function isSponsorshipEnabled() {
  return sponsorshipEnabled
}

/** Toggle sponsorship on/off */
export function setSponsorshipEnabled(enabled) {
  sponsorshipEnabled = !!enabled
}

/** Returns whether a sponsored tx is currently in-flight */
export function isSponsorActive() {
  return sponsorActive
}

/** Mark sponsorship as active/inactive */
export function setSponsorActive(active) {
  sponsorActive = !!active
}

/**
 * Full gasless flow helper.
 * Takes a user-signed XDR, wraps it in a FeeBump, signs as sponsor (simulated),
 * and returns the final XDR ready for submission.
 *
 * @param {string} userSignedXDR - XDR string of inner tx signed by user
 * @param {Keypair} [sponsorKeypair] - Optional: sponsor keypair for testnet demo
 * @returns {string} Final FeeBump XDR to submit
 */
export async function createSponsoredTransaction(userSignedXDR, sponsorKeypair = null) {
  setSponsorActive(true)
  try {
    const feeBumpTx = await buildFeeBumpTransaction(userSignedXDR)

    // Testnet demo: sign immediately with the demo sponsor keypair
    const keypairToUse = sponsorKeypair || Keypair.fromSecret(SPONSOR_SECRET_KEY)
    return await signFeeBumpSimulated(feeBumpTx, keypairToUse)
  } finally {
    setSponsorActive(false)
  }
}

/**
 * Get sponsorship info for display in the UI.
 */
export function getSponsorshipInfo() {
  return {
    enabled: sponsorshipEnabled,
    sponsor: SPONSOR_PUBLIC_KEY,
    sponsorTruncated: `${SPONSOR_PUBLIC_KEY.slice(0, 6)}...${SPONSOR_PUBLIC_KEY.slice(-4)}`,
    fee: `${parseInt(SPONSOR_FEE) / 10_000_000} XLM`,
    description: 'LumensFlow covers your network fee. You only spend what you stream.',
    mode: 'testnet-demo',
  }
}
