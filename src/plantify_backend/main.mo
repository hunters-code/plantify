import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "./modules/types";
import RegistrationService "./modules/services/registration";

persistent actor PlantifyBackend {
    private transient let registrationService = RegistrationService.RegistrationService();

    public shared(msg) func registerFounder(request: Types.FounderRegistrationRequest): async Result.Result<Types.Founder, Text> {
        registrationService.registerFounder(msg.caller, request)
    };

    public shared(msg) func registerInvestor(request: Types.InvestorRegistrationRequest): async Result.Result<Types.Investor, Text> {
        registrationService.registerInvestor(msg.caller, request)
    };
};
