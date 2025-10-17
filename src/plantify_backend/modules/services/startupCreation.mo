import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Char "mo:base/Char";
import Types "../types";
import Storage "../storage";

module StartupCreation {
  public class StartupCreationService(storage : Storage.UserStorage) {

    private func cleanNumericString(input : Text) : Text {
      let chars = input.chars();
      var result : Text = "";

      for (char in chars) {
        let charCode = Char.toNat32(char);

        if (charCode >= 48 and charCode <= 57) {
          result := result # Char.toText(char);
        };
      };

      if (Text.size(result) == 0) {
        "0";
      } else {
        result;
      };
    };

    private func cleanStartupRequest(request : Types.StartupCreationRequest) : Types.StartupCreationRequest {
      {
        startupName = request.startupName;
        sector = request.sector;
        foundedYear = cleanNumericString(request.foundedYear);
        description = request.description;
        website = request.website;
        location = request.location;
        companyType = request.companyType;
        companyLogo = request.companyLogo;
        companyImages = request.companyImages;
        nftImage = request.nftImage;
        problemStatement = request.problemStatement;
        solution = request.solution;
        targetMarket = request.targetMarket;
        competitiveAdvantage = request.competitiveAdvantage;
        marketingStrategy = request.marketingStrategy;
        operationalProcess = request.operationalProcess;
        founderBackground = request.founderBackground;
        teamMembers = request.teamMembers;
        advisors = request.advisors;
        fundingGoal = cleanNumericString(request.fundingGoal);
        nftPrice = cleanNumericString(request.nftPrice);
        periodicProfitSharing = cleanNumericString(request.periodicProfitSharing);
        revenueModel = request.revenueModel;
        monthlyRevenue = cleanNumericString(request.monthlyRevenue);
        monthlyExpenses = cleanNumericString(request.monthlyExpenses);
        useOfFunds = request.useOfFunds;
        businessPlan = request.businessPlan;
        financialProjections = request.financialProjections;
        legalDocuments = request.legalDocuments;
        status = request.status;
        builtByCaffeineAI = request.builtByCaffeineAI;
      };
    };

    public func createStartup(
      principal : Principal,
      request : Types.StartupCreationRequest,
    ) : Result.Result<Types.Startup, Text> {

      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {

          let cleanedRequest = cleanStartupRequest(request);
          let validationErrors = validateStartupRequest(cleanedRequest);

          if (validationErrors.size() > 0) {
            let errorMessage = Text.join("; ", validationErrors.vals());
            return #err(errorMessage);
          };

          switch (storage.addStartup(founder.id, cleanedRequest)) {
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

    public func createStartupForFounder(
      founderId : Text,
      request : Types.StartupCreationRequest,
    ) : Result.Result<Types.Startup, Text> {

      switch (storage.getFounder(founderId)) {
        case null {
          #err("Founder not found with ID: " # founderId);
        };
        case (?_) {

          let cleanedRequest = cleanStartupRequest(request);
          let validationErrors = validateStartupRequest(cleanedRequest);

          if (validationErrors.size() > 0) {
            let errorMessage = Text.join("; ", validationErrors.vals());
            return #err(errorMessage);
          };

          switch (storage.addStartup(founderId, cleanedRequest)) {
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

      if (request.teamMembers.size() == 0) {
        errors := Array.append(errors, ["At least one team member is required"]);
      };

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

      if (Text.size(request.status) == 0) {
        errors := Array.append(errors, ["Status is required"]);
      };

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
