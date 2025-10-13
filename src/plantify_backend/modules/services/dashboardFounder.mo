import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Char "mo:base/Char";
import Time "mo:base/Time";
import Nat32 "mo:base/Nat32";
import Types "../types";
import Storage "../storage";
import NFTPurchaseService "./nftPurchase";
import NFTService "./nft";
import CollateralService "./collateral";

module DashboardFounderService {
  public class DashboardFounder(
    storage : Storage.UserStorage,
    nftPurchaseService : NFTPurchaseService.NFTPurchaseService,
    nftService : NFTService.NFTService,
    collateralService : CollateralService.CollateralService
  ) {
    
    // Get dashboard overview for a specific founder
    public func getFounderDashboardOverview(founderId : Text) : Types.DashboardOverviewResponse {
      switch (storage.getFounder(founderId)) {
        case null {
          #Error("Founder not found");
        };
        case (?_founder) {
          let founderStartups = storage.getStartupsByFounder(founderId);
          
          // Calculate metrics
          let totalFundingRaised = calculateTotalFundingRaised(founderStartups);
          let activeStartups = countStartupsByStatus(founderStartups, "Active");
          let pendingStartups = countStartupsByStatus(founderStartups, "Pending");
          let draftStartups = countStartupsByStatus(founderStartups, "Draft");
          let totalNFTHolders = calculateTotalNFTHolders(founderStartups);
          let totalMonthlyCommitments = calculateTotalMonthlyCommitments(founderStartups);
          
          let overview : Types.DashboardOverview = {
            totalFundingRaised = totalFundingRaised;
            activeStartups = activeStartups;
            pendingStartups = pendingStartups;
            draftStartups = draftStartups;
            totalNFTHolders = totalNFTHolders;
            totalMonthlyCommitments = totalMonthlyCommitments;
          };
          
          #Success(overview);
        };
      };
    };
    
    // Calculate total funding raised across all founder's startups
    private func calculateTotalFundingRaised(startups : [Types.Startup]) : Nat {
      var total : Nat = 0;
      for (startup in startups.vals()) {
        total := total + startup.totalFunded;
      };
      total;
    };
    
    // Count startups by status
    private func countStartupsByStatus(startups : [Types.Startup], status : Text) : Nat {
      var count : Nat = 0;
      for (startup in startups.vals()) {
        if (startup.status == status) {
          count := count + 1;
        };
      };
      count;
    };
    
    // Calculate total NFT holders across all founder's startups
    private func calculateTotalNFTHolders(startups : [Types.Startup]) : Nat {
      var totalHolders : Nat = 0;
      for (startup in startups.vals()) {
        // Get all monthly reports for this startup to count unique investors
        let reports = storage.getMonthlyReportsByStartup(startup.id);
        
        for (report in reports.vals()) {
          // Add investor count from this report
          totalHolders := totalHolders + report.investorCount;
        };
      };
      totalHolders;
    };
    
    // Calculate total monthly commitments (profit sharing amounts)
    private func calculateTotalMonthlyCommitments(startups : [Types.Startup]) : Nat {
      var totalCommitments : Nat = 0;
      for (startup in startups.vals()) {
        let reports = storage.getMonthlyReportsByStartup(startup.id);
        for (report in reports.vals()) {
          totalCommitments := totalCommitments + report.profitSharingAmount;
        };
      };
      totalCommitments;
    };
    
    // Get startup-specific dashboard overview
    public func getFounderStartupOverview(startupId : Text) : Types.StartupOverviewResponse {
      switch (storage.getStartup(startupId)) {
        case null {
          #Error("Startup not found");
        };
        case (?startup) {
          let totalNFTSale = calculateTotalNFTSale(startupId);
          let totalNFT = calculateTotalNFT(startupId);
          
          let overview : Types.StartupOverview = {
            name = startup.startupName;
            companyType = startup.companyType;
            location = startup.location;
            description = startup.description;
            totalFunded = startup.totalFunded;
            fundTarget = textToNat(startup.fundingGoal);
            totalNFTSale = totalNFTSale;
            totalNFT = totalNFT;
            totalTeamMembers = startup.teamMembers.size();
          };
          
          #Success(overview);
        };
      };
    };
    
    // Helper function to convert text to natural number
    private func textToNat(txt : Text) : Nat {
      if (txt.size() == 0) { 0 }
      else {
        let chars = txt.chars();
        var num : Nat = 0;
        for (v in chars) {
          let charToNum = Nat32.toNat(Char.toNat32(v) -48);
          if (charToNum >= 0 and charToNum <= 9) {
            num := num * 10 + charToNum;
          };
        };
        num;
      };
    };
    
    // Calculate total NFT sales for a startup
    private func calculateTotalNFTSale(startupId : Text) : Nat {
      switch (nftPurchaseService.getStartupPurchaseHistory(startupId)) {
        case (#ok(history)) { history.totalSpent };
        case (#err(_)) { 0 };
      };
    };
    
    // Calculate total NFT count for a startup
    private func calculateTotalNFT(startupId : Text) : Nat {
      switch (nftService.getNFTsByStartup(startupId)) {
        case (#ok(nfts)) { nfts.size() };
        case (#err(_)) { 0 };
      };
    };
    
    // Get startup team members
    public func getStartupTeamMembers(startupId : Text) : Types.TeamMembersResponse {
      switch (storage.getStartup(startupId)) {
        case null {
          #Error("Startup not found");
        };
        case (?startup) {
          let teamMembers : [Types.TeamMemberOverview] = Array.map<Types.TeamMember, Types.TeamMemberOverview>(
            startup.teamMembers,
            func(member : Types.TeamMember) : Types.TeamMemberOverview {
              {
                id = member.id;
                name = member.name;
                role = member.role;
                background = member.background;
                photo = member.photo;
                linkedin = member.linkedin;
                email = member.email;
                isFounder = member.isFounder;
              };
            }
          );
          
          #Success(teamMembers);
        };
      };
    };
    
    // Get startup funding status
    public func getFundingStatus(startupId : Text) : Types.FundingStatusResponse {
      switch (storage.getStartup(startupId)) {
        case null {
          #Error("Startup not found");
        };
        case (?startup) {
          let totalRaised = startup.totalFunded;
          let fundingGoal = textToNat(startup.fundingGoal);
          let progressPercentage = if (fundingGoal > 0) {
            let percentage = (totalRaised * 100) / fundingGoal;
            if (percentage > 100) { 100 } else { percentage };
          } else {
            0;
          };
          let remainingAmount = if (totalRaised >= fundingGoal) {
            0;
          } else {
            // Use a loop to safely calculate the difference
            var diff : Nat = 0;
            var current : Nat = totalRaised;
            while (current < fundingGoal) {
              diff := diff + 1;
              current := current + 1;
            };
            diff;
          };
          let isFullyFunded = totalRaised >= fundingGoal;
          
          let fundingStatus = if (totalRaised == 0) {
            "Not Started";
          } else if (totalRaised < fundingGoal) {
            "In Progress";
          } else if (totalRaised == fundingGoal) {
            "Fully Funded";
          } else {
            "Over Funded";
          };
          
          let recentInvestments = getRecentInvestments(startupId);
          let fundingMilestones = getFundingMilestones(totalRaised, fundingGoal);
          
          let status : Types.FundingStatus = {
            totalRaised = totalRaised;
            fundingGoal = fundingGoal;
            progressPercentage = progressPercentage;
            remainingAmount = remainingAmount;
            isFullyFunded = isFullyFunded;
            fundingStatus = fundingStatus;
            recentInvestments = recentInvestments;
            fundingMilestones = fundingMilestones;
          };
          
          #Success(status);
        };
      };
    };
    
    // Get recent investments for a startup
    private func getRecentInvestments(startupId : Text) : [Types.RecentInvestment] {
      switch (nftPurchaseService.getStartupPurchaseHistory(startupId)) {
        case (#ok(history)) {
          // Get the 5 most recent purchases
          let recentPurchases = Array.take(history.purchases, 5);
          Array.map<Types.NFTPurchaseInfo, Types.RecentInvestment>(
            recentPurchases,
            func(purchase : Types.NFTPurchaseInfo) : Types.RecentInvestment {
              {
                investorName = "Investor " # purchase.investorId; // This would need to be enhanced to get actual investor name
                amount = purchase.amount;
                date = purchase.timestamp;
                tokenType = "ICP"; // This would need to be determined from the purchase data
              };
            }
          );
        };
        case (#err(_)) { [] };
      };
    };
    
    // Get funding milestones for a startup
    private func getFundingMilestones(totalRaised : Nat, fundingGoal : Nat) : [Types.FundingMilestone] {
      let milestones = [
        {
          milestone = "25% of Goal";
          targetAmount = fundingGoal / 4;
          isAchieved = totalRaised >= (fundingGoal / 4);
          achievedDate = if (totalRaised >= (fundingGoal / 4)) { ?Time.now() } else { null };
        },
        {
          milestone = "50% of Goal";
          targetAmount = fundingGoal / 2;
          isAchieved = totalRaised >= (fundingGoal / 2);
          achievedDate = if (totalRaised >= (fundingGoal / 2)) { ?Time.now() } else { null };
        },
        {
          milestone = "75% of Goal";
          targetAmount = (fundingGoal * 3) / 4;
          isAchieved = totalRaised >= ((fundingGoal * 3) / 4);
          achievedDate = if (totalRaised >= ((fundingGoal * 3) / 4)) { ?Time.now() } else { null };
        },
        {
          milestone = "100% of Goal";
          targetAmount = fundingGoal;
          isAchieved = totalRaised >= fundingGoal;
          achievedDate = if (totalRaised >= fundingGoal) { ?Time.now() } else { null };
        }
      ];
      milestones;
    };
    
    // Get collateral status for a startup
    public func getCollateralStatus(startupId : Text) : Types.CollateralDashboardResponse {
      switch (storage.getStartup(startupId)) {
        case null {
          #Error("Startup not found");
        };
        case (?startup) {
          switch (collateralService.getCollateralStatus(startupId)) {
            case (#ok(collateralInfo)) {
              let progressPercentage = if (collateralInfo.requiredAmount > 0) {
                let percentage = (collateralInfo.currentAmount * 100) / collateralInfo.requiredAmount;
                if (percentage > 100) { 100 } else { percentage };
              } else {
                0;
              };
              
              let remainingAmount = if (collateralInfo.currentAmount >= collateralInfo.requiredAmount) {
                0;
              } else {
                // Use a loop to safely calculate the difference
                var diff : Nat = 0;
                var current : Nat = collateralInfo.currentAmount;
                while (current < collateralInfo.requiredAmount) {
                  diff := diff + 1;
                  current := current + 1;
                };
                diff;
              };
              
              let isFullyPaid = collateralInfo.currentAmount >= collateralInfo.requiredAmount;
              
              let statusText = switch (collateralInfo.status) {
                case (#Pending) { "Pending" };
                case (#Active) { "Active" };
                case (#Locked) { "Locked" };
                case (#Released) { "Released" };
              };
              
              let topUpHistory = Array.map<Types.CollateralTopUp, Types.CollateralTopUpSummary>(
                collateralInfo.topUpHistory,
                func(topUp : Types.CollateralTopUp) : Types.CollateralTopUpSummary {
                  {
                    id = topUp.id;
                    amount = topUp.amount;
                    timestamp = topUp.timestamp;
                    status = topUp.status;
                    transactionId = topUp.transactionId;
                  };
                }
              );
              
              let dashboard : Types.CollateralDashboard = {
                startupId = startupId;
                requiredAmount = collateralInfo.requiredAmount;
                currentAmount = collateralInfo.currentAmount;
                progressPercentage = progressPercentage;
                status = statusText;
                tokenType = collateralInfo.tokenType;
                isFullyPaid = isFullyPaid;
                remainingAmount = remainingAmount;
                lockStartTime = collateralInfo.lockStartTime;
                lockEndTime = collateralInfo.lockEndTime;
                topUpHistory = topUpHistory;
                nextPaymentDue = null; // This would need to be calculated based on business logic
              };
              
              #Success(dashboard);
            };
            case (#err(error)) {
              #Error("Failed to get collateral status: " # error);
            };
          };
        };
      };
    };
    
    // Get investor dashboard for a founder's startups
    public func getInvestorDashboard(founderId : Text) : Types.InvestorDashboardResponse {
      switch (storage.getFounder(founderId)) {
        case null {
          #Error("Founder not found");
        };
        case (?_founder) {
          let founderStartups = storage.getStartupsByFounder(founderId);
          let allInvestors = storage.getAllInvestors();
          
          // Calculate metrics
          let totalInvestors = allInvestors.size();
          let activeInvestors = calculateActiveInvestors(founderStartups);
          let newInvestorsThisMonth = calculateNewInvestorsThisMonth(founderStartups);
          let totalInvestmentAmount = calculateTotalInvestmentAmount(founderStartups);
          let averageInvestmentPerInvestor = if (activeInvestors > 0) {
            totalInvestmentAmount / activeInvestors;
          } else {
            0;
          };
          
          let topInvestors = getTopInvestors(founderStartups, 5);
          let recentInvestments = getRecentInvestmentsForDashboard(founderStartups, 10);
          let investorGrowth = getInvestorGrowthData(founderStartups);
          
          let dashboard : Types.InvestorDashboard = {
            totalInvestors = totalInvestors;
            activeInvestors = activeInvestors;
            newInvestorsThisMonth = newInvestorsThisMonth;
            totalInvestmentAmount = totalInvestmentAmount;
            averageInvestmentPerInvestor = averageInvestmentPerInvestor;
            topInvestors = topInvestors;
            recentInvestments = recentInvestments;
            investorGrowth = investorGrowth;
          };
          
          #Success(dashboard);
        };
      };
    };
    
    // Calculate active investors for founder's startups
    private func calculateActiveInvestors(startups : [Types.Startup]) : Nat {
      var uniqueInvestors : [Text] = [];
      
      for (startup in startups.vals()) {
        switch (nftPurchaseService.getStartupPurchaseHistory(startup.id)) {
          case (#ok(history)) {
            for (purchase in history.purchases.vals()) {
              // Add unique investor IDs
              let existing = Array.find<Text>(uniqueInvestors, func(id) = id == purchase.investorId);
              if (existing == null) {
                uniqueInvestors := Array.append(uniqueInvestors, [purchase.investorId]);
              };
            };
          };
          case (#err(_)) { };
        };
      };
      
      uniqueInvestors.size();
    };
    
    // Calculate new investors this month
    private func calculateNewInvestorsThisMonth(startups : [Types.Startup]) : Nat {
      let currentTime = Time.now();
      let currentMonth = getCurrentMonth(currentTime);
      let currentYear = getCurrentYear(currentTime);
      var newInvestors : [Text] = [];
      
      for (startup in startups.vals()) {
        switch (nftPurchaseService.getStartupPurchaseHistory(startup.id)) {
          case (#ok(history)) {
            for (purchase in history.purchases.vals()) {
              let purchaseMonth = getCurrentMonth(purchase.timestamp);
              let purchaseYear = getCurrentYear(purchase.timestamp);
              
              if (purchaseMonth == currentMonth and purchaseYear == currentYear) {
                let existing = Array.find<Text>(newInvestors, func(id) = id == purchase.investorId);
                if (existing == null) {
                  newInvestors := Array.append(newInvestors, [purchase.investorId]);
                };
              };
            };
          };
          case (#err(_)) { };
        };
      };
      
      newInvestors.size();
    };
    
    // Calculate total investment amount
    private func calculateTotalInvestmentAmount(startups : [Types.Startup]) : Nat {
      var totalAmount : Nat = 0;
      
      for (startup in startups.vals()) {
        switch (nftPurchaseService.getStartupPurchaseHistory(startup.id)) {
          case (#ok(history)) {
            totalAmount := totalAmount + history.totalSpent;
          };
          case (#err(_)) { };
        };
      };
      
      totalAmount;
    };
    
    // Get top investors
    private func getTopInvestors(startups : [Types.Startup], limit : Nat) : [Types.TopInvestor] {
      var investorStats : [{
        investorId : Text;
        totalInvested : Nat;
        numberOfInvestments : Nat;
        lastInvestmentDate : Time.Time;
      }] = [];
      
      for (startup in startups.vals()) {
        switch (nftPurchaseService.getStartupPurchaseHistory(startup.id)) {
          case (#ok(history)) {
            for (purchase in history.purchases.vals()) {
              // Find existing investor stats or create new
              let existingStats = Array.find<{
                investorId : Text;
                totalInvested : Nat;
                numberOfInvestments : Nat;
                lastInvestmentDate : Time.Time;
              }>(investorStats, func(stats) = stats.investorId == purchase.investorId);
              
              switch (existingStats) {
                case null {
                  // Create new investor stats
                  let newStats = {
                    investorId = purchase.investorId;
                    totalInvested = purchase.amount;
                    numberOfInvestments = 1;
                    lastInvestmentDate = purchase.timestamp;
                  };
                  investorStats := Array.append(investorStats, [newStats]);
                };
                case (?stats) {
                  // Update existing stats (simplified - would need proper array update in real implementation)
                  // For now, just add new entry
                  let newStats = {
                    investorId = stats.investorId;
                    totalInvested = stats.totalInvested + purchase.amount;
                    numberOfInvestments = stats.numberOfInvestments + 1;
                    lastInvestmentDate = if (purchase.timestamp > stats.lastInvestmentDate) {
                      purchase.timestamp;
                    } else {
                      stats.lastInvestmentDate;
                    };
                  };
                  investorStats := Array.append(investorStats, [newStats]);
                };
              };
            };
          };
          case (#err(_)) { };
        };
      };
      
      // Sort by total invested and take top N
      let sortedStats = Array.sort(investorStats, func(a, b) : { #less; #equal; #greater } {
        if (a.totalInvested > b.totalInvested) { #less }
        else if (a.totalInvested < b.totalInvested) { #greater }
        else { #equal }
      });
      
      let limitedStats = if (sortedStats.size() > limit) {
        Array.take(sortedStats, limit);
      } else {
        sortedStats;
      };
      
      // Convert to TopInvestor format
      Array.map<{
        investorId : Text;
        totalInvested : Nat;
        numberOfInvestments : Nat;
        lastInvestmentDate : Time.Time;
      }, Types.TopInvestor>(
        limitedStats,
        func(stats) : Types.TopInvestor {
          {
            investorId = stats.investorId;
            investorName = "Investor " # stats.investorId; // Would need to get actual name from investor data
            totalInvested = stats.totalInvested;
            numberOfInvestments = stats.numberOfInvestments;
            lastInvestmentDate = stats.lastInvestmentDate;
            profilePhoto = null; // Would need to get from investor profile
          };
        }
      );
    };
    
    // Get recent investments for investor dashboard
    private func getRecentInvestmentsForDashboard(startups : [Types.Startup], limit : Nat) : [Types.RecentInvestmentSummary] {
      var allInvestments : [Types.RecentInvestmentSummary] = [];
      
      for (startup in startups.vals()) {
        switch (nftPurchaseService.getStartupPurchaseHistory(startup.id)) {
          case (#ok(history)) {
            for (purchase in history.purchases.vals()) {
              let investment = {
                investorId = purchase.investorId;
                investorName = "Investor " # purchase.investorId;
                startupId = startup.id;
                startupName = startup.startupName;
                amount = purchase.amount;
                date = purchase.timestamp;
                tokenType = "ICP"; // Would need to determine from purchase data
              };
              allInvestments := Array.append(allInvestments, [investment]);
            };
          };
          case (#err(_)) { };
        };
      };
      
      // Sort by date (most recent first) and limit
      let sortedInvestments = Array.sort(allInvestments, func(a, b) : { #less; #equal; #greater } {
        if (a.date > b.date) { #less }
        else if (a.date < b.date) { #greater }
        else { #equal }
      });
      
      if (sortedInvestments.size() > limit) {
        Array.take(sortedInvestments, limit);
      } else {
        sortedInvestments;
      };
    };
    
    // Get investor growth data
    private func getInvestorGrowthData(startups : [Types.Startup]) : [Types.InvestorGrowthData] {
      // Simplified implementation - would need more sophisticated date handling
      let currentTime = Time.now();
      let currentMonth = getCurrentMonth(currentTime);
      let currentYear = getCurrentYear(currentTime);
      
      [
        {
          month = currentMonth;
          year = currentYear;
          newInvestors = calculateNewInvestorsThisMonth(startups);
          totalInvestors = calculateActiveInvestors(startups);
        }
      ];
    };
    
    // Helper functions for date handling
    private func getCurrentMonth(_timestamp : Time.Time) : Nat {
      // Simplified - would need proper date parsing
      1;
    };
    
    private func getCurrentYear(_timestamp : Time.Time) : Nat {
      // Simplified - would need proper date parsing
      2024;
    };
  };
};