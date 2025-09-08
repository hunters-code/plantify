import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Result "mo:base/Result";
import Types "../types";
import Storage "../storage";
import TokenFactory "../tokens/tokenFactory";

module Transfer {
  public class TransferService(config : Types.EnvironmentConfig) {
    private let storage = Storage.UserStorage();
    private let tokenService = TokenFactory.TokenService(config);

    public func initializeCollateral(startupId : Text, requiredAmount : Nat) : Result.Result<Text, Text> {
      switch (storage.getStartup(startupId)) {
        case null {
          #err("Startup not found");
        };
        case (?startup) {
          if (startup.status != "approved") {
            #err("Startup must be approved before collateral can be initialized");
          } else {
            let collateralId = storage.createCollateralInfo(startupId, requiredAmount);
            #ok(collateralId);
          };
        };
      };
    };

     public func topUpCollateral(
       principal : Principal,
       request : Types.TopUpRequest,
     ) : async Result.Result<Types.TopUpResult, Text> {
      switch (storage.getStartup(request.startupId)) {
        case null {
          #err("Startup not found");
        };
        case (?_) {
          switch (storage.getCollateralInfo(request.startupId)) {
            case null {
              #err("Collateral info not initialized for this startup");
            };
            case (?collateralInfo) {
              if (collateralInfo.status == #Active) {
                #err("Collateral is already fully paid and active");
              } else {
                let _founderAccount = {
                  owner = principal;
                  subaccount = null;
                };

                let plantifyAccount = {
                  owner = Principal.fromText("rrkah-fqaaa-aaaah-qcvmq-cai");
                  subaccount = null;
                };

                 let transferResult = await tokenService.icrc1_transfer({
                   from_subaccount = null;
                   to = plantifyAccount;
                   amount = request.amount;
                   fee = ?1000;
                   memo = null;
                   created_at_time = null;
                 });

                switch (transferResult) {
                  case (#Err(error)) {
                    #err("Transfer failed: " # _transferErrorToString(error));
                  };
                  case (#Ok(txId)) {
                    let _topUpId = storage.addCollateralTopUp(
                      request.startupId,
                      request.amount,
                      ?Nat.toText(txId),
                    );

                    switch (storage.getCollateralInfo(request.startupId)) {
                      case null {
                        #err("Failed to retrieve updated collateral info");
                      };
                      case (?updatedInfo) {
                        let remainingAmount = if (updatedInfo.currentAmount >= updatedInfo.requiredAmount) {
                          0;
                        } else {
                          updatedInfo.requiredAmount - updatedInfo.currentAmount;
                        };

                        let isFullyPaid = updatedInfo.status == #Active;

                        if (isFullyPaid) {
                          let statusUpdateResult = storage.updateStartupStatus(request.startupId, "active");
                          if (not statusUpdateResult) {
                            #err("Failed to update startup status to active");
                          } else {
                            #ok(#Success({ transactionId = Nat.toText(txId); newTotal = updatedInfo.currentAmount; remainingAmount = remainingAmount; isFullyPaid = isFullyPaid }));
                          };
                        } else {
                          #ok(#Success({ transactionId = Nat.toText(txId); newTotal = updatedInfo.currentAmount; remainingAmount = remainingAmount; isFullyPaid = isFullyPaid }));
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };

    public func getCollateralStatus(startupId : Text) : Result.Result<Types.CollateralInfo, Text> {
      switch (storage.getCollateralInfo(startupId)) {
        case null {
          #err("Collateral info not found for this startup");
        };
        case (?info) {
          #ok(info);
        };
      };
    };

    public func getCollateralTopUpHistory(startupId : Text) : Result.Result<[Types.CollateralTopUp], Text> {
      switch (storage.getStartup(startupId)) {
        case null {
          #err("Startup not found");
        };
        case (?_) {
          let topUps = storage.getCollateralTopUps(startupId);
          #ok(topUps);
        };
      };
    };

     public func mintTestTokens(principal : Principal, amount : Nat) : async Result.Result<Text, Text> {
      let account = {
        owner = principal;
        subaccount = null;
      };

       switch (await tokenService.mint(account, amount)) {
         case (#err(error)) {
           #err("Failed to mint tokens: " # error);
         };
         case (#ok(txId)) {
           #ok("Successfully minted " # Nat.toText(amount) # " ckUSDC tokens. Transaction ID: " # Nat.toText(txId));
         };
       };
    };

    public func getTokenBalance(principal : Principal) : async Nat {
      let account = {
        owner = principal;
        subaccount = null;
      };
      await tokenService.get_balance(account);
    };

    public func getTokenInfo() : async (Text, Text, Nat8, Nat) {
      let name = await tokenService.icrc1_name();
      let symbol = await tokenService.icrc1_symbol();
      let decimals = await tokenService.icrc1_decimals();
      let fee = await tokenService.icrc1_fee();
      (name, symbol, decimals, fee);
    };

    private func _transferErrorToString(error : TokenFactory.TransferError) : Text {
      switch (error) {
        case (#BadFee { expected_fee }) {
          "Bad fee. Expected: " # Nat.toText(expected_fee);
        };
        case (#BadBurn { min_burn_amount }) {
          "Bad burn amount. Minimum: " # Nat.toText(min_burn_amount);
        };
        case (#InsufficientFunds { balance }) {
          "Insufficient funds. Balance: " # Nat.toText(balance);
        };
        case (#TooOld) {
          "Transaction too old";
        };
        case (#CreatedInFuture { ledger_time }) {
          "Transaction created in future. Ledger time: " # Nat64.toText(ledger_time);
        };
        case (#TemporarilyUnavailable) {
          "Temporarily unavailable";
        };
        case (#Duplicate { duplicate_of }) {
          "Duplicate transaction. Duplicate of: " # Nat.toText(duplicate_of);
        };
        case (#GenericError { error_code; message }) {
          "Generic error " # Nat.toText(error_code) # ": " # message;
        };
      };
    };

    public func calculateRequiredCollateral(monthlyProfitSharing : Nat) : Nat {
      let baseAmount = monthlyProfitSharing * 12;
      let bufferAmount = baseAmount / 10;
      baseAmount + bufferAmount;
    };

    public func getCollateralProgress(startupId : Text) : Result.Result<{ currentAmount : Nat; requiredAmount : Nat; percentage : Nat; status : Text; isFullyPaid : Bool }, Text> {
      switch (storage.getCollateralInfo(startupId)) {
        case null {
          #err("Collateral info not found");
        };
        case (?info) {
          let percentage = if (info.requiredAmount > 0) {
            (info.currentAmount * 100) / info.requiredAmount;
          } else {
            0;
          };

          let statusText = switch (info.status) {
            case (#Pending) { "Pending" };
            case (#Active) { "Active" };
            case (#Locked) { "Locked" };
            case (#Released) { "Released" };
          };

          #ok({
            currentAmount = info.currentAmount;
            requiredAmount = info.requiredAmount;
            percentage = percentage;
            status = statusText;
            isFullyPaid = info.status == #Active;
          });
        };
      };
    };
  };
};
