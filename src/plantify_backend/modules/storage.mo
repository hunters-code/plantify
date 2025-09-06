import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Types "./types";

module Storage {
  public class UserStorage() {
    // ========================================
    // STORAGE VARIABLES
    // ========================================
    
    // Founder Storage
    private var founders = HashMap.HashMap<Text, Types.Founder>(
      0,
      Text.equal,
      Text.hash,
    );
    private var founderPrincipals = HashMap.HashMap<Principal, Text>(
      0,
      Principal.equal,
      Principal.hash,
    );
    private var nextFounderId : Nat = 1;

    // Investor Storage
    private var investors = HashMap.HashMap<Text, Types.Investor>(
      0,
      Text.equal,
      Text.hash,
    );
    private var investorPrincipals = HashMap.HashMap<Principal, Text>(
      0,
      Principal.equal,
      Principal.hash,
    );
    private var nextInvestorId : Nat = 1;

    // Startup Storage
    private var startups = HashMap.HashMap<Text, Types.Startup>(
      0,
      Text.equal,
      Text.hash,
    );
    private var founderStartups = HashMap.HashMap<Text, [Text]>(
      0,
      Text.equal,
      Text.hash,
    );
    private var nextStartupId : Nat = 1;


    // ========================================
    // FOUNDER METHODS
    // ========================================

    public func addFounder(founder : Types.Founder) : Text {
      let id = Nat.toText(nextFounderId);
      nextFounderId += 1;
      let newFounder = {
        id = id;
        principal = founder.principal;
        fullName = founder.fullName;
        email = founder.email;
        phone = founder.phone;
        address = founder.address;
        experience = founder.experience;
        previousBusinesses = founder.previousBusinesses;
        expertise = founder.expertise;
        linkedIn = founder.linkedIn;
        idNumber = founder.idNumber;
        taxNumber = founder.taxNumber;
        createdAt = founder.createdAt;
        updatedAt = founder.updatedAt;
      };
      founders.put(id, newFounder);
      founderPrincipals.put(founder.principal, id);
      id;
    };

    public func getFounder(id : Text) : ?Types.Founder {
      founders.get(id);
    };

    public func getFounderByPrincipal(principal : Principal) : ?Types.Founder {
      switch (founderPrincipals.get(principal)) {
        case null { null };
        case (?id) { founders.get(id) };
      };
    };

    // ========================================
    // INVESTOR METHODS
    // ========================================

    public func addInvestor(investor : Types.Investor) : Text {
      let id = Nat.toText(nextInvestorId);
      nextInvestorId += 1;
      let newInvestor = {
        id = id;
        principal = investor.principal;
        fullName = investor.fullName;
        email = investor.email;
        phone = investor.phone;
        country = investor.country;
        city = investor.city;
        investmentExperience = investor.investmentExperience;
        riskTolerance = investor.riskTolerance;
        investmentGoals = investor.investmentGoals;
        availableCapital = investor.availableCapital;
        monthlyBudget = investor.monthlyBudget;
        createdAt = investor.createdAt;
        updatedAt = investor.updatedAt;
      };
      investors.put(id, newInvestor);
      investorPrincipals.put(investor.principal, id);
      id;
    };

    public func getInvestor(id : Text) : ?Types.Investor {
      investors.get(id);
    };

    public func getInvestorByPrincipal(principal : Principal) : ?Types.Investor {
      switch (investorPrincipals.get(principal)) {
        case null { null };
        case (?id) { investors.get(id) };
      };
    };

    // ========================================
    // STARTUP METHODS
    // ========================================

    public func addStartup(founderId : Text, startupRequest : Types.StartupCreationRequest) : ?Text {
      // Validate that founder exists
      switch (founders.get(founderId)) {
        case null { null };
        case (?_) {
          let id = Nat.toText(nextStartupId);
          nextStartupId += 1;
          let now = Time.now();
          let newStartup : Types.Startup = {
            id = id;
            founderId = founderId;
            startupName = startupRequest.startupName;
            sector = startupRequest.sector;
            foundedYear = startupRequest.foundedYear;
            description = startupRequest.description;
            website = startupRequest.website;
            location = startupRequest.location;
            companyType = startupRequest.companyType;

            problemStatement = startupRequest.problemStatement;
            solution = startupRequest.solution;
            targetMarket = startupRequest.targetMarket;
            competitiveAdvantage = startupRequest.competitiveAdvantage;
            marketingStrategy = startupRequest.marketingStrategy;
            operationalProcess = startupRequest.operationalProcess;

            // Team Information
            founderBackground = startupRequest.founderBackground;
            teamMembers = startupRequest.teamMembers;
            advisors = startupRequest.advisors;

            // Financial Projections
            fundingGoal = startupRequest.fundingGoal;
            nftPrice = startupRequest.nftPrice;
            periodicProfitSharing = startupRequest.periodicProfitSharing;
            revenueModel = startupRequest.revenueModel;
            monthlyRevenue = startupRequest.monthlyRevenue;
            monthlyExpenses = startupRequest.monthlyExpenses;
            useOfFunds = startupRequest.useOfFunds;

            // Collateral
            collateralSource = startupRequest.collateralSource;
            collateralAmount = startupRequest.collateralAmount;

            // Documents
            businessPlan = startupRequest.businessPlan;
            financialProjections = startupRequest.financialProjections;
            legalDocuments = startupRequest.legalDocuments;

            // Status and Metadata
            status = startupRequest.status;
            createdAt = now;
            updatedAt = now;
          };
          startups.put(id, newStartup);

          // Update founder's startup list
          switch (founderStartups.get(founderId)) {
            case null { founderStartups.put(founderId, [id]) };
            case (?existingStartups) {
              let updatedStartups = Array.append(existingStartups, [id]);
              founderStartups.put(founderId, updatedStartups);
            };
          };
          ?id;
        };
      };
    };

    public func getStartup(id : Text) : ?Types.Startup {
      startups.get(id);
    };

    public func getStartupsByFounder(founderId : Text) : [Types.Startup] {
      switch (founderStartups.get(founderId)) {
        case null { [] };
        case (?startupIds) {
          let startupArray = Array.map<Text, ?Types.Startup>(
            startupIds,
            func(id : Text) : ?Types.Startup { startups.get(id) },
          );
          let validStartups = Array.filter<?Types.Startup>(
            startupArray,
            func(startup : ?Types.Startup) : Bool {
              switch (startup) {
                case null { false };
                case (?_) { true };
              };
            },
          );
          Array.map<?Types.Startup, Types.Startup>(
            validStartups,
            func(startup : ?Types.Startup) : Types.Startup {
              switch (startup) {
                case null { assert false; loop {} };
                case (?s) { s };
              };
            },
          );
        };
      };
    };

    // ========================================
    // FOUNDER-STARTUP RELATIONSHIP METHODS
    // ========================================

    public func getFounderOfStartup(startupId : Text) : ?Types.Founder {
      switch (startups.get(startupId)) {
        case null { null };
        case (?startup) { founders.get(startup.founderId) };
      };
    };


  };
};
