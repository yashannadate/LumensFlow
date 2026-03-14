#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, Symbol, Vec,
};

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

// ─── Contract ───────────────────────────────────────────────────────────
#[contract]
pub struct LumensFlowContract;

#[contractimpl]
impl LumensFlowContract {
    /// Initialize the contract. Can only be called once.
    pub fn initialize(env: Env, admin: Address, token_address: Address) {
        admin.require_auth();
        assert!(
            !env.storage().persistent().has(&DataKey::TokenAddress),
            "already initialized"
        );
        env.storage().persistent().set(&DataKey::TokenAddress, &token_address);
        env.storage().persistent().set(&DataKey::StreamCounter, &0u32);
        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Create a new payment stream.
    ///
    /// - `sender`: the address funding the stream (must authorize)
    /// - `receiver`: the address receiving the streamed funds
    /// - `deposit_amount`: total XLM (in stroops) to lock
    /// - `duration`: stream length in seconds
    ///
    /// Returns the new `stream_id`.
    pub fn create_stream(
        env: Env,
        sender: Address,
        receiver: Address,
        deposit_amount: i128,
        duration: u64,
    ) -> u32 {
        sender.require_auth();

        assert!(deposit_amount > 0, "deposit must be positive");
        assert!(duration > 0, "duration must be positive");
        assert!(sender != receiver, "sender cannot be receiver");
        assert!(duration >= 60, "minimum duration is 60 seconds");

        // Calculate flow rate (stroops per second)
        let flow_rate = deposit_amount / (duration as i128);
        assert!(flow_rate > 0, "flow rate must be positive");

        let start_time = env.ledger().timestamp();
        let end_time = start_time + duration;

        // Transfer deposit from sender → contract
        let token_address: Address = env
            .storage()
            .persistent()
            .get(&DataKey::TokenAddress)
            .unwrap();
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&sender, &env.current_contract_address(), &deposit_amount);

        // Increment stream counter
        let stream_id: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::StreamCounter)
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&DataKey::StreamCounter, &(stream_id + 1));

        // Create the stream object
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

        // Store stream
        env.storage()
            .persistent()
            .set(&DataKey::Stream(stream_id), &stream);

        // Add stream_id to sender's list
        let mut sender_streams: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::UserStreams(sender.clone()))
            .unwrap_or(Vec::new(&env));
        sender_streams.push_back(stream_id);
        env.storage()
            .persistent()
            .set(&DataKey::UserStreams(sender.clone()), &sender_streams);

        // Add stream_id to receiver's list
        let mut receiver_streams: Vec<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::UserStreams(receiver.clone()))
            .unwrap_or(Vec::new(&env));
        receiver_streams.push_back(stream_id);
        env.storage()
            .persistent()
            .set(&DataKey::UserStreams(receiver.clone()), &receiver_streams);

        // Emit StreamCreated event
        env.events().publish(
            (STREAM_CREATED, stream_id),
            (
                sender,
                receiver,
                deposit_amount,
                flow_rate,
            ),
        );

        stream_id
    }

    /// Withdraw available streamed funds (receiver only).
    pub fn withdraw(env: Env, stream_id: u32, receiver: Address) -> i128 {
        receiver.require_auth();

        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .unwrap();

        assert!(stream.is_active, "stream is not active");
        assert!(
            stream.receiver == receiver,
            "only receiver can withdraw"
        );

        let withdrawable = Self::_withdrawable(&env, &stream);
        assert!(withdrawable > 0, "nothing to withdraw");

        // Transfer funds to receiver
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

        // Update withdrawn amount
        stream.withdrawn_amount += withdrawable;

        // If fully withdrawn past end_time, deactivate
        let now = env.ledger().timestamp();
        if now >= stream.end_time && stream.withdrawn_amount >= stream.deposit_amount {
            stream.is_active = false;
        }

        env.storage()
            .persistent()
            .set(&DataKey::Stream(stream_id), &stream);

        // Emit FundsWithdrawn event
        env.events().publish(
            (FUNDS_WITHDRAWN, stream_id),
            (receiver, withdrawable),
        );

        withdrawable
    }

    /// Cancel an active stream (sender only).
    /// Sends already-streamed funds to receiver, refunds rest to sender.
    pub fn cancel_stream(env: Env, stream_id: u32, sender: Address) {
        sender.require_auth();

        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .unwrap();

        assert!(stream.is_active, "stream is not active");
        assert!(stream.sender == sender, "only sender can cancel");

        let now = env.ledger().timestamp();

        // Calculate streamed amount (clamped)
        let elapsed = if now >= stream.end_time {
            stream.end_time - stream.start_time
        } else {
            now - stream.start_time
        };
        let mut streamed = stream.flow_rate * (elapsed as i128);
        if streamed > stream.deposit_amount {
            streamed = stream.deposit_amount;
        }

        // Amount still owed to receiver (minus what they already withdrew)
        let receiver_amount = streamed - stream.withdrawn_amount;

        // Refund remaining to sender
        let sender_refund = stream.deposit_amount - streamed;

        let token_address: Address = env
            .storage()
            .persistent()
            .get(&DataKey::TokenAddress)
            .unwrap();
        let token_client = token::Client::new(&env, &token_address);

        // Pay receiver what's been streamed but not yet withdrawn
        if receiver_amount > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &stream.receiver,
                &receiver_amount,
            );
        }

        // Refund sender the unstreamed portion
        if sender_refund > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &stream.sender,
                &sender_refund,
            );
        }

        // Mark inactive
        stream.is_active = false;
        stream.withdrawn_amount = streamed;
        env.storage()
            .persistent()
            .set(&DataKey::Stream(stream_id), &stream);

        // Emit StreamCancelled event
        env.events()
            .publish((STREAM_CANCELLED, stream_id), sender);
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

    /// Get all stream IDs associated with an address (both sent and received).
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
        // Clamp to deposit_amount
        if streamed > stream.deposit_amount {
            streamed = stream.deposit_amount;
        }

        let withdrawable = streamed - stream.withdrawn_amount;
        if withdrawable < 0 {
            0
        } else {
            withdrawable
        }
    }
}

#[cfg(test)]
mod test;
