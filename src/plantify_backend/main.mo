import Text "mo:base/Text";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Types "./modules/types";
import RegistrationService "./modules/services/registration";
import StartupCreation "./modules/services/startupCreation";
import TransferService "./modules/services/transfer";
import Config "./config";

persistent actor PlantifyBackend {
  private let config : Types.EnvironmentConfig = Config.getDevelopmentConfig();
  
  private transient let registrationService = RegistrationService.RegistrationService();
  private transient let startupCreationService = StartupCreation.StartupCreationService();
  private transient let transferService = TransferService.TransferService(config);

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
  // TRANSFER & COLLATERAL METHODS
  // ========================================

  public shared (_msg) func initializeCollateral(startupId : Text, requiredAmount : Nat) : async Result.Result<Text, Text> {
    transferService.initializeCollateral(startupId, requiredAmount);
  };

  public shared (msg) func topUpCollateral(request : Types.TopUpRequest) : async Result.Result<Types.TopUpResult, Text> {
    await transferService.topUpCollateral(msg.caller, request);
  };

  public shared (_msg) func getCollateralStatus(startupId : Text) : async Result.Result<Types.CollateralInfo, Text> {
    transferService.getCollateralStatus(startupId);
  };

  public shared (_msg) func getCollateralTopUpHistory(startupId : Text) : async Result.Result<[Types.CollateralTopUp], Text> {
    transferService.getCollateralTopUpHistory(startupId);
  };

  public shared (_msg) func getCollateralProgress(startupId : Text) : async Result.Result<{ currentAmount : Nat; requiredAmount : Nat; percentage : Nat; status : Text; isFullyPaid : Bool }, Text> {
    transferService.getCollateralProgress(startupId);
  };

  // ========================================
  // TOKEN MANAGEMENT METHODS
  // ========================================

  public shared (msg) func mintTestTokens(amount : Nat) : async Result.Result<Text, Text> {
    await transferService.mintTestTokens(msg.caller, amount);
  };

  public shared (msg) func getTokenBalance() : async Nat {
    await transferService.getTokenBalance(msg.caller);
  };

  public shared func getTokenInfo() : async (Text, Text, Nat8, Nat) {
    await transferService.getTokenInfo();
  };

  public shared func calculateRequiredCollateral(monthlyProfitSharing : Nat) : async Nat {
    transferService.calculateRequiredCollateral(monthlyProfitSharing);
  };

  // ========================================
  // CONFIGURATION METHODS
  // ========================================

  public shared func getEnvironmentConfig() : async Types.EnvironmentConfig {
    config;
  };

  public shared func isUsingTestToken() : async Bool {
    config.useTestToken;
  };

  public shared func getPlantifyAccount() : async Text {
    config.plantifyAccount;
  };

  public shared func getMainnetConfig() : async ?{ canisterId : Text; ledgerId : Text } {
    config.mainnetCkUSDC;
  };
};
