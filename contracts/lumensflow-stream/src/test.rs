#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env,
};

const HIGH_TTL: u32 = 999_999;

// ─── Helpers ─────────────────────────────────────────────────────────────

fn set_ledger(env: &Env, timestamp: u64) {
    env.ledger().set(LedgerInfo {
        timestamp,
        protocol_version: 22,
        sequence_number: (timestamp / 5) as u32,
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: HIGH_TTL,
        min_persistent_entry_ttl: HIGH_TTL,
        max_entry_ttl: HIGH_TTL,
    });
}

/// Creates env, mints tokens to sender, registers + initialises contract.
/// Returns (env, sender, receiver, token_address, contract_id)
fn create_test_env() -> (Env, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    set_ledger(&env, 1000);

    let admin    = Address::generate(&env);
    let sender   = Address::generate(&env);
    let receiver = Address::generate(&env);

    let token_address = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();

    let token_admin = StellarAssetClient::new(&env, &token_address);
    token_admin.mint(&sender, &1_000_000);

    let contract_id = env.register_contract(None, LumensFlowContract);
    let client      = LumensFlowContractClient::new(&env, &contract_id);
    client.initialize(&admin, &token_address);

    (env, sender, receiver, token_address, contract_id)
}

// ─── Test 1: Create stream — verify all fields ───────────────────────────
#[test]
fn test_create_stream() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    let stream_id = client.create_stream(&sender, &receiver, &100_000i128, &60u64);
    assert_eq!(stream_id, 0);

    let stream = client.get_stream(&stream_id);
    assert_eq!(stream.id, 0);
    assert_eq!(stream.sender,   sender);
    assert_eq!(stream.receiver, receiver);
    assert_eq!(stream.deposit_amount,   100_000);
    assert_eq!(stream.flow_rate,        1_666); // 100_000 / 60 (informational)
    assert_eq!(stream.start_time,       1000);
    assert_eq!(stream.end_time,         1060);
    assert_eq!(stream.withdrawn_amount, 0);
    assert_eq!(stream.status, StreamStatus::Active);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&sender), 900_000);
}

// ─── Test 2: Withdraw partial — halfway through ──────────────────────────
#[test]
fn test_withdraw_partial() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // deposit=100_000, duration=1000 → end_time=2000
    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    set_ledger(&env, 1500); // 500 s elapsed

    // Precise formula: 100_000 * 500 / 1000 = 50_000  (exact, no truncation)
    let withdrawable = client.withdrawable_amount(&0);
    assert_eq!(withdrawable, 50_000);

    let withdrawn = client.withdraw(&0, &receiver);
    assert_eq!(withdrawn, 50_000);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 50_000);

    let stream = client.get_stream(&0);
    assert_eq!(stream.withdrawn_amount, 50_000);
    assert_eq!(stream.status, StreamStatus::Active); // still running
}

// ─── Test 3: Cancel mid-stream — refund math correct ────────────────────
#[test]
fn test_cancel_mid_stream() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    set_ledger(&env, 1300); // 300 s elapsed → streamed = 100_000 * 300 / 1000 = 30_000

    client.cancel_stream(&0, &sender);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 30_000);
    // sender: 1_000_000 − 100_000 deposit + 70_000 refund = 970_000
    assert_eq!(token.balance(&sender), 970_000);

    let stream = client.get_stream(&0);
    assert_eq!(stream.status, StreamStatus::Cancelled);
}

// ─── Test 4: Withdraw after end — clamped to full deposit ────────────────
#[test]
fn test_withdraw_after_end() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    set_ledger(&env, 9999); // far past end_time = 2000

    // Precise formula at end: 100_000 * 1000 / 1000 = 100_000 (exact)
    let withdrawable = client.withdrawable_amount(&0);
    assert_eq!(withdrawable, 100_000);

    let withdrawn = client.withdraw(&0, &receiver);
    assert_eq!(withdrawn, 100_000);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 100_000);

    let stream = client.get_stream(&0);
    assert_eq!(stream.status, StreamStatus::Completed);
}

// ─── Test 5a: Unauthorized withdraw — sender can't withdraw ─────────────
#[test]
#[should_panic]
fn test_unauthorized_withdraw() {
    let (env, sender, receiver, _token, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);
    set_ledger(&env, 1500);

    client.withdraw(&0, &sender); // must panic
}

// ─── Test 5b: Unauthorized cancel — receiver can't cancel ───────────────
#[test]
#[should_panic]
fn test_unauthorized_cancel() {
    let (env, sender, receiver, _token, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    client.cancel_stream(&0, &receiver); // must panic
}

// ─── Test 6: Initialize twice fails ─────────────────────────────────────
#[test]
#[should_panic]
fn test_initialize_twice_fails() {
    let env = Env::default();
    env.mock_all_auths();
    set_ledger(&env, 1000);

    let admin = Address::generate(&env);
    let token_address = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();

    let contract_id = env.register_contract(None, LumensFlowContract);
    let client      = LumensFlowContractClient::new(&env, &contract_id);

    client.initialize(&admin, &token_address);
    client.initialize(&admin, &token_address); // must panic
}

// ─── Test 7: Double withdraw — second must fail ──────────────────────────
// Prevents double-spend: receiver cannot drain the contract twice.
#[test]
fn test_double_withdraw_returns_nothing() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    set_ledger(&env, 1500); // 500 s elapsed = 50_000 withdrawable

    // First withdraw — succeeds
    let first = client.withdraw(&0, &receiver);
    assert_eq!(first, 50_000);

    // Second withdraw immediately — nothing new accrued
    let result = client.try_withdraw(&0, &receiver);
    assert!(result.is_err());

    // Balance unchanged after second attempt
    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 50_000);
}

// ─── Test 8: Cancel after partial withdraw — accounting correct ──────────
// Receiver withdraws first, then sender cancels.
// Receiver must NOT get paid twice for the already-withdrawn amount.
#[test]
fn test_cancel_after_partial_withdraw() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // end_time = 2000
    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    // Receiver withdraws at 300 s elapsed = 30_000
    set_ledger(&env, 1300);
    client.withdraw(&0, &receiver);

    let token = TokenClient::new(&env, &token_address);
    assert_eq!(token.balance(&receiver), 30_000);

    // Sender cancels at 500 s elapsed → streamed = 50_000
    // Receiver already got 30_000, should receive 20_000 more
    // Sender refund = 100_000 − 50_000 = 50_000
    set_ledger(&env, 1500);
    client.cancel_stream(&0, &sender);

    assert_eq!(token.balance(&receiver), 50_000); // 30_000 + 20_000
    // sender: 1_000_000 − 100_000 + 50_000 = 950_000
    assert_eq!(token.balance(&sender), 950_000);

    let stream = client.get_stream(&0);
    assert_eq!(stream.status, StreamStatus::Cancelled);
}

// ─── Test 9: Withdraw at stream start — nothing accrued ─────────────────
#[test]
fn test_withdraw_at_start_fails() {
    let (env, sender, receiver, _token, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    // Still at start_time = 1000, 0 s elapsed
    let result = client.try_withdraw(&0, &receiver);
    assert!(result.is_err());
}

// ─── Test 10: Multiple streams — IDs increment correctly ─────────────────
#[test]
fn test_multiple_streams_correct_ids() {
    let (env, sender, receiver, _token, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    let id0 = client.create_stream(&sender, &receiver, &100_000i128, &1000u64);
    let id1 = client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    assert_eq!(id0, 0);
    assert_eq!(id1, 1);

    let s0 = client.get_stream(&0);
    let s1 = client.get_stream(&1);
    assert_eq!(s0.id, 0);
    assert_eq!(s1.id, 1);
}

// ─── Test 11: Cancel already-cancelled stream fails ──────────────────────
#[test]
fn test_cancel_inactive_stream_fails() {
    let (env, sender, receiver, _token, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);
    set_ledger(&env, 1300);

    client.cancel_stream(&0, &sender); // first cancel — ok

    let result = client.try_cancel_stream(&0, &sender); // second cancel — must fail
    assert!(result.is_err());
}

// ─── Test 12: get_streams_for_user — both parties listed ─────────────────
#[test]
fn test_get_streams_for_user() {
    let (env, sender, receiver, _token, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);
    client.create_stream(&sender, &receiver, &100_000i128, &1000u64);

    let sender_streams   = client.get_streams_for_user(&sender);
    let receiver_streams = client.get_streams_for_user(&receiver);

    assert_eq!(sender_streams.len(),   2);
    assert_eq!(receiver_streams.len(), 2);
    assert_eq!(sender_streams.get(0).unwrap(), 0);
    assert_eq!(sender_streams.get(1).unwrap(), 1);
}

// ─── Test 13: Precise math — no truncation dust at stream end ────────────
// With the formula  deposit * elapsed / duration:
//   (100_000 * 60) / 60 = 100_000  — exact, no remainder.
// The receiver receives the full deposit; the sender gets nothing back.
#[test]
fn test_precise_math_no_dust() {
    let (env, sender, receiver, token_address, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    // flow_rate (informational) = 1_666, but accrual is exact via deposit * elapsed / duration
    client.create_stream(&sender, &receiver, &100_000i128, &60u64);

    set_ledger(&env, 9999); // far past end_time = 1060

    // Receiver withdraws everything
    client.withdraw(&0, &receiver);

    let token = TokenClient::new(&env, &token_address);

    // Receiver gets full 100_000 — no dust because (100_000 * 60) / 60 = 100_000 exactly
    assert_eq!(token.balance(&receiver), 100_000);

    // Sender had 1_000_000, deposited 100_000, no dust back
    assert_eq!(token.balance(&sender), 900_000);

    let stream = client.get_stream(&0);
    assert_eq!(stream.status, StreamStatus::Completed);
}

// ─── Test 14: get_stream on invalid id returns error ─────────────────────
#[test]
fn test_get_stream_invalid_id() {
    let (env, _, _, _, contract_id) = create_test_env();
    let client = LumensFlowContractClient::new(&env, &contract_id);

    let result = client.try_get_stream(&999);
    assert!(result.is_err());
}