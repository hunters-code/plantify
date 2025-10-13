import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Types "../types";
import Storage "../storage";
import NFTPurchaseService "./nftPurchase";
import NFTService "./nft";
import VotingService "./voting";

module DashboardInvestorService {
  public class DashboardInvestor(
    storage : Storage.UserStorage,
    nftPurchaseService : NFTPurchaseService.NFTPurchaseService,
    _nftService : NFTService.NFTService,
    votingService : VotingService.VotingService,
  ) {

    // Get dashboard overview for a specific investor
    public func getInvestorDashboardOverview(investorId : Text) : Types.InvestorDashboardOverviewResponse {
      switch (storage.getInvestor(investorId)) {
        case null {
          #Error("Investor not found");
        };
        case (?_investor) {
          // Get investor's purchase history
          switch (nftPurchaseService.getInvestorPurchaseHistory(investorId)) {
            case (#ok(purchaseHistory)) {
              // Calculate metrics
              let totalInvestments = purchaseHistory.totalPurchases;
              let totalAmountInvested = purchaseHistory.totalSpent;
              let totalNFTsOwned = purchaseHistory.totalNFTs;
              let uniqueStartupsInvested = calculateUniqueStartupsInvested(purchaseHistory.purchases);
              let averageInvestmentPerStartup = if (uniqueStartupsInvested > 0) {
                totalAmountInvested / uniqueStartupsInvested;
              } else {
                0;
              };
              let recentInvestments = getRecentInvestmentsForInvestor(purchaseHistory.purchases, 5);
              let investmentPortfolio = getInvestmentPortfolio(purchaseHistory.purchases);
              let profitSharingEarnings = calculateProfitSharingEarnings(investorId);
              let monthlyCommitment = calculateMonthlyCommitment(investorId);
              let votingPending = calculateVotingPending(investorId);

              let overview : Types.InvestorDashboardOverview = {
                totalInvestments = totalInvestments;
                totalAmountInvested = totalAmountInvested;
                totalNFTsOwned = totalNFTsOwned;
                uniqueStartupsInvested = uniqueStartupsInvested;
                averageInvestmentPerStartup = averageInvestmentPerStartup;
                recentInvestments = recentInvestments;
                investmentPortfolio = investmentPortfolio;
                profitSharingEarnings = profitSharingEarnings;
                monthlyCommitment = monthlyCommitment;
                votingPending = votingPending;
              };

              #Success(overview);
            };
            case (#err(error)) {
              #Error("Failed to get investor purchase history: " # error);
            };
          };
        };
      };
    };

    // Calculate unique startups invested in
    private func calculateUniqueStartupsInvested(purchases : [Types.NFTPurchaseInfo]) : Nat {
      var uniqueStartups : [Text] = [];

      for (purchase in purchases.vals()) {
        let existing = Array.find<Text>(uniqueStartups, func(startupId) = startupId == purchase.startupId);
        if (existing == null) {
          uniqueStartups := Array.append(uniqueStartups, [purchase.startupId]);
        };
      };

      uniqueStartups.size();
    };

    // Get recent investments for investor
    private func getRecentInvestmentsForInvestor(purchases : [Types.NFTPurchaseInfo], limit : Nat) : [Types.InvestorRecentInvestment] {
      // Sort purchases by timestamp (most recent first)
      let sortedPurchases = Array.sort(
        purchases,
        func(a, b) : { #less; #equal; #greater } {
          if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
            #greater;
          } else { #equal };
        },
      );

      let limitedPurchases = if (sortedPurchases.size() > limit) {
        Array.take(sortedPurchases, limit);
      } else {
        sortedPurchases;
      };

      Array.map<Types.NFTPurchaseInfo, Types.InvestorRecentInvestment>(
        limitedPurchases,
        func(purchase : Types.NFTPurchaseInfo) : Types.InvestorRecentInvestment {
          {
            startupId = purchase.startupId;
            startupName = getStartupName(purchase.startupId);
            amount = purchase.amount;
            nftPrice = purchase.nftPrice;
            quantity = 1; // Each purchase represents 1 NFT
            date = purchase.timestamp;
            status = purchase.status;
          };
        },
      );
    };

    // Get investment portfolio for investor
    private func getInvestmentPortfolio(purchases : [Types.NFTPurchaseInfo]) : [Types.InvestorPortfolioItem] {
      var portfolioMap : [{
        startupId : Text;
        totalInvested : Nat;
        nftCount : Nat;
        averagePrice : Nat;
        firstInvestment : Time.Time;
        lastInvestment : Time.Time;
      }] = [];

      for (purchase in purchases.vals()) {
        let existing = Array.find<{ startupId : Text; totalInvested : Nat; nftCount : Nat; averagePrice : Nat; firstInvestment : Time.Time; lastInvestment : Time.Time }>(portfolioMap, func(item) = item.startupId == purchase.startupId);

        switch (existing) {
          case null {
            // Create new portfolio item
            let newItem = {
              startupId = purchase.startupId;
              totalInvested = purchase.amount;
              nftCount = 1;
              averagePrice = purchase.nftPrice;
              firstInvestment = purchase.timestamp;
              lastInvestment = purchase.timestamp;
            };
            portfolioMap := Array.append(portfolioMap, [newItem]);
          };
          case (?item) {
            // Update existing portfolio item
            let updatedItem = {
              startupId = item.startupId;
              totalInvested = item.totalInvested + purchase.amount;
              nftCount = item.nftCount + 1;
              averagePrice = (item.totalInvested + purchase.amount) / (item.nftCount + 1);
              firstInvestment = if (purchase.timestamp < item.firstInvestment) {
                purchase.timestamp;
              } else {
                item.firstInvestment;
              };
              lastInvestment = if (purchase.timestamp > item.lastInvestment) {
                purchase.timestamp;
              } else {
                item.lastInvestment;
              };
            };
            portfolioMap := Array.append(portfolioMap, [updatedItem]);
          };
        };
      };

      Array.map<{ startupId : Text; totalInvested : Nat; nftCount : Nat; averagePrice : Nat; firstInvestment : Time.Time; lastInvestment : Time.Time }, Types.InvestorPortfolioItem>(
        portfolioMap,
        func(item) : Types.InvestorPortfolioItem {
          {
            startupId = item.startupId;
            startupName = getStartupName(item.startupId);
            totalInvested = item.totalInvested;
            nftCount = item.nftCount;
            averagePrice = item.averagePrice;
            firstInvestment = item.firstInvestment;
            lastInvestment = item.lastInvestment;
            startupStatus = getStartupStatus(item.startupId);
          };
        },
      );
    };

    // Calculate profit sharing earnings for investor
    private func calculateProfitSharingEarnings(_investorId : Text) : Nat {
      // This would need to be calculated based on monthly reports and investor's NFT holdings
      // For now, return 0 as this would require more complex business logic
      0;
    };

    // Calculate monthly commitment for investor
    private func calculateMonthlyCommitment(investorId : Text) : Nat {
      // Get all startups the investor has invested in
      switch (nftPurchaseService.getInvestorPurchaseHistory(investorId)) {
        case (#ok(purchaseHistory)) {
          var totalCommitment : Nat = 0;

          // For each unique startup, calculate the monthly commitment
          var processedStartups : [Text] = [];

          for (purchase in purchaseHistory.purchases.vals()) {
            // Check if we've already processed this startup
            let alreadyProcessed = Array.find<Text>(processedStartups, func(startupId) = startupId == purchase.startupId);

            if (alreadyProcessed == null) {
              // Add to processed list
              processedStartups := Array.append(processedStartups, [purchase.startupId]);

              // Get startup details to calculate monthly commitment
              switch (storage.getStartup(purchase.startupId)) {
                case null {};
                case (?startup) {
                  // Calculate monthly commitment based on periodic profit sharing
                  let periodicProfitSharing = textToNat(startup.periodicProfitSharing);
                  totalCommitment := totalCommitment + periodicProfitSharing;
                };
              };
            };
          };

          totalCommitment;
        };
        case (#err(_)) { 0 };
      };
    };

    // Calculate voting pending for investor
    private func calculateVotingPending(investorId : Text) : Nat {
      // Get investor details to get the principal
      switch (storage.getInvestor(investorId)) {
        case null { 0 };
        case (?investor) {
          // Get all monthly reports that need voting
          let allReports = storage.getAllMonthlyReports();
          var pendingVotes : Nat = 0;

          for (report in allReports.vals()) {
            // Check if this report is in submitted status and investor hasn't voted yet
            if (report.status == #Submitted) {
              // Check if investor has already voted on this report
              switch (votingService.getInvestorVoteForReport(investor.principal, report.id)) {
                case (#ok(null)) {
                  // Investor hasn't voted on this report yet
                  pendingVotes := pendingVotes + 1;
                };
                case (#ok(?_vote)) {
                  // Investor has already voted, no action needed
                };
                case (#err(_)) {
                  // Error getting vote info, assume pending
                  pendingVotes := pendingVotes + 1;
                };
              };
            };
          };

          pendingVotes;
        };
      };
    };

    // Helper function to convert text to natural number with overflow protection
    private func textToNat(txt : Text) : Nat {
      if (txt.size() == 0) { 0 } else {
        let chars = txt.chars();
        var num : Nat = 0;
        var maxSafeValue : Nat = 1000000000; // 1 billion - reasonable maximum
        
        for (v in chars) {
          let charToNum = Nat32.toNat(Char.toNat32(v) -48);
          if (charToNum >= 0 and charToNum <= 9) {
            // Check for overflow before multiplication
            if (num > maxSafeValue) {
              return maxSafeValue; // Return max safe value to prevent overflow
            };
            
            let newNum = num * 10 + charToNum;
            if (newNum < num) {
              // Overflow detected, return max safe value
              return maxSafeValue;
            };
            num := newNum;
          };
        };
        
        num;
      };
    };

    // Helper function to get startup name
    private func getStartupName(startupId : Text) : Text {
      switch (storage.getStartup(startupId)) {
        case null { "Unknown Startup" };
        case (?startup) { startup.startupName };
      };
    };

    // Helper function to get startup status
    private func getStartupStatus(startupId : Text) : Text {
      switch (storage.getStartup(startupId)) {
        case null { "Unknown" };
        case (?startup) { startup.status };
      };
    };

    // Get investor's investment performance
    public func getInvestorPerformance(investorId : Text) : Types.InvestorPerformanceResponse {
      switch (storage.getInvestor(investorId)) {
        case null {
          #Error("Investor not found");
        };
        case (?_investor) {
          switch (nftPurchaseService.getInvestorPurchaseHistory(investorId)) {
            case (#ok(purchaseHistory)) {
              let totalInvested = purchaseHistory.totalSpent;
              let totalNFTs = purchaseHistory.totalNFTs;
              let uniqueStartups = calculateUniqueStartupsInvested(purchaseHistory.purchases);
              let averageInvestmentSize = if (purchaseHistory.totalPurchases > 0) {
                totalInvested / purchaseHistory.totalPurchases;
              } else {
                0;
              };
              let diversificationScore = calculateDiversificationScore(uniqueStartups, totalNFTs);
              let investmentTrend = getInvestmentTrend(purchaseHistory.purchases);
              let riskProfile = getRiskProfile(investorId);

              let performance : Types.InvestorPerformance = {
                totalInvested = totalInvested;
                totalNFTs = totalNFTs;
                uniqueStartups = uniqueStartups;
                averageInvestmentSize = averageInvestmentSize;
                diversificationScore = diversificationScore;
                investmentTrend = investmentTrend;
                riskProfile = riskProfile;
                profitSharingEarnings = calculateProfitSharingEarnings(investorId);
              };

              #Success(performance);
            };
            case (#err(error)) {
              #Error("Failed to get investor purchase history: " # error);
            };
          };
        };
      };
    };

    // Calculate diversification score (0-100)
    private func calculateDiversificationScore(uniqueStartups : Nat, totalNFTs : Nat) : Nat {
      if (totalNFTs == 0) { 0 } else if (uniqueStartups == 1) { 20 } // Low diversification
      else if (uniqueStartups <= 3) { 50 } // Medium diversification
      else if (uniqueStartups <= 5) { 75 } // Good diversification
      else { 100 }; // High diversification
    };

    // Get investment trend (simplified)
    private func getInvestmentTrend(purchases : [Types.NFTPurchaseInfo]) : Text {
      if (purchases.size() < 2) { "Insufficient Data" } else {
        // Sort by timestamp and compare first half vs second half
        let sortedPurchases = Array.sort(
          purchases,
          func(a, b) : { #less; #equal; #greater } {
            if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
              #greater;
            } else { #equal };
          },
        );

        let totalSize = sortedPurchases.size();
        let midPoint = if (totalSize > 0 and totalSize >= 2) {
          totalSize / 2;
        } else {
          0;
        };
        let firstHalf = Array.take(sortedPurchases, midPoint);
        // Create second half manually to avoid subtraction warning
        var secondHalf : [Types.NFTPurchaseInfo] = [];
        var i = midPoint;
        while (i < totalSize) {
          // Get element at index i safely
          if (i < sortedPurchases.size()) {
            let element = sortedPurchases[i];
            secondHalf := Array.append(secondHalf, [element]);
          };
          i := i + 1;
        };

        let firstHalfTotal = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
          firstHalf,
          0,
          func(acc, purchase) = acc + purchase.amount,
        );
        let secondHalfTotal = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
          secondHalf,
          0,
          func(acc, purchase) = acc + purchase.amount,
        );

        if (secondHalfTotal > firstHalfTotal) { "Increasing" } else if (secondHalfTotal < firstHalfTotal) {
          "Decreasing";
        } else { "Stable" };
      };
    };

    // Get risk profile (simplified)
    private func getRiskProfile(investorId : Text) : Text {
      switch (storage.getInvestor(investorId)) {
        case null { "Unknown" };
        case (?investor) { investor.riskTolerance };
      };
    };

    // Get my investment portfolio
    public func getMyInvestmentPortfolio(investorId : Text) : Types.MyInvestmentPortfolioResponse {
      switch (storage.getInvestor(investorId)) {
        case null {
          #Error("Investor not found");
        };
        case (?_investor) {
          switch (nftPurchaseService.getInvestorPurchaseHistory(investorId)) {
            case (#ok(purchaseHistory)) {
              let portfolioItems = buildPortfolioItems(investorId, purchaseHistory.purchases);
              let totalInvested = calculateTotalInvested(portfolioItems);
              let totalReturns = calculateTotalReturns(portfolioItems);
              let totalPortfolioValue = totalInvested + totalReturns;
              let returnPercentage = if (totalInvested > 0) {
                (totalReturns * 100) / totalInvested;
              } else {
                0;
              };
              
              let portfolioSummary = buildPortfolioSummary(portfolioItems);
              let performanceMetrics = buildPerformanceMetrics(investorId, portfolioItems);
              
              let portfolio : Types.MyInvestmentPortfolio = {
                totalPortfolioValue = totalPortfolioValue;
                totalInvested = totalInvested;
                totalReturns = totalReturns;
                returnPercentage = returnPercentage;
                portfolioItems = portfolioItems;
                portfolioSummary = portfolioSummary;
                performanceMetrics = performanceMetrics;
              };
              
              #Success(portfolio);
            };
            case (#err(error)) {
              #Error("Failed to get investor purchase history: " # error);
            };
          };
        };
      };
    };

    // Get investor's startup investments
    public func getInvestorStartupInvestments(investorId : Text, startupId : Text) : Types.InvestorStartupInvestmentResponse {
      switch (storage.getInvestor(investorId)) {
        case null {
          #Error("Investor not found");
        };
        case (?_investor) {
          switch (storage.getStartup(startupId)) {
            case null {
              #Error("Startup not found");
            };
            case (?startup) {
              switch (nftPurchaseService.getInvestorPurchaseHistory(investorId)) {
                case (#ok(purchaseHistory)) {
                  let startupPurchases = Array.filter<Types.NFTPurchaseInfo>(
                    purchaseHistory.purchases,
                    func(purchase) = purchase.startupId == startupId,
                  );

                  if (startupPurchases.size() == 0) {
                    #Error("No investments found for this startup");
                  } else {
                    let totalInvested = Array.foldLeft<Types.NFTPurchaseInfo, Nat>(
                      startupPurchases,
                      0,
                      func(acc, purchase) = acc + purchase.amount,
                    );
                    let nftCount = startupPurchases.size();
                    let averagePrice = if (nftCount > 0) {
                      totalInvested / nftCount;
                    } else { 0 };
                    let firstInvestment = Array.sort(
                      startupPurchases,
                      func(a, b) : { #less; #equal; #greater } {
                        if (a.timestamp > b.timestamp) { #greater } else if (a.timestamp < b.timestamp) {
                          #less;
                        } else { #equal };
                      },
                    )[0].timestamp;
                    let lastInvestment = Array.sort(
                      startupPurchases,
                      func(a, b) : { #less; #equal; #greater } {
                        if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
                          #greater;
                        } else { #equal };
                      },
                    )[0].timestamp;

                    let investment : Types.InvestorStartupInvestment = {
                      startupId = startupId;
                      startupName = startup.startupName;
                      totalInvested = totalInvested;
                      nftCount = nftCount;
                      averagePrice = averagePrice;
                      firstInvestment = firstInvestment;
                      lastInvestment = lastInvestment;
                      startupStatus = startup.status;
                      profitSharingEarnings = 0; // Would need to calculate from monthly reports
                    };

                    #Success(investment);
                  };
                };
                case (#err(error)) {
                  #Error("Failed to get investor purchase history: " # error);
                };
              };
            };
          };
        };
      };
    };

    // Build portfolio items from purchase history
    private func buildPortfolioItems(_investorId : Text, purchases : [Types.NFTPurchaseInfo]) : [Types.PortfolioItem] {
      var portfolioMap : [{
        startupId : Text;
        totalInvested : Nat;
        nftCount : Nat;
        firstInvestment : Time.Time;
        lastInvestment : Time.Time;
      }] = [];
      
      // Group purchases by startup
      for (purchase in purchases.vals()) {
        let existing = Array.find<{
          startupId : Text;
          totalInvested : Nat;
          nftCount : Nat;
          firstInvestment : Time.Time;
          lastInvestment : Time.Time;
        }>(portfolioMap, func(item) = item.startupId == purchase.startupId);
        
        switch (existing) {
          case null {
            let newItem = {
              startupId = purchase.startupId;
              totalInvested = purchase.amount;
              nftCount = 1;
              firstInvestment = purchase.timestamp;
              lastInvestment = purchase.timestamp;
            };
            portfolioMap := Array.append(portfolioMap, [newItem]);
          };
          case (?item) {
            let updatedItem = {
              startupId = item.startupId;
              totalInvested = item.totalInvested + purchase.amount;
              nftCount = item.nftCount + 1;
              firstInvestment = if (purchase.timestamp < item.firstInvestment) {
                purchase.timestamp;
              } else {
                item.firstInvestment;
              };
              lastInvestment = if (purchase.timestamp > item.lastInvestment) {
                purchase.timestamp;
              } else {
                item.lastInvestment;
              };
            };
            portfolioMap := Array.append(portfolioMap, [updatedItem]);
          };
        };
      };
      
      // Convert to PortfolioItem format
      Array.map<{
        startupId : Text;
        totalInvested : Nat;
        nftCount : Nat;
        firstInvestment : Time.Time;
        lastInvestment : Time.Time;
      }, Types.PortfolioItem>(
        portfolioMap,
        func(item) : Types.PortfolioItem {
          let startup = storage.getStartup(item.startupId);
          let startupName = switch (startup) {
            case null { "Unknown Startup" };
            case (?s) { s.startupName };
          };
          let startupLogo = switch (startup) {
            case null { null };
            case (?s) { s.companyLogo };
          };
          let sector = switch (startup) {
            case null { "Unknown" };
            case (?s) { s.sector };
          };
          let status = switch (startup) {
            case null { "Unknown" };
            case (?s) { s.status };
          };
          let monthlyCommitment = switch (startup) {
            case null { 0 };
            case (?s) { textToNat(s.periodicProfitSharing) };
          };
          
          // Calculate current value (simplified - would need more complex logic in real implementation)
          let currentValue = item.totalInvested; // For now, assume no change in value
          // Since currentValue is set to item.totalInvested, returnAmount will always be 0
          // This is a placeholder for future implementation
          let returnAmount = 0;
          let returnPercentage = if (item.totalInvested > 0) {
            (returnAmount * 100) / item.totalInvested;
          } else {
            0;
          };
          
          {
            startupId = item.startupId;
            startupName = startupName;
            startupLogo = startupLogo;
            sector = sector;
            investedAmount = item.totalInvested;
            currentValue = currentValue;
            nftCount = item.nftCount;
            returnAmount = returnAmount;
            returnPercentage = returnPercentage;
            investmentDate = item.firstInvestment;
            lastUpdateDate = item.lastInvestment;
            status = status;
            profitSharingEarnings = 0; // Would need to calculate from monthly reports
            monthlyCommitment = monthlyCommitment;
          };
        }
      );
    };
    
    // Calculate total invested amount
    private func calculateTotalInvested(portfolioItems : [Types.PortfolioItem]) : Nat {
      Array.foldLeft<Types.PortfolioItem, Nat>(
        portfolioItems, 0, func(acc, item) = acc + item.investedAmount
      );
    };
    
    // Calculate total returns
    private func calculateTotalReturns(portfolioItems : [Types.PortfolioItem]) : Nat {
      Array.foldLeft<Types.PortfolioItem, Nat>(
        portfolioItems, 0, func(acc, item) = acc + item.returnAmount
      );
    };
    
    // Build portfolio summary
    private func buildPortfolioSummary(portfolioItems : [Types.PortfolioItem]) : Types.PortfolioSummary {
      let totalStartups = portfolioItems.size();
      let activeInvestments = Array.filter<Types.PortfolioItem>(
        portfolioItems, func(item) = item.status == "Active"
      ).size();
      let completedInvestments = Array.filter<Types.PortfolioItem>(
        portfolioItems, func(item) = item.status == "Completed"
      ).size();
      
      let totalReturns = calculateTotalReturns(portfolioItems);
      let _totalInvested = calculateTotalInvested(portfolioItems);
      let averageReturn = if (totalStartups > 0) {
        totalReturns / totalStartups;
      } else {
        0;
      };
      
      // Find best and worst performers
      let bestPerformer = findBestPerformer(portfolioItems);
      let worstPerformer = findWorstPerformer(portfolioItems);
      
      let totalMonthlyCommitments = Array.foldLeft<Types.PortfolioItem, Nat>(
        portfolioItems, 0, func(acc, item) = acc + item.monthlyCommitment
      );
      let totalProfitSharingEarnings = Array.foldLeft<Types.PortfolioItem, Nat>(
        portfolioItems, 0, func(acc, item) = acc + item.profitSharingEarnings
      );
      
      {
        totalStartups = totalStartups;
        activeInvestments = activeInvestments;
        completedInvestments = completedInvestments;
        averageReturn = averageReturn;
        bestPerformer = bestPerformer;
        worstPerformer = worstPerformer;
        totalMonthlyCommitments = totalMonthlyCommitments;
        totalProfitSharingEarnings = totalProfitSharingEarnings;
      };
    };
    
    // Build performance metrics
    private func buildPerformanceMetrics(_investorId : Text, portfolioItems : [Types.PortfolioItem]) : Types.PerformanceMetrics {
      let totalInvested = calculateTotalInvested(portfolioItems);
      let totalReturns = calculateTotalReturns(portfolioItems);
      let portfolioGrowth = if (totalInvested > 0) {
        (totalReturns * 100) / totalInvested;
      } else {
        0;
      };
      
      let riskScore = calculateRiskScore(portfolioItems);
      let diversificationScore = calculateDiversificationScore(portfolioItems.size(), totalInvested);
      let investmentTrend = getInvestmentTrendFromPortfolio(portfolioItems);
      let monthlyCommitmentTrend = "Stable"; // Simplified
      let profitSharingTrend = "Growing"; // Simplified
      
      {
        portfolioGrowth = portfolioGrowth;
        riskScore = riskScore;
        diversificationScore = diversificationScore;
        investmentTrend = investmentTrend;
        monthlyCommitmentTrend = monthlyCommitmentTrend;
        profitSharingTrend = profitSharingTrend;
      };
    };
    
    // Find best performing startup
    private func findBestPerformer(portfolioItems : [Types.PortfolioItem]) : ?Text {
      if (portfolioItems.size() == 0) { null }
      else {
        let bestItem = Array.find<Types.PortfolioItem>(
          portfolioItems,
          func(item) = item.returnPercentage == Array.foldLeft<Types.PortfolioItem, Nat>(
            portfolioItems, 0, func(max, i) = if (i.returnPercentage > max) { i.returnPercentage } else { max }
          )
        );
        switch (bestItem) {
          case null { null };
          case (?item) { ?item.startupName };
        };
      };
    };
    
    // Find worst performing startup
    private func findWorstPerformer(portfolioItems : [Types.PortfolioItem]) : ?Text {
      if (portfolioItems.size() == 0) { null }
      else {
        let worstItem = Array.find<Types.PortfolioItem>(
          portfolioItems,
          func(item) = item.returnPercentage == Array.foldLeft<Types.PortfolioItem, Nat>(
            portfolioItems, 100, func(min, i) = if (i.returnPercentage < min) { i.returnPercentage } else { min }
          )
        );
        switch (worstItem) {
          case null { null };
          case (?item) { ?item.startupName };
        };
      };
    };
    
    // Calculate risk score (1-10)
    private func calculateRiskScore(portfolioItems : [Types.PortfolioItem]) : Nat {
      if (portfolioItems.size() == 0) { 5 }
      else {
        // Simplified risk calculation based on portfolio size and return variance
        let avgReturn = Array.foldLeft<Types.PortfolioItem, Nat>(
          portfolioItems, 0, func(acc, item) = acc + item.returnPercentage
        ) / portfolioItems.size();
        
        if (avgReturn > 20) { 8 } // High risk, high return
        else if (avgReturn > 10) { 6 } // Medium risk
        else if (avgReturn > 0) { 4 } // Low risk
        else { 3 }; // Very low risk
      };
    };
    
    
    // Get investment trend from portfolio
    private func getInvestmentTrendFromPortfolio(portfolioItems : [Types.PortfolioItem]) : Text {
      if (portfolioItems.size() < 2) { "Insufficient Data" }
      else {
        // Sort by investment date and compare early vs recent investments
        let sortedItems = Array.sort(portfolioItems, func(a, b) : { #less; #equal; #greater } {
          if (a.investmentDate > b.investmentDate) { #less }
          else if (a.investmentDate < b.investmentDate) { #greater }
          else { #equal }
        });
        
        let midPoint = sortedItems.size() / 2;
        let earlyInvestments = Array.take(sortedItems, midPoint);
        let recentInvestments = Array.tabulate<Types.PortfolioItem>(
          sortedItems.size() - midPoint,
          func(i) = sortedItems[midPoint + i]
        );
        
        let earlyTotal = Array.foldLeft<Types.PortfolioItem, Nat>(
          earlyInvestments, 0, func(acc, item) = acc + item.investedAmount
        );
        let recentTotal = Array.foldLeft<Types.PortfolioItem, Nat>(
          recentInvestments, 0, func(acc, item) = acc + item.investedAmount
        );
        
        if (recentTotal > earlyTotal) { "Growing" }
        else if (recentTotal < earlyTotal) { "Declining" }
        else { "Stable" };
      };
    };
  };
};
