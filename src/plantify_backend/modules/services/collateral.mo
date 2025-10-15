import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Types "../types";
import TransferService "./transfer";
import Storage "../storage";
import NFTService "./nft";

module Collateral {
  public class CollateralService(config : Types.EnvironmentConfig, storage : Storage.UserStorage) {
    
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

    private let transferService = TransferService.TransferService(config);
    private let nftService = NFTService.NFTService(storage);

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

    public func topUpCollateral(
      _principal : Principal,
      request : Types.TopUpRequest
    ) : async Result.Result<Types.TopUpResponse, Text> {
      Debug.print("Top up collateral request: " # debug_show(request));

      if (Text.size(request.startupId) == 0) {
        return #err("Startup ID is required");
      };

      if (request.amount == 0) {
        return #err("Amount must be greater than 0");
      };

      if (request.tokenType != "ICP" and request.tokenType != "ckUSDC") {
        return #err("Token type must be either 'ICP' or 'ckUSDC'");
      };

      switch (collateralInfo.get(request.startupId)) {
        case null {
          return #err("Collateral not initialized for this startup");
        };
        case (?info) {
          if (info.status == #Active) {
            return #err("Collateral is already fully paid and active");
          };

          let plantifyAccount : Types.TransferAccount = {
            owner = Principal.fromText(config.plantifyAccount);
            subaccount = null;
          };

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

              if (newStatus == #Active) {
                ignore await updateStartupStatus(request.startupId, "Active");
              };

              let remainingAmount = if (newCurrentAmount >= info.requiredAmount) {
                0;
              } else {
                let diff = Int.abs(Int.sub(Int.abs(info.requiredAmount), Int.abs(newCurrentAmount)));
                if (info.requiredAmount > newCurrentAmount) {
                  Int.abs(diff);
                } else {
                  0;
                };
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

    public func calculateRequiredCollateral(monthlyProfitSharing : Nat, _tokenType : Text) : Nat {
      let baseAmount = monthlyProfitSharing * 12;
      let bufferAmount = baseAmount / 10;
      baseAmount + bufferAmount;
    };

    public func getAllCollateralInfo() : [Types.CollateralInfo] {
      let infoArray = Buffer.Buffer<Types.CollateralInfo>(collateralInfo.size());
      for ((_, info) in collateralInfo.entries()) {
        infoArray.add(info);
      };
      Buffer.toArray(infoArray);
    };

    public func updateStartupStatus(startupId : Text, newStatus : Text) : async Bool {
      let updateResult = storage.updateStartupStatus(startupId, newStatus);
      
      if (updateResult and newStatus == "Active") {
        await mintStartupNFT(startupId);
      };
      
      updateResult;
    };

    private func mintStartupNFT(startupId : Text) : async () {
      switch (storage.getStartup(startupId)) {
        case null {
          Debug.print("Startup not found for NFT minting: " # startupId);
        };
        case (?startup) {
          switch (storage.getFounderOfStartup(startupId)) {
            case null {
              Debug.print("Founder not found for startup: " # startupId);
            };
            case (?founder) {
              let startupImage = switch (startup.nftImage) {
                case (?nftImageUrl) {
                  nftImageUrl;
                };
                case null {
                  switch (startup.companyLogo) {
                    case (?logoUrl) {
                      logoUrl;
                    };
                    case null {
                      "https://plantify.com/images/startup-nft.png";
                    };
                  };
                };
              };

              let metadata : Types.NFTMetadata = {
                tokenUri = "https://plantify.com/nft/" # startupId;
                name = ?("Plantify: " # startup.startupName);
                description = ?("Plantify ownership share in " # startup.startupName # " - " # startup.description);
                image = ?startupImage;
                attributes = ?[
                  ("startup_id", startupId),
                  ("startup_name", startup.startupName),
                  ("sector", startup.sector),
                  ("founded_year", startup.foundedYear),
                  ("founder", founder.fullName),
                  ("plantify_share", "true")
                ];
              };

              let founderAccount : Types.NFTAccount = {
                owner = founder.principal;
                subaccount = null;
              };

              let mintRequest : Types.MintNFTRequest = {
                startupId = startupId;
                toAccount = founderAccount;
                metadata = metadata;
                memo = ?("Auto-minted when startup became active - " # startupId);
              };

              switch (await nftService.mintNFT(founder.principal, mintRequest)) {
                case (#ok(#Success(result))) {
                  Debug.print("Successfully minted NFT for startup " # startupId # " with token ID: " # Nat.toText(result.tokenId));
                };
                case (#ok(#Error(error))) {
                  Debug.print("Error minting NFT for startup " # startupId # ": " # error);
                };
                case (#err(error)) {
                  Debug.print("Failed to mint NFT for startup " # startupId # ": " # error);
                };
              };
            };
          };
        };
      };
    };

    public func mintNFTForStartup(startupId : Text) : async Result.Result<Text, Text> {
      switch (storage.getStartup(startupId)) {
        case null {
          #err("Startup not found");
        };
        case (?startup) {
          if (startup.status != "Active") {
            #err("Startup must be active to mint NFT");
          } else {
            await mintStartupNFT(startupId);
            #ok("NFT minted successfully for startup " # startupId);
          };
        };
      };
    };
  };
};
