import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Nat8 "mo:base/Nat8";

module CkUSDC {
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

    public class CkUSDCToken() {
        private let name : Text = "CkUSDC Test Token";
        private let symbol : Text = "ckUSDC";
        private let decimals : Nat8 = 6;
        private let fee : Nat = 1000;
        private let max_supply : Nat = 1000000000000;

        private var balances = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);
        private var total_supply : Nat = 0;
        private var next_txid : Nat = 0;

        private func _getAccountId(account : Account) : Text {
            Principal.toText(account.owner);
        };

        private func _mint(to : Account, amount : Nat) : Result.Result<Nat, Text> {
            if (total_supply + amount > max_supply) {
                return #err("Max supply exceeded");
            };
            let account_id = _getAccountId(to);
            let current_balance = Option.get(balances.get(account_id), 0);
            balances.put(account_id, current_balance + amount);
            total_supply += amount;
            #ok(next_txid);
        };

        public func icrc1_name() : Text {
            name;
        };

        public func icrc1_symbol() : Text {
            symbol;
        };

        public func icrc1_decimals() : Nat8 {
            decimals;
        };

        public func icrc1_fee() : Nat {
            fee;
        };

        public func icrc1_total_supply() : Nat {
            total_supply;
        };

        public func icrc1_balance_of(account : Account) : Nat {
            let account_id = _getAccountId(account);
            Option.get(balances.get(account_id), 0);
        };

        public func icrc1_transfer(args : TransferArgs) : TransferResult {
            let from_id = _getAccountId({ owner = Principal.fromText("current_principal"); subaccount = args.from_subaccount });
            let to_id = _getAccountId(args.to);
            let transfer_fee = Option.get(args.fee, fee);
            let amount_with_fee = args.amount + transfer_fee;

            let from_balance = Option.get(balances.get(from_id), 0);
            if (from_balance < amount_with_fee) {
                return #Err(#InsufficientFunds { balance = from_balance });
            };

            let to_balance = Option.get(balances.get(to_id), 0);
            balances.put(from_id, from_balance - amount_with_fee);
            balances.put(to_id, to_balance + args.amount);

            next_txid += 1;
            #Ok(next_txid - 1);
        };

        public func mint(to : Account, amount : Nat) : Result.Result<Nat, Text> {
            _mint(to, amount);
        };

        public func get_balance(account : Account) : Nat {
            icrc1_balance_of(account);
        };

        public func get_total_supply() : Nat {
            total_supply;
        };

        public func icrc1_metadata() : [(Text, MetadataValue)] {
            [
                ("icrc1:fee", #Nat(fee)),
                ("icrc1:name", #Text(name)),
                ("icrc1:symbol", #Text(symbol)),
                ("icrc1:decimals", #Nat(Nat8.toNat(decimals))),
            ];
        };

        public func icrc1_minting_account() : ?Account {
            null;
        };

        public func icrc1_approve(_args : ApproveArgs) : ApproveResult {
            #Err(#GenericError { error_code = 999; message = "Approve not implemented in test token" });
        };

        public func icrc1_allowance(_args : AllowanceArgs) : Int {
            0;
        };
    };
};