import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Types "../types";
import CkUSDC "./ckUSDC";
import MainnetCkUSDC "./mainnetCkUSDC";

module TokenFactory {
    public type Account = {
        owner : Principal;
        subaccount : ?[Nat8];
    };

    public type TransferArgs = {
        from_subaccount : ?[Nat8];
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?[Nat8];
        created_at_time : ?Nat64;
    };

    public type TransferResult = {
        #Ok : Nat;
        #Err : TransferError;
    };

    public type TransferError = {
        #BadFee : { expected_fee : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #InsufficientFunds : { balance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #TemporarilyUnavailable;
        #Duplicate : { duplicate_of : Nat };
        #GenericError : { error_code : Nat; message : Text };
    };

    public type ApproveArgs = {
        from_subaccount : ?[Nat8];
        spender : Account;
        amount : Int;
        expires_at : ?Nat64;
        fee : ?Nat;
        memo : ?[Nat8];
        created_at_time : ?Nat64;
    };

    public type ApproveResult = {
        #Ok : Nat;
        #Err : ApproveError;
    };

    public type ApproveError = {
        #BadFee : { expected_fee : Nat };
        #InsufficientFunds : { balance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    public type AllowanceArgs = {
        account : Account;
        spender : Account;
    };

    public type MetadataValue = {
        #Text : Text;
        #Blob : [Nat8];
        #Nat : Nat;
        #Int : Int;
    };

    public type StandardRecord = {
        name : Text;
        url : Text;
    };

    public type TokenInfo = {
        name : Text;
        symbol : Text;
        decimals : Nat8;
        fee : Nat;
        totalSupply : Nat;
    };

    public class TokenService(config : Types.EnvironmentConfig) {
        private let useTestToken = config.useTestToken;
        private let testToken = CkUSDC.CkUSDCToken();
        private let mainnetToken = switch (config.mainnetCkUSDC) {
            case null { null };
            case (?mainnetConfig) { ?MainnetCkUSDC.MainnetCkUSDCToken(mainnetConfig.canisterId) };
        };

        public func icrc1_name() : async Text {
            if (useTestToken) {
                testToken.icrc1_name();
            } else {
                switch (mainnetToken) {
                    case null { "CkUSDC" };
                    case (?token) { await token.icrc1_name() };
                };
            };
        };

        public func icrc1_symbol() : async Text {
            if (useTestToken) {
                testToken.icrc1_symbol();
            } else {
                switch (mainnetToken) {
                    case null { "ckUSDC" };
                    case (?token) { await token.icrc1_symbol() };
                };
            };
        };

        public func icrc1_decimals() : async Nat8 {
            if (useTestToken) {
                testToken.icrc1_decimals();
            } else {
                switch (mainnetToken) {
                    case null { 6 };
                    case (?token) { await token.icrc1_decimals() };
                };
            };
        };

        public func icrc1_fee() : async Nat {
            if (useTestToken) {
                testToken.icrc1_fee();
            } else {
                switch (mainnetToken) {
                    case null { 1000 };
                    case (?token) { await token.icrc1_fee() };
                };
            };
        };

        public func icrc1_metadata() : async [(Text, MetadataValue)] {
            if (useTestToken) {
                testToken.icrc1_metadata();
            } else {
                switch (mainnetToken) {
                    case null { [] };
                    case (?token) { await token.icrc1_metadata() };
                };
            };
        };

        public func icrc1_total_supply() : async Nat {
            if (useTestToken) {
                testToken.icrc1_total_supply();
            } else {
                switch (mainnetToken) {
                    case null { 0 };
                    case (?token) { await token.icrc1_total_supply() };
                };
            };
        };

        public func icrc1_minting_account() : async ?Account {
            if (useTestToken) {
                testToken.icrc1_minting_account();
            } else {
                switch (mainnetToken) {
                    case null { null };
                    case (?token) { await token.icrc1_minting_account() };
                };
            };
        };

        public func icrc1_balance_of(account : Account) : async Nat {
            if (useTestToken) {
                testToken.icrc1_balance_of(account);
            } else {
                switch (mainnetToken) {
                    case null { 0 };
                    case (?token) { await token.icrc1_balance_of(account) };
                };
            };
        };

        public func icrc1_transfer(args : TransferArgs) : async TransferResult {
            if (useTestToken) {
                testToken.icrc1_transfer(args);
            } else {
                switch (mainnetToken) {
                    case null { #Err(#GenericError { error_code = 999; message = "Mainnet token not configured" }) };
                    case (?token) { await token.icrc1_transfer(args) };
                };
            };
        };

        public func icrc1_approve(args : ApproveArgs) : async ApproveResult {
            if (useTestToken) {
                testToken.icrc1_approve(args);
            } else {
                switch (mainnetToken) {
                    case null { #Err(#GenericError { error_code = 999; message = "Mainnet token not configured" }) };
                    case (?token) { await token.icrc1_approve(args) };
                };
            };
        };

        public func icrc1_allowance(args : AllowanceArgs) : async Int {
            if (useTestToken) {
                testToken.icrc1_allowance(args);
            } else {
                switch (mainnetToken) {
                    case null { 0 };
                    case (?token) { await token.icrc1_allowance(args) };
                };
            };
        };

        public func mint(to : Account, amount : Nat) : async Result.Result<Nat, Text> {
            if (useTestToken) {
                testToken.mint(to, amount);
            } else {
                #err("Minting not available for mainnet token");
            };
        };

        public func get_balance(account : Account) : async Nat {
            if (useTestToken) {
                testToken.get_balance(account);
            } else {
                switch (mainnetToken) {
                    case null { 0 };
                    case (?token) { await token.get_balance(account) };
                };
            };
        };

        public func get_total_supply() : async Nat {
            if (useTestToken) {
                testToken.get_total_supply();
            } else {
                switch (mainnetToken) {
                    case null { 0 };
                    case (?token) { await token.get_total_supply() };
                };
            };
        };

        public func get_token_info() : async TokenInfo {
            {
                name = await icrc1_name();
                symbol = await icrc1_symbol();
                decimals = await icrc1_decimals();
                fee = await icrc1_fee();
                totalSupply = await icrc1_total_supply();
            };
        };

        public func is_test_token() : Bool {
            useTestToken;
        };

        public func get_config() : Types.EnvironmentConfig {
            config;
        };
    };
};
