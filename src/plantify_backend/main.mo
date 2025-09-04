import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "./modules/types";
import RegistrationService "./modules/services/registration";
import StartupCreation "./modules/services/startupCreation";

persistent actor PlantifyBackend {
  private transient let registrationService = RegistrationService.RegistrationService();
  private transient let startupCreationService = StartupCreation.StartupCreationService();

  public shared (msg) func registerFounder(request : Types.FounderRegistrationRequest) : async Result.Result<Types.Founder, Text> {
    registrationService.registerFounder(msg.caller, request);
  };

  public shared (msg) func registerInvestor(request : Types.InvestorRegistrationRequest) : async Result.Result<Types.Investor, Text> {
    registrationService.registerInvestor(msg.caller, request);
  };

  public shared (msg) func createStartup(request : Types.StartupCreationRequest) : async Result.Result<Types.Startup, Text> {
    startupCreationService.createStartup(msg.caller, request);
  };
};
