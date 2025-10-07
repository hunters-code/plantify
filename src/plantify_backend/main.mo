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
import MonthlyReportService "./modules/services/monthlyReport";
import VotingService "./modules/services/voting";
import Config "./config";

persistent actor PlantifyBackend {
  private transient let config : Types.EnvironmentConfig = Config.getCurrentConfig();
  
  // Transient storage variables - these do NOT persist across canister upgrades.
  // They are temporary and rebuilt from stable data after each upgrade.
  private transient var foundersEntries : [(Text, Types.Founder)] = [];
  private transient var founderPrincipalsEntries : [(Principal, Text)] = [];
  private transient var investorsEntries : [(Text, Types.Investor)] = [];
  private transient var investorPrincipalsEntries : [(Principal, Text)] = [];
  private transient var startupsEntries : [(Text, Types.Startup)] = [];
  private transient var founderStartupsEntries : [(Text, [Text])] = [];
  private transient var monthlyReportsEntries : [(Text, Types.MonthlyReport)] = [];
  private transient var startupReportsEntries : [(Text, [Text])] = [];
  private transient var votesEntries : [(Text, Types.InvestorVote)] = [];
  private transient var reportVotesEntries : [(Text, [Text])] = [];
  private transient var investorVotesEntries : [(Text, [Text])] = [];
  private transient var nextFounderId : Nat = 1;
  private transient var nextInvestorId : Nat = 1;
  private transient var nextStartupId : Nat = 1;
  private transient var nextReportId : Nat = 1;
  private transient var nextVoteId : Nat = 1;
  
  // Version tracking for migrations
  private transient var canisterVersion : Nat = 1;
  
  // Initialize storage from stable variables (transient - rebuilt on each upgrade)
  private transient let storage = Storage.UserStorage(
    foundersEntries,
    founderPrincipalsEntries,
    investorsEntries,
    investorPrincipalsEntries,
    startupsEntries,
    founderStartupsEntries,
    monthlyReportsEntries,
    startupReportsEntries,
    votesEntries,
    reportVotesEntries,
    investorVotesEntries,
    nextFounderId,
    nextInvestorId,
    nextStartupId,
    nextReportId,
    nextVoteId
  );
  private transient let registrationService = RegistrationService.RegistrationService(storage);
  private transient let startupCreationService = StartupCreation.StartupCreationService(storage);
  private transient let transferService = TransferService.TransferService(config);
  private transient let collateralService = CollateralService.CollateralService(config, storage);
  private transient let nftService = NFTService.NFTService(config, storage);
  private transient let nftPurchaseService = NFTPurchaseService.NFTPurchaseService(config, storage, transferService, nftService);
  private transient let monthlyReportService = MonthlyReportService.MonthlyReportService(storage);
  private transient let votingService = VotingService.VotingService(storage);

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

  public shared (msg) func getFounderByPrincipal() : async ?Types.Founder {
    storage.getFounderByPrincipal(msg.caller);
  };

  public shared (msg) func getInvestorByPrincipal() : async ?Types.Investor {
    storage.getInvestorByPrincipal(msg.caller);
  };

  public shared (msg) func getUserType() : async ?Types.UserType {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case (?_founder) { ?#Founder };
      case null {
        switch (storage.getInvestorByPrincipal(msg.caller)) {
          case (?_investor) { ?#Investor };
          case null { null };
        };
      };
    };
  };

  public shared (msg) func isUserFounder() : async Bool {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case (?_founder) { true };
      case null { false };
    };
  };

  public shared (msg) func isUserInvestor() : async Bool {
    switch (storage.getInvestorByPrincipal(msg.caller)) {
      case (?_investor) { true };
      case null { false };
    };
  };

  public shared func getAllStartups() : async [Types.Startup] {
    storage.getAllStartups();
  };

  public shared func getStartupDetails(startupId : Text) : async ?Types.Startup {
    storage.getStartup(startupId);
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

  public shared func getCanisterVersion() : async Nat {
    canisterVersion;
  };

  // ========================================
  // DATA SYNCHRONIZATION METHODS
  // ========================================

  // Sync data from storage to stable variables (called before upgrade)
  private func syncToStable() {
    foundersEntries := Iter.toArray(storage.founders.entries());
    founderPrincipalsEntries := Iter.toArray(storage.founderPrincipals.entries());
    investorsEntries := Iter.toArray(storage.investors.entries());
    investorPrincipalsEntries := Iter.toArray(storage.investorPrincipals.entries());
    startupsEntries := Iter.toArray(storage.startups.entries());
    founderStartupsEntries := Iter.toArray(storage.founderStartups.entries());
    monthlyReportsEntries := Iter.toArray(storage.monthlyReports.entries());
    startupReportsEntries := Iter.toArray(storage.startupReports.entries());
    votesEntries := Iter.toArray(storage.votes.entries());
    reportVotesEntries := Iter.toArray(storage.reportVotes.entries());
    investorVotesEntries := Iter.toArray(storage.investorVotes.entries());
    nextFounderId := storage.nextFounderId;
    nextInvestorId := storage.nextInvestorId;
    nextStartupId := storage.nextStartupId;
    nextReportId := storage.nextReportId;
    nextVoteId := storage.nextVoteId;
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

  public shared (msg) func getMyICPBalance() : async Types.BalanceResponse {
    let account : Types.TransferAccount = {
      owner = msg.caller;
      subaccount = null;
    };
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
  // MONTHLY REPORT SERVICE METHODS
  // ========================================

  public shared (msg) func createMonthlyReport(request : Types.MonthlyReportRequest) : async Result.Result<Types.MonthlyReport, Text> {
    monthlyReportService.createMonthlyReport(msg.caller, request);
  };

  public shared (msg) func updateMonthlyReport(reportId : Text, request : Types.MonthlyReportRequest) : async Result.Result<Types.MonthlyReport, Text> {
    monthlyReportService.updateMonthlyReport(msg.caller, reportId, request);
  };

  public shared (msg) func submitMonthlyReport(reportId : Text) : async Result.Result<Types.MonthlyReport, Text> {
    monthlyReportService.submitMonthlyReport(msg.caller, reportId);
  };

  public shared (_msg) func approveMonthlyReport(reportId : Text) : async Result.Result<Types.MonthlyReport, Text> {
    monthlyReportService.approveMonthlyReport(reportId);
  };

  public shared (_msg) func rejectMonthlyReport(reportId : Text) : async Result.Result<Types.MonthlyReport, Text> {
    monthlyReportService.rejectMonthlyReport(reportId);
  };

  public shared (_msg) func getMonthlyReport(reportId : Text) : async Result.Result<Types.MonthlyReport, Text> {
    monthlyReportService.getMonthlyReport(reportId);
  };

  public shared (_msg) func getMonthlyReportsByStartup(startupId : Text) : async Result.Result<Types.MonthlyReportList, Text> {
    monthlyReportService.getMonthlyReportsByStartup(startupId);
  };

  public shared (_msg) func getAllMonthlyReports() : async [Types.MonthlyReport] {
    monthlyReportService.getAllMonthlyReports();
  };

  public shared (_msg) func getMonthlyReportStats() : async Types.MonthlyReportStats {
    monthlyReportService.getMonthlyReportStats();
  };

  public shared (_msg) func getMonthlyReportsByStatus(status : Types.MonthlyReportStatus) : async [Types.MonthlyReport] {
    monthlyReportService.getMonthlyReportsByStatus(status);
  };

  // ========================================
  // VOTING SERVICE METHODS
  // ========================================

  public shared (msg) func castVote(request : Types.VoteRequest) : async Result.Result<Types.InvestorVote, Text> {
    votingService.castVote(msg.caller, request);
  };

  public shared (msg) func updateVote(reportId : Text, request : Types.VoteRequest) : async Result.Result<Types.InvestorVote, Text> {
    votingService.updateVote(msg.caller, reportId, request);
  };

  public shared (_msg) func getVoteSummary(reportId : Text) : async Result.Result<Types.VoteSummary, Text> {
    votingService.getVoteSummary(reportId);
  };

  public shared (_msg) func getReportVotes(reportId : Text) : async [Types.InvestorVote] {
    votingService.getReportVotes(reportId);
  };

  public shared (_msg) func getReportVoteDetails(reportId : Text) : async Result.Result<Types.ReportVoteDetails, Text> {
    votingService.getReportVoteDetails(reportId);
  };

  public shared (_msg) func getInvestorVoteHistory(investorId : Text) : async Result.Result<Types.InvestorVoteHistory, Text> {
    votingService.getInvestorVoteHistory(investorId);
  };

  public shared (msg) func getInvestorVoteForReport(reportId : Text) : async Result.Result<?Types.InvestorVote, Text> {
    votingService.getInvestorVoteForReport(msg.caller, reportId);
  };

  public shared (_msg) func getAllVotes() : async [Types.InvestorVote] {
    votingService.getAllVotes();
  };

  public shared (_msg) func getVotingStats() : async Types.VotingStats {
    votingService.getVotingStats();
  };

  public shared (msg) func canInvestorVote(reportId : Text) : async Result.Result<Bool, Text> {
    votingService.canInvestorVote(msg.caller, reportId);
  };

  // ========================================
  // PERSISTENCE METHODS
  // ========================================

  system func preupgrade() {
    syncToStable();
  };

  system func postupgrade() {
    if (canisterVersion < 2) {
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
      canisterVersion := 2;
    };
  };
};
