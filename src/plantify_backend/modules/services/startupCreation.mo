import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Types "../types";
import Storage "../storage";

module StartupCreation {
  public class StartupCreationService() {
    private let storage = Storage.UserStorage();

    public func createStartup(
      principal : Principal,
      request : Types.StartupCreationRequest,
    ) : Result.Result<Types.Startup, Text> {
      // First, get the founder by principal to get founderId
      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {
          let validationErrors = validateStartupRequest(request);

          if (validationErrors.size() > 0) {
            let errorMessage = Text.join("; ", validationErrors.vals());
            return #err(errorMessage);
          };

          // Create startup with founder validation
          switch (storage.addStartup(founder.id, request)) {
            case null {
              #err("Failed to create startup");
            };
            case (?startupId) {
              switch (storage.getStartup(startupId)) {
                case null {
                  #err("Failed to retrieve created startup");
                };
                case (?createdStartup) {
                  #ok(createdStartup);
                };
              };
            };
          };
        };
      };
    };

    private func validateStartupRequest(request : Types.StartupCreationRequest) : [Text] {
      var errors : [Text] = [];

      // Basic Information Validation
      if (Text.size(request.startupName) == 0) {
        errors := Array.append(errors, ["Startup name is required"]);
      };
      if (Text.size(request.sector) == 0) {
        errors := Array.append(errors, ["Sector is required"]);
      };
      if (Text.size(request.foundedYear) == 0) {
        errors := Array.append(errors, ["Founded year is required"]);
      };
      if (Text.size(request.description) == 0) {
        errors := Array.append(errors, ["Description is required"]);
      };
      if (Text.size(request.companyType) == 0) {
        errors := Array.append(errors, ["Company type is required"]);
      };

      // Team Information Validation
      if (request.teamMembers.size() == 0) {
        errors := Array.append(errors, ["At least one team member is required"]);
      };

      // Financial Projections Validation
      if (Text.size(request.fundingGoal) == 0) {
        errors := Array.append(errors, ["Funding goal is required"]);
      };
      if (Text.size(request.nftPrice) == 0) {
        errors := Array.append(errors, ["NFT price is required"]);
      };
      if (Text.size(request.periodicProfitSharing) == 0) {
        errors := Array.append(errors, ["Periodic profit sharing is required"]);
      };
      if (Text.size(request.revenueModel) == 0) {
        errors := Array.append(errors, ["Revenue model is required"]);
      };
      if (Text.size(request.monthlyRevenue) == 0) {
        errors := Array.append(errors, ["Monthly revenue is required"]);
      };
      if (Text.size(request.monthlyExpenses) == 0) {
        errors := Array.append(errors, ["Monthly expenses is required"]);
      };


      // Status Validation
      if (Text.size(request.status) == 0) {
        errors := Array.append(errors, ["Status is required"]);
      };

      // Team Members Validation
      for (member in request.teamMembers.vals()) {
        if (Text.size(member.name) == 0) {
          errors := Array.append(errors, ["Team member name is required"]);
        };
        if (Text.size(member.role) == 0) {
          errors := Array.append(errors, ["Team member role is required"]);
        };
      };

      errors;
    };
  };
};
