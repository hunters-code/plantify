import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Types "../types";
import Storage "../storage";
import NFTPurchaseService "./nftPurchase";
import NFTService "./nft";

module DashboardInvestorService {
  public class DashboardInvestor(
    storage : Storage.UserStorage,
    nftPurchaseService : NFTPurchaseService.NFTPurchaseService,
    _nftService : NFTService.NFTService,
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

              let overview : Types.InvestorDashboardOverview = {
                totalInvestments = totalInvestments;
                totalAmountInvested = totalAmountInvested;
                totalNFTsOwned = totalNFTsOwned;
                uniqueStartupsInvested = uniqueStartupsInvested;
                averageInvestmentPerStartup = averageInvestmentPerStartup;
                recentInvestments = recentInvestments;
                investmentPortfolio = investmentPortfolio;
                profitSharingEarnings = profitSharingEarnings;
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
        let midPoint = if (totalSize > 0) {
          totalSize / 2;
        } else {
          0;
        };
        let firstHalf = Array.take(sortedPurchases, midPoint);
        // Create second half using tabulate
        let secondHalfSize = if (totalSize > midPoint) {
          totalSize - midPoint;
        } else {
          0;
        };
        let secondHalf = Array.tabulate<Types.NFTPurchaseInfo>(
          secondHalfSize,
          func(i) = sortedPurchases[midPoint + i]
        );

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
  };
};
