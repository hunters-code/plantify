import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "./modules/types";
import RegistrationService "./modules/services/registration";
import StartupCreation "./modules/services/startupCreation";
import TransferService "./modules/services/transfer";
import CollateralService "./modules/services/collateral";
import Config "./config";

persistent actor PlantifyBackend {
  private let config : Types.EnvironmentConfig = Config.getCurrentConfig();
  
  private transient let registrationService = RegistrationService.RegistrationService();
  private transient let startupCreationService = StartupCreation.StartupCreationService();
  private transient let transferService = TransferService.TransferService(config);
  private transient let collateralService = CollateralService.CollateralService(config);

  public shared (msg) func registerFounder(request : Types.FounderRegistrationRequest) : async Result.Result<Types.Founder, Text> {
    registrationService.registerFounder(msg.caller, request);
  };

  public shared (msg) func registerInvestor(request : Types.InvestorRegistrationRequest) : async Result.Result<Types.Investor, Text> {
    registrationService.registerInvestor(msg.caller, request);
  };

  public shared (msg) func createStartup(request : Types.StartupCreationRequest) : async Result.Result<Types.Startup, Text> {
    startupCreationService.createStartup(msg.caller, request);
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
};
