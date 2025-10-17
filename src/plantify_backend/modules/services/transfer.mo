import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Types "../types";

module Transfer {
  public class TransferService(config : Types.EnvironmentConfig) {
    
    // ICRC-1 and ICRC-2 Ledger Interface Types
    public type Account = {
      owner : Principal;
      subaccount : ?[Nat8];
    };

    public type Subaccount = [Nat8];
    public type Tokens = Nat;
    public type Memo = [Nat8];
    public type Timestamp = Nat64;
    public type BlockIndex = Nat;
    
    // ICRC-1 Transfer Types
    public type TransferArg = {
      from_subaccount : ?Subaccount;
      to : Account;
      amount : Tokens;
      fee : ?Tokens;
      memo : ?Memo;
      created_at_time : ?Timestamp;
    };
    
    // ICRC-2 Transfer From Types
    public type TransferFromArg = {
      amount : Tokens;
      created_at_time : ?Timestamp;
      fee : ?Tokens;
      from : Account;
      memo : ?Memo;
      spender_subaccount : ?Subaccount;
      to : Account;
    };
    
    // ICRC-2 Approve Types
    public type ApproveArg = {
      fee : ?Tokens;
      memo : ?Memo;
      from_subaccount : ?Subaccount;
      created_at_time : ?Timestamp;
      amount : Int;
      expected_allowance : ?Int;
      expires_at : ?Int;
      spender : Account;
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

    public type TransferFromError = {
      #BadFee : { expected_fee : Tokens };
      #BadBurn : { min_burn_amount : Tokens };
      #InsufficientFunds : { balance : Tokens };
      #TooOld;
      #CreatedInFuture : { ledger_time : Timestamp };
      #TemporarilyUnavailable;
      #Duplicate : { duplicate_of : BlockIndex };
      #GenericError : { error_code : Nat; message : Text };
      #InsufficientAllowance : { allowance : Tokens };
    };

    public type TransferResult = {
      #Ok : BlockIndex;
      #Err : TransferError;
    };

    public type TransferFromResult = {
      #Ok : BlockIndex;
      #Err : TransferFromError;
    };

    // Transfer Arguments
    public type TransferArgs = {
      amount : Nat;
      toAccount : Account;
      tokenType : Text; // "ICP" or "ckUSDC"
      memo : ?Text;
    };

    // Transfer From Arguments (for ICRC-2)
    public type TransferFromArgs = {
      amount : Nat;
      fromAccount : Account;
      toAccount : Account;
      tokenType : Text; // "ICP" or "ckUSDC"
      memo : ?Text;
    };

    // Approve Arguments (for ICRC-2)
    public type ApproveArgs = {
      amount : Nat;
      spenderAccount : Account;
      tokenType : Text; // "ICP" or "ckUSDC"
      memo : ?Text;
      expiresAt : ?Nat;
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

    // Approve tokens for spending (ICRC-2)
    public func approve(args : ApproveArgs) : async TransferResponse {
      Debug.print(
        "Approving "
        # debug_show (args.amount)
        # " " # args.tokenType
        # " tokens for spender "
        # debug_show (args.spenderAccount)
      );

      // Validate arguments
      if (args.amount == 0) {
        return #Error("Approval amount must be greater than 0");
      };

      if (Text.size(args.tokenType) == 0) {
        return #Error("Token type must be specified");
      };

      if (args.tokenType != "ICP" and args.tokenType != "ckUSDC") {
        return #Error("Token type must be either 'ICP' or 'ckUSDC'");
      };

      let ledgerCanisterId = getLedgerCanister(args.tokenType);
      if (ledgerCanisterId == "") {
        return #Error("Invalid token type: " # args.tokenType);
      };

      let fee = getTokenFee(args.tokenType);

      let approveArgs : ApproveArg = {
        memo = textToMemo(args.memo);
        amount = args.amount;
        from_subaccount = null;
        fee = ?fee;
        spender = args.spenderAccount;
        created_at_time = null;
        expected_allowance = null;
        expires_at = switch (args.expiresAt) {
          case null { null };
          case (?expires) { ?expires };
        };
      };

      try {
        // Create ledger actor
        let ledger = actor (ledgerCanisterId) : actor {
          icrc2_approve : (ApproveArg) -> async TransferFromResult;
        };

        // Initiate the approval
        let approveResult = await ledger.icrc2_approve(approveArgs);

        // Check if the approval was successful
        switch (approveResult) {
          case (#Err(transferError)) {
            let errorMessage = "Approval failed: " # debug_show(transferError);
            return #Error(errorMessage);
          };
          case (#Ok(blockIndex)) {
            let transactionId = Nat.toText(blockIndex);
            return #Success({
              blockIndex = blockIndex;
              transactionId = transactionId;
              amount = args.amount;
              toAccount = args.spenderAccount;
              tokenType = args.tokenType;
            });
          };
        };
      } catch (error : Error) {
        // Catch any errors that might occur during the approval
        return #Error("Approval error: " # Error.message(error));
      };
    };

    // Transfer from account (ICRC-2)
    public func transferFrom(args : TransferFromArgs) : async TransferResponse {
      Debug.print(
        "Transferring "
        # debug_show (args.amount)
        # " " # args.tokenType
        # " tokens from "
        # debug_show (args.fromAccount)
        # " to "
        # debug_show (args.toAccount)
      );

      // Validate arguments
      if (args.amount == 0) {
        return #Error("Transfer amount must be greater than 0");
      };

      if (Text.size(args.tokenType) == 0) {
        return #Error("Token type must be specified");
      };

      if (args.tokenType != "ICP" and args.tokenType != "ckUSDC") {
        return #Error("Token type must be either 'ICP' or 'ckUSDC'");
      };

      let ledgerCanisterId = getLedgerCanister(args.tokenType);
      if (ledgerCanisterId == "") {
        return #Error("Invalid token type: " # args.tokenType);
      };

      let fee = getTokenFee(args.tokenType);

      let transferFromArgs : TransferFromArg = {
        amount = args.amount;
        created_at_time = null;
        fee = ?fee;
        from = args.fromAccount;
        memo = textToMemo(args.memo);
        spender_subaccount = null;
        to = args.toAccount;
      };

      try {
        // Create ledger actor
        let ledger = actor (ledgerCanisterId) : actor {
          icrc2_transfer_from : (TransferFromArg) -> async TransferFromResult;
        };

        // Initiate the transfer
        let transferResult = await ledger.icrc2_transfer_from(transferFromArgs);

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

    // Check if spender has sufficient allowance
    public func checkAllowance(fromAccount : Account, spenderAccount : Account, tokenType : Text) : async Result.Result<{
      allowance : Nat;
      expiresAt : ?Nat;
    }, Text> {
      let ledgerCanisterId = getLedgerCanister(tokenType);
      if (ledgerCanisterId == "") {
        return #err("Invalid token type: " # tokenType);
      };

      try {
        let ledger = actor (ledgerCanisterId) : actor {
          icrc2_allowance : (Account, Account) -> async {
            allowance : Nat;
            expires_at : ?Nat;
          };
        };

        let allowanceResult = await ledger.icrc2_allowance(fromAccount, spenderAccount);
        #ok({
          allowance = allowanceResult.allowance;
          expiresAt = allowanceResult.expires_at;
        });
      } catch (error : Error) {
        #err("Failed to check allowance: " # Error.message(error));
      };
    };


    // Verify a transfer by checking the transaction in the ledger
    public func verifyTransfer(blockIndex : Nat, fromAccount : Account, toAccount : Account, expectedAmount : Nat, tokenType : Text) : async Result.Result<{
      verified : Bool;
      transactionId : Text;
      amount : Nat;
      from : Account;
      to : Account;
    }, Text> {
      let ledgerCanisterId = getLedgerCanister(tokenType);
      if (ledgerCanisterId == "") {
        return #err("Invalid token type: " # tokenType);
      };

      try {
        // Query the ledger to get transaction details
        let ledger = actor (ledgerCanisterId) : actor {
          get_transaction : (Nat) -> async ?{
            operation : {
              #Transfer : {
                from : Account;
                to : Account;
                amount : Nat;
                fee : ?Nat;
                memo : ?[Nat8];
                created_at_time : ?Nat64;
              };
              #Approve : {
                from : Account;
                spender : Account;
                amount : Nat;
                fee : ?Nat;
                memo : ?[Nat8];
                created_at_time : ?Nat64;
                expires_at : ?Nat64;
              };
              #Mint : {
                to : Account;
                amount : Nat;
                fee : ?Nat;
                memo : ?[Nat8];
                created_at_time : ?Nat64;
              };
              #Burn : {
                from : Account;
                amount : Nat;
                fee : ?Nat;
                memo : ?[Nat8];
                created_at_time : ?Nat64;
              };
            };
            fee : Nat;
            timestamp : Nat64;
          };
        };

        switch (await ledger.get_transaction(blockIndex)) {
          case null {
            Debug.print("ERROR: Transaction not found for blockIndex: " # Nat.toText(blockIndex));
            #err("Transaction not found");
          };
          case (?transaction) {
            Debug.print("Transaction found, checking operation type...");
            switch (transaction.operation) {
              case (#Transfer(transfer)) {
                
                // Detailed comparison with debugging
                let fromMatch = transfer.from == fromAccount;
                let toMatch = transfer.to == toAccount;
                
                // Get actual decimal places from the ledger
                let ledger = actor (ledgerCanisterId) : actor {
                  icrc1_decimals : () -> async Nat8;
                };
                let actualDecimals = await ledger.icrc1_decimals();
                let decimalMultiplier = Nat.pow(10, Nat8.toNat(actualDecimals));
                let expectedAmountWithDecimals = expectedAmount * decimalMultiplier;
                let amountMatch = transfer.amount == expectedAmountWithDecimals;
                
                Debug.print("FROM account comparison:");
                Debug.print("  Expected: " # debug_show(fromAccount));
                Debug.print("  Actual: " # debug_show(transfer.from));
                Debug.print("  Match: " # debug_show(fromMatch));
                
                Debug.print("TO account comparison:");
                Debug.print("  Expected: " # debug_show(toAccount));
                Debug.print("  Actual: " # debug_show(transfer.to));
                Debug.print("  Match: " # debug_show(toMatch));

                Debug.print("AMOUNT comparison:");
                Debug.print("  Token type: " # tokenType);
                Debug.print("  Actual decimals from ledger: " # Nat8.toText(actualDecimals));
                Debug.print("  Decimal multiplier: " # debug_show(decimalMultiplier));
                Debug.print("  Expected (raw): " # debug_show(expectedAmount));
                Debug.print("  Expected (with decimals): " # debug_show(expectedAmountWithDecimals));
                Debug.print("  Actual: " # debug_show(transfer.amount));
                Debug.print("  Match: " # debug_show(amountMatch));
                
                Debug.print("From account matches: " # debug_show(fromMatch));
                Debug.print("To account matches: " # debug_show(toMatch));
                Debug.print("Amount matches: " # debug_show(amountMatch));
                
                if (fromMatch and toMatch and amountMatch) {
                  Debug.print("SUCCESS: All verification checks passed");
                  #ok({
                    verified = true;
                    transactionId = Nat.toText(blockIndex);
                    amount = transfer.amount;
                    from = transfer.from;
                    to = transfer.to;
                  });
                } else {
                  Debug.print("FAILURE: Verification checks failed");
                  Debug.print("Expected from: " # debug_show(fromAccount));
                  Debug.print("Actual from: " # debug_show(transfer.from));
                  Debug.print("Expected to: " # debug_show(toAccount));
                  Debug.print("Actual to: " # debug_show(transfer.to));
                  Debug.print("Expected amount: " # Nat.toText(expectedAmount));
                  Debug.print("Actual amount: " # Nat.toText(transfer.amount));
                  
                  #ok({
                    verified = false;
                    transactionId = Nat.toText(blockIndex);
                    amount = transfer.amount;
                    from = transfer.from;
                    to = transfer.to;
                  });
                };
              };
              case (_) {
                Debug.print("ERROR: Transaction is not a transfer operation");
                #err("Transaction is not a transfer");
              };
            };
          };
        };
      } catch (error : Error) {
        Debug.print("ERROR: Exception during verification: " # Error.message(error));
        #err("Failed to verify transfer: " # Error.message(error));
      };
    };
  };
};
