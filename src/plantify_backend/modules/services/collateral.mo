import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Types "../types";
import TransferService "./transfer";

module Collateral {
  public class CollateralService(config : Types.EnvironmentConfig) {
    
    // Storage for collateral information
    private var collateralInfo = HashMap.HashMap<Text, Types.CollateralInfo>(
      0,
      Text.equal,
      Text.hash,
    );
    private var collateralTopUps = HashMap.HashMap<Text, Types.CollateralTopUp>(
      0,
      Text.equal,
      Text.hash,
    );
    private var nextTopUpId : Nat = 1;

    // Transfer service instance
    private let transferService = TransferService.TransferService(config);

    // Initialize collateral for a startup
    public func initializeCollateral(
      startupId : Text, 
      requiredAmount : Nat, 
      tokenType : Text
    ) : Result.Result<Text, Text> {
      if (Text.size(startupId) == 0) {
        return #err("Startup ID is required");
      };

      if (requiredAmount == 0) {
        return #err("Required amount must be greater than 0");
      };

      if (tokenType != "ICP" and tokenType != "ckUSDC") {
        return #err("Token type must be either 'ICP' or 'ckUSDC'");
      };

      // Check if collateral already exists
      switch (collateralInfo.get(startupId)) {
        case (?_) {
          return #err("Collateral already initialized for this startup");
        };
        case null {
          let now = Time.now();
          let newCollateralInfo : Types.CollateralInfo = {
            startupId = startupId;
            requiredAmount = requiredAmount;
            currentAmount = 0;
            status = #Pending;
            tokenType = tokenType;
            topUpHistory = [];
            lockStartTime = null;
            lockEndTime = null;
            createdAt = now;
            updatedAt = now;
          };
          collateralInfo.put(startupId, newCollateralInfo);
          #ok("Collateral initialized successfully");
        };
      };
    };

    // Top up collateral using transfer service
    public func topUpCollateral(
      _principal : Principal,
      request : Types.TopUpRequest
    ) : async Result.Result<Types.TopUpResponse, Text> {
      Debug.print(
        "Top up collateral request: " # debug_show(request)
      );

      // Validate request
      if (Text.size(request.startupId) == 0) {
        return #err("Startup ID is required");
      };

      if (request.amount == 0) {
        return #err("Amount must be greater than 0");
      };

      if (request.tokenType != "ICP" and request.tokenType != "ckUSDC") {
        return #err("Token type must be either 'ICP' or 'ckUSDC'");
      };

      // Get collateral info
      switch (collateralInfo.get(request.startupId)) {
        case null {
          return #err("Collateral not initialized for this startup");
        };
        case (?info) {
          if (info.status == #Active) {
            return #err("Collateral is already fully paid and active");
          };

          // Create Plantify account for receiving tokens
          let plantifyAccount : Types.TransferAccount = {
            owner = Principal.fromText(config.plantifyAccount);
            subaccount = null;
          };

          // Perform the transfer
          let transferResult = switch (request.tokenType) {
            case ("ICP") {
              await transferService.transferICP(plantifyAccount, request.amount, request.memo);
            };
            case ("ckUSDC") {
              await transferService.transferCkUSDC(plantifyAccount, request.amount, request.memo);
            };
            case (_) {
              return #err("Invalid token type");
            };
          };

          switch (transferResult) {
            case (#Error(error)) {
              return #err("Transfer failed: " # error);
            };
            case (#Success(transferSuccess)) {
              // Record the top-up
              let topUpId = Nat.toText(nextTopUpId);
              nextTopUpId += 1;
              let now = Time.now();
              
              let topUp : Types.CollateralTopUp = {
                id = topUpId;
                startupId = request.startupId;
                amount = request.amount;
                tokenType = request.tokenType;
                timestamp = now;
                transactionId = ?transferSuccess.transactionId;
                status = "completed";
              };
              
              collateralTopUps.put(topUpId, topUp);
              
              // Update collateral info
              let newCurrentAmount = info.currentAmount + request.amount;
              let newStatus = if (newCurrentAmount >= info.requiredAmount) {
                #Active;
              } else {
                #Pending;
              };
              
              let updatedTopUpHistory = Array.append(info.topUpHistory, [topUp]);
              
              let updatedInfo : Types.CollateralInfo = {
                startupId = info.startupId;
                requiredAmount = info.requiredAmount;
                currentAmount = newCurrentAmount;
                status = newStatus;
                tokenType = info.tokenType;
                topUpHistory = updatedTopUpHistory;
                lockStartTime = if (newStatus == #Active) { ?now } else { info.lockStartTime };
                lockEndTime = if (newStatus == #Active) { ?(now + 36 * 30 * 24 * 60 * 60 * 1000000000) } else { info.lockEndTime };
                createdAt = info.createdAt;
                updatedAt = now;
              };
              
              collateralInfo.put(request.startupId, updatedInfo);

              let remainingAmount = if (newCurrentAmount >= info.requiredAmount) {
                0;
              } else {
                info.requiredAmount - newCurrentAmount;
              };

              let isFullyPaid = newStatus == #Active;

              return #ok(#Success({
                topUpId = topUpId;
                transactionId = transferSuccess.transactionId;
                amount = request.amount;
                newTotal = newCurrentAmount;
                remainingAmount = remainingAmount;
                isFullyPaid = isFullyPaid;
                tokenType = request.tokenType;
              }));
            };
          };
        };
      };
    };

    // Get collateral status
    public func getCollateralStatus(startupId : Text) : Result.Result<Types.CollateralInfo, Text> {
      switch (collateralInfo.get(startupId)) {
        case null {
          #err("Collateral info not found for this startup");
        };
        case (?info) {
          #ok(info);
        };
      };
    };

    // Get collateral top-up history
    public func getCollateralTopUpHistory(startupId : Text) : Result.Result<[Types.CollateralTopUp], Text> {
      switch (collateralInfo.get(startupId)) {
        case null {
          #err("Collateral info not found for this startup");
        };
        case (?info) {
          #ok(info.topUpHistory);
        };
      };
    };

    // Get collateral progress
    public func getCollateralProgress(startupId : Text) : Result.Result<Types.CollateralProgress, Text> {
      switch (collateralInfo.get(startupId)) {
        case null {
          #err("Collateral info not found");
        };
        case (?info) {
          let percentage = if (info.requiredAmount > 0) {
            let result = (info.currentAmount * 100) / info.requiredAmount;
            if (result > 100) { 100 } else { result };
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
            tokenType = info.tokenType;
          });
        };
      };
    };

    // Calculate required collateral based on monthly profit sharing
    public func calculateRequiredCollateral(monthlyProfitSharing : Nat, _tokenType : Text) : Nat {
      let baseAmount = monthlyProfitSharing * 12; // 12 months
      let bufferAmount = baseAmount / 10; // 10% buffer
      baseAmount + bufferAmount;
    };

    // Get all collateral info (for admin purposes)
    public func getAllCollateralInfo() : [Types.CollateralInfo] {
      let infoArray = Buffer.Buffer<Types.CollateralInfo>(collateralInfo.size());
      for ((_, info) in collateralInfo.entries()) {
        infoArray.add(info);
      };
      Buffer.toArray(infoArray);
    };

    // Update startup status when collateral is fully paid
    public func updateStartupStatus(_startupId : Text, _newStatus : Text) : Bool {
      // This would typically update the startup status in the main storage
      // For now, we'll just return true as a placeholder
      // In a real implementation, you'd call the startup service here
      true;
    };
  };
};
