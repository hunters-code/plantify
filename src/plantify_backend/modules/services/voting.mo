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

module Voting {
  public class VotingService(storage : Storage.UserStorage) {
    
    // Storage for votes
    private var votes = HashMap.HashMap<Text, Types.InvestorVote>(
      0,
      Text.equal,
      Text.hash,
    );
    private var reportVotes = HashMap.HashMap<Text, [Text]>(
      0,
      Text.equal,
      Text.hash,
    );
    private var investorVotes = HashMap.HashMap<Text, [Text]>(
      0,
      Text.equal,
      Text.hash,
    );
    private var nextVoteId : Nat = 1;

    // Cast a vote on a monthly report
    public func castVote(
      principal : Principal,
      request : Types.VoteRequest
    ) : Result.Result<Types.InvestorVote, Text> {
      
      // Validate request
      let validationErrors = validateVoteRequest(request);
      if (validationErrors.size() > 0) {
        let errorMessage = Text.join("; ", validationErrors.vals());
        return #err(errorMessage);
      };

      // Check if user is an investor
      switch (storage.getInvestorByPrincipal(principal)) {
        case null {
          return #err("Only investors can vote on monthly reports");
        };
        case (?investor) {
          // Check if the report exists and is in submitted status
          // Note: We'll need to get the report from the monthly report service
          // For now, we'll assume the report exists and is submitted
          
          // Check if investor has already voted on this report
          let voteKey = investor.id # "-" # request.reportId;
          switch (votes.get(voteKey)) {
            case (?_existingVote) {
              return #err("Investor has already voted on this report");
            };
            case null {
              // Create new vote
              let voteId = "V" # Nat.toText(nextVoteId);
              nextVoteId += 1;

              let vote : Types.InvestorVote = {
                id = voteId;
                reportId = request.reportId;
                investorId = investor.id;
                vote = request.vote;
                feedback = request.feedback;
                feedbackType = request.feedbackType;
                confidence = request.confidence;
                timestamp = Time.now();
              };

              votes.put(voteKey, vote);

              // Update report votes mapping
              switch (reportVotes.get(request.reportId)) {
                case null {
                  reportVotes.put(request.reportId, [voteKey]);
                };
                case (?existingVotes) {
                  let updatedVotes = Array.append<Text>(existingVotes, [voteKey]);
                  reportVotes.put(request.reportId, updatedVotes);
                };
              };

              // Update investor votes mapping
              switch (investorVotes.get(investor.id)) {
                case null {
                  investorVotes.put(investor.id, [voteKey]);
                };
                case (?existingVotes) {
                  let updatedVotes = Array.append<Text>(existingVotes, [voteKey]);
                  investorVotes.put(investor.id, updatedVotes);
                };
              };

              #ok(vote);
            };
          };
        };
      };
    };

    // Update an existing vote
    public func updateVote(
      principal : Principal,
      reportId : Text,
      request : Types.VoteRequest
    ) : Result.Result<Types.InvestorVote, Text> {
      
      // Check if user is an investor
      switch (storage.getInvestorByPrincipal(principal)) {
        case null {
          return #err("Only investors can vote on monthly reports");
        };
        case (?investor) {
          let voteKey = investor.id # "-" # reportId;
          
          // Check if vote exists
          switch (votes.get(voteKey)) {
            case null {
              return #err("Vote not found");
            };
            case (?existingVote) {
              // Validate request
              let validationErrors = validateVoteRequest(request);
              if (validationErrors.size() > 0) {
                let errorMessage = Text.join("; ", validationErrors.vals());
                return #err(errorMessage);
              };

              // Update the vote
              let updatedVote : Types.InvestorVote = {
                id = existingVote.id;
                reportId = request.reportId;
                investorId = investor.id;
                vote = request.vote;
                feedback = request.feedback;
                feedbackType = request.feedbackType;
                confidence = request.confidence;
                timestamp = Time.now();
              };

              votes.put(voteKey, updatedVote);
              #ok(updatedVote);
            };
          };
        };
      };
    };

    // Get vote summary for a report
    public func getVoteSummary(reportId : Text) : Result.Result<Types.VoteSummary, Text> {
      switch (reportVotes.get(reportId)) {
        case null {
          #ok({
            reportId = reportId;
            totalVotes = 0;
            approveVotes = 0;
            rejectVotes = 0;
            abstainVotes = 0;
            approvalRate = 0;
            averageConfidence = 0;
            positiveFeedback = 0;
            neutralFeedback = 0;
            negativeFeedback = 0;
            lastVoteTime = null;
          });
        };
        case (?voteKeys) {
          let reportVotesList = Array.mapFilter<Text, Types.InvestorVote>(
            voteKeys,
            func(key : Text) : ?Types.InvestorVote {
              votes.get(key);
            },
          );

          if (reportVotesList.size() == 0) {
            #ok({
              reportId = reportId;
              totalVotes = 0;
              approveVotes = 0;
              rejectVotes = 0;
              abstainVotes = 0;
              approvalRate = 0;
              averageConfidence = 0;
              positiveFeedback = 0;
              negativeFeedback = 0;
              neutralFeedback = 0;
              lastVoteTime = null;
            });
          } else {
            let totalVotes = reportVotesList.size();
            var approveVotes : Nat = 0;
            var rejectVotes : Nat = 0;
            var abstainVotes : Nat = 0;
            var totalConfidence : Nat = 0;
            var positiveFeedback : Nat = 0;
            var neutralFeedback : Nat = 0;
            var negativeFeedback : Nat = 0;
            var lastVoteTime : ?Time.Time = null;

            for (vote in reportVotesList.vals()) {
              // Count vote types
              switch (vote.vote) {
                case (#Approve) { approveVotes += 1 };
                case (#Reject) { rejectVotes += 1 };
                case (#Abstain) { abstainVotes += 1 };
              };

              // Sum confidence
              totalConfidence += vote.confidence;

              // Count feedback types
              switch (vote.feedbackType) {
                case (?#Positive) { positiveFeedback += 1 };
                case (?#Neutral) { neutralFeedback += 1 };
                case (?#Negative) { negativeFeedback += 1 };
                case null { };
              };

              // Track last vote time
              switch (lastVoteTime) {
                case null { lastVoteTime := ?vote.timestamp };
                case (?lastTime) {
                  if (vote.timestamp > lastTime) {
                    lastVoteTime := ?vote.timestamp;
                  };
                };
              };
            };

            let approvalRate = if (totalVotes > 0) {
              (approveVotes * 100) / totalVotes;
            } else {
              0;
            };

            let averageConfidence = if (totalVotes > 0) {
              totalConfidence / totalVotes;
            } else {
              0;
            };

            #ok({
              reportId = reportId;
              totalVotes = totalVotes;
              approveVotes = approveVotes;
              rejectVotes = rejectVotes;
              abstainVotes = abstainVotes;
              approvalRate = approvalRate;
              averageConfidence = averageConfidence;
              positiveFeedback = positiveFeedback;
              neutralFeedback = neutralFeedback;
              negativeFeedback = negativeFeedback;
              lastVoteTime = lastVoteTime;
            });
          };
        };
      };
    };

    // Get individual votes for a report
    public func getReportVotes(reportId : Text) : [Types.InvestorVote] {
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

    // Get vote details for a report (summary + individual votes)
    public func getReportVoteDetails(reportId : Text) : Result.Result<Types.ReportVoteDetails, Text> {
      switch (getVoteSummary(reportId)) {
        case (#err(error)) {
          #err(error);
        };
        case (#ok(summary)) {
          let individualVotes = getReportVotes(reportId);
          #ok({
            reportId = reportId;
            summary = summary;
            individualVotes = individualVotes;
          });
        };
      };
    };

    // Get investor's vote history
    public func getInvestorVoteHistory(investorId : Text) : Result.Result<Types.InvestorVoteHistory, Text> {
      switch (investorVotes.get(investorId)) {
        case null {
          #ok({
            votes = [];
            totalVotes = 0;
            approvalRate = 0;
            averageConfidence = 0;
          });
        };
        case (?voteKeys) {
          let investorVotesList = Array.mapFilter<Text, Types.InvestorVote>(
            voteKeys,
            func(key : Text) : ?Types.InvestorVote {
              votes.get(key);
            },
          );

          if (investorVotesList.size() == 0) {
            #ok({
              votes = [];
              totalVotes = 0;
              approvalRate = 0;
              averageConfidence = 0;
            });
          } else {
            var approveCount : Nat = 0;
            var totalConfidence : Nat = 0;

            for (vote in investorVotesList.vals()) {
              if (vote.vote == #Approve) {
                approveCount += 1;
              };
              totalConfidence += vote.confidence;
            };

            let approvalRate = if (investorVotesList.size() > 0) {
              (approveCount * 100) / investorVotesList.size();
            } else {
              0;
            };

            let averageConfidence = if (investorVotesList.size() > 0) {
              totalConfidence / investorVotesList.size();
            } else {
              0;
            };

            #ok({
              votes = investorVotesList;
              totalVotes = investorVotesList.size();
              approvalRate = approvalRate;
              averageConfidence = averageConfidence;
            });
          };
        };
      };
    };

    // Get investor's vote for a specific report
    public func getInvestorVoteForReport(
      principal : Principal,
      reportId : Text
    ) : Result.Result<?Types.InvestorVote, Text> {
      switch (storage.getInvestorByPrincipal(principal)) {
        case null {
          #err("User not found or not an investor");
        };
        case (?investor) {
          let voteKey = investor.id # "-" # reportId;
          switch (votes.get(voteKey)) {
            case null {
              #ok(null);
            };
            case (?vote) {
              #ok(?vote);
            };
          };
        };
      };
    };

    // Get all votes
    public func getAllVotes() : [Types.InvestorVote] {
      let votesList = Buffer.Buffer<Types.InvestorVote>(0);
      for ((key, vote) in votes.entries()) {
        votesList.add(vote);
      };
      Buffer.toArray(votesList);
    };

    // Get voting statistics
    public func getVotingStats() : Types.VotingStats {
      let allVotes = getAllVotes();
      let allReports = Iter.toArray(reportVotes.keys());
      
      var totalApprovalRate : Nat = 0;
      var totalConfidence : Nat = 0;
      var investorVoteCounts = HashMap.HashMap<Text, Nat>(
        0,
        Text.equal,
        Text.hash,
      );

      // Calculate stats for each report
      for (reportId in allReports.vals()) {
        switch (getVoteSummary(reportId)) {
          case (#ok(summary)) {
            totalApprovalRate += summary.approvalRate;
            totalConfidence += summary.averageConfidence;
          };
          case (#err(_)) { };
        };
      };

      // Count votes per investor
      for (vote in allVotes.vals()) {
        switch (investorVoteCounts.get(vote.investorId)) {
          case null { investorVoteCounts.put(vote.investorId, 1) };
          case (?count) { investorVoteCounts.put(vote.investorId, count + 1) };
        };
      };

      // Find most active investor
      var mostActiveInvestor : ?Text = null;
      var maxVotes : Nat = 0;
      for ((investorId, count) in investorVoteCounts.entries()) {
        if (count > maxVotes) {
          maxVotes := count;
          mostActiveInvestor := ?investorId;
        };
      };

      let averageApprovalRate = if (allReports.size() > 0) {
        totalApprovalRate / allReports.size();
      } else {
        0;
      };

      let averageConfidence = if (allReports.size() > 0) {
        totalConfidence / allReports.size();
      } else {
        0;
      };

      {
        totalVotes = allVotes.size();
        totalReportsVoted = allReports.size();
        averageApprovalRate = averageApprovalRate;
        mostActiveInvestor = mostActiveInvestor;
        averageConfidence = averageConfidence;
      };
    };

    // Check if investor can vote on a report
    public func canInvestorVote(
      principal : Principal,
      reportId : Text
    ) : Result.Result<Bool, Text> {
      switch (storage.getInvestorByPrincipal(principal)) {
        case null {
          #err("User not found or not an investor");
        };
        case (?investor) {
          let voteKey = investor.id # "-" # reportId;
          switch (votes.get(voteKey)) {
            case null {
              #ok(true);
            };
            case (?_existingVote) {
              #ok(false);
            };
          };
        };
      };
    };

    // Validate vote request
    private func validateVoteRequest(request : Types.VoteRequest) : [Text] {
      let errors = Buffer.Buffer<Text>(0);

      if (request.reportId == "") {
        errors.add("Report ID is required");
      };

      if (request.confidence < 1 or request.confidence > 10) {
        errors.add("Confidence must be between 1 and 10");
      };

      // Validate feedback length if provided
      switch (request.feedback) {
        case null { };
        case (?feedback) {
          if (feedback.size() > 1000) {
            errors.add("Feedback cannot exceed 1000 characters");
          };
        };
      };

      Buffer.toArray(errors);
    };

    // Get storage for persistence
    public func getStorage() : ([(Text, Types.InvestorVote)], [(Text, [Text])], [(Text, [Text])], Nat) {
      (
        Iter.toArray(votes.entries()),
        Iter.toArray(reportVotes.entries()),
        Iter.toArray(investorVotes.entries()),
        nextVoteId
      );
    };

    // Initialize from storage
    public func initFromStorage(
      votesEntries : [(Text, Types.InvestorVote)],
      reportVotesEntries : [(Text, [Text])],
      investorVotesEntries : [(Text, [Text])],
      voteId : Nat
    ) {
      votes := HashMap.fromIter<Text, Types.InvestorVote>(
        votesEntries.vals(),
        votesEntries.size(),
        Text.equal,
        Text.hash,
      );
      reportVotes := HashMap.fromIter<Text, [Text]>(
        reportVotesEntries.vals(),
        reportVotesEntries.size(),
        Text.equal,
        Text.hash,
      );
      investorVotes := HashMap.fromIter<Text, [Text]>(
        investorVotesEntries.vals(),
        investorVotesEntries.size(),
        Text.equal,
        Text.hash,
      );
      nextVoteId := voteId;
    };
  };
};
