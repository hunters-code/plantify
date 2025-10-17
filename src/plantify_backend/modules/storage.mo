import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Types "./types";

module Storage {
  // Fungsi untuk membersihkan string dari karakter non-numerik
  private func cleanNumericString(input : Text) : Text {
    let chars = input.chars();
    var result : Text = "";
    
    for (char in chars) {
      let charCode = Char.toNat32(char);
      // Hanya simpan karakter angka (0-9)
      if (charCode >= 48 and charCode <= 57) {
        result := result # Char.toText(char);
      };
    };
    
    // Jika hasil kosong, return "0"
    if (Text.size(result) == 0) {
      "0";
    } else {
      result;
    };
  };

  // Safe textToNat function with overflow protection
  private func textToNat(txt : Text) : Nat {
    if (txt.size() == 0) { 0 }
    else if (txt.size() > 10) { 
      // If text is too long, return a safe maximum to prevent overflow
      1000000; 
    }
    else {
      let chars = txt.chars();
      var num : Nat = 0;
      var maxSafeValue : Nat = 1000000; // 1 million - safe maximum
      
      for (v in chars) {
        // First check if character is a digit (0-9) to prevent arithmetic overflow
        let charCode = Char.toNat32(v);
        if (charCode >= 48 and charCode <= 57) {
          let charToNum = Nat32.toNat(charCode - 48);
          
          // Check for overflow before multiplication
          if (num > maxSafeValue / 10) {
            return maxSafeValue; // Return max safe value to prevent overflow
          };
          
          let newNum = num * 10 + charToNum;
          if (newNum < num or newNum > maxSafeValue) {
            // Overflow detected, return max safe value
            return maxSafeValue;
          };
          num := newNum;
        } else {
          // Non-numeric character found, return 0
          return 0;
        };
      };
      
      num;
    };
  };

  public class UserStorage(
    foundersEntries : [(Text, Types.Founder)],
    founderPrincipalsEntries : [(Principal, Text)],
    investorsEntries : [(Text, Types.Investor)],
    investorPrincipalsEntries : [(Principal, Text)],
    startupsEntries : [(Text, Types.Startup)],
    founderStartupsEntries : [(Text, [Text])],
    monthlyReportsEntries : [(Text, Types.MonthlyReport)],
    startupReportsEntries : [(Text, [Text])],
    votesEntries : [(Text, Types.InvestorVote)],
    reportVotesEntries : [(Text, [Text])],
    investorVotesEntries : [(Text, [Text])],
    initialNextFounderId : Nat,
    initialNextInvestorId : Nat,
    initialNextStartupId : Nat,
    initialNextReportId : Nat,
    initialNextVoteId : Nat,
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
        func((id, founder) : (Text, Types.Founder)) : Types.Founder { founder },
      );
      founderArray;
    };

    public func getAllInvestors() : [Types.Investor] {
      let investorArray = Array.map<(Text, Types.Investor), Types.Investor>(
        Iter.toArray(investors.entries()),
        func((id, investor) : (Text, Types.Investor)) : Types.Investor {
          investor;
        },
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
        location = investor.location;
        occupation = investor.occupation;
        company = investor.company;
        bio = investor.bio;
        profilePhoto = investor.profilePhoto;
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

    public func updateInvestorProfile(investorId : Text, updateRequest : Types.InvestorProfileUpdateRequest) : Bool {
      switch (investors.get(investorId)) {
        case null { false };
        case (?existingInvestor) {
          let updatedInvestor : Types.Investor = {
            id = existingInvestor.id;
            principal = existingInvestor.principal;
            fullName = switch (updateRequest.fullName) {
              case null { existingInvestor.fullName };
              case (?name) { name };
            };
            email = switch (updateRequest.email) {
              case null { existingInvestor.email };
              case (?email) { email };
            };
            phone = switch (updateRequest.phone) {
              case null { existingInvestor.phone };
              case (?phone) { phone };
            };
            country = switch (updateRequest.country) {
              case null { existingInvestor.country };
              case (?country) { country };
            };
            city = switch (updateRequest.city) {
              case null { existingInvestor.city };
              case (?city) { city };
            };
            location = switch (updateRequest.location) {
              case null { existingInvestor.location };
              case (?location) { ?location };
            };
            occupation = switch (updateRequest.occupation) {
              case null { existingInvestor.occupation };
              case (?occupation) { ?occupation };
            };
            company = switch (updateRequest.company) {
              case null { existingInvestor.company };
              case (?company) { ?company };
            };
            bio = switch (updateRequest.bio) {
              case null { existingInvestor.bio };
              case (?bio) { ?bio };
            };
            profilePhoto = switch (updateRequest.profilePhoto) {
              case null { existingInvestor.profilePhoto };
              case (?photo) { ?photo };
            };
            investmentExperience = switch (updateRequest.investmentExperience) {
              case null { existingInvestor.investmentExperience };
              case (?experience) { experience };
            };
            riskTolerance = switch (updateRequest.riskTolerance) {
              case null { existingInvestor.riskTolerance };
              case (?tolerance) { tolerance };
            };
            investmentGoals = switch (updateRequest.investmentGoals) {
              case null { existingInvestor.investmentGoals };
              case (?goals) { goals };
            };
            availableCapital = switch (updateRequest.availableCapital) {
              case null { existingInvestor.availableCapital };
              case (?capital) { cleanNumericString(capital) };
            };
            monthlyBudget = switch (updateRequest.monthlyBudget) {
              case null { existingInvestor.monthlyBudget };
              case (?budget) { cleanNumericString(budget) };
            };
            createdAt = existingInvestor.createdAt;
            updatedAt = Time.now();
          };
          investors.put(investorId, updatedInvestor);
          true;
        };
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
            builtByCaffeineAI = startupRequest.builtByCaffeineAI;
            totalFunded = 0; // Always initialize to 0, only incremented by NFT purchases
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

    public func getStartupsByFounderPrincipal(principal : Principal) : [Types.Startup] {
      switch (founderPrincipals.get(principal)) {
        case null { [] };
        case (?founderId) { getStartupsByFounder(founderId) };
      };
    };

    public func getStartupsByFounderPrincipalPaginated(principal : Principal, params : Types.PaginationParams) : Types.PaginatedStartups {
      switch (founderPrincipals.get(principal)) {
        case null {
          {
            startups = [];
            totalCount = 0;
            page = params.page;
            limit = params.limit;
            totalPages = 0;
          };
        };
        case (?founderId) {
          let founderStartups = getStartupsByFounder(founderId);
          let totalCount = founderStartups.size();
          
          // Safe offset calculation to prevent arithmetic overflow
          let offset = if (params.page == 0) {
            0;
          } else if (params.limit == 0) {
            0;
          } else {
            // Check for potential overflow before multiplication
            let maxSafePage = if (params.limit > 0) {
              // Use a safe maximum to prevent overflow
              let maxPage = 1000000; // Reasonable maximum page number
              if (params.page > maxPage) {
                maxPage;
              } else {
                params.page;
              };
            } else {
              0;
            };
            maxSafePage * params.limit;
          };

          let paginatedStartups = if (offset >= totalCount or params.limit == 0) {
            [];
          } else {
            // Safe endIndex calculation to prevent overflow
            let endIndex = if (offset + params.limit > totalCount) {
              totalCount;
            } else {
              offset + params.limit;
            };
            let takeCount = if (endIndex > offset) {
              // Use a loop to safely calculate the difference
              var count : Nat = 0;
              var current : Nat = offset;
              while (current < endIndex) {
                count := count + 1;
                current := current + 1;
              };
              count;
            } else { 0 };

            if (takeCount == 0) {
              [];
            } else {
              // Safe array creation with overflow protection
              var safeStartups : [Types.Startup] = [];
              var i : Nat = 0;
              while (i < takeCount and i < 1000) { // Limit to 1000 items max
                if (offset + i < founderStartups.size()) {
                  let startup = founderStartups[offset + i];
                  safeStartups := Array.append(safeStartups, [startup]);
                };
                i := i + 1;
              };
              safeStartups;
            };
          };

          // Convert to lightweight startup summaries with overflow protection
          let startupSummaries = if (paginatedStartups.size() > 1000) {
            // If too many startups, return empty array to prevent overflow
            [];
          } else {
            Array.map<Types.Startup, Types.StartupSummary>(
              paginatedStartups,
              func(startup : Types.Startup) : Types.StartupSummary {
              // Get first company image or empty array if none
              let firstImage = if (startup.companyImages.size() > 0) {
                [startup.companyImages[0]];
              } else {
                [];
              };

              // Parse funding goal to calculate available NFTs with safe textToNat
              let fundingGoal = textToNat(startup.fundingGoal);
              let nftPrice = textToNat(startup.nftPrice);
              let availableNFTs = if (nftPrice > 0 and fundingGoal > 0 and nftPrice <= fundingGoal) {
                let result = fundingGoal / nftPrice;
                if (result > 1000000) { 1000000 } else { result }; // Cap at 1 million NFTs
              } else {
                0;
              };

              // Use the actual totalFunded from the startup record
              let totalFunded = startup.totalFunded;

              {
                id = startup.id;
                startupName = startup.startupName;
                description = startup.description;
                nftPrice = startup.nftPrice;
                companyImages = firstImage;
                companyType = startup.companyType;
                totalFunding = startup.fundingGoal;
                availableNFTs = availableNFTs;
                totalFunded = totalFunded;
                builtByCaffeineAI = startup.builtByCaffeineAI;
                location = startup.location;
              };
            },
            );
          };

          let totalPages = if (totalCount == 0 or params.limit == 0) {
            0;
          } else {
            // Safe division with overflow protection
            let pages = if (params.limit > 0) {
              let result = totalCount / params.limit;
              if (result > 1000000) { 1000000 } else { result }; // Cap at 1 million pages
            } else {
              0;
            };
            let remainder = if (params.limit > 0) {
              totalCount % params.limit;
            } else {
              0;
            };
            if (remainder == 0) { pages } else { 
              let finalPages = pages + 1;
              if (finalPages > 1000000) { 1000000 } else { finalPages };
            };
          };

          {
            startups = startupSummaries;
            totalCount = totalCount;
            page = params.page;
            limit = params.limit;
            totalPages = totalPages;
          };
        };
      };
    };

    public func getStartupsByFounderNameAndId(founderName : Text, founderId : Text) : [Types.Startup] {
      switch (founders.get(founderId)) {
        case null { [] };
        case (?founder) {
          if (founder.fullName == founderName) {
            getStartupsByFounder(founderId);
          } else {
            [];
          };
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

    public func getStartupsPaginated(params : Types.PaginationParams) : Types.PaginatedStartups {
      // Input validation to prevent overflow
      let safeParams = {
        page = if (params.page > 1000000) { 1000000 } else { params.page };
        limit = if (params.limit > 1000) { 1000 } else { params.limit };
      };
      
      let allStartups = Array.map<(Text, Types.Startup), Types.Startup>(
        Iter.toArray(startups.entries()),
        func(entry : (Text, Types.Startup)) : Types.Startup {
          let (id, startup) = entry;
          startup;
        },
      );

      let totalCount = allStartups.size();
      
      // Safe offset calculation to prevent arithmetic overflow
      let offset = if (safeParams.page == 0) {
        0;
      } else if (safeParams.limit == 0) {
        0;
      } else {
        safeParams.page * safeParams.limit;
      };

      let paginatedStartups = if (offset >= totalCount or safeParams.limit == 0) {
        [];
      } else {
        // Safe endIndex calculation to prevent overflow
        let endIndex = if (offset + safeParams.limit > totalCount) {
          totalCount;
        } else {
          offset + safeParams.limit;
        };
        let takeCount = if (endIndex > offset) {
          // Use a loop to safely calculate the difference
          var count : Nat = 0;
          var current : Nat = offset;
          while (current < endIndex) {
            count := count + 1;
            current := current + 1;
          };
          count;
        } else { 0 };

        if (takeCount == 0) {
          [];
        } else {
          // Safe array creation with overflow protection
          var safeStartups : [Types.Startup] = [];
          var i : Nat = 0;
          while (i < takeCount and i < 1000) { // Limit to 1000 items max
            if (offset + i < allStartups.size()) {
              let startup = allStartups[offset + i];
              safeStartups := Array.append(safeStartups, [startup]);
            };
            i := i + 1;
          };
          safeStartups;
        };
      };

      // Convert to lightweight startup summaries with overflow protection
      let startupSummaries = if (paginatedStartups.size() > 1000) {
        // If too many startups, return empty array to prevent overflow
        [];
      } else {
        Array.map<Types.Startup, Types.StartupSummary>(
          paginatedStartups,
          func(startup : Types.Startup) : Types.StartupSummary {
          // Get first company image or empty array if none
          let firstImage = if (startup.companyImages.size() > 0) {
            [startup.companyImages[0]];
          } else {
            [];
          };

          // Parse funding goal to calculate available NFTs with safe textToNat
          let fundingGoal = textToNat(startup.fundingGoal);
          let nftPrice = textToNat(startup.nftPrice);
          let availableNFTs = if (nftPrice > 0 and fundingGoal > 0 and nftPrice <= fundingGoal) {
            let result = fundingGoal / nftPrice;
            if (result > 1000000) { 1000000 } else { result }; // Cap at 1 million NFTs
          } else {
            0;
          };

          // Use the actual totalFunded from the startup record
          let totalFunded = startup.totalFunded;

          {
            id = startup.id;
            startupName = startup.startupName;
            description = startup.description;
            nftPrice = startup.nftPrice;
            companyImages = firstImage;
            companyType = startup.companyType;
            totalFunding = startup.fundingGoal;
            availableNFTs = availableNFTs;
            totalFunded = totalFunded;
            builtByCaffeineAI = startup.builtByCaffeineAI;
            location = startup.location;
          };
        },
        );
      };

      let totalPages = if (totalCount == 0 or safeParams.limit == 0) {
        0;
      } else {
        // Safe division with overflow protection
        let pages = if (safeParams.limit > 0) {
          let result = totalCount / safeParams.limit;
          if (result > 1000000) { 1000000 } else { result }; // Cap at 1 million pages
        } else {
          0;
        };
        let remainder = if (safeParams.limit > 0) {
          totalCount % safeParams.limit;
        } else {
          0;
        };
        if (remainder == 0) { pages } else { 
          let finalPages = pages + 1;
          if (finalPages > 1000000) { 1000000 } else { finalPages };
        };
      };

      {
        startups = startupSummaries;
        totalCount = totalCount;
        page = safeParams.page;
        limit = safeParams.limit;
        totalPages = totalPages;
      };
    };

    public func getStartupsCount() : Nat {
      startups.size();
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
            builtByCaffeineAI = startup.builtByCaffeineAI;
            totalFunded = startup.totalFunded;
            createdAt = startup.createdAt;
            updatedAt = Time.now();
          };
          startups.put(startupId, updatedStartup);
          true;
        };
      };
    };

    public func updateStartupTotalFunded(startupId : Text, amount : Nat) : Bool {
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
            status = startup.status;
            builtByCaffeineAI = startup.builtByCaffeineAI;
            totalFunded = startup.totalFunded + amount;
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
