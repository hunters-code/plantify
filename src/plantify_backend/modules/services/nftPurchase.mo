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
import Types "../types";
import Storage "../storage";
import TransferService "./transfer";
import NFTService "./nft";

module NFTPurchase {
  // Helper function to convert text to natural number
  public func textToNat(txt : Text) : Nat {
    assert(txt.size() > 0);
    let chars = txt.chars();

    var num : Nat = 0;
    for (v in chars){
      let charToNum = Nat32.toNat(Char.toNat32(v)-48);
      assert(charToNum >= 0 and charToNum <= 9);
      num := num * 10 +  charToNum;          
    };

    num;
  };

  public class NFTPurchaseService(
    config : Types.EnvironmentConfig, 
    storage : Storage.UserStorage,
    transferService : TransferService.TransferService,
    nftService : NFTService.NFTService
  ) {
    
    // Storage for purchase information
    private var purchases = HashMap.HashMap<Text, Types.NFTPurchaseInfo>(
      0,
      Text.equal,
      Text.hash,
    );
    private var investorPurchases = HashMap.HashMap<Text, [Text]>(
      0,
      Text.equal,
      Text.hash,
    );
    private var startupPurchases = HashMap.HashMap<Text, [Text]>(
      0,
      Text.equal,
      Text.hash,
    );
    private var nextPurchaseId : Nat = 1;

    // Purchase NFT with ckUSDC
    public func purchaseNFT(
      _principal : Principal,
      request : Types.NFTPurchaseRequest
    ) : async Result.Result<Types.NFTPurchaseResponse, Text> {
      Debug.print("NFT Purchase request: " # debug_show(request));

      // Validate request
      if (Text.size(request.startupId) == 0) {
        return #err("Startup ID is required");
      };
      if (Text.size(request.investorId) == 0) {
        return #err("Investor ID is required");
      };
      if (request.amount == 0) {
        return #err("Purchase amount must be greater than 0");
      };

      // Check if startup exists and is active
      switch (storage.getStartup(request.startupId)) {
        case null {
          return #err("Startup not found");
        };
        case (?startup) {
          if (startup.status != "Active") {
            return #err("Startup must be active to purchase NFTs");
          };

          // Parse NFT price from startup
          if (Text.size(startup.nftPrice) == 0) {
            return #err("NFT price cannot be empty");
          };
          
          let nftPrice = textToNat(startup.nftPrice);
          
          if (nftPrice == 0) {
            return #err("NFT price cannot be zero");
          };

          // Check if investor has sufficient balance
          let investorAccount : Types.TransferAccount = {
            owner = _principal;
            subaccount = null;
          };

          switch (await transferService.getCkUSDCBalance(investorAccount)) {
            case (#err(error)) {
              return #err("Failed to check investor balance: " # error);
            };
            case (#ok(balance)) {
              if (balance < request.amount) {
                return #err("Insufficient ckUSDC balance");
              };
            };
          };

          // Check if amount is sufficient for NFT price
          if (request.amount < nftPrice) {
            return #err("Insufficient amount for NFT purchase. Required: " # Nat.toText(nftPrice) # ", Provided: " # Nat.toText(request.amount));
          };

          // Calculate change if overpaid
          let change = if (request.amount >= nftPrice) { request.amount - nftPrice } else { 0 };

          // Create purchase record
          let purchaseId = "purchase_" # Nat.toText(nextPurchaseId);
          nextPurchaseId += 1;

          let now = Time.now();
          let purchaseInfo : Types.NFTPurchaseInfo = {
            id = purchaseId;
            startupId = request.startupId;
            investorId = request.investorId;
            tokenId = 0; // Will be set after NFT minting
            amount = request.amount;
            nftPrice = nftPrice;
            change = change;
            transactionId = "";
            timestamp = now;
            status = "Pending";
          };

          // Store purchase info
          purchases.put(purchaseId, purchaseInfo);

          // Transfer ckUSDC to Plantify account
          let plantifyAccount : Types.TransferAccount = {
            owner = Principal.fromText(config.plantifyAccount);
            subaccount = null;
          };

          let transferArgs : Types.TransferArgs = {
            amount = nftPrice;
            toAccount = plantifyAccount;
            tokenType = "ckUSDC";
            memo = request.memo;
          };

          switch (await transferService.transfer(transferArgs)) {
            case (#Error(error)) {
              // Update purchase status to failed
              let failedPurchase = {
                id = purchaseInfo.id;
                startupId = purchaseInfo.startupId;
                investorId = purchaseInfo.investorId;
                tokenId = 0;
                amount = purchaseInfo.amount;
                nftPrice = purchaseInfo.nftPrice;
                change = purchaseInfo.change;
                transactionId = "";
                timestamp = purchaseInfo.timestamp;
                status = "Failed";
              };
              purchases.put(purchaseId, failedPurchase);
              return #err("Transfer failed: " # error);
            };
            case (#Success(transferResult)) {
              // Find existing NFT for the startup (minted when startup became active)
              switch (nftService.getNFTsByStartup(request.startupId)) {
                case (#err(error)) {
                  // Update purchase status to failed
                  let failedPurchase = {
                    id = purchaseInfo.id;
                    startupId = purchaseInfo.startupId;
                    investorId = purchaseInfo.investorId;
                    tokenId = 0;
                    amount = purchaseInfo.amount;
                    nftPrice = purchaseInfo.nftPrice;
                    change = purchaseInfo.change;
                    transactionId = transferResult.transactionId;
                    timestamp = purchaseInfo.timestamp;
                    status = "Failed";
                  };
                  purchases.put(purchaseId, failedPurchase);
                  return #err("Failed to find NFT for startup: " # error);
                };
                case (#ok(nftList)) {
                  if (nftList.size() == 0) {
                    // Update purchase status to failed
                    let failedPurchase = {
                      id = purchaseInfo.id;
                      startupId = purchaseInfo.startupId;
                      investorId = purchaseInfo.investorId;
                      tokenId = 0;
                      amount = purchaseInfo.amount;
                      nftPrice = purchaseInfo.nftPrice;
                      change = purchaseInfo.change;
                      transactionId = transferResult.transactionId;
                      timestamp = purchaseInfo.timestamp;
                      status = "Failed";
                    };
                    purchases.put(purchaseId, failedPurchase);
                    return #err("No NFT found for startup. Startup may not be active yet.");
                  };

                  // Get the first NFT (there should only be one per startup)
                  let existingNFT = nftList[0];

                  // Transfer NFT to investor
                  let investorNFTAccount : Types.NFTAccount = {
                    owner = _principal;
                    subaccount = null;
                  };

                  let transferRequest : Types.TransferNFTRequest = {
                    tokenId = existingNFT.tokenId;
                    toAccount = investorNFTAccount;
                    memo = ?("NFT purchase: " # purchaseId);
                  };

                  switch (await nftService.transferNFT(_principal, transferRequest)) {
                    case (#err(error)) {
                      // Update purchase status to failed
                      let failedPurchase = {
                        id = purchaseInfo.id;
                        startupId = purchaseInfo.startupId;
                        investorId = purchaseInfo.investorId;
                        tokenId = 0;
                        amount = purchaseInfo.amount;
                        nftPrice = purchaseInfo.nftPrice;
                        change = purchaseInfo.change;
                        transactionId = transferResult.transactionId;
                        timestamp = purchaseInfo.timestamp;
                        status = "Failed";
                      };
                      purchases.put(purchaseId, failedPurchase);
                      return #err("NFT transfer failed: " # error);
                    };
                    case (#ok(transferResult)) {
                      // Handle the variant type properly
                      switch (transferResult) {
                        case (#Success(successResult)) {
                          // Update purchase info with NFT details
                          let completedPurchase = {
                            id = purchaseInfo.id;
                            startupId = purchaseInfo.startupId;
                            investorId = purchaseInfo.investorId;
                            tokenId = existingNFT.tokenId;
                            amount = purchaseInfo.amount;
                            nftPrice = purchaseInfo.nftPrice;
                            change = purchaseInfo.change;
                            transactionId = switch (successResult.transactionId) {
                              case null { "" };
                              case (?txId) { txId };
                            };
                            timestamp = purchaseInfo.timestamp;
                            status = "Completed";
                          };
                              purchases.put(purchaseId, completedPurchase);

                          // Update investor purchases
                          switch (investorPurchases.get(request.investorId)) {
                            case null { investorPurchases.put(request.investorId, [purchaseId]) };
                            case (?existingPurchases) {
                              let updatedPurchases = Array.append(existingPurchases, [purchaseId]);
                              investorPurchases.put(request.investorId, updatedPurchases);
                            };
                          };

                          // Update startup purchases
                          switch (startupPurchases.get(request.startupId)) {
                            case null { startupPurchases.put(request.startupId, [purchaseId]) };
                            case (?existingPurchases) {
                              let updatedPurchases = Array.append(existingPurchases, [purchaseId]);
                              startupPurchases.put(request.startupId, updatedPurchases);
                            };
                          };

                          // Return change to investor if overpaid
                          if (change > 0) {
                            let changeTransferArgs : Types.TransferArgs = {
                              amount = change;
                              toAccount = investorAccount;
                              tokenType = "ckUSDC";
                              memo = ?("Change from NFT purchase: " # purchaseId);
                            };
                            switch (await transferService.transfer(changeTransferArgs)) {
                              case (#Error(error)) {
                                Debug.print("Failed to return change: " # error);
                              };
                              case (#Success(_)) {
                                Debug.print("Change returned successfully");
                              };
                            };
                          };

                          return #ok(#Success({
                            tokenId = existingNFT.tokenId;
                            transactionId = switch (successResult.transactionId) {
                              case null { "" };
                              case (?txId) { txId };
                            };
                            startupId = request.startupId;
                            investorId = request.investorId;
                            amount = request.amount;
                            nftPrice = nftPrice;
                            change = change;
                          }));
                        };
                        case (#Error(error)) {
                          // Update purchase status to failed
                          let failedPurchase = {
                            id = purchaseInfo.id;
                            startupId = purchaseInfo.startupId;
                            investorId = purchaseInfo.investorId;
                            tokenId = 0;
                            amount = purchaseInfo.amount;
                            nftPrice = purchaseInfo.nftPrice;
                            change = purchaseInfo.change;
                            transactionId = "";
                            timestamp = purchaseInfo.timestamp;
                            status = "Failed";
                          };
                          purchases.put(purchaseId, failedPurchase);
                          return #err("NFT transfer failed: " # error);
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

    // Get purchase info by ID
    public func getPurchaseInfo(purchaseId : Text) : Result.Result<Types.NFTPurchaseInfo, Text> {
      switch (purchases.get(purchaseId)) {
        case null {
          #err("Purchase not found");
        };
        case (?info) {
          #ok(info);
        };
      };
    };

    // Get purchase history for investor
    public func getInvestorPurchaseHistory(investorId : Text) : Result.Result<Types.NFTPurchaseHistory, Text> {
      switch (investorPurchases.get(investorId)) {
        case null {
          #ok({
            purchases = [];
            totalPurchases = 0;
            totalSpent = 0;
            totalNFTs = 0;
          });
        };
        case (?purchaseIds) {
          let purchaseArray = Array.map<Text, ?Types.NFTPurchaseInfo>(
            purchaseIds,
            func(id : Text) : ?Types.NFTPurchaseInfo { purchases.get(id) },
          );
          let validPurchases = Array.filter<?Types.NFTPurchaseInfo>(
            purchaseArray,
            func(purchase : ?Types.NFTPurchaseInfo) : Bool {
              switch (purchase) {
                case null { false };
                case (?_) { true };
              };
            },
          );
          let result = Array.map<?Types.NFTPurchaseInfo, Types.NFTPurchaseInfo>(
            validPurchases,
            func(purchase : ?Types.NFTPurchaseInfo) : Types.NFTPurchaseInfo {
              switch (purchase) {
                case null { assert false; loop {} };
                case (?p) { p };
              };
            },
          );

          let totalSpent = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
            result,
            0,
            func(acc : Nat, purchase : Types.NFTPurchaseInfo) : Nat {
              acc + purchase.amount;
            },
          );

          let totalNFTs = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
            result,
            0,
            func(acc : Nat, purchase : Types.NFTPurchaseInfo) : Nat {
              if (purchase.status == "Completed") { acc + 1 } else { acc };
            },
          );

          #ok({
            purchases = result;
            totalPurchases = result.size();
            totalSpent = totalSpent;
            totalNFTs = totalNFTs;
          });
        };
      };
    };

    // Get purchase history for startup
    public func getStartupPurchaseHistory(startupId : Text) : Result.Result<Types.NFTPurchaseHistory, Text> {
      switch (startupPurchases.get(startupId)) {
        case null {
          #ok({
            purchases = [];
            totalPurchases = 0;
            totalSpent = 0;
            totalNFTs = 0;
          });
        };
        case (?purchaseIds) {
          let purchaseArray = Array.map<Text, ?Types.NFTPurchaseInfo>(
            purchaseIds,
            func(id : Text) : ?Types.NFTPurchaseInfo { purchases.get(id) },
          );
          let validPurchases = Array.filter<?Types.NFTPurchaseInfo>(
            purchaseArray,
            func(purchase : ?Types.NFTPurchaseInfo) : Bool {
              switch (purchase) {
                case null { false };
                case (?_) { true };
              };
            },
          );
          let result = Array.map<?Types.NFTPurchaseInfo, Types.NFTPurchaseInfo>(
            validPurchases,
            func(purchase : ?Types.NFTPurchaseInfo) : Types.NFTPurchaseInfo {
              switch (purchase) {
                case null { assert false; loop {} };
                case (?p) { p };
              };
            },
          );

          let totalSpent = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
            result,
            0,
            func(acc : Nat, purchase : Types.NFTPurchaseInfo) : Nat {
              acc + purchase.amount;
            },
          );

          let totalNFTs = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
            result,
            0,
            func(acc : Nat, purchase : Types.NFTPurchaseInfo) : Nat {
              if (purchase.status == "Completed") { acc + 1 } else { acc };
            },
          );

          #ok({
            purchases = result;
            totalPurchases = result.size();
            totalSpent = totalSpent;
            totalNFTs = totalNFTs;
          });
        };
      };
    };

    // Get all purchases (admin function)
    public func getAllPurchases() : [Types.NFTPurchaseInfo] {
      let purchaseArray = Buffer.Buffer<Types.NFTPurchaseInfo>(purchases.size());
      for ((_, info) in purchases.entries()) {
        purchaseArray.add(info);
      };
      Buffer.toArray(purchaseArray);
    };

    // Get purchase statistics
    public func getPurchaseStats() : Types.NFTPurchaseStats {
      let allPurchases = getAllPurchases();
      let completedPurchases = Array.filter<Types.NFTPurchaseInfo>(
        allPurchases,
        func(purchase : Types.NFTPurchaseInfo) : Bool {
          purchase.status == "Completed";
        },
      );

      let totalRevenue = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
        completedPurchases,
        0,
        func(acc : Nat, purchase : Types.NFTPurchaseInfo) : Nat {
          acc + purchase.nftPrice;
        },
      );

      let totalSpent = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
        completedPurchases,
        0,
        func(acc : Nat, purchase : Types.NFTPurchaseInfo) : Nat {
          acc + purchase.amount;
        },
      );

      let averagePurchaseAmount = if (completedPurchases.size() > 0) {
        totalSpent / completedPurchases.size();
      } else {
        0;
      };

      // Find top startup by number of purchases
      let startupPurchaseCounts = HashMap.HashMap<Text, Nat>(
        0,
        Text.equal,
        Text.hash,
      );

      for (purchase in completedPurchases.vals()) {
        switch (startupPurchaseCounts.get(purchase.startupId)) {
          case null { startupPurchaseCounts.put(purchase.startupId, 1) };
          case (?count) { startupPurchaseCounts.put(purchase.startupId, count + 1) };
        };
      };

      var topStartup : ?Text = null;
      var maxCount : Nat = 0;
      for ((startupId, count) in startupPurchaseCounts.entries()) {
        if (count > maxCount) {
          maxCount := count;
          topStartup := ?startupId;
        };
      };

      {
        totalPurchases = allPurchases.size();
        totalRevenue = totalRevenue;
        totalNFTsSold = completedPurchases.size();
        averagePurchaseAmount = averagePurchaseAmount;
        topStartup = topStartup;
      };
    };

    // Check if investor can purchase NFT
    public func canPurchaseNFT(investorId : Text, startupId : Text) : Result.Result<Bool, Text> {
      // Check if investor exists
      switch (storage.getInvestor(investorId)) {
        case null {
          #err("Investor not found");
        };
        case (?_) {
          // Check if startup exists and is active
          switch (storage.getStartup(startupId)) {
            case null {
              #err("Startup not found");
            };
            case (?startup) {
              if (startup.status == "Active") {
                #ok(true);
              } else {
                #ok(false);
              };
            };
          };
        };
      };
    };

    // Get NFT price for startup
    public func getNFTPrice(startupId : Text) : Result.Result<Nat, Text> {
      switch (storage.getStartup(startupId)) {
        case null {
          #err("Startup not found");
        };
        case (?startup) {
          if (Text.size(startup.nftPrice) == 0) {
            #err("NFT price cannot be empty");
          } else {
            let price = textToNat(startup.nftPrice);
            if (price == 0) {
              #err("NFT price cannot be zero");
            } else {
              #ok(price);
            };
          };
        };
      };
    };
  };
};
