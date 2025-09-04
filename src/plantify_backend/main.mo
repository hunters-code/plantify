import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "./modules/types";
import RegistrationService "./modules/services/registration";
import StartupCreation "./modules/services/startupCreation";
import CollateralService "./modules/services/collateral";

persistent actor PlantifyBackend {
  private transient let registrationService = RegistrationService.RegistrationService();
  private transient let startupCreationService = StartupCreation.StartupCreationService();
  private transient let collateralService = CollateralService.CollateralService();

  public shared (msg) func registerFounder(request : Types.FounderRegistrationRequest) : async Result.Result<Types.Founder, Text> {
    registrationService.registerFounder(msg.caller, request);
  };

  public shared (msg) func registerInvestor(request : Types.InvestorRegistrationRequest) : async Result.Result<Types.Investor, Text> {
    registrationService.registerInvestor(msg.caller, request);
  };

  public shared (msg) func createStartup(request : Types.StartupCreationRequest) : async Result.Result<Types.Startup, Text> {
    startupCreationService.createStartup(msg.caller, request);
  };

  public shared (msg) func createCollateral(startupId : Text, totalRequiredAmount : Text) : async Result.Result<Types.Collateral, Text> {
    collateralService.createCollateral(msg.caller, startupId, totalRequiredAmount);
  };

  public shared (msg) func topUpCollateral(request : Types.CollateralTopUpRequest) : async Result.Result<Types.Collateral, Text> {
    collateralService.topUpCollateral(msg.caller, request);
  };

  public shared (msg) func getCollateralsByStartup(startupId : Text) : async Result.Result<[Types.Collateral], Text> {
    collateralService.getCollateralsByStartup(msg.caller, startupId);
  };

  public shared (msg) func getCollateral(collateralId : Text) : async Result.Result<Types.Collateral, Text> {
    collateralService.getCollateral(msg.caller, collateralId);
  };

  public shared (msg) func updateCollateralStatus(collateralId : Text, newStatus : Text) : async Result.Result<Types.Collateral, Text> {
    collateralService.updateCollateralStatus(msg.caller, collateralId, newStatus);
  };

  public shared query func getPlantifyWalletAddress() : async Principal {
    collateralService.getPlantifyWalletAddress();
  };
};
