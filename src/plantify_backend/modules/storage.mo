import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "./types";

module Storage {
  public class UserStorage(
    foundersEntries: [(Text, Types.Founder)],
    founderPrincipalsEntries: [(Principal, Text)],
    investorsEntries: [(Text, Types.Investor)],
    investorPrincipalsEntries: [(Principal, Text)],
    startupsEntries: [(Text, Types.Startup)],
    founderStartupsEntries: [(Text, [Text])],
    monthlyReportsEntries: [(Text, Types.MonthlyReport)],
    startupReportsEntries: [(Text, [Text])],
    votesEntries: [(Text, Types.InvestorVote)],
    reportVotesEntries: [(Text, [Text])],
    investorVotesEntries: [(Text, [Text])],
    initialNextFounderId: Nat,
    initialNextInvestorId: Nat,
    initialNextStartupId: Nat,
    initialNextReportId: Nat,
    initialNextVoteId: Nat
  ) {
    // ========================================
    // STORAGE VARIABLES
    // ========================================
    
    // Founder Storage
    public var founders = HashMap.fromIter<Text, Types.Founder>(
      foundersEntries.vals(),
      foundersEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var founderPrincipals = HashMap.fromIter<Principal, Text>(
      founderPrincipalsEntries.vals(),
      founderPrincipalsEntries.size(),
      Principal.equal,
      Principal.hash,
    );
    public var nextFounderId : Nat = initialNextFounderId;

    // Investor Storage
    public var investors = HashMap.fromIter<Text, Types.Investor>(
      investorsEntries.vals(),
      investorsEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var investorPrincipals = HashMap.fromIter<Principal, Text>(
      investorPrincipalsEntries.vals(),
      investorPrincipalsEntries.size(),
      Principal.equal,
      Principal.hash,
    );
    public var nextInvestorId : Nat = initialNextInvestorId;

    // Startup Storage
    public var startups = HashMap.fromIter<Text, Types.Startup>(
      startupsEntries.vals(),
      startupsEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var founderStartups = HashMap.fromIter<Text, [Text]>(
      founderStartupsEntries.vals(),
      founderStartupsEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var nextStartupId : Nat = initialNextStartupId;

    // Monthly Report Storage
    public var monthlyReports = HashMap.fromIter<Text, Types.MonthlyReport>(
      monthlyReportsEntries.vals(),
      monthlyReportsEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var startupReports = HashMap.fromIter<Text, [Text]>(
      startupReportsEntries.vals(),
      startupReportsEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var nextReportId : Nat = initialNextReportId;

    // Voting Storage
    public var votes = HashMap.fromIter<Text, Types.InvestorVote>(
      votesEntries.vals(),
      votesEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var reportVotes = HashMap.fromIter<Text, [Text]>(
      reportVotesEntries.vals(),
      reportVotesEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var investorVotes = HashMap.fromIter<Text, [Text]>(
      investorVotesEntries.vals(),
      investorVotesEntries.size(),
      Text.equal,
      Text.hash,
    );
    public var nextVoteId : Nat = initialNextVoteId;

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

    public func getAllFounders() : [Types.Founder] {
      let founderArray = Array.map<(Text, Types.Founder), Types.Founder>(
        Iter.toArray(founders.entries()),
        func((id, founder) : (Text, Types.Founder)) : Types.Founder { founder }
      );
      founderArray;
    };

    public func getAllInvestors() : [Types.Investor] {
      let investorArray = Array.map<(Text, Types.Investor), Types.Investor>(
        Iter.toArray(investors.entries()),
        func((id, investor) : (Text, Types.Investor)) : Types.Investor { investor }
      );
      investorArray;
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
            companyLogo = startupRequest.companyLogo;
            companyImages = startupRequest.companyImages;
            nftImage = startupRequest.nftImage;

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

    public func getAllStartups() : [Types.Startup] {
      let startupArray = Array.map<(Text, Types.Startup), Types.Startup>(
        Iter.toArray(startups.entries()),
        func(entry : (Text, Types.Startup)) : Types.Startup {
          let (id, startup) = entry;
          startup;
        },
      );
      startupArray;
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


    public func updateStartupStatus(startupId : Text, newStatus : Text) : Bool {
      switch (startups.get(startupId)) {
        case null { false };
        case (?startup) {
          let updatedStartup : Types.Startup = {
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
            companyImages = startup.companyImages;
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
            status = newStatus;
            createdAt = startup.createdAt;
            updatedAt = Time.now();
          };
          startups.put(startupId, updatedStartup);
          true;
        };
      };
    };

    // ========================================
    // MONTHLY REPORT METHODS
    // ========================================

    public func addMonthlyReport(report : Types.MonthlyReport) : Text {
      let reportKey = report.startupId # "-" # Nat.toText(report.year) # "-" # Nat.toText(report.month);
      monthlyReports.put(reportKey, report);

      // Update startup reports mapping
      switch (startupReports.get(report.startupId)) {
        case null {
          startupReports.put(report.startupId, [reportKey]);
        };
        case (?existingReports) {
          let updatedReports = Array.append<Text>(existingReports, [reportKey]);
          startupReports.put(report.startupId, updatedReports);
        };
      };

      report.id;
    };

    public func getMonthlyReport(reportKey : Text) : ?Types.MonthlyReport {
      monthlyReports.get(reportKey);
    };

    public func getMonthlyReportById(reportId : Text) : ?Types.MonthlyReport {
      for ((key, report) in monthlyReports.entries()) {
        if (report.id == reportId) {
          return ?report;
        };
      };
      null;
    };

    public func updateMonthlyReport(reportKey : Text, report : Types.MonthlyReport) : Bool {
      switch (monthlyReports.get(reportKey)) {
        case null { false };
        case (?_) {
          monthlyReports.put(reportKey, report);
          true;
        };
      };
    };

    public func getMonthlyReportsByStartup(startupId : Text) : [Types.MonthlyReport] {
      switch (startupReports.get(startupId)) {
        case null { [] };
        case (?reportKeys) {
          let reports = Array.mapFilter<Text, Types.MonthlyReport>(
            reportKeys,
            func(key : Text) : ?Types.MonthlyReport {
              monthlyReports.get(key);
            },
          );
          reports;
        };
      };
    };

    public func getAllMonthlyReports() : [Types.MonthlyReport] {
      let reportArray = Array.map<(Text, Types.MonthlyReport), Types.MonthlyReport>(
        Iter.toArray(monthlyReports.entries()),
        func(entry : (Text, Types.MonthlyReport)) : Types.MonthlyReport {
          let (key, report) = entry;
          report;
        },
      );
      reportArray;
    };

    public func getNextReportId() : Nat {
      let id = nextReportId;
      nextReportId += 1;
      id;
    };

    // ========================================
    // VOTING METHODS
    // ========================================

    public func addVote(vote : Types.InvestorVote) : Text {
      let voteKey = vote.investorId # "-" # vote.reportId;
      votes.put(voteKey, vote);

      // Update report votes mapping
      switch (reportVotes.get(vote.reportId)) {
        case null {
          reportVotes.put(vote.reportId, [voteKey]);
        };
        case (?existingVotes) {
          let updatedVotes = Array.append<Text>(existingVotes, [voteKey]);
          reportVotes.put(vote.reportId, updatedVotes);
        };
      };

      // Update investor votes mapping
      switch (investorVotes.get(vote.investorId)) {
        case null {
          investorVotes.put(vote.investorId, [voteKey]);
        };
        case (?existingVotes) {
          let updatedVotes = Array.append<Text>(existingVotes, [voteKey]);
          investorVotes.put(vote.investorId, updatedVotes);
        };
      };

      vote.id;
    };

    public func getVote(voteKey : Text) : ?Types.InvestorVote {
      votes.get(voteKey);
    };

    public func updateVote(voteKey : Text, vote : Types.InvestorVote) : Bool {
      switch (votes.get(voteKey)) {
        case null { false };
        case (?_) {
          votes.put(voteKey, vote);
          true;
        };
      };
    };

    public func getVotesByReport(reportId : Text) : [Types.InvestorVote] {
      switch (reportVotes.get(reportId)) {
        case null { [] };
        case (?voteKeys) {
          let reportVotesList = Array.mapFilter<Text, Types.InvestorVote>(
            voteKeys,
            func(key : Text) : ?Types.InvestorVote {
              votes.get(key);
            },
          );
          reportVotesList;
        };
      };
    };

    public func getVotesByInvestor(investorId : Text) : [Types.InvestorVote] {
      switch (investorVotes.get(investorId)) {
        case null { [] };
        case (?voteKeys) {
          let investorVotesList = Array.mapFilter<Text, Types.InvestorVote>(
            voteKeys,
            func(key : Text) : ?Types.InvestorVote {
              votes.get(key);
            },
          );
          investorVotesList;
        };
      };
    };

    public func getAllVotes() : [Types.InvestorVote] {
      let voteArray = Array.map<(Text, Types.InvestorVote), Types.InvestorVote>(
        Iter.toArray(votes.entries()),
        func(entry : (Text, Types.InvestorVote)) : Types.InvestorVote {
          let (key, vote) = entry;
          vote;
        },
      );
      voteArray;
    };

    public func getNextVoteId() : Nat {
      let id = nextVoteId;
      nextVoteId += 1;
      id;
    };

  };
};
