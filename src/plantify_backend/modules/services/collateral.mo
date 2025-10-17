import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
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
  public class CollateralService(config : Types.EnvironmentConfig, storage : Storage.UserStorage, nftService : NFTService.NFTService) {
    
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

    // Helper function to convert text to natural number
    private func textToNat(txt : Text) : Nat {
      if (txt.size() == 0) { 0 }
      else {
        let chars = txt.chars();
        var num : Nat = 0;
        var maxSafeValue : Nat = 1000000000; // 1 billion - reasonable maximum
        
        for (v in chars) {
          let charCode = Char.toNat32(v);
          if (charCode >= 48 and charCode <= 57) {
            let charToNum = Nat32.toNat(charCode - 48);
            
            // Check for overflow before multiplication
            if (num > maxSafeValue / 10) {
              return maxSafeValue; // Return max safe value to prevent overflow
            };
            
            let newNum = num * 10 + charToNum;
            if (newNum < num or newNum > maxSafeValue) {
              // Overflow detected, return max safe value
              return maxSafeValue;
            };
            num := newNum;
          } else {
            // Non-numeric character found, return 0
            return 0;
          };
        };
        
        num;
      };
    };

    private let transferService = TransferService.TransferService(config);

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
          // Check if NFTs are already minted for this startup
          switch (nftService.getNFTsByStartup(startupId, 1, 1)) {
            case (#ok(paginatedResult)) {
              if (paginatedResult.totalCount > 0) {
                Debug.print("NFTs already minted for startup " # startupId # ". Skipping minting.");
                return;
              };
            };
            case (#err(_)) {
              Debug.print("Error checking existing NFTs for startup " # startupId);
            };
          };

          switch (storage.getFounderOfStartup(startupId)) {
            case null {
              Debug.print("Founder not found for startup: " # startupId);
            };
            case (?founder) {
              // Calculate total number of NFTs to mint based on funding goal and NFT price
              let fundingGoal = textToNat(startup.fundingGoal);
              let nftPrice = textToNat(startup.nftPrice);
              
              if (nftPrice == 0) {
                Debug.print("NFT price is zero for startup " # startupId # ". Cannot mint NFTs.");
                return;
              };
              
              let totalNFTs = fundingGoal / nftPrice;
              
              if (totalNFTs == 0) {
                Debug.print("Total NFTs calculated as zero for startup " # startupId # ". Cannot mint NFTs.");
                return;
              };

              Debug.print("Minting " # Nat.toText(totalNFTs) # " NFTs for startup " # startupId);

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

              let founderAccount : Types.NFTAccount = {
                owner = founder.principal;
                subaccount = null;
              };

              // Mint all NFTs for the startup
              var mintedCount = 0;
              var i = 0;
              while (i < totalNFTs) {
                let metadata : Types.NFTMetadata = {
                  tokenUri = "https://hiplantify.com/nft/" # startupId # "/" # Nat.toText(i + 1);
                  name = ?("Plantify: " # startup.startupName # " #" # Nat.toText(i + 1));
                  description = ?("Plantify ownership share in " # startup.startupName # " - " # startup.description);
                  image = ?startupImage;
                  attributes = ?[
                    ("startup_id", startupId),
                    ("startup_name", startup.startupName),
                    ("sector", startup.sector),
                    ("founded_year", startup.foundedYear),
                    ("founder", founder.fullName),
                    ("plantify_share", "true"),
                    ("nft_number", Nat.toText(i + 1)),
                    ("total_nfts", Nat.toText(totalNFTs))
                  ];
                };

                let mintRequest : Types.MintNFTRequest = {
                  startupId = startupId;
                  toAccount = founderAccount;
                  metadata = metadata;
                  memo = ?("Auto-minted when startup became active - " # startupId # " - NFT " # Nat.toText(i + 1) # "/" # Nat.toText(totalNFTs));
                };

                switch (await nftService.mintNFT(founder.principal, mintRequest)) {
                  case (#ok(#Success(result))) {
                    mintedCount += 1;
                    Debug.print("Successfully minted NFT " # Nat.toText(i + 1) # "/" # Nat.toText(totalNFTs) # " for startup " # startupId # " with token ID: " # Nat.toText(result.tokenId));
                  };
                  case (#ok(#Error(error))) {
                    Debug.print("Error minting NFT " # Nat.toText(i + 1) # " for startup " # startupId # ": " # error);
                  };
                  case (#err(error)) {
                    Debug.print("Failed to mint NFT " # Nat.toText(i + 1) # " for startup " # startupId # ": " # error);
                  };
                };
                i += 1;
              };

              Debug.print("Completed minting " # Nat.toText(mintedCount) # "/" # Nat.toText(totalNFTs) # " NFTs for startup " # startupId);
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
