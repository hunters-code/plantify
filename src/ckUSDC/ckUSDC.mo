// Use this token for testing purposes only!
// Please visit https://github.com/dfinity/ICRC-1 to find
// the latest version of the ICP token standards.

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";

persistent actor class ckUSDC() = this {

  // Initialize ckUSDC token with proper values
  var init : {
    initial_mints : [{
      account : { owner : Principal; subaccount : ?Blob };
      amount : Nat;
    }];
    minting_account : { owner : Principal; subaccount : ?Blob };
    token_name : Text;
    token_symbol : Text;
    decimals : Nat8;
    transfer_fee : Nat;
  } = {
    initial_mints = [];
    minting_account = {
      owner = Principal.fromBlob("\04");
      subaccount = null;
    };
    token_name = "CkUSDC Token";
    token_symbol = "ckUSDC";
    decimals = 8;
    transfer_fee = 0;
  };

  var logo : Text = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjE0NiIgdmlld0JveD0iMCAwIDE0NiAxNDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDYiIGhlaWdodD0iMTQ2IiByeD0iNzMiIGZpbGw9IiMzQjAwQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi4zODM3IDc3LjIwNTJDMTguNDM0IDEwNS4yMDYgNDAuNzk0IDEyNy41NjYgNjguNzk0OSAxMjkuNjE2VjEzNS45NEMzNy4zMDg3IDEzMy44NjcgMTIuMTMzIDEwOC42OTEgMTAuMDYwNSA3Ny4yMDUySDE2LjM4MzdaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTEwXzYwNCkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02OC43NjQ2IDE2LjM1MzRDNDAuNzYzOCAxOC40MDM2IDE4LjQwMzcgNDAuNzYzNyAxNi4zNTM1IDY4Ljc2NDZMMTAuMDMwMyA2OC43NjQ2QzEyLjEwMjcgMzcuMjc4NCAzNy4yNzg1IDEyLjEwMjYgNjguNzY0NiAxMC4wMzAyTDY4Ljc2NDYgMTYuMzUzNFoiIGZpbGw9IiMyOUFCRTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMjkuNjE2IDY4LjczNDNDMTI3LjU2NiA0MC43MzM0IDEwNS4yMDYgMTguMzczMyA3Ny4yMDUxIDE2LjMyMzFMNzcuMjA1MSA5Ljk5OTk4QzEwOC42OTEgMTIuMDcyNCAxMzMuODY3IDM3LjI0ODEgMTM1LjkzOSA2OC43MzQzTDEyOS42MTYgNjguNzM0M1oiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8xMTBfNjA0KSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTc3LjIzNTQgMTI5LjU4NkMxMDUuMjM2IDEyNy41MzYgMTI3LjU5NiAxMDUuMTc2IDEyOS42NDcgNzcuMTc0OUwxMzUuOTcgNzcuMTc0OUMxMzMuODk3IDEwOC42NjEgMTA4LjcyMiAxMzMuODM3IDc3LjIzNTQgMTM1LjkwOUw3Ny4yMzU0IDEyOS41ODZaIiBmaWxsPSIjMjlBQkUyIi8+CjxwYXRoIGQ9Ik04OS4yMjUzIDgyLjMzOTdDODkuMjI1MyA3My43Mzc1IDg0LjA2MjggNzAuNzg3NSA3My43Mzc4IDY5LjU1NDRDNjYuMzYyOCA2OC41NjkxIDY0Ljg4NzggNjYuNjA0NCA2NC44ODc4IDYzLjE2NDdDNjQuODg3OCA1OS43MjUgNjcuMzQ4MSA1Ny41MTI1IDcyLjI2MjggNTcuNTEyNUM3Ni42ODc4IDU3LjUxMjUgNzkuMTQ4MSA1OC45ODc1IDgwLjM3NTMgNjIuNjc1QzgwLjYyMzEgNjMuNDEyNSA4MS4zNjA2IDYzLjkwMjIgODIuMDk4MSA2My45MDIySDg2LjAzMzRDODcuMDE4NyA2My45MDIyIDg3Ljc1NjIgNjMuMTY0NyA4Ny43NTYyIDYyLjE3OTRWNjEuOTMxNkM4Ni43NzA5IDU2LjUyMTMgODIuMzQ1OSA1Mi4zNDQxIDc2LjY5MzcgNTEuODU0NFY0NS45NTQ0Qzc2LjY5MzcgNDQuOTY5MSA3NS45NTYyIDQ0LjIzMTYgNzQuNzI5IDQzLjk4OTdINzEuMDQxNUM3MC4wNTYyIDQzLjk4OTcgNjkuMzE4NyA0NC43MjcyIDY5LjA3NjggNDUuOTU0NFY1MS42MDY2QzYxLjcwMTggNTIuNTkxOSA1Ny4wMjkgNTcuNTA2NiA1Ny4wMjkgNjMuNjU0NEM1Ny4wMjkgNzEuNzY2OSA2MS45NDM3IDc0Ljk2NDcgNzIuMjY4NyA3Ni4xOTE5Qzc5LjE1NCA3Ny40MTkxIDgxLjM2NjUgNzguODk0MSA4MS4zNjY1IDgyLjgyOTRDODEuMzY2NSA4Ni43NjQ3IDc3LjkyNjggODkuNDY2OSA3My4yNTQgODkuNDY2OUM2Ni44NjQzIDg5LjQ2NjkgNjQuNjUxOCA4Ni43NjQ3IDYzLjkxNDMgODMuMDc3MkM2My42NjY1IDgyLjA5MTkgNjIuOTI5IDgxLjYwMjIgNjIuMTkxNSA4MS42MDIySDU4LjAxNDNDNTcuMDI5IDgxLjYwMjIgNTYuMjkxNSA4Mi4zMzk3IDU2LjI5MTUgODMuMzI1VjgzLjU3MjhDNTcuMjc2OCA4OS43MjA2IDYxLjIwNjIgOTQuMTQ1NiA2OS4zMTg3IDk1LjM3MjhWMTAxLjI3M0M2OS4zMTg3IDEwMi4yNTggNzAuMDU2MiAxMDIuOTk2IDcxLjI4MzQgMTAzLjIzN0g3NC45NzA5Qzc1Ljk1NjIgMTAzLjIzNyA3Ni42OTM3IDEwMi41IDc2LjkzNTYgMTAxLjI3M1Y5NS4zNzI4Qzg0LjMwNDcgOTQuMTM5NyA4OS4yMjUzIDg4Ljk3NzIgODkuMjI1MyA4Mi4zMzk3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYwLjQ2MjYgMTA4LjE1MkM0MS4yODc2IDEwMS4yNjcgMzEuNDUyMyA3OS44Nzk0IDM4LjU4NTQgNjAuOTUyMkM0Mi4yNzI5IDUwLjYyNzIgNTAuMzg1NCA0Mi43NjI1IDYwLjQ2MjYgMzkuMDc1QzYxLjQ0NzggMzguNTg1MyA2MS45Mzc1IDM3Ljg0NzggNjEuOTM3NSAzNi42MTQ3VjMzLjE3NUM2MS45Mzc1IDMyLjE4OTcgNjEuNDQ3OCAzMS40NTIyIDYwLjQ2MjYgMzEuMjEwM0M2MC4yMTQ4IDMxLjIxMDMgNTkuNzI1MSAzMS4yMTAzIDU5LjQ3NzMgMzEuNDU4MUMzNi4xMjUxIDM4LjgzMzEgMjMuMzM5OCA2My42NjAzIDMwLjcxNDggODcuMDE4NEMzNS4xMzk4IDEwMC43ODMgNDUuNzEyNiAxMTEuMzU2IDU5LjQ3NzMgMTE1Ljc4MUM2MC40NjI2IDExNi4yNzEgNjEuNDQyIDExNS43ODEgNjEuNjg5OCAxMTQuNzk2QzYxLjkzNzYgMTE0LjU0OCA2MS45Mzc1IDExNC4zMDYgNjEuOTM3NSAxMTMuODFWMTEwLjM3MUM2MS45Mzc1IDEwOS42MjcgNjEuMjAwMSAxMDguNjQ4IDYwLjQ2MjYgMTA4LjE1MlpNODYuNTE2OSAzMS40NTIyQzg1LjUzMTYgMzAuOTYyNSA4NC41NTIyIDMxLjQ1MjIgODQuMzA0NCAzMi40Mzc1Qzg0LjA1NjYgMzIuNjg1MyA4NC4wNTY2IDMyLjkyNzIgODQuMDU2NiAzMy40MjI4VjM2Ljg2MjVDODQuMDU2NiAzNy44NDc4IDg0Ljc5NDIgMzguODI3MiA4NS41MzE3IDM5LjMyMjhDMTA0LjcwNyA0Ni4yMDgxIDExNC41NDIgNjcuNTk1NiAxMDcuNDA5IDg2LjUyMjhDMTAzLjcyMSA5Ni44NDc4IDk1LjYwODggMTA0LjcxMyA4NS41MzE3IDEwOC40Qzg0LjU0NjMgMTA4Ljg5IDg0LjA1NjYgMTA5LjYyNyA4NC4wNTY2IDExMC44NlYxMTQuM0M4NC4wNTY2IDExNS4yODUgODQuNTQ2MyAxMTYuMDIzIDg1LjUzMTcgMTE2LjI2NUM4NS43Nzk0IDExNi4yNjUgODYuMjY5MSAxMTYuMjY1IDg2LjUxNjkgMTE2LjAxN0MxMDkuODY5IDEwOC42NDIgMTIyLjY1NCA4My44MTQ3IDExNS4yNzkgNjAuNDU2NkMxMTAuODU0IDQ2LjQ1IDEwMC4wNCAzNS44NzcyIDg2LjUxNjkgMzEuNDUyMloiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTEwXzYwNCIgeDE9IjUzLjQ3MzYiIHkxPSIxMjIuNzkiIHgyPSIxNC4wMzYyIiB5Mj0iODkuNTc4NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNFRDFFNzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTIyNzg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMTBfNjA0IiB4MT0iMTIwLjY1IiB5MT0iNTUuNjAyMSIgeDI9IjgxLjIxMyIgeTI9IjIyLjM5MTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjIxIiBzdG9wLWNvbG9yPSIjRjE1QTI0Ii8+CjxzdG9wIG9mZnNldD0iMC42ODQxIiBzdG9wLWNvbG9yPSIjRkJCMDNCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";
  var created : Bool = true;

  public query func token_created() : async Bool {
    created;
  };

  // Initialize token with initial supply for the caller
  public shared ({ caller }) func initialize_with_supply(initial_supply : Nat) : async Result<Text, Text> {
    if (not created) {
      return #Err("Token not initialized");
    };

    if (Principal.isAnonymous(caller)) {
      return #Err("Cannot initialize with anonymous principal");
    };

    // Set the caller as the minting account and give them initial supply
    init := {
      initial_mints = [{
        account = {
          owner = caller;
          subaccount = null;
        };
        amount = initial_supply;
      }];
      minting_account = {
        owner = caller;
        subaccount = null;
      };
      token_name = "CkUSDC Token";
      token_symbol = "ckUSDC";
      decimals = 8;
      transfer_fee = 10000;
    };

    // Override the genesis chain with new minter and initial mints
    log := makeGenesisChain();

    #Ok("Token initialized with " # Nat.toText(initial_supply) # " ckUSDC tokens");
  };

  // Mint new tokens (available for anyone - testing token)
  public shared ({ caller }) func mint(to : Account, amount : Nat) : async Result<TxIndex, Text> {
    if (not created) {
      return #Err("Token not initialized");
    };

    if (Principal.isAnonymous(caller)) {
      return #Err("Cannot mint with anonymous principal");
    };

    validateSubaccount(to.subaccount);

    let now = Nat64.fromNat(Int.abs(Time.now()));
    let transfer : Transfer = {
      spender = init.minting_account;
      source = #Icrc1Transfer;
      from = init.minting_account;
      to = to;
      amount = amount;
      fee = null;
      memo = null;
      created_at_time = ?now;
    };

    switch (applyTransfer(transfer)) {
      case (#Ok(txid)) { #Ok(txid) };
      case (#Err(_)) { #Err("Mint failed") };
    };
  };

  // Mint tokens to caller's account (convenience function)
  public shared ({ caller }) func mint_to_self(amount : Nat) : async Result<TxIndex, Text> {
    let callerAccount = {
      owner = caller;
      subaccount = null;
    };
    await mint(callerAccount, amount);
  };

  public shared ({ caller }) func delete_token() : async Result<Text, Text> {
    if (not created) {
      return #Err("Token not created");
    };

    if (not Principal.equal(caller, init.minting_account.owner)) {
      return #Err("Caller is not the token creator");
    };

    created := false;

    // Reset token details.
    init := {
      initial_mints = [];
      minting_account = {
        owner = Principal.fromBlob("\04");
        subaccount = null;
      };
      token_name = "";
      token_symbol = "";
      decimals = 0;
      transfer_fee = 0;
    };

    // Override the genesis txns.
    log := makeGenesisChain();

    #Ok("Token deleted");
  };

  public shared ({ caller }) func create_token({
    token_name : Text;
    token_symbol : Text;
    initial_supply : Nat;
    token_logo : Text;
  }) : async Result<Text, Text> {
    if (created) {
      return #Err("Token already created");
    };

    if (Principal.isAnonymous(caller)) {
      return #Err("Cannot create token with anonymous principal");
    };

    // Specify actual token details, set the caller to own some inital amount.
    init := {
      initial_mints = [{
        account = {
          owner = caller;
          subaccount = null;
        };
        amount = initial_supply;
      }];
      minting_account = {
        owner = caller;
        subaccount = null;
      };
      token_name;
      token_symbol;
      decimals = 8; // Change this to the number of decimals you want to use.
      transfer_fee = 10_000; // Change this to the fee you want to charge for transfers.
    };

    // Set the token logo.
    logo := token_logo;

    // Override the genesis chain with new minter and initial mints.
    log := makeGenesisChain();

    created := true;

    #Ok("Token created");
  };

  // From here on, we use the reference implementation of the ICRC Ledger
  // canister from https://github.com/dfinity/ICRC-1/blob/main/ref/ICRC1.mo,
  // except where we add the token logo to the metadata.

  public type Account = { owner : Principal; subaccount : ?Subaccount };
  public type Subaccount = Blob;
  public type Tokens = Nat;
  public type Memo = Blob;
  public type Timestamp = Nat64;
  public type Duration = Nat64;
  public type TxIndex = Nat;
  public type TxLog = Buffer.Buffer<Transaction>;

  public type Value = { #Nat : Nat; #Int : Int; #Blob : Blob; #Text : Text };

  transient let maxMemoSize = 32;
  transient let permittedDriftNanos : Duration = 60_000_000_000;
  transient let transactionWindowNanos : Duration = 24 * 60 * 60 * 1_000_000_000;
  transient let defaultSubaccount : Subaccount = Blob.fromArrayMut(Array.init(32, 0 : Nat8));

  public type Operation = {
    #Approve : Approve;
    #Transfer : Transfer;
    #Burn : Transfer;
    #Mint : Transfer;
  };

  public type CommonFields = {
    memo : ?Memo;
    fee : ?Tokens;
    created_at_time : ?Timestamp;
  };

  public type Approve = CommonFields and {
    from : Account;
    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;
  };

  public type TransferSource = {
    #Init;
    #Icrc1Transfer;
    #Icrc2TransferFrom;
  };

  public type Transfer = CommonFields and {
    spender : Account;
    source : TransferSource;
    to : Account;
    from : Account;
    amount : Tokens;
  };

  public type Allowance = { allowance : Nat; expires_at : ?Nat64 };

  public type Transaction = {
    operation : Operation;
    // Effective fee for this transaction.
    fee : Tokens;
    timestamp : Timestamp;
  };

  public type DeduplicationError = {
    #TooOld;
    #Duplicate : { duplicate_of : TxIndex };
    #CreatedInFuture : { ledger_time : Timestamp };
  };

  public type CommonError = {
    #InsufficientFunds : { balance : Tokens };
    #BadFee : { expected_fee : Tokens };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  public type TransferError = DeduplicationError or CommonError or {
    #BadBurn : { min_burn_amount : Tokens };
  };

  public type ApproveError = DeduplicationError or CommonError or {
    #Expired : { ledger_time : Nat64 };
    #AllowanceChanged : { current_allowance : Nat };
  };

  public type TransferFromError = TransferError or {
    #InsufficientAllowance : { allowance : Nat };
  };

  public type Result<T, E> = { #Ok : T; #Err : E };

  // Checks whether two accounts are semantically equal.
  func accountsEqual(lhs : Account, rhs : Account) : Bool {
    let lhsSubaccount = Option.get(lhs.subaccount, defaultSubaccount);
    let rhsSubaccount = Option.get(rhs.subaccount, defaultSubaccount);

    Principal.equal(lhs.owner, rhs.owner) and Blob.equal(
      lhsSubaccount,
      rhsSubaccount,
    );
  };

  // Computes the balance of the specified account.
  func balance(account : Account, log : TxLog) : Nat {
    var sum = 0;
    for (tx in log.vals()) {
      switch (tx.operation) {
        case (#Burn(args)) {
          if (accountsEqual(args.from, account)) { sum -= args.amount };
        };
        case (#Mint(args)) {
          if (accountsEqual(args.to, account)) { sum += args.amount };
        };
        case (#Transfer(args)) {
          if (accountsEqual(args.from, account)) {
            sum -= args.amount + tx.fee;
          };
          if (accountsEqual(args.to, account)) { sum += args.amount };
        };
        case (#Approve(args)) {
          if (accountsEqual(args.from, account)) { sum -= tx.fee };
        };
      };
    };
    sum;
  };

  // Computes the total token supply.
  func totalSupply(log : TxLog) : Tokens {
    var total = 0;
    for (tx in log.vals()) {
      switch (tx.operation) {
        case (#Burn(args)) { total -= args.amount };
        case (#Mint(args)) { total += args.amount };
        case (#Transfer(_)) { total -= tx.fee };
        case (#Approve(_)) { total -= tx.fee };
      };
    };
    total;
  };

  // Finds a transaction in the transaction log.
  func findTransfer(transfer : Transfer, log : TxLog) : ?TxIndex {
    var i = 0;
    for (tx in log.vals()) {
      switch (tx.operation) {
        case (#Burn(args)) { if (args == transfer) { return ?i } };
        case (#Mint(args)) { if (args == transfer) { return ?i } };
        case (#Transfer(args)) { if (args == transfer) { return ?i } };
        case (_) {};
      };
      i += 1;
    };
    null;
  };

  // Finds an approval in the transaction log.
  func findApproval(approval : Approve, log : TxLog) : ?TxIndex {
    var i = 0;
    for (tx in log.vals()) {
      switch (tx.operation) {
        case (#Approve(args)) { if (args == approval) { return ?i } };
        case (_) {};
      };
      i += 1;
    };
    null;
  };

  // Computes allowance of the spender for the specified account.
  func allowance(account : Account, spender : Account, now : Nat64) : Allowance {
    var allowance : Nat = 0;
    var lastApprovalTs : ?Nat64 = null;

    for (tx in log.vals()) {
      // Reset expired approvals, if any.
      switch (lastApprovalTs) {
        case (?expires_at) {
          if (expires_at < tx.timestamp) {
            allowance := 0;
            lastApprovalTs := null;
          };
        };
        case (null) {};
      };
      // Add pending approvals.
      switch (tx.operation) {
        case (#Approve(args)) {
          if (args.from == account and args.spender == spender) {
            allowance := args.amount;
            lastApprovalTs := args.expires_at;
          };
        };
        case (#Transfer(args)) {
          if (args.from == account and args.spender == spender) {
            assert (allowance > args.amount + tx.fee);
            allowance -= args.amount + tx.fee;
          };
        };
        case (_) {};
      };
    };

    switch (lastApprovalTs) {
      case (?expires_at) {
        if (expires_at < now) { { allowance = 0; expires_at = null } } else {
          {
            allowance = Int.abs(allowance);
            expires_at = ?expires_at;
          };
        };
      };
      case (null) { { allowance = allowance; expires_at = null } };
    };
  };

  // Constructs the transaction log corresponding to the init argument.
  func makeGenesisChain() : TxLog {
    validateSubaccount(init.minting_account.subaccount);

    let now = Nat64.fromNat(Int.abs(Time.now()));
    let log = Buffer.Buffer<Transaction>(100);
    for ({ account; amount } in Array.vals(init.initial_mints)) {
      validateSubaccount(account.subaccount);
      let tx : Transaction = {
        operation = #Mint({
          spender = init.minting_account;
          source = #Init;
          from = init.minting_account;
          to = account;
          amount = amount;
          fee = null;
          memo = null;
          created_at_time = ?now;
        });
        fee = 0;
        timestamp = now;
      };
      log.add(tx);
    };
    log;
  };

  // Traps if the specified blob is not a valid subaccount.
  func validateSubaccount(s : ?Subaccount) {
    let subaccount = Option.get(s, defaultSubaccount);
    assert (subaccount.size() == 32);
  };

  func validateMemo(m : ?Memo) {
    switch (m) {
      case (null) {};
      case (?memo) { assert (memo.size() <= maxMemoSize) };
    };
  };

  func checkTxTime(created_at_time : ?Timestamp, now : Timestamp) : Result<(), DeduplicationError> {
    let txTime : Timestamp = Option.get(created_at_time, now);

    if ((txTime > now) and (txTime - now > permittedDriftNanos)) {
      return #Err(#CreatedInFuture { ledger_time = now });
    };

    if ((txTime < now) and (now - txTime > transactionWindowNanos + permittedDriftNanos)) {
      return #Err(#TooOld);
    };

    #Ok(());
  };

  // The list of all transactions.
  transient var log : TxLog = makeGenesisChain();

  // The stable representation of the transaction log.
  // Used only during upgrades.
  var persistedLog : [Transaction] = [];

  system func preupgrade() {
    persistedLog := Buffer.toArray(log);
  };

  system func postupgrade() {
    log := Buffer.Buffer(persistedLog.size());
    for (tx in Array.vals(persistedLog)) {
      log.add(tx);
    };
  };

  func recordTransaction(tx : Transaction) : TxIndex {
    let idx = log.size();
    log.add(tx);
    idx;
  };

  func classifyTransfer(log : TxLog, transfer : Transfer) : Result<(Operation, Tokens), TransferError> {
    let minter = init.minting_account;

    if (Option.isSome(transfer.created_at_time)) {
      switch (findTransfer(transfer, log)) {
        case (?txid) { return #Err(#Duplicate { duplicate_of = txid }) };
        case null {};
      };
    };

    let result = if (accountsEqual(transfer.from, minter)) {
      if (Option.get(transfer.fee, 0) != 0) {
        return #Err(#BadFee { expected_fee = 0 });
      };
      (#Mint(transfer), 0);
    } else if (accountsEqual(transfer.to, minter)) {
      if (Option.get(transfer.fee, 0) != 0) {
        return #Err(#BadFee { expected_fee = 0 });
      };

      if (transfer.amount < init.transfer_fee) {
        return #Err(#BadBurn { min_burn_amount = init.transfer_fee });
      };

      let debitBalance = balance(transfer.from, log);
      if (debitBalance < transfer.amount) {
        return #Err(#InsufficientFunds { balance = debitBalance });
      };

      (#Burn(transfer), 0);
    } else {
      let effectiveFee = init.transfer_fee;
      if (Option.get(transfer.fee, effectiveFee) != effectiveFee) {
        return #Err(#BadFee { expected_fee = init.transfer_fee });
      };

      let debitBalance = balance(transfer.from, log);
      if (debitBalance < transfer.amount + effectiveFee) {
        return #Err(#InsufficientFunds { balance = debitBalance });
      };

      (#Transfer(transfer), effectiveFee);
    };
    #Ok(result);
  };

  func applyTransfer(args : Transfer) : Result<TxIndex, TransferError> {
    validateSubaccount(args.from.subaccount);
    validateSubaccount(args.to.subaccount);
    validateMemo(args.memo);

    let now = Nat64.fromNat(Int.abs(Time.now()));

    switch (checkTxTime(args.created_at_time, now)) {
      case (#Ok(_)) {};
      case (#Err(e)) { return #Err(e) };
    };

    switch (classifyTransfer(log, args)) {
      case (#Ok((operation, effectiveFee))) {
        #Ok(recordTransaction({ operation = operation; fee = effectiveFee; timestamp = now }));
      };
      case (#Err(e)) { #Err(e) };
    };
  };

  func overflowOk(x : Nat) : Nat {
    x;
  };

  public shared ({ caller }) func icrc1_transfer({
    from_subaccount : ?Subaccount;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, TransferError> {
    let from = {
      owner = caller;
      subaccount = from_subaccount;
    };
    applyTransfer({
      spender = from;
      source = #Icrc1Transfer;
      from = from;
      to = to;
      amount = amount;
      fee = fee;
      memo = memo;
      created_at_time = created_at_time;
    });
  };

  public query func icrc1_balance_of(account : Account) : async Tokens {
    balance(account, log);
  };

  public query func icrc1_total_supply() : async Tokens {
    totalSupply(log);
  };

  public query func icrc1_minting_account() : async ?Account {
    ?init.minting_account;
  };

  public query func icrc1_name() : async Text {
    init.token_name;
  };

  public query func icrc1_symbol() : async Text {
    init.token_symbol;
  };

  public query func icrc1_decimals() : async Nat8 {
    init.decimals;
  };

  public query func icrc1_fee() : async Nat {
    init.transfer_fee;
  };

  public query func icrc1_metadata() : async [(Text, Value)] {
    [
      ("icrc1:name", #Text(init.token_name)),
      ("icrc1:symbol", #Text(init.token_symbol)),
      ("icrc1:decimals", #Nat(Nat8.toNat(init.decimals))),
      ("icrc1:fee", #Nat(init.transfer_fee)),
      ("icrc1:logo", #Text(logo)), /* Here we add the token logo to the metadata. */
    ];
  };

  public query func icrc1_supported_standards() : async [{
    name : Text;
    url : Text;
  }] {
    [
      {
        name = "ICRC-1";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-1";
      },
      {
        name = "ICRC-2";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-2";
      },
    ];
  };

  public shared ({ caller }) func icrc2_approve({
    from_subaccount : ?Subaccount;
    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;
    expected_allowance : ?Nat;
    memo : ?Memo;
    fee : ?Tokens;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, ApproveError> {
    validateSubaccount(from_subaccount);
    validateMemo(memo);

    let now = Nat64.fromNat(Int.abs(Time.now()));

    switch (checkTxTime(created_at_time, now)) {
      case (#Ok(_)) {};
      case (#Err(e)) { return #Err(e) };
    };

    let approverAccount = { owner = caller; subaccount = from_subaccount };
    let approval = {
      from = approverAccount;
      spender = spender;
      amount = amount;
      expires_at = expires_at;
      fee = fee;
      created_at_time = created_at_time;
      memo = memo;
    };

    if (Option.isSome(created_at_time)) {
      switch (findApproval(approval, log)) {
        case (?txid) { return #Err(#Duplicate { duplicate_of = txid }) };
        case (null) {};
      };
    };

    switch (expires_at) {
      case (?expires_at) {
        if (expires_at < now) { return #Err(#Expired { ledger_time = now }) };
      };
      case (null) {};
    };

    let effectiveFee = init.transfer_fee;

    if (Option.get(fee, effectiveFee) != effectiveFee) {
      return #Err(#BadFee({ expected_fee = effectiveFee }));
    };

    switch (expected_allowance) {
      case (?expected_allowance) {
        let currentAllowance = allowance(approverAccount, spender, now);
        if (currentAllowance.allowance != expected_allowance) {
          return #Err(#AllowanceChanged({ current_allowance = currentAllowance.allowance }));
        };
      };
      case (null) {};
    };

    let approverBalance = balance(approverAccount, log);
    if (approverBalance < init.transfer_fee) {
      return #Err(#InsufficientFunds { balance = approverBalance });
    };

    let txid = recordTransaction({
      operation = #Approve(approval);
      fee = effectiveFee;
      timestamp = now;
    });

    assert (balance(approverAccount, log) == overflowOk(approverBalance - effectiveFee));

    #Ok(txid);
  };

  public shared ({ caller }) func icrc2_transfer_from({
    spender_subaccount : ?Subaccount;
    from : Account;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, TransferFromError> {
    validateSubaccount(spender_subaccount);
    validateSubaccount(from.subaccount);
    validateSubaccount(to.subaccount);
    validateMemo(memo);

    let spender = { owner = caller; subaccount = spender_subaccount };
    let transfer : Transfer = {
      spender = spender;
      source = #Icrc2TransferFrom;
      from = from;
      to = to;
      amount = amount;
      fee = fee;
      memo = memo;
      created_at_time = created_at_time;
    };

    if (caller == from.owner) {
      return applyTransfer(transfer);
    };

    let now = Nat64.fromNat(Int.abs(Time.now()));

    switch (checkTxTime(created_at_time, now)) {
      case (#Ok(_)) {};
      case (#Err(e)) { return #Err(e) };
    };

    let (operation, effectiveFee) = switch (classifyTransfer(log, transfer)) {
      case (#Ok(result)) { result };
      case (#Err(err)) { return #Err(err) };
    };

    let preTransferAllowance = allowance(from, spender, now);
    if (preTransferAllowance.allowance < amount + effectiveFee) {
      return #Err(#InsufficientAllowance { allowance = preTransferAllowance.allowance });
    };

    let txid = recordTransaction({
      operation = operation;
      fee = effectiveFee;
      timestamp = now;
    });

    let postTransferAllowance = allowance(from, spender, now);
    assert (postTransferAllowance.allowance == overflowOk(preTransferAllowance.allowance - (amount + effectiveFee)));

    #Ok(txid);
  };

  public query func icrc2_allowance({ account : Account; spender : Account }) : async Allowance {
    allowance(account, spender, Nat64.fromNat(Int.abs(Time.now())));
  };
};
