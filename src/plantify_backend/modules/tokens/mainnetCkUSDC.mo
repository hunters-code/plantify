import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Option "mo:base/Option";

module MainnetCkUSDC {
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

    public class MainnetCkUSDCToken(canisterId : Text) {
        private let ledgerCanisterId = canisterId;

        public func icrc1_name() : async Text {
            "CkUSDC";
        };

        public func icrc1_symbol() : async Text {
            "ckUSDC";
        };

        public func icrc1_decimals() : async Nat8 {
            6;
        };

        public func icrc1_fee() : async Nat {
            1000;
        };

        public func icrc1_metadata() : async [(Text, MetadataValue)] {
            [
                ("icrc1:fee", #Nat(1000)),
                ("icrc1:name", #Text("CkUSDC")),
                ("icrc1:symbol", #Text("ckUSDC")),
                ("icrc1:decimals", #Nat(6)),
            ];
        };

        public func icrc1_total_supply() : async Nat {
            0;
        };

        public func icrc1_minting_account() : async ?Account {
            null;
        };

        public func icrc1_balance_of(account : Account) : async Nat {
            0;
        };

        public func icrc1_transfer(args : TransferArgs) : async TransferResult {
            #Err(#GenericError { error_code = 999; message = "Mainnet integration not implemented yet" });
        };

        public func icrc1_approve(args : ApproveArgs) : async ApproveResult {
            #Err(#GenericError { error_code = 999; message = "Mainnet integration not implemented yet" });
        };

        public func icrc1_allowance(args : AllowanceArgs) : async Int {
            0;
        };

        public func mint(to : Account, amount : Nat) : async Result.Result<Nat, Text> {
            #err("Minting not available for mainnet token");
        };

        public func get_balance(account : Account) : async Nat {
            await icrc1_balance_of(account);
        };

        public func get_total_supply() : async Nat {
            await icrc1_total_supply();
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
    };
};
