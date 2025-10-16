import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Types "../types";
import Storage "../storage";

module NFT {
  public class NFTService(
    storage : Storage.UserStorage,
    nftInfoEntries : [(Nat, Types.NFTInfo)],
    startupNFTsEntries : [(Text, [Nat])],
    initialNextTokenId : Nat
  ) {
    
    // Storage for NFT information - initialized from persistent data
    private var nftInfo = HashMap.fromIter<Nat, Types.NFTInfo>(
      nftInfoEntries.vals(),
      nftInfoEntries.size(),
      Nat.equal,
      func(n : Nat) : Nat32 { Nat32.fromNat(n) },
    );
    private var startupNFTs = HashMap.fromIter<Text, [Nat]>(
      startupNFTsEntries.vals(),
      startupNFTsEntries.size(),
      Text.equal,
      Text.hash,
    );
    private var nextTokenId : Nat = initialNextTokenId;

    // Mint NFT for a startup
    public func mintNFT(
      _principal : Principal,
      request : Types.MintNFTRequest
    ) : async Result.Result<Types.MintNFTResponse, Text> {
      Debug.print("Mint NFT request: " # debug_show(request));

      // Validate request
      if (Text.size(request.startupId) == 0) {
        return #err("Startup ID is required");
      };

      // Check if startup exists
      switch (storage.getStartup(request.startupId)) {
        case null {
          return #err("Startup not found");
        };
        case (?startup) {
          // Check if startup status allows NFT minting
          if (startup.status != "Active") {
            return #err("Startup must be active to mint NFTs");
          };

          // Create NFT info
          let now = Time.now();
          let tokenId = nextTokenId;
          nextTokenId += 1;

          let nftData : Types.NFTInfo = {
            tokenId = tokenId;
            startupId = request.startupId;
            owner = request.toAccount;
            metadata = request.metadata;
            mintedAt = now;
          };

          // Store NFT info
          nftInfo.put(tokenId, nftData);

          // Update startup's NFT list
          switch (startupNFTs.get(request.startupId)) {
            case null { startupNFTs.put(request.startupId, [tokenId]) };
            case (?existingNFTs) {
              let updatedNFTs = Array.append(existingNFTs, [tokenId]);
              startupNFTs.put(request.startupId, updatedNFTs);
            };
          };

          // In a real implementation, you would call the actual NFT canister here
          // For now, we'll simulate the minting
          let transactionId = "tx_" # Nat.toText(Int.abs(now));

          return #ok(#Success({
            tokenId = tokenId;
            transactionId = ?transactionId;
            startupId = request.startupId;
          }));
        };
      };
    };

    // Transfer NFT
    public func transferNFT(
      _principal : Principal,
      request : Types.TransferNFTRequest
    ) : async Result.Result<Types.TransferNFTResponse, Text> {
      Debug.print("Transfer NFT request: " # debug_show(request));

      // Get NFT info
      switch (nftInfo.get(request.tokenId)) {
        case null {
          return #err("NFT not found");
        };
        case (?info) {
          // Update NFT owner
          let updatedInfo : Types.NFTInfo = {
            tokenId = info.tokenId;
            startupId = info.startupId;
            owner = request.toAccount;
            metadata = info.metadata;
            mintedAt = info.mintedAt;
          };

          nftInfo.put(request.tokenId, updatedInfo);

          // In a real implementation, you would call the actual NFT canister here
          let transactionId = "tx_" # Nat.toText(Int.abs(Time.now()));

          return #ok(#Success({
            tokenId = request.tokenId;
            transactionId = ?transactionId;
          }));
        };
      };
    };

    // Get NFT info
    public func getNFTInfo(tokenId : Nat) : Result.Result<Types.NFTInfo, Text> {
      switch (nftInfo.get(tokenId)) {
        case null {
          #err("NFT not found");
        };
        case (?info) {
          #ok(info);
        };
      };
    };

    // Get NFT balance for an account
    public func getNFTBalance(account : Types.NFTAccount) : Result.Result<Types.NFTBalanceResponse, Text> {
      var balance : Nat = 0;
      for ((_, info) in nftInfo.entries()) {
        if (Principal.equal(info.owner.owner, account.owner)) {
          balance += 1;
        };
      };

      #ok(#Success({
        balance = balance;
        account = account;
      }));
    };

    // Get NFT owner
    public func getNFTOwner(tokenId : Nat) : Result.Result<Types.NFTOwnerResponse, Text> {
      switch (nftInfo.get(tokenId)) {
        case null {
          #err("NFT not found");
        };
        case (?info) {
          #ok(#Success({
            tokenId = tokenId;
            owner = ?info.owner;
          }));
        };
      };
    };

    // Get all NFTs (for admin purposes)
    public func getAllNFTs() : [Types.NFTInfo] {
      let nftArray = Buffer.Buffer<Types.NFTInfo>(nftInfo.size());
      for ((_, info) in nftInfo.entries()) {
        nftArray.add(info);
      };
      Buffer.toArray(nftArray);
    };

    // Get NFTs by startup ID with pagination
    public func getNFTsByStartup(startupId : Text, page : Nat, limit : Nat) : Result.Result<Types.PaginatedNFTs, Text> {
      // Validate pagination parameters
      if (page == 0) {
        return #err("Page number must be greater than 0");
      };
      if (limit == 0) {
        return #err("Limit must be greater than 0");
      };
      
      switch (startupNFTs.get(startupId)) {
        case null {
          #ok({
            nfts = [];
            totalCount = 0;
            page = page;
            limit = limit;
            totalPages = 0;
          });
        };
        case (?tokenIds) {
          let totalCount = tokenIds.size();
          let totalPages = if (totalCount == 0) { 0 } else { 
            let division = totalCount / limit;
            let remainder = totalCount % limit;
            if (remainder == 0) { division } else { division + 1 }
          };
          
          // Validate page number
          if (totalPages > 0 and page > totalPages) {
            return #err("Invalid page number");
          };
          
          let startIndex = if (page == 1) { 
            0 
          } else { 
            let pageOffset = if (page > 1) { 
              Nat.sub(page, 1)
            } else { 
              0 
            };
            pageOffset * limit
          };
          let endIndex = if (startIndex >= totalCount) { 
            totalCount 
          } else { 
            let calculatedEnd = startIndex + limit;
            if (calculatedEnd > totalCount) { totalCount } else { calculatedEnd }
          };
          
          let nftArray = Buffer.Buffer<Types.NFTInfo>(limit);
          var currentIndex = 0;
          
          for (tokenId in tokenIds.vals()) {
            if (currentIndex >= startIndex and currentIndex < endIndex) {
              switch (nftInfo.get(tokenId)) {
                case null { };
                case (?info) { nftArray.add(info) };
              };
            };
            currentIndex += 1;
          };
          
          #ok({
            nfts = Buffer.toArray(nftArray);
            totalCount = totalCount;
            page = page;
            limit = limit;
            totalPages = totalPages;
          });
        };
      };
    };

    // Check if NFT can be minted for startup
    public func canMintNFT(startupId : Text) : Result.Result<Bool, Text> {
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

    // Get NFT statistics
    public func getNFTStats() : {
      totalSupply : Nat;
      totalStartups : Nat;
      nextTokenId : Nat;
    } {
      {
        totalSupply = nftInfo.size();
        totalStartups = startupNFTs.size();
        nextTokenId = nextTokenId;
      };
    };

    // Methods for persistence - used by pre-upgrade hook
    public func getNFTInfoEntries() : [(Nat, Types.NFTInfo)] {
      Iter.toArray(nftInfo.entries());
    };

    public func getStartupNFTsEntries() : [(Text, [Nat])] {
      Iter.toArray(startupNFTs.entries());
    };

    public func getNextTokenId() : Nat {
      nextTokenId;
    };
  };
};
