import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Types "../types";

module Transfer {
  public class TransferService(config : Types.EnvironmentConfig) {
    
    // ICRC-1 Ledger Interface Types
    public type Account = {
      owner : Principal;
      subaccount : ?[Nat8];
    };

    public type Subaccount = [Nat8];
    public type Tokens = Nat;
    public type Memo = [Nat8];
    public type Timestamp = Nat64;
    public type BlockIndex = Nat;
    public type TransferArg = {
      from_subaccount : ?Subaccount;
      to : Account;
      amount : Tokens;
      fee : ?Tokens;
      memo : ?Memo;
      created_at_time : ?Timestamp;
    };
    public type TransferError = {
      #BadFee : { expected_fee : Tokens };
      #BadBurn : { min_burn_amount : Tokens };
      #InsufficientFunds : { balance : Tokens };
      #TooOld;
      #CreatedInFuture : { ledger_time : Timestamp };
      #TemporarilyUnavailable;
      #Duplicate : { duplicate_of : BlockIndex };
      #GenericError : { error_code : Nat; message : Text };
    };
    public type TransferResult = {
      #Ok : BlockIndex;
      #Err : TransferError;
    };

    // Transfer Arguments
    public type TransferArgs = {
      amount : Nat;
      toAccount : Account;
      tokenType : Text; // "ICP" or "ckUSDC"
      memo : ?Text;
    };

    public type TransferResponse = {
      #Success : {
        blockIndex : BlockIndex;
        transactionId : Text;
        amount : Nat;
        toAccount : Account;
        tokenType : Text;
      };
      #Error : Text;
    };

    // Get the appropriate ledger canister based on token type
    private func getLedgerCanister(tokenType : Text) : Text {
      switch (tokenType) {
        case ("ICP") { config.icpToken.canisterId };
        case ("ckUSDC") { config.ckUSDCToken.canisterId };
        case (_) { "" };
      };
    };

    // Get token fee based on token type
    private func getTokenFee(tokenType : Text) : Nat {
      switch (tokenType) {
        case ("ICP") { config.icpToken.fee };
        case ("ckUSDC") { config.ckUSDCToken.fee };
        case (_) { 0 };
      };
    };

    // Validate transfer arguments
    private func validateTransferArgs(args : TransferArgs) : Result.Result<(), Text> {
      if (args.amount == 0) {
        return #err("Transfer amount must be greater than 0");
      };

      if (Text.size(args.tokenType) == 0) {
        return #err("Token type must be specified");
      };

      if (args.tokenType != "ICP" and args.tokenType != "ckUSDC") {
        return #err("Token type must be either 'ICP' or 'ckUSDC'");
      };

      #ok(());
    };

    // Convert text memo to vec nat8
    private func textToMemo(memo : ?Text) : ?Memo {
      switch (memo) {
        case null { null };
        case (?text) { 
          let blob = Text.encodeUtf8(text);
          let array = Array.tabulate<Nat8>(blob.size(), func(i) = blob.get(i));
          ?array;
        };
      };
    };

    // Perform ICRC-1 transfer
    public func transfer(args : TransferArgs) : async TransferResponse {
      Debug.print(
        "Transferring "
        # debug_show (args.amount)
        # " " # args.tokenType
        # " tokens to account "
        # debug_show (args.toAccount)
      );

      // Validate arguments
      switch (validateTransferArgs(args)) {
        case (#err(error)) {
          return #Error(error);
        };
        case (#ok(_)) {};
      };

      let ledgerCanisterId = getLedgerCanister(args.tokenType);
      if (ledgerCanisterId == "") {
        return #Error("Invalid token type: " # args.tokenType);
      };

      let fee = getTokenFee(args.tokenType);

      let transferArgs : TransferArg = {
        memo = textToMemo(args.memo);
        amount = args.amount;
        from_subaccount = null;
        fee = ?fee;
        to = args.toAccount;
        created_at_time = null;
      };

      try {
        // Create ledger actor
        let ledger = actor (ledgerCanisterId) : actor {
          icrc1_transfer : (TransferArg) -> async TransferResult;
        };

        // Initiate the transfer
        let transferResult = await ledger.icrc1_transfer(transferArgs);

        // Check if the transfer was successful
        switch (transferResult) {
          case (#Err(transferError)) {
            let errorMessage = "Transfer failed: " # debug_show(transferError);
            return #Error(errorMessage);
          };
          case (#Ok(blockIndex)) {
            let transactionId = Nat.toText(blockIndex);
            return #Success({
              blockIndex = blockIndex;
              transactionId = transactionId;
              amount = args.amount;
              toAccount = args.toAccount;
              tokenType = args.tokenType;
            });
          };
        };
      } catch (error : Error) {
        // Catch any errors that might occur during the transfer
        return #Error("Transfer error: " # Error.message(error));
      };
    };

    // Transfer ICP tokens
    public func transferICP(toAccount : Account, amount : Nat, memo : ?Text) : async TransferResponse {
      let args : TransferArgs = {
        amount = amount;
        toAccount = toAccount;
        tokenType = "ICP";
        memo = memo;
      };
      await transfer(args);
    };

    // Transfer ckUSDC tokens
    public func transferCkUSDC(toAccount : Account, amount : Nat, memo : ?Text) : async TransferResponse {
      let args : TransferArgs = {
        amount = amount;
        toAccount = toAccount;
        tokenType = "ckUSDC";
        memo = memo;
      };
      await transfer(args);
    };

    // Get account balance
    public func getBalance(account : Account, tokenType : Text) : async Result.Result<Nat, Text> {
      let ledgerCanisterId = getLedgerCanister(tokenType);
      if (ledgerCanisterId == "") {
        return #err("Invalid token type: " # tokenType);
      };

      try {
        let ledger = actor (ledgerCanisterId) : actor {
          icrc1_balance_of : (Account) -> async Nat;
        };

        let balance = await ledger.icrc1_balance_of(account);
        #ok(balance);
      } catch (error : Error) {
        #err("Failed to get balance: " # Error.message(error));
      };
    };

    // Get ICP balance
    public func getICPBalance(account : Account) : async Result.Result<Nat, Text> {
      await getBalance(account, "ICP");
    };

    // Get ckUSDC balance
    public func getCkUSDCBalance(account : Account) : async Result.Result<Nat, Text> {
      await getBalance(account, "ckUSDC");
    };

    // Get token info
    public func getTokenInfo(tokenType : Text) : async Result.Result<{
      name : Text;
      symbol : Text;
      decimals : Nat8;
      fee : Nat;
    }, Text> {
      switch (tokenType) {
        case ("ICP") {
          #ok({
            name = config.icpToken.name;
            symbol = config.icpToken.symbol;
            decimals = config.icpToken.decimals;
            fee = config.icpToken.fee;
          });
        };
        case ("ckUSDC") {
          #ok({
            name = config.ckUSDCToken.name;
            symbol = config.ckUSDCToken.symbol;
            decimals = config.ckUSDCToken.decimals;
            fee = config.ckUSDCToken.fee;
          });
        };
        case (_) {
          #err("Invalid token type: " # tokenType);
        };
      };
    };
  };
};
