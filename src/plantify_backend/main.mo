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
import DashboardFounderService "./modules/services/dashboardFounder";
import DashboardInvestorService "./modules/services/dashboardInvestor";
import Config "./config";
persistent actor PlantifyBackend {
  // Stable variables for persistence across canister upgrades
  private var config : Types.EnvironmentConfig = Config.getCurrentConfig();
  private var foundersEntries : [(Text, Types.Founder)] = [];
  private var founderPrincipalsEntries : [(Principal, Text)] = [];
  private var investorsEntries : [(Text, Types.Investor)] = [];
  private var investorPrincipalsEntries : [(Principal, Text)] = [];
  private var startupsEntries : [(Text, Types.Startup)] = [];
  private var founderStartupsEntries : [(Text, [Text])] = [];
  private var monthlyReportsEntries : [(Text, Types.MonthlyReport)] = [];
  private var startupReportsEntries : [(Text, [Text])] = [];
  private var votesEntries : [(Text, Types.InvestorVote)] = [];
  private var reportVotesEntries : [(Text, [Text])] = [];
  private var investorVotesEntries : [(Text, [Text])] = [];
  private var nextFounderId : Nat = 1;
  private var nextInvestorId : Nat = 1;
  private var nextStartupId : Nat = 1;
  private var nextReportId : Nat = 1;
  private var nextVoteId : Nat = 1;
  
  
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
  private transient let nftService = NFTService.NFTService(storage);
  private transient let nftPurchaseService = NFTPurchaseService.NFTPurchaseService(config, storage, transferService, nftService);
  private transient let monthlyReportService = MonthlyReportService.MonthlyReportService(storage);
  private transient let votingService = VotingService.VotingService(storage);
  private transient let dashboardFounderService = DashboardFounderService.DashboardFounder(storage, nftPurchaseService, nftService, collateralService);
  private transient let dashboardInvestorService = DashboardInvestorService.DashboardInvestor(storage, nftPurchaseService, nftService, votingService);

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

  public shared (msg) func updateInvestorProfile(request : Types.InvestorProfileUpdateRequest) : async Result.Result<Types.Investor, Text> {
    switch (storage.getInvestorByPrincipal(msg.caller)) {
      case null { #err("Investor not found") };
      case (?investor) {
        if (storage.updateInvestorProfile(investor.id, request)) {
          switch (storage.getInvestor(investor.id)) {
            case null { #err("Failed to retrieve updated investor") };
            case (?updatedInvestor) { #ok(updatedInvestor) };
          };
        } else {
          #err("Failed to update investor profile");
        };
      };
    };
  };

  public shared (msg) func getInvestorProfile() : async ?Types.Investor {
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

  public shared func getStartupsPaginated(params : Types.PaginationParams) : async Types.PaginatedStartups {
    storage.getStartupsPaginated(params);
  };

  public shared func getStartupsCount() : async Nat {
    storage.getStartupsCount();
  };

  public shared func getStartupDetails(startupId : Text) : async ?Types.Startup {
    storage.getStartup(startupId);
  };

  public shared (msg) func getStartupsByFounderPrincipal() : async [Types.Startup] {
    storage.getStartupsByFounderPrincipal(msg.caller);
  };

  public shared (msg) func getStartupsByFounderPrincipalPaginated(params : Types.PaginationParams) : async Types.PaginatedStartups {
    storage.getStartupsByFounderPrincipalPaginated(msg.caller, params);
  };

  public shared func getStartupsByFounderNameAndId(founderName : Text, founderId : Text) : async [Types.Startup] {
    storage.getStartupsByFounderNameAndId(founderName, founderId);
  };

  // ========================================
  // FEATURED STARTUPS METHODS
  // ========================================

  public shared func getFeaturedStartup() : async ?Types.Startup {
    let allStartups = storage.getAllStartups();
    if (allStartups.size() == 0) {
      null;
    } else {
      // Sort by creation date (newest first) and return the first one
      let sortedStartups = Array.sort<Types.Startup>(
        allStartups,
        func(a : Types.Startup, b : Types.Startup) : {#less; #equal; #greater} {
          if (a.createdAt > b.createdAt) { #greater }
          else if (a.createdAt < b.createdAt) { #less }
          else { #equal };
        },
      );
      ?sortedStartups[0];
    };
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
    1;
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

  public shared (_msg) func getNFTBalance(account : Types.NFTAccount) : async Result.Result<Types.NFTBalanceResponse, Text> {
    nftService.getNFTBalance(account);
  };

  public shared (_msg) func getNFTOwner(tokenId : Nat) : async Result.Result<Types.NFTOwnerResponse, Text> {
    nftService.getNFTOwner(tokenId);
  };

  public shared (_msg) func getAllNFTs() : async [Types.NFTInfo] {
    nftService.getAllNFTs();
  };

  public shared (_msg) func getNFTsByStartup(startupId : Text) : async Result.Result<[Types.NFTInfo], Text> {
    nftService.getNFTsByStartup(startupId);
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

  public shared (msg) func purchaseNFT(request : Types.NFTPurchaseRequest) : async Types.NFTPurchaseResponse {
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
  // DASHBOARD FOUNDER SERVICE METHODS
  // ========================================

  public shared (msg) func getFounderDashboardOverview() : async Types.DashboardOverviewResponse {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case null { #Error("Founder not found") };
      case (?founder) {
        dashboardFounderService.getFounderDashboardOverview(founder.id);
      };
    };
  };

  public shared (msg) func getFounderStartupOverview(startupId : Text) : async Types.StartupOverviewResponse {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case null { #Error("Founder not found") };
      case (?founder) {
        // Verify that the startup belongs to this founder
        let founderStartups = storage.getStartupsByFounder(founder.id);
        let startupExists = Array.find<Types.Startup>(founderStartups, func(startup) = startup.id == startupId);
        switch (startupExists) {
          case null { #Error("Startup not found or not owned by this founder") };
          case (?_) { dashboardFounderService.getFounderStartupOverview(startupId) };
        };
      };
    };
  };

  public shared (msg) func getStartupTeamMembers(startupId : Text) : async Types.TeamMembersResponse {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case null { #Error("Founder not found") };
      case (?founder) {
        // Verify that the startup belongs to this founder
        let founderStartups = storage.getStartupsByFounder(founder.id);
        let startupExists = Array.find<Types.Startup>(founderStartups, func(startup) = startup.id == startupId);
        switch (startupExists) {
          case null { #Error("Startup not found or not owned by this founder") };
          case (?_) { dashboardFounderService.getStartupTeamMembers(startupId) };
        };
      };
    };
  };

  public shared (msg) func getFundingStatus(startupId : Text) : async Types.FundingStatusResponse {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case null { #Error("Founder not found") };
      case (?founder) {
        // Verify that the startup belongs to this founder
        let founderStartups = storage.getStartupsByFounder(founder.id);
        let startupExists = Array.find<Types.Startup>(founderStartups, func(startup) = startup.id == startupId);
        switch (startupExists) {
          case null { #Error("Startup not found or not owned by this founder") };
          case (?_) { dashboardFounderService.getFundingStatus(startupId) };
        };
      };
    };
  };

  public shared (msg) func getCollateralDashboard(startupId : Text) : async Types.CollateralDashboardResponse {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case null { #Error("Founder not found") };
      case (?founder) {
        // Verify that the startup belongs to this founder
        let founderStartups = storage.getStartupsByFounder(founder.id);
        let startupExists = Array.find<Types.Startup>(founderStartups, func(startup) = startup.id == startupId);
        switch (startupExists) {
          case null { #Error("Startup not found or not owned by this founder") };
          case (?_) { dashboardFounderService.getCollateralStatus(startupId) };
        };
      };
    };
  };

  public shared (msg) func getInvestorDashboard() : async Types.InvestorDashboardResponse {
    switch (storage.getFounderByPrincipal(msg.caller)) {
      case null { #Error("Founder not found") };
      case (?founder) {
        dashboardFounderService.getInvestorDashboard(founder.id);
      };
    };
  };

  // ========================================
  // DASHBOARD INVESTOR SERVICE METHODS
  // ========================================

  public shared (msg) func getInvestorDashboardOverview() : async Types.InvestorDashboardOverviewResponse {
    switch (storage.getInvestorByPrincipal(msg.caller)) {
      case null { #Error("Investor not found") };
      case (?investor) {
        dashboardInvestorService.getInvestorDashboardOverview(investor.id);
      };
    };
  };

  public shared (msg) func getInvestorPerformance() : async Types.InvestorPerformanceResponse {
    switch (storage.getInvestorByPrincipal(msg.caller)) {
      case null { #Error("Investor not found") };
      case (?investor) {
        dashboardInvestorService.getInvestorPerformance(investor.id);
      };
    };
  };

  public shared (msg) func getInvestorStartupInvestment(startupId : Text) : async Types.InvestorStartupInvestmentResponse {
    switch (storage.getInvestorByPrincipal(msg.caller)) {
      case null { #Error("Investor not found") };
      case (?investor) {
        dashboardInvestorService.getInvestorStartupInvestments(investor.id, startupId);
      };
    };
  };

  public shared (msg) func getMyInvestmentPortfolio() : async Types.MyInvestmentPortfolioResponse {
    switch (storage.getInvestorByPrincipal(msg.caller)) {
      case null { #Error("Investor not found") };
      case (?investor) {
        dashboardInvestorService.getMyInvestmentPortfolio(investor.id);
      };
    };
  };

  // ========================================
  // PERSISTENCE METHODS
  // ========================================

  system func postupgrade() {
    config := Config.getCurrentConfig();
  };
};
