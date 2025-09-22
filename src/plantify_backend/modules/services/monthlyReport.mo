import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Types "../types";
import Storage "../storage";

module MonthlyReport {
  public class MonthlyReportService(storage : Storage.UserStorage) {
    
    // Storage for monthly reports
    private var monthlyReports = HashMap.HashMap<Text, Types.MonthlyReport>(
      0,
      Text.equal,
      Text.hash,
    );
    private var startupReports = HashMap.HashMap<Text, [Text]>(
      0,
      Text.equal,
      Text.hash,
    );
    private var nextReportId : Nat = 1;

    // Create a new monthly report
    public func createMonthlyReport(
      principal : Principal,
      request : Types.MonthlyReportRequest
    ) : Result.Result<Types.MonthlyReport, Text> {
      
      // Validate request
      let validationErrors = validateMonthlyReportRequest(request);
      if (validationErrors.size() > 0) {
        let errorMessage = Text.join("; ", validationErrors.vals());
        return #err(errorMessage);
      };

      // Check if startup exists and user is authorized
      switch (storage.getStartup(request.startupId)) {
        case null {
          return #err("Startup not found");
        };
        case (?startup) {
          // Check if user is the founder of this startup
          switch (storage.getFounderByPrincipal(principal)) {
            case null {
              return #err("User not authorized to create reports for this startup");
            };
            case (?founder) {
              if (founder.id != startup.founderId) {
                return #err("User not authorized to create reports for this startup");
              };
            };
          };
        };
      };

      // Check if report already exists for this month/year
      let reportKey = request.startupId # "-" # Nat.toText(request.year) # "-" # Nat.toText(request.month);
      switch (monthlyReports.get(reportKey)) {
        case (?_existingReport) {
          return #err("Monthly report already exists for " # Nat.toText(request.year) # "-" # Nat.toText(request.month));
        };
        case null {
          // Create new report
          let reportId = "MR" # Nat.toText(nextReportId);
          nextReportId += 1;

          let report : Types.MonthlyReport = {
            id = reportId;
            startupId = request.startupId;
            month = request.month;
            year = request.year;
            revenue = request.revenue;
            expenses = request.expenses;
            profit = request.profit;
            profitSharingAmount = request.profitSharingAmount;
            investorCount = request.investorCount;
            newInvestors = request.newInvestors;
            status = #Draft;
            submittedAt = null;
            approvedAt = null;
            createdAt = Time.now();
            updatedAt = Time.now();
          };

          monthlyReports.put(reportKey, report);

          // Update startup reports mapping
          switch (startupReports.get(request.startupId)) {
            case null {
              startupReports.put(request.startupId, [reportKey]);
            };
            case (?existingReports) {
              let updatedReports = Array.append<Text>(existingReports, [reportKey]);
              startupReports.put(request.startupId, updatedReports);
            };
          };

          #ok(report);
        };
      };
    };

    // Update an existing monthly report
    public func updateMonthlyReport(
      principal : Principal,
      reportId : Text,
      request : Types.MonthlyReportRequest
    ) : Result.Result<Types.MonthlyReport, Text> {
      
      // Find the report
      var foundReport : ?Types.MonthlyReport = null;
      var reportKey : ?Text = null;
      
      for ((key, report) in monthlyReports.entries()) {
        if (report.id == reportId) {
          foundReport := ?report;
          reportKey := ?key;
        };
      };

      switch (foundReport, reportKey) {
        case (null, _) {
          return #err("Monthly report not found");
        };
        case (?report, null) {
          return #err("Report key not found");
        };
        case (?report, ?key) {
          // Check authorization
          switch (storage.getFounderByPrincipal(principal)) {
            case null {
              return #err("User not authorized to update this report");
            };
            case (?founder) {
              if (founder.id != report.startupId) {
                return #err("User not authorized to update this report");
              };
            };
          };

          // Check if report can be updated (only draft reports can be updated)
          if (report.status != #Draft) {
            return #err("Only draft reports can be updated");
          };

          // Validate request
          let validationErrors = validateMonthlyReportRequest(request);
          if (validationErrors.size() > 0) {
            let errorMessage = Text.join("; ", validationErrors.vals());
            return #err(errorMessage);
          };

          // Update the report
          let updatedReport : Types.MonthlyReport = {
            id = report.id;
            startupId = request.startupId;
            month = request.month;
            year = request.year;
            revenue = request.revenue;
            expenses = request.expenses;
            profit = request.profit;
            profitSharingAmount = request.profitSharingAmount;
            investorCount = request.investorCount;
            newInvestors = request.newInvestors;
            status = report.status;
            submittedAt = report.submittedAt;
            approvedAt = report.approvedAt;
            createdAt = report.createdAt;
            updatedAt = Time.now();
          };

          monthlyReports.put(key, updatedReport);
          #ok(updatedReport);
        };
      };
    };

    // Submit a monthly report for approval
    public func submitMonthlyReport(
      principal : Principal,
      reportId : Text
    ) : Result.Result<Types.MonthlyReport, Text> {
      
      // Find the report
      var foundReport : ?Types.MonthlyReport = null;
      var reportKey : ?Text = null;
      
      for ((key, report) in monthlyReports.entries()) {
        if (report.id == reportId) {
          foundReport := ?report;
          reportKey := ?key;
        };
      };

      switch (foundReport, reportKey) {
        case (null, _) {
          return #err("Monthly report not found");
        };
        case (?report, null) {
          return #err("Report key not found");
        };
        case (?report, ?key) {
          // Check authorization
          switch (storage.getFounderByPrincipal(principal)) {
            case null {
              return #err("User not authorized to submit this report");
            };
            case (?founder) {
              if (founder.id != report.startupId) {
                return #err("User not authorized to submit this report");
              };
            };
          };

          // Check if report can be submitted
          if (report.status != #Draft) {
            return #err("Only draft reports can be submitted");
          };

          // Update the report status
          let updatedReport : Types.MonthlyReport = {
            id = report.id;
            startupId = report.startupId;
            month = report.month;
            year = report.year;
            revenue = report.revenue;
            expenses = report.expenses;
            profit = report.profit;
            profitSharingAmount = report.profitSharingAmount;
            investorCount = report.investorCount;
            newInvestors = report.newInvestors;
            status = #Submitted;
            submittedAt = ?Time.now();
            approvedAt = null;
            createdAt = report.createdAt;
            updatedAt = Time.now();
          };

          monthlyReports.put(key, updatedReport);
          #ok(updatedReport);
        };
      };
    };

    // Approve a monthly report (admin function)
    public func approveMonthlyReport(
      reportId : Text
    ) : Result.Result<Types.MonthlyReport, Text> {
      
      // Find the report
      var foundReport : ?Types.MonthlyReport = null;
      var reportKey : ?Text = null;
      
      for ((key, report) in monthlyReports.entries()) {
        if (report.id == reportId) {
          foundReport := ?report;
          reportKey := ?key;
        };
      };

      switch (foundReport, reportKey) {
        case (null, _) {
          return #err("Monthly report not found");
        };
        case (?report, null) {
          return #err("Report key not found");
        };
        case (?report, ?key) {
          // Check if report can be approved
          if (report.status != #Submitted) {
            return #err("Only submitted reports can be approved");
          };

          // Update the report status
          let updatedReport : Types.MonthlyReport = {
            id = report.id;
            startupId = report.startupId;
            month = report.month;
            year = report.year;
            revenue = report.revenue;
            expenses = report.expenses;
            profit = report.profit;
            profitSharingAmount = report.profitSharingAmount;
            investorCount = report.investorCount;
            newInvestors = report.newInvestors;
            status = #Approved;
            submittedAt = report.submittedAt;
            approvedAt = ?Time.now();
            createdAt = report.createdAt;
            updatedAt = Time.now();
          };

          monthlyReports.put(key, updatedReport);
          #ok(updatedReport);
        };
      };
    };

    // Reject a monthly report (admin function)
    public func rejectMonthlyReport(
      reportId : Text
    ) : Result.Result<Types.MonthlyReport, Text> {
      
      // Find the report
      var foundReport : ?Types.MonthlyReport = null;
      var reportKey : ?Text = null;
      
      for ((key, report) in monthlyReports.entries()) {
        if (report.id == reportId) {
          foundReport := ?report;
          reportKey := ?key;
        };
      };

      switch (foundReport, reportKey) {
        case (null, _) {
          return #err("Monthly report not found");
        };
        case (?report, null) {
          return #err("Report key not found");
        };
        case (?report, ?key) {
          // Check if report can be rejected
          if (report.status != #Submitted) {
            return #err("Only submitted reports can be rejected");
          };

          // Update the report status
          let updatedReport : Types.MonthlyReport = {
            id = report.id;
            startupId = report.startupId;
            month = report.month;
            year = report.year;
            revenue = report.revenue;
            expenses = report.expenses;
            profit = report.profit;
            profitSharingAmount = report.profitSharingAmount;
            investorCount = report.investorCount;
            newInvestors = report.newInvestors;
            status = #Rejected;
            submittedAt = report.submittedAt;
            approvedAt = null;
            createdAt = report.createdAt;
            updatedAt = Time.now();
          };

          monthlyReports.put(key, updatedReport);
          #ok(updatedReport);
        };
      };
    };

    // Get monthly report by ID
    public func getMonthlyReport(reportId : Text) : Result.Result<Types.MonthlyReport, Text> {
      for ((key, report) in monthlyReports.entries()) {
        if (report.id == reportId) {
          return #ok(report);
        };
      };
      #err("Monthly report not found");
    };

    // Get monthly reports by startup
    public func getMonthlyReportsByStartup(startupId : Text) : Result.Result<Types.MonthlyReportList, Text> {
      switch (startupReports.get(startupId)) {
        case null {
          #ok({
            reports = [];
            totalReports = 0;
            totalRevenue = 0;
            totalExpenses = 0;
            totalProfit = 0;
            totalProfitSharing = 0;
          });
        };
        case (?reportKeys) {
          let reports = Array.mapFilter<Text, Types.MonthlyReport>(
            reportKeys,
            func(key : Text) : ?Types.MonthlyReport {
              monthlyReports.get(key);
            },
          );

          let totalRevenue = Array.foldLeft<Types.MonthlyReport, Nat>(
            reports,
            0,
            func(acc : Nat, report : Types.MonthlyReport) : Nat {
              acc + report.revenue;
            },
          );

          let totalExpenses = Array.foldLeft<Types.MonthlyReport, Nat>(
            reports,
            0,
            func(acc : Nat, report : Types.MonthlyReport) : Nat {
              acc + report.expenses;
            },
          );

          let totalProfit = Array.foldLeft<Types.MonthlyReport, Nat>(
            reports,
            0,
            func(acc : Nat, report : Types.MonthlyReport) : Nat {
              acc + report.profit;
            },
          );

          let totalProfitSharing = Array.foldLeft<Types.MonthlyReport, Nat>(
            reports,
            0,
            func(acc : Nat, report : Types.MonthlyReport) : Nat {
              acc + report.profitSharingAmount;
            },
          );

          #ok({
            reports = reports;
            totalReports = reports.size();
            totalRevenue = totalRevenue;
            totalExpenses = totalExpenses;
            totalProfit = totalProfit;
            totalProfitSharing = totalProfitSharing;
          });
        };
      };
    };

    // Get all monthly reports
    public func getAllMonthlyReports() : [Types.MonthlyReport] {
      let reports = Buffer.Buffer<Types.MonthlyReport>(0);
      for ((key, report) in monthlyReports.entries()) {
        reports.add(report);
      };
      Buffer.toArray(reports);
    };

    // Get monthly report statistics
    public func getMonthlyReportStats() : Types.MonthlyReportStats {
      let allReports = getAllMonthlyReports();
      let approvedReports = Array.filter<Types.MonthlyReport>(
        allReports,
        func(report : Types.MonthlyReport) : Bool {
          report.status == #Approved;
        },
      );

      let totalRevenue = Array.foldLeft<Types.MonthlyReport, Nat>(
        approvedReports,
        0,
        func(acc : Nat, report : Types.MonthlyReport) : Nat {
          acc + report.revenue;
        },
      );

      let totalExpenses = Array.foldLeft<Types.MonthlyReport, Nat>(
        approvedReports,
        0,
        func(acc : Nat, report : Types.MonthlyReport) : Nat {
          acc + report.expenses;
        },
      );

      let totalProfit = Array.foldLeft<Types.MonthlyReport, Nat>(
        approvedReports,
        0,
        func(acc : Nat, report : Types.MonthlyReport) : Nat {
          acc + report.profit;
        },
      );

      let totalProfitSharing = Array.foldLeft<Types.MonthlyReport, Nat>(
        approvedReports,
        0,
        func(acc : Nat, report : Types.MonthlyReport) : Nat {
          acc + report.profitSharingAmount;
        },
      );

      let averageMonthlyRevenue = if (approvedReports.size() > 0) {
        totalRevenue / approvedReports.size();
      } else {
        0;
      };

      let averageMonthlyExpenses = if (approvedReports.size() > 0) {
        totalExpenses / approvedReports.size();
      } else {
        0;
      };

      let averageMonthlyProfit = if (approvedReports.size() > 0) {
        totalProfit / approvedReports.size();
      } else {
        0;
      };

      // Find best and worst months
      var bestMonth : ?Text = null;
      var worstMonth : ?Text = null;
      var maxProfit : Nat = 0;
      var minProfit : Nat = 0;

      if (approvedReports.size() > 0) {
        minProfit := approvedReports[0].profit;
        for (report in approvedReports.vals()) {
          if (report.profit > maxProfit) {
            maxProfit := report.profit;
            bestMonth := ?(Nat.toText(report.year) # "-" # Nat.toText(report.month));
          };
          if (report.profit < minProfit) {
            minProfit := report.profit;
            worstMonth := ?(Nat.toText(report.year) # "-" # Nat.toText(report.month));
          };
        };
      };

      {
        totalReports = allReports.size();
        totalRevenue = totalRevenue;
        totalExpenses = totalExpenses;
        totalProfit = totalProfit;
        totalProfitSharing = totalProfitSharing;
        averageMonthlyRevenue = averageMonthlyRevenue;
        averageMonthlyExpenses = averageMonthlyExpenses;
        averageMonthlyProfit = averageMonthlyProfit;
        bestMonth = bestMonth;
        worstMonth = worstMonth;
      };
    };

    // Get monthly reports by status
    public func getMonthlyReportsByStatus(status : Types.MonthlyReportStatus) : [Types.MonthlyReport] {
      let allReports = getAllMonthlyReports();
      Array.filter<Types.MonthlyReport>(
        allReports,
        func(report : Types.MonthlyReport) : Bool {
          report.status == status;
        },
      );
    };

    // Validate monthly report request
    private func validateMonthlyReportRequest(request : Types.MonthlyReportRequest) : [Text] {
      let errors = Buffer.Buffer<Text>(0);

      if (request.startupId == "") {
        errors.add("Startup ID is required");
      };

      if (request.month < 1 or request.month > 12) {
        errors.add("Month must be between 1 and 12");
      };

      if (request.year < 2020 or request.year > 2030) {
        errors.add("Year must be between 2020 and 2030");
      };

      if (request.revenue < 0) {
        errors.add("Revenue cannot be negative");
      };

      if (request.expenses < 0) {
        errors.add("Expenses cannot be negative");
      };

      if (request.profit < 0) {
        errors.add("Profit cannot be negative");
      };

      if (request.profitSharingAmount < 0) {
        errors.add("Profit sharing amount cannot be negative");
      };

      if (request.investorCount < 0) {
        errors.add("Investor count cannot be negative");
      };

      if (request.newInvestors < 0) {
        errors.add("New investors count cannot be negative");
      };

      Buffer.toArray(errors);
    };

    // Get storage for persistence
    public func getStorage() : ([(Text, Types.MonthlyReport)], [(Text, [Text])], Nat) {
      (
        Iter.toArray(monthlyReports.entries()),
        Iter.toArray(startupReports.entries()),
        nextReportId
      );
    };

    // Initialize from storage
    public func initFromStorage(
      reportsEntries : [(Text, Types.MonthlyReport)],
      startupReportsEntries : [(Text, [Text])],
      reportId : Nat
    ) {
      monthlyReports := HashMap.fromIter<Text, Types.MonthlyReport>(
        reportsEntries.vals(),
        reportsEntries.size(),
        Text.equal,
        Text.hash,
      );
      startupReports := HashMap.fromIter<Text, [Text]>(
        startupReportsEntries.vals(),
        startupReportsEntries.size(),
        Text.equal,
        Text.hash,
      );
      nextReportId := reportId;
    };
  };
};
