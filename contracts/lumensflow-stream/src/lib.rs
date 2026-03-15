#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, symbol_short,
    token, Address, Env, Symbol, Vec,
};

// ─── Error Codes ────────────────────────────────────────────────────────
#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum StreamError {
    AlreadyInitialized = 1,
    NotInitialized     = 2,
    NotActive          = 3,
    NotReceiver        = 4,
    NotSender          = 5,
    NothingToWithdraw  = 6,
    InvalidDeposit     = 7,
    InvalidDuration    = 8,
    SenderIsReceiver   = 9,
    FlowRateZero       = 10,
}

// ─── Stream Data Structure ──────────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Stream {
    pub id: u32,
    pub sender: Address,
    pub receiver: Address,
    pub deposit_amount: i128,
    pub flow_rate: i128,
    pub start_time: u64,
    pub end_time: u64,
    pub withdrawn_amount: i128,
    pub is_active: bool,
}

// ─── Storage Keys ───────────────────────────────────────────────────────
#[contracttype]
pub enum DataKey {
    StreamCounter,
    Stream(u32),
    UserStreams(Address),
    TokenAddress,
    Admin,
}

// ─── Event Topics ───────────────────────────────────────────────────────
const STREAM_CREATED: Symbol = symbol_short!("created");
const FUNDS_WITHDRAWN: Symbol = symbol_short!("withdraw");
const STREAM_CANCELLED: Symbol = symbol_short!("cancel");

// ─── TTL constant (~1 year in ledgers at ~5s per ledger) ────────────────
const STREAM_TTL_LEDGERS: u32 = 535_000;

// ─── Contract ───────────────────────────────────────────────────────────
#[contract]
pub struct LumensFlowContract;

#[contractimpl]
impl LumensFlowContract {
    /// Initialize the contract. Can only be called once.
    pub fn initialize(env: Env, admin: Address, token_address: Address) -> Result<(), StreamError> {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::TokenAddress) {
            return Err(StreamError::AlreadyInitialized);
        }

        env.storage().persistent().set(&DataKey::TokenAddress, &token_address);
        env.storage().persistent().set(&DataKey::StreamCounter, &0u32);
        env.storage().persistent().set(&DataKey::Admin, &admin);

        Ok(())
    }

    /// Create a new payment stream.
    pub fn create_stream(
        env: Env,
        sender: Address,
        receiver: Address,
        deposit_amount: i128,
        duration: u64,
    ) -> Result<u32, StreamError> {
        sender.require_auth();

        if deposit_amount <= 0 {
            return Err(StreamError::InvalidDeposit);
        }
        if duration < 60 {
            return Err(StreamError::InvalidDuration);
        }
        if sender == receiver {
            return Err(StreamError::SenderIsReceiver);
        }

        let flow_rate = deposit_amount / (duration as i128);
        if flow_rate <= 0 {
            return Err(StreamError::FlowRateZero);
        }

        let token_address: Address = env
            .storage()
            .persistent()
            .get(&DataKey::TokenAddress)
            .ok_or(StreamError::NotInitialized)?;

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&sender, &env.current_contract_address(), &deposit_amount);

        let stream_id: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::StreamCounter)
            .unwrap_or(0);

        env.storage()
            .persistent()
            .set(&DataKey::StreamCounter, &(stream_id + 1));

        let start_time = env.ledger().timestamp();
        let end_time = start_time + duration;

        let stream = Stream {
            id: stream_id,
            sender: sender.clone(),
            receiver: receiver.clone(),
            deposit_amount,
            flow_rate,
            start_time,
            end_time,
            withdrawn_amount: 0,
            is_active: true,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Stream(stream_id), &stream);

        // ── Extend TTL so stream data survives for ~1 year ──────────────
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Stream(stream_id), STREAM_TTL_LEDGERS, STREAM_TTL_LEDGERS);

        // Add to sender's stream list
        let mut sender_streams: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::UserStreams(sender.clone()))
            .unwrap_or(Vec::new(&env));
        sender_streams.push_back(stream_id);
        env.storage()
            .persistent()
            .set(&DataKey::UserStreams(sender.clone()), &sender_streams);

        // Add to receiver's stream list
        let mut receiver_streams: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::UserStreams(receiver.clone()))
            .unwrap_or(Vec::new(&env));
        receiver_streams.push_back(stream_id);
        env.storage()
            .persistent()
            .set(&DataKey::UserStreams(receiver.clone()), &receiver_streams);

        env.events().publish(
            (STREAM_CREATED, stream_id),
            (sender, receiver, deposit_amount, flow_rate),
        );

        Ok(stream_id)
    }

    /// Withdraw available streamed funds (receiver only).
    pub fn withdraw(env: Env, stream_id: u32, receiver: Address) -> Result<i128, StreamError> {
        receiver.require_auth();

        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .unwrap();

        if !stream.is_active {
            return Err(StreamError::NotActive);
        }
        if stream.receiver != receiver {
            return Err(StreamError::NotReceiver);
        }

        let withdrawable = Self::_withdrawable(&env, &stream);
        if withdrawable <= 0 {
            return Err(StreamError::NothingToWithdraw);
        }

        let token_address: Address = env
            .storage()
            .persistent()
            .get(&DataKey::TokenAddress)
            .unwrap();
        let token_client = token::Client::new(&env, &token_address);

        token_client.transfer(
            &env.current_contract_address(),
            &receiver,
            &withdrawable,
        );

        stream.withdrawn_amount += withdrawable;

        let now = env.ledger().timestamp();

        // ── Deactivate + dust refund when stream fully ends ─────────────
        if now >= stream.end_time {
            let total_streamed = (stream.flow_rate
                * (stream.end_time - stream.start_time) as i128)
                .min(stream.deposit_amount);

            if stream.withdrawn_amount >= total_streamed {
                stream.is_active = false;

                // Refund truncation dust to sender
                let dust = stream.deposit_amount.saturating_sub(total_streamed);
                if dust > 0 {
                    token_client.transfer(
                        &env.current_contract_address(),
                        &stream.sender,
                        &dust,
                    );
                }
            }
        }

        // ── Bump TTL to keep stream data alive ──────────────────────────
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Stream(stream_id), STREAM_TTL_LEDGERS, STREAM_TTL_LEDGERS);

        env.storage()
            .persistent()
            .set(&DataKey::Stream(stream_id), &stream);

        env.events().publish(
            (FUNDS_WITHDRAWN, stream_id),
            (receiver, withdrawable),
        );

        Ok(withdrawable)
    }

    /// Cancel an active stream (sender only).
    pub fn cancel_stream(env: Env, stream_id: u32, sender: Address) -> Result<(), StreamError> {
        sender.require_auth();

        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .unwrap();

        if !stream.is_active {
            return Err(StreamError::NotActive);
        }
        if stream.sender != sender {
            return Err(StreamError::NotSender);
        }

        let now = env.ledger().timestamp();

        let elapsed = if now >= stream.end_time {
            stream.end_time - stream.start_time
        } else {
            now - stream.start_time
        };

        let mut streamed = stream.flow_rate * (elapsed as i128);
        if streamed > stream.deposit_amount {
            streamed = stream.deposit_amount;
        }

        // What receiver is still owed (not yet withdrawn)
        let receiver_amount = streamed - stream.withdrawn_amount;

        // Refund unstreamed + dust back to sender
        let sender_refund = stream.deposit_amount - streamed;

        let token_address: Address = env
            .storage()
            .persistent()
            .get(&DataKey::TokenAddress)
            .unwrap();
        let token_client = token::Client::new(&env, &token_address);

        if receiver_amount > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &stream.receiver,
                &receiver_amount,
            );
        }

        if sender_refund > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &stream.sender,
                &sender_refund,
            );
        }

        stream.is_active = false;
        stream.withdrawn_amount = streamed;

        env.storage()
            .persistent()
            .set(&DataKey::Stream(stream_id), &stream);

        env.events()
            .publish((STREAM_CANCELLED, stream_id), sender);

        Ok(())
    }

    /// Get the full stream object.
    pub fn get_stream(env: Env, stream_id: u32) -> Stream {
        env.storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .unwrap()
    }

    /// Calculate the amount currently available for withdrawal.
    pub fn withdrawable_amount(env: Env, stream_id: u32) -> i128 {
        let stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .unwrap();
        Self::_withdrawable(&env, &stream)
    }

    /// Get all stream IDs associated with an address.
    pub fn get_streams_for_user(env: Env, address: Address) -> Vec<u32> {
        env.storage()
            .persistent()
            .get(&DataKey::UserStreams(address))
            .unwrap_or(Vec::new(&env))
    }

    // ─── Internal helper ────────────────────────────────────────────────
    fn _withdrawable(env: &Env, stream: &Stream) -> i128 {
        if !stream.is_active {
            return 0;
        }

        let now = env.ledger().timestamp();

        let elapsed = if now >= stream.end_time {
            stream.end_time - stream.start_time
        } else if now <= stream.start_time {
            0u64
        } else {
            now - stream.start_time
        };

        let mut streamed = stream.flow_rate * (elapsed as i128);
        if streamed > stream.deposit_amount {
            streamed = stream.deposit_amount;
        }

        let withdrawable = streamed - stream.withdrawn_amount;
        if withdrawable < 0 { 0 } else { withdrawable }
    }
}

#[cfg(test)]
mod test;