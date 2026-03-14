#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env,
};

const HIGH_TTL: u32 = 999_999;

/// Set ledger timestamp. Sequence number tracks with time to avoid archival.
fn set_ledger(env: &Env, timestamp: u64) {
    env.ledger().set(LedgerInfo {
        timestamp,
        protocol_version: 22,
        sequence_number: (timestamp / 5) as u32, // ~1 ledger per 5 seconds
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: HIGH_TTL,
        min_persistent_entry_ttl: HIGH_TTL,
        max_entry_ttl: HIGH_TTL,
    });
}

/// Creates env, mints tokens to sender, registers+initializes contract.
/// Returns (env, sender, receiver, token_address, contract_id)
fn create_test_env() -> (Env, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    // Initial ledger at timestamp 1000
    set_ledger(&env, 1000);

    let admin = Address::generate(&env);
    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);

    // Create a test token (simulates native XLM)
    let token_address = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();

    // Mint funds to sender
    let token_admin = StellarAssetClient::new(&env, &token_address);
    token_admin.mint(&sender, &1_000_000);

    // Register and initialize the LumensFlow contract
    let contract_id = env.register_contract(None, LumensFlowContract);
    let client = LumensFlowContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_address);

    (env, sender, receiver, token_address, contract_id)
}

// ─── Test 1: Create Stream — verify all fields ──────────────────────────
#[test]
fn test_create_stream() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    let deposit = 100_000i128;
    let duration = 60u64; // minimum allowed duration

    let stream_id = client.create_stream(&sender, &receiver, &deposit, &duration);
    assert_eq!(stream_id, 0);

    let stream = client.get_stream(&stream_id);
    assert_eq!(stream.id, 0);
    assert_eq!(stream.sender, sender);
    assert_eq!(stream.receiver, receiver);
    assert_eq!(stream.deposit_amount, 100_000);
    assert_eq!(stream.flow_rate, 1_666); // 100_000 / 60 = 1666
    assert_eq!(stream.start_time, 1000);
    assert_eq!(stream.end_time, 1060);
    assert_eq!(stream.withdrawn_amount, 0);
    assert!(stream.is_active);

    // Sender balance reduced by deposit amount
    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&sender), 900_000);
}

// ─── Test 2: Withdraw Partial — advance time halfway, withdraw ──────────
#[test]
fn test_withdraw_partial() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // start_time = 1000, end_time = 2000, flow_rate = 100
    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    // Advance to halfway: elapsed = 500s
    set_ledger(&env, 1500);

    let withdrawable = client.withdrawable_amount(&0);
    assert_eq!(withdrawable, 50_000); // 100 * 500

    let withdrawn = client.withdraw(&0, &receiver);
    assert_eq!(withdrawn, 50_000);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 50_000);

    let stream = client.get_stream(&0);
    assert_eq!(stream.withdrawn_amount, 50_000);
    assert!(stream.is_active); // not finished yet
}

// ─── Test 3: Cancel Mid-Stream — refund math correct ───────────────────
#[test]
fn test_cancel_mid_stream() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // start_time = 1000, flow_rate = 100
    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    // 30% through: elapsed = 300s, streamed = 30_000
    set_ledger(&env, 1300);

    client.cancel_stream(&0, &sender);

    let token = TokenClient::new(&env, &token_address);
    // receiver gets 30_000 (streamed, not yet withdrawn)
    assert_eq!(token.balance(&receiver), 30_000);
    // sender gets back 70_000 refund → net balance: 1_000_000 - 100_000 + 70_000 = 970_000
    assert_eq!(token.balance(&sender), 970_000);

    let stream = client.get_stream(&0);
    assert!(!stream.is_active);
}

// ─── Test 4: Withdraw After End — clamped to deposit ───────────────────
#[test]
fn test_withdraw_after_end() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // end_time = 2000
    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    // Far past end
    set_ledger(&env, 9999);

    // Must be clamped to full deposit, not flow_rate * huge_elapsed
    let withdrawable = client.withdrawable_amount(&0);
    assert_eq!(withdrawable, 100_000);

    let withdrawn = client.withdraw(&0, &receiver);
    assert_eq!(withdrawn, 100_000);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 100_000);

    // Deactivated after full withdrawal past end
    let stream = client.get_stream(&0);
    assert!(!stream.is_active);
}

// ─── Test 5a: Unauthorized Withdraw — sender can't withdraw ────────────
#[test]
#[should_panic]
fn test_unauthorized_withdraw() {
    let (env, sender, receiver, _token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);
    set_ledger(&env, 1500);

    // Sender tries to withdraw — must panic
    client.withdraw(&0, &sender);
}

// ─── Test 5b: Unauthorized Cancel — receiver can't cancel ──────────────
#[test]
#[should_panic]
fn test_unauthorized_cancel() {
    let (env, sender, receiver, _token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    // Receiver tries to cancel — must panic
    client.cancel_stream(&0, &receiver);
}

// ─── Test 7: Initialize Twice Fails ────────────────────────────────────
#[test]
#[should_panic(expected = "already initialized")]
fn test_initialize_twice_fails() {
    let env = Env::default();
    env.mock_all_auths();
    set_ledger(&env, 1000);

    let admin = Address::generate(&env);
    let token_address = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();

    let contract_id = env.register_contract(None, LumensFlowContract);
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // First call — should succeed
    client.initialize(&admin, &token_address);

    // Second call — must panic with "already initialized"
    client.initialize(&admin, &token_address);
}
