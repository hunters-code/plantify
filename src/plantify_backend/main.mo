import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Types "./modules/types";
import Storage "./modules/storage";
import RegistrationService "./modules/services/registration";
import StartupCreation "./modules/services/startupCreation";
import TransferService "./modules/services/transfer";
import CollateralService "./modules/services/collateral";
import NFTService "./modules/services/nft";
import NFTPurchaseService "./modules/services/nftPurchase";
import Config "./config";

persistent actor PlantifyBackend {
  private let config : Types.EnvironmentConfig = Config.getCurrentConfig();
  
  // Stable storage variables
  private var foundersEntries : [(Text, Types.Founder)] = [];
  private var founderPrincipalsEntries : [(Principal, Text)] = [];
  private var investorsEntries : [(Text, Types.Investor)] = [];
  private var investorPrincipalsEntries : [(Principal, Text)] = [];
  private var startupsEntries : [(Text, Types.Startup)] = [];
  private var founderStartupsEntries : [(Text, [Text])] = [];
  private var nextFounderId : Nat = 1;
  private var nextInvestorId : Nat = 1;
  private var nextStartupId : Nat = 1;
  
  // Migration flag to handle type changes
  private var migrationCompleted : Bool = false;
  
  private transient let storage = Storage.UserStorage(
    foundersEntries,
    founderPrincipalsEntries,
    investorsEntries,
    investorPrincipalsEntries,
    startupsEntries,
    founderStartupsEntries,
    nextFounderId,
    nextInvestorId,
    nextStartupId
  );
  private transient let registrationService = RegistrationService.RegistrationService(storage);
  private transient let startupCreationService = StartupCreation.StartupCreationService(storage);
  private transient let transferService = TransferService.TransferService(config);
  private transient let collateralService = CollateralService.CollateralService(config, storage);
  private transient let nftService = NFTService.NFTService(config, storage);
  private transient let nftPurchaseService = NFTPurchaseService.NFTPurchaseService(config, storage, transferService, nftService);

  public shared (msg) func registerFounder(request : Types.FounderRegistrationRequest) : async Result.Result<Types.Founder, Text> {
    registrationService.registerFounder(msg.caller, request);
  };

  public shared (msg) func registerInvestor(request : Types.InvestorRegistrationRequest) : async Result.Result<Types.Investor, Text> {
    registrationService.registerInvestor(msg.caller, request);
  };

  public shared (msg) func createStartup(request : Types.StartupCreationRequest) : async Result.Result<Types.Startup, Text> {
    startupCreationService.createStartup(msg.caller, request);
  };

  // Admin function to create startup for any founder
  public shared (_msg) func createStartupForFounder(founderId : Text, request : Types.StartupCreationRequest) : async Result.Result<Types.Startup, Text> {
    startupCreationService.createStartupForFounder(founderId, request);
  };

  public shared func getFounders() : async [Types.Founder] {
    registrationService.getAllFounders();
  };

  public shared func getInvestors() : async [Types.Investor] {
    registrationService.getAllInvestors();
  };

  public shared func getAllStartups() : async [Types.Startup] {
    storage.getAllStartups();
  };

  // ========================================
  // CONFIGURATION METHODS
  // ========================================

  public shared func getEnvironmentConfig() : async Types.EnvironmentConfig {
    config;
  };

  public shared func getEnvironment() : async Text {
    config.environment;
  };

  public shared func getICPTokenConfig() : async Types.TokenConfig {
    config.icpToken;
  };

  public shared func getCkUSDCTokenConfig() : async Types.TokenConfig {
    config.ckUSDCToken;
  };

  public shared func getPlantifyAccount() : async Text {
    config.plantifyAccount;
  };

  public shared func isUsingTestTokens() : async Bool {
    config.useTestTokens;
  };

  public shared func getTokenCanisterId(tokenType : Text) : async ?Text {
    switch (tokenType) {
      case ("ICP") { ?config.icpToken.canisterId };
      case ("ckUSDC") { ?config.ckUSDCToken.canisterId };
      case (_) { null };
    };
  };

  // ========================================
  // TRANSFER SERVICE METHODS
  // ========================================

  public shared func transferTokens(args : Types.TransferArgs) : async Types.TransferResponse {
    await transferService.transfer(args);
  };

  public shared func transferICP(toAccount : Types.TransferAccount, amount : Nat, memo : ?Text) : async Types.TransferResponse {
    await transferService.transferICP(toAccount, amount, memo);
  };

  public shared func transferCkUSDC(toAccount : Types.TransferAccount, amount : Nat, memo : ?Text) : async Types.TransferResponse {
    await transferService.transferCkUSDC(toAccount, amount, memo);
  };

  public shared func getBalance(account : Types.TransferAccount, tokenType : Text) : async Types.BalanceResponse {
    switch (await transferService.getBalance(account, tokenType)) {
      case (#ok(balance)) {
        #Success({
          balance = balance;
          tokenType = tokenType;
          account = account;
        });
      };
      case (#err(error)) {
        #Error(error);
      };
    };
  };

  public shared func getICPBalance(account : Types.TransferAccount) : async Types.BalanceResponse {
    switch (await transferService.getICPBalance(account)) {
      case (#ok(balance)) {
        #Success({
          balance = balance;
          tokenType = "ICP";
          account = account;
        });
      };
      case (#err(error)) {
        #Error(error);
      };
    };
  };

  public shared func getCkUSDCBalance(account : Types.TransferAccount) : async Types.BalanceResponse {
    switch (await transferService.getCkUSDCBalance(account)) {
      case (#ok(balance)) {
        #Success({
          balance = balance;
          tokenType = "ckUSDC";
          account = account;
        });
      };
      case (#err(error)) {
        #Error(error);
      };
    };
  };

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

  public shared func getTokenInfo(tokenType : Text) : async Types.TokenInfoResponse {
    switch (await transferService.getTokenInfo(tokenType)) {
      case (#ok(info)) {
        #Success({
          name = info.name;
          symbol = info.symbol;
          decimals = info.decimals;
          fee = info.fee;
          tokenType = tokenType;
        });
      };
      case (#err(error)) {
        #Error(error);
      };
    };
  };

  // ========================================
  // COLLATERAL SERVICE METHODS
  // ========================================

  public shared (_msg) func initializeCollateral(
    startupId : Text, 
    requiredAmount : Nat, 
    tokenType : Text
  ) : async Result.Result<Text, Text> {
    collateralService.initializeCollateral(startupId, requiredAmount, tokenType);
  };

  public shared (msg) func topUpCollateral(request : Types.TopUpRequest) : async Result.Result<Types.TopUpResponse, Text> {
    await collateralService.topUpCollateral(msg.caller, request);
  };

  public shared (_msg) func getCollateralStatus(startupId : Text) : async Result.Result<Types.CollateralInfo, Text> {
    collateralService.getCollateralStatus(startupId);
  };

  public shared (_msg) func getCollateralTopUpHistory(startupId : Text) : async Result.Result<[Types.CollateralTopUp], Text> {
    collateralService.getCollateralTopUpHistory(startupId);
  };

  public shared (_msg) func getCollateralProgress(startupId : Text) : async Types.CollateralProgressResponse {
    switch (collateralService.getCollateralProgress(startupId)) {
      case (#ok(progress)) {
        #Success(progress);
      };
      case (#err(error)) {
        #Error(error);
      };
    };
  };

  public shared func calculateRequiredCollateral(monthlyProfitSharing : Nat, tokenType : Text) : async Nat {
    collateralService.calculateRequiredCollateral(monthlyProfitSharing, tokenType);
  };

  public shared (_msg) func getAllCollateralInfo() : async [Types.CollateralInfo] {
    collateralService.getAllCollateralInfo();
  };

  public shared (_msg) func updateStartupStatus(startupId : Text, newStatus : Text) : async Bool {
    await collateralService.updateStartupStatus(startupId, newStatus);
  };

  public shared (_msg) func mintNFTForStartup(startupId : Text) : async Result.Result<Text, Text> {
    await collateralService.mintNFTForStartup(startupId);
  };

  // ========================================
  // NFT SERVICE METHODS
  // ========================================

  public shared (msg) func mintNFT(request : Types.MintNFTRequest) : async Result.Result<Types.MintNFTResponse, Text> {
    await nftService.mintNFT(msg.caller, request);
  };

  public shared (msg) func transferNFT(request : Types.TransferNFTRequest) : async Result.Result<Types.TransferNFTResponse, Text> {
    await nftService.transferNFT(msg.caller, request);
  };

  public shared (_msg) func getNFTInfo(tokenId : Nat) : async Result.Result<Types.NFTInfo, Text> {
    nftService.getNFTInfo(tokenId);
  };

  public shared (_msg) func getNFTsByStartup(startupId : Text) : async Result.Result<[Types.NFTInfo], Text> {
    nftService.getNFTsByStartup(startupId);
  };

  public shared (_msg) func getNFTBalance(account : Types.NFTAccount) : async Result.Result<Types.NFTBalanceResponse, Text> {
    nftService.getNFTBalance(account);
  };

  public shared (_msg) func getNFTOwner(tokenId : Nat) : async Result.Result<Types.NFTOwnerResponse, Text> {
    nftService.getNFTOwner(tokenId);
  };

  public shared (_msg) func getAllNFTs() : async [Types.NFTInfo] {
    nftService.getAllNFTs();
  };

  public shared (_msg) func getCollectionInfo() : async Types.NFTConfig {
    nftService.getCollectionInfo();
  };

  public shared (_msg) func canMintNFT(startupId : Text) : async Result.Result<Bool, Text> {
    nftService.canMintNFT(startupId);
  };

  public shared (_msg) func getNFTStats() : async {
    totalSupply : Nat;
    totalStartups : Nat;
    nextTokenId : Nat;
  } {
    nftService.getNFTStats();
  };

  // ========================================
  // NFT PURCHASE SERVICE METHODS
  // ========================================

  public shared (msg) func purchaseNFT(request : Types.NFTPurchaseRequest) : async Result.Result<Types.NFTPurchaseResponse, Text> {
    await nftPurchaseService.purchaseNFT(msg.caller, request);
  };

  public shared (_msg) func getPurchaseInfo(purchaseId : Text) : async Result.Result<Types.NFTPurchaseInfo, Text> {
    nftPurchaseService.getPurchaseInfo(purchaseId);
  };

  public shared (_msg) func getInvestorPurchaseHistory(investorId : Text) : async Result.Result<Types.NFTPurchaseHistory, Text> {
    nftPurchaseService.getInvestorPurchaseHistory(investorId);
  };

  public shared (_msg) func getStartupPurchaseHistory(startupId : Text) : async Result.Result<Types.NFTPurchaseHistory, Text> {
    nftPurchaseService.getStartupPurchaseHistory(startupId);
  };

  public shared (_msg) func getAllPurchases() : async [Types.NFTPurchaseInfo] {
    nftPurchaseService.getAllPurchases();
  };

  public shared (_msg) func getPurchaseStats() : async Types.NFTPurchaseStats {
    nftPurchaseService.getPurchaseStats();
  };

  public shared (_msg) func canPurchaseNFT(investorId : Text, startupId : Text) : async Result.Result<Bool, Text> {
    nftPurchaseService.canPurchaseNFT(investorId, startupId);
  };

  public shared (_msg) func getNFTPrice(startupId : Text) : async Result.Result<Nat, Text> {
    nftPurchaseService.getNFTPrice(startupId);
  };

  // ========================================
  // PERSISTENCE METHODS
  // ========================================

  system func preupgrade() {
    foundersEntries := Iter.toArray(storage.founders.entries());
    founderPrincipalsEntries := Iter.toArray(storage.founderPrincipals.entries());
    investorsEntries := Iter.toArray(storage.investors.entries());
    investorPrincipalsEntries := Iter.toArray(storage.investorPrincipals.entries());
    startupsEntries := Iter.toArray(storage.startups.entries());
    founderStartupsEntries := Iter.toArray(storage.founderStartups.entries());
    nextFounderId := storage.nextFounderId;
    nextInvestorId := storage.nextInvestorId;
    nextStartupId := storage.nextStartupId;
  };

  system func postupgrade() {
    // Migration: Add companyImages field to existing startups
    // For existing startups, initialize companyImages as empty array
    let migratedStartups = Array.map<(Text, Types.Startup), (Text, Types.Startup)>(
      startupsEntries,
      func((id, startup) : (Text, Types.Startup)) : (Text, Types.Startup) {
        let migratedStartup : Types.Startup = {
          id = startup.id;
          founderId = startup.founderId;
          startupName = startup.startupName;
          sector = startup.sector;
          foundedYear = startup.foundedYear;
          description = startup.description;
          website = startup.website;
          location = startup.location;
          companyType = startup.companyType;
          companyLogo = startup.companyLogo;
          companyImages = []; // Initialize new field as empty array for existing startups
          nftImage = startup.nftImage;
          problemStatement = startup.problemStatement;
          solution = startup.solution;
          targetMarket = startup.targetMarket;
          competitiveAdvantage = startup.competitiveAdvantage;
          marketingStrategy = startup.marketingStrategy;
          operationalProcess = startup.operationalProcess;
          founderBackground = startup.founderBackground;
          teamMembers = startup.teamMembers;
          advisors = startup.advisors;
          fundingGoal = startup.fundingGoal;
          nftPrice = startup.nftPrice;
          periodicProfitSharing = startup.periodicProfitSharing;
          revenueModel = startup.revenueModel;
          monthlyRevenue = startup.monthlyRevenue;
          monthlyExpenses = startup.monthlyExpenses;
          useOfFunds = startup.useOfFunds;
          businessPlan = startup.businessPlan;
          financialProjections = startup.financialProjections;
          legalDocuments = startup.legalDocuments;
          status = startup.status;
          createdAt = startup.createdAt;
          updatedAt = startup.updatedAt;
        };
        (id, migratedStartup);
      }
    );
    startupsEntries := migratedStartups;
  };
};
