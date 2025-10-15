export const idlFactory = ({ IDL }) => {
  const MonthlyReportStatus = IDL.Variant({
    'Approved' : IDL.Null,
    'Draft' : IDL.Null,
    'Rejected' : IDL.Null,
    'Submitted' : IDL.Null,
  });
  const Time = IDL.Int;
  const MonthlyReport = IDL.Record({
    'id' : IDL.Text,
    'status' : MonthlyReportStatus,
    'month' : IDL.Nat,
    'revenue' : IDL.Nat,
    'startupId' : IDL.Text,
    'newInvestors' : IDL.Nat,
    'approvedAt' : IDL.Opt(Time),
    'expenses' : IDL.Nat,
    'investorCount' : IDL.Nat,
    'createdAt' : Time,
    'year' : IDL.Nat,
    'submittedAt' : IDL.Opt(Time),
    'profitSharingAmount' : IDL.Nat,
    'updatedAt' : Time,
    'profit' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : MonthlyReport, 'err' : IDL.Text });
  const Result_24 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const VoteType = IDL.Variant({
    'Approve' : IDL.Null,
    'Reject' : IDL.Null,
    'Abstain' : IDL.Null,
  });
  const FeedbackType = IDL.Variant({
    'Negative' : IDL.Null,
    'Positive' : IDL.Null,
    'Neutral' : IDL.Null,
  });
  const VoteRequest = IDL.Record({
    'vote' : VoteType,
    'feedbackType' : IDL.Opt(FeedbackType),
    'feedback' : IDL.Opt(IDL.Text),
    'confidence' : IDL.Nat,
    'reportId' : IDL.Text,
  });
  const InvestorVote = IDL.Record({
    'id' : IDL.Text,
    'vote' : VoteType,
    'investorId' : IDL.Text,
    'feedbackType' : IDL.Opt(FeedbackType),
    'feedback' : IDL.Opt(IDL.Text),
    'timestamp' : Time,
    'confidence' : IDL.Nat,
    'reportId' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : InvestorVote, 'err' : IDL.Text });
  const Result_23 = IDL.Variant({
    'ok' : IDL.Record({
      'expiresAt' : IDL.Opt(IDL.Nat),
      'allowance' : IDL.Nat,
    }),
    'err' : IDL.Text,
  });
  const NFTPurchaseRequest = IDL.Record({
    'startupId' : IDL.Text,
    'memo' : IDL.Opt(IDL.Text),
    'investorId' : IDL.Text,
    'quantity' : IDL.Nat,
  });
  const NFTPurchaseResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'startupId' : IDL.Text,
      'tokenIds' : IDL.Vec(IDL.Nat),
      'investorId' : IDL.Text,
      'totalAmount' : IDL.Nat,
      'quantity' : IDL.Nat,
      'nftPrice' : IDL.Nat,
      'transactionId' : IDL.Text,
    }),
  });
  const MonthlyReportRequest = IDL.Record({
    'month' : IDL.Nat,
    'revenue' : IDL.Nat,
    'startupId' : IDL.Text,
    'newInvestors' : IDL.Nat,
    'expenses' : IDL.Nat,
    'investorCount' : IDL.Nat,
    'year' : IDL.Nat,
    'profitSharingAmount' : IDL.Nat,
    'profit' : IDL.Nat,
  });
  const TeamMember = IDL.Record({
    'id' : IDL.Nat,
    'linkedin' : IDL.Text,
    'background' : IDL.Text,
    'name' : IDL.Text,
    'role' : IDL.Text,
    'email' : IDL.Text,
    'isFounder' : IDL.Bool,
    'photo' : IDL.Opt(IDL.Text),
  });
  const StartupCreationRequest = IDL.Record({
    'status' : IDL.Text,
    'periodicProfitSharing' : IDL.Text,
    'foundedYear' : IDL.Text,
    'competitiveAdvantage' : IDL.Text,
    'businessPlan' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'sector' : IDL.Text,
    'useOfFunds' : IDL.Text,
    'website' : IDL.Text,
    'teamMembers' : IDL.Vec(TeamMember),
    'targetMarket' : IDL.Text,
    'revenueModel' : IDL.Text,
    'solution' : IDL.Text,
    'builtByCaffeineAI' : IDL.Opt(IDL.Bool),
    'companyLogo' : IDL.Opt(IDL.Text),
    'companyType' : IDL.Text,
    'financialProjections' : IDL.Opt(IDL.Text),
    'marketingStrategy' : IDL.Text,
    'startupName' : IDL.Text,
    'fundingGoal' : IDL.Text,
    'legalDocuments' : IDL.Opt(IDL.Text),
    'monthlyRevenue' : IDL.Text,
    'operationalProcess' : IDL.Text,
    'companyImages' : IDL.Vec(IDL.Text),
    'nftImage' : IDL.Opt(IDL.Text),
    'advisors' : IDL.Text,
    'nftPrice' : IDL.Text,
    'location' : IDL.Text,
    'monthlyExpenses' : IDL.Text,
    'problemStatement' : IDL.Text,
    'founderBackground' : IDL.Text,
  });
  const Startup = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'periodicProfitSharing' : IDL.Text,
    'foundedYear' : IDL.Text,
    'competitiveAdvantage' : IDL.Text,
    'totalFunded' : IDL.Nat,
    'createdAt' : Time,
    'businessPlan' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'sector' : IDL.Text,
    'useOfFunds' : IDL.Text,
    'website' : IDL.Text,
    'teamMembers' : IDL.Vec(TeamMember),
    'targetMarket' : IDL.Text,
    'updatedAt' : Time,
    'revenueModel' : IDL.Text,
    'solution' : IDL.Text,
    'builtByCaffeineAI' : IDL.Opt(IDL.Bool),
    'companyLogo' : IDL.Opt(IDL.Text),
    'founderId' : IDL.Text,
    'companyType' : IDL.Text,
    'financialProjections' : IDL.Opt(IDL.Text),
    'marketingStrategy' : IDL.Text,
    'startupName' : IDL.Text,
    'fundingGoal' : IDL.Text,
    'legalDocuments' : IDL.Opt(IDL.Text),
    'monthlyRevenue' : IDL.Text,
    'operationalProcess' : IDL.Text,
    'companyImages' : IDL.Vec(IDL.Text),
    'nftImage' : IDL.Opt(IDL.Text),
    'advisors' : IDL.Text,
    'nftPrice' : IDL.Text,
    'location' : IDL.Text,
    'monthlyExpenses' : IDL.Text,
    'problemStatement' : IDL.Text,
    'founderBackground' : IDL.Text,
  });
  const Result_22 = IDL.Variant({ 'ok' : Startup, 'err' : IDL.Text });
  const CollateralStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Released' : IDL.Null,
    'Locked' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const CollateralTopUp = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'startupId' : IDL.Text,
    'timestamp' : Time,
    'tokenType' : IDL.Text,
    'amount' : IDL.Nat,
    'transactionId' : IDL.Opt(IDL.Text),
  });
  const CollateralInfo = IDL.Record({
    'status' : CollateralStatus,
    'topUpHistory' : IDL.Vec(CollateralTopUp),
    'startupId' : IDL.Text,
    'lockEndTime' : IDL.Opt(Time),
    'createdAt' : Time,
    'updatedAt' : Time,
    'tokenType' : IDL.Text,
    'currentAmount' : IDL.Nat,
    'requiredAmount' : IDL.Nat,
    'lockStartTime' : IDL.Opt(Time),
  });
  const NFTAccount = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const NFTMetadata = IDL.Record({
    'tokenUri' : IDL.Text,
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'attributes' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
    'image' : IDL.Opt(IDL.Text),
  });
  const NFTInfo = IDL.Record({
    'tokenId' : IDL.Nat,
    'startupId' : IDL.Text,
    'owner' : NFTAccount,
    'metadata' : NFTMetadata,
    'mintedAt' : Time,
  });
  const NFTPurchaseInfo = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'tokenId' : IDL.Nat,
    'startupId' : IDL.Text,
    'investorId' : IDL.Text,
    'timestamp' : Time,
    'change' : IDL.Nat,
    'amount' : IDL.Nat,
    'nftPrice' : IDL.Nat,
    'transactionId' : IDL.Text,
  });
  const TransferAccount = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const BalanceResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'balance' : IDL.Nat,
      'account' : TransferAccount,
      'tokenType' : IDL.Text,
    }),
  });
  const TokenConfig = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'ledgerId' : IDL.Text,
    'name' : IDL.Text,
    'symbol' : IDL.Text,
    'canisterId' : IDL.Text,
  });
  const CollateralTopUpSummary = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'timestamp' : Time,
    'amount' : IDL.Nat,
    'transactionId' : IDL.Opt(IDL.Text),
  });
  const CollateralDashboard = IDL.Record({
    'status' : IDL.Text,
    'topUpHistory' : IDL.Vec(CollateralTopUpSummary),
    'remainingAmount' : IDL.Nat,
    'startupId' : IDL.Text,
    'nextPaymentDue' : IDL.Opt(Time),
    'progressPercentage' : IDL.Nat,
    'lockEndTime' : IDL.Opt(Time),
    'isFullyPaid' : IDL.Bool,
    'tokenType' : IDL.Text,
    'currentAmount' : IDL.Nat,
    'requiredAmount' : IDL.Nat,
    'lockStartTime' : IDL.Opt(Time),
  });
  const CollateralDashboardResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : CollateralDashboard,
  });
  const CollateralProgress = IDL.Record({
    'status' : IDL.Text,
    'isFullyPaid' : IDL.Bool,
    'tokenType' : IDL.Text,
    'currentAmount' : IDL.Nat,
    'requiredAmount' : IDL.Nat,
    'percentage' : IDL.Nat,
  });
  const CollateralProgressResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : CollateralProgress,
  });
  const Result_21 = IDL.Variant({ 'ok' : CollateralInfo, 'err' : IDL.Text });
  const Result_20 = IDL.Variant({
    'ok' : IDL.Vec(CollateralTopUp),
    'err' : IDL.Text,
  });
  const NFTConfig = IDL.Record({
    'permittedDrift' : IDL.Nat,
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'maxQueryBatchSize' : IDL.Opt(IDL.Nat),
    'description' : IDL.Text,
    'supplyCap' : IDL.Opt(IDL.Nat),
    'maxTakeValue' : IDL.Opt(IDL.Nat),
    'atomicBatchTransfers' : IDL.Opt(IDL.Bool),
    'maxUpdateBatchSize' : IDL.Opt(IDL.Nat),
    'defaultTakeValue' : IDL.Opt(IDL.Nat),
    'maxMemoSize' : IDL.Nat,
    'symbol' : IDL.Text,
    'txWindow' : IDL.Nat,
    'canisterId' : IDL.Text,
  });
  const EnvironmentConfig = IDL.Record({
    'nftToken' : NFTConfig,
    'ckUSDCToken' : TokenConfig,
    'environment' : IDL.Text,
    'plantifyAccount' : IDL.Text,
    'useTestTokens' : IDL.Bool,
    'icpToken' : TokenConfig,
  });
  const Founder = IDL.Record({
    'id' : IDL.Text,
    'linkedIn' : IDL.Text,
    'principal' : IDL.Principal,
    'createdAt' : Time,
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'experience' : IDL.Text,
    'updatedAt' : Time,
    'idNumber' : IDL.Text,
    'expertise' : IDL.Text,
    'taxNumber' : IDL.Text,
    'address' : IDL.Text,
    'phone' : IDL.Text,
    'previousBusinesses' : IDL.Text,
  });
  const DashboardOverview = IDL.Record({
    'pendingStartups' : IDL.Nat,
    'totalFundingRaised' : IDL.Nat,
    'activeStartups' : IDL.Nat,
    'totalNFTHolders' : IDL.Nat,
    'draftStartups' : IDL.Nat,
    'totalMonthlyCommitments' : IDL.Nat,
  });
  const DashboardOverviewResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : DashboardOverview,
  });
  const StartupOverview = IDL.Record({
    'totalNFTSale' : IDL.Nat,
    'totalFunded' : IDL.Nat,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'totalNFT' : IDL.Nat,
    'totalTeamMembers' : IDL.Nat,
    'fundTarget' : IDL.Nat,
    'companyType' : IDL.Text,
    'location' : IDL.Text,
  });
  const StartupOverviewResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : StartupOverview,
  });
  const RecentInvestment = IDL.Record({
    'date' : Time,
    'tokenType' : IDL.Text,
    'amount' : IDL.Nat,
    'investorName' : IDL.Text,
  });
  const FundingMilestone = IDL.Record({
    'achievedDate' : IDL.Opt(Time),
    'isAchieved' : IDL.Bool,
    'targetAmount' : IDL.Nat,
    'milestone' : IDL.Text,
  });
  const FundingStatus = IDL.Record({
    'remainingAmount' : IDL.Nat,
    'progressPercentage' : IDL.Nat,
    'recentInvestments' : IDL.Vec(RecentInvestment),
    'fundingStatus' : IDL.Text,
    'totalRaised' : IDL.Nat,
    'isFullyFunded' : IDL.Bool,
    'fundingGoal' : IDL.Nat,
    'fundingMilestones' : IDL.Vec(FundingMilestone),
  });
  const FundingStatusResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : FundingStatus,
  });
  const Investor = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Opt(IDL.Text),
    'occupation' : IDL.Opt(IDL.Text),
    'principal' : IDL.Principal,
    'country' : IDL.Text,
    'riskTolerance' : IDL.Text,
    'monthlyBudget' : IDL.Text,
    'city' : IDL.Text,
    'createdAt' : Time,
    'profilePhoto' : IDL.Opt(IDL.Text),
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'updatedAt' : Time,
    'company' : IDL.Opt(IDL.Text),
    'investmentGoals' : IDL.Text,
    'availableCapital' : IDL.Text,
    'phone' : IDL.Text,
    'investmentExperience' : IDL.Text,
    'location' : IDL.Opt(IDL.Text),
  });
  const RecentInvestmentSummary = IDL.Record({
    'startupId' : IDL.Text,
    'date' : Time,
    'investorId' : IDL.Text,
    'tokenType' : IDL.Text,
    'startupName' : IDL.Text,
    'amount' : IDL.Nat,
    'investorName' : IDL.Text,
  });
  const InvestorGrowthData = IDL.Record({
    'month' : IDL.Nat,
    'newInvestors' : IDL.Nat,
    'year' : IDL.Nat,
    'totalInvestors' : IDL.Nat,
  });
  const TopInvestor = IDL.Record({
    'numberOfInvestments' : IDL.Nat,
    'totalInvested' : IDL.Nat,
    'profilePhoto' : IDL.Opt(IDL.Text),
    'investorId' : IDL.Text,
    'lastInvestmentDate' : Time,
    'investorName' : IDL.Text,
  });
  const InvestorDashboard = IDL.Record({
    'averageInvestmentPerInvestor' : IDL.Nat,
    'recentInvestments' : IDL.Vec(RecentInvestmentSummary),
    'activeInvestors' : IDL.Nat,
    'investorGrowth' : IDL.Vec(InvestorGrowthData),
    'topInvestors' : IDL.Vec(TopInvestor),
    'newInvestorsThisMonth' : IDL.Nat,
    'totalInvestmentAmount' : IDL.Nat,
    'totalInvestors' : IDL.Nat,
  });
  const InvestorDashboardResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : InvestorDashboard,
  });
  const InvestorRecentInvestment = IDL.Record({
    'status' : IDL.Text,
    'startupId' : IDL.Text,
    'date' : Time,
    'quantity' : IDL.Nat,
    'startupName' : IDL.Text,
    'amount' : IDL.Nat,
    'nftPrice' : IDL.Nat,
  });
  const InvestorPortfolioItem = IDL.Record({
    'startupId' : IDL.Text,
    'totalInvested' : IDL.Nat,
    'averagePrice' : IDL.Nat,
    'nftCount' : IDL.Nat,
    'firstInvestment' : Time,
    'startupStatus' : IDL.Text,
    'startupName' : IDL.Text,
    'lastInvestment' : Time,
  });
  const InvestorDashboardOverview = IDL.Record({
    'averageInvestmentPerStartup' : IDL.Nat,
    'uniqueStartupsInvested' : IDL.Nat,
    'monthlyCommitment' : IDL.Nat,
    'recentInvestments' : IDL.Vec(InvestorRecentInvestment),
    'totalAmountInvested' : IDL.Nat,
    'totalInvestments' : IDL.Nat,
    'totalNFTsOwned' : IDL.Nat,
    'votingPending' : IDL.Nat,
    'profitSharingEarnings' : IDL.Nat,
    'investmentPortfolio' : IDL.Vec(InvestorPortfolioItem),
  });
  const InvestorDashboardOverviewResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : InvestorDashboardOverview,
  });
  const InvestorPerformance = IDL.Record({
    'uniqueStartups' : IDL.Nat,
    'averageInvestmentSize' : IDL.Nat,
    'investmentTrend' : IDL.Text,
    'totalInvested' : IDL.Nat,
    'diversificationScore' : IDL.Nat,
    'totalNFTs' : IDL.Nat,
    'profitSharingEarnings' : IDL.Nat,
    'riskProfile' : IDL.Text,
  });
  const InvestorPerformanceResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : InvestorPerformance,
  });
  const NFTPurchaseHistory = IDL.Record({
    'totalNFTs' : IDL.Nat,
    'totalPurchases' : IDL.Nat,
    'totalSpent' : IDL.Nat,
    'purchases' : IDL.Vec(NFTPurchaseInfo),
  });
  const Result_9 = IDL.Variant({ 'ok' : NFTPurchaseHistory, 'err' : IDL.Text });
  const InvestorStartupInvestment = IDL.Record({
    'startupId' : IDL.Text,
    'totalInvested' : IDL.Nat,
    'averagePrice' : IDL.Nat,
    'nftCount' : IDL.Nat,
    'firstInvestment' : Time,
    'profitSharingEarnings' : IDL.Nat,
    'startupStatus' : IDL.Text,
    'startupName' : IDL.Text,
    'lastInvestment' : Time,
  });
  const InvestorStartupInvestmentResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : InvestorStartupInvestment,
  });
  const Result_19 = IDL.Variant({
    'ok' : IDL.Opt(InvestorVote),
    'err' : IDL.Text,
  });
  const InvestorVoteHistory = IDL.Record({
    'votes' : IDL.Vec(InvestorVote),
    'totalVotes' : IDL.Nat,
    'averageConfidence' : IDL.Nat,
    'approvalRate' : IDL.Nat,
  });
  const Result_18 = IDL.Variant({
    'ok' : InvestorVoteHistory,
    'err' : IDL.Text,
  });
  const MonthlyReportStats = IDL.Record({
    'bestMonth' : IDL.Opt(IDL.Text),
    'worstMonth' : IDL.Opt(IDL.Text),
    'totalProfitSharing' : IDL.Nat,
    'averageMonthlyRevenue' : IDL.Nat,
    'averageMonthlyProfit' : IDL.Nat,
    'totalReports' : IDL.Nat,
    'totalProfit' : IDL.Nat,
    'totalExpenses' : IDL.Nat,
    'totalRevenue' : IDL.Nat,
    'averageMonthlyExpenses' : IDL.Nat,
  });
  const MonthlyReportList = IDL.Record({
    'totalProfitSharing' : IDL.Nat,
    'totalReports' : IDL.Nat,
    'totalProfit' : IDL.Nat,
    'totalExpenses' : IDL.Nat,
    'reports' : IDL.Vec(MonthlyReport),
    'totalRevenue' : IDL.Nat,
  });
  const Result_17 = IDL.Variant({ 'ok' : MonthlyReportList, 'err' : IDL.Text });
  const PortfolioItem = IDL.Record({
    'status' : IDL.Text,
    'returnAmount' : IDL.Nat,
    'startupId' : IDL.Text,
    'returnPercentage' : IDL.Nat,
    'monthlyCommitment' : IDL.Nat,
    'nftCount' : IDL.Nat,
    'sector' : IDL.Text,
    'lastUpdateDate' : Time,
    'currentValue' : IDL.Nat,
    'profitSharingEarnings' : IDL.Nat,
    'investmentDate' : Time,
    'startupLogo' : IDL.Opt(IDL.Text),
    'startupName' : IDL.Text,
    'investedAmount' : IDL.Nat,
  });
  const PerformanceMetrics = IDL.Record({
    'monthlyCommitmentTrend' : IDL.Text,
    'investmentTrend' : IDL.Text,
    'profitSharingTrend' : IDL.Text,
    'diversificationScore' : IDL.Nat,
    'riskScore' : IDL.Nat,
    'portfolioGrowth' : IDL.Nat,
  });
  const PortfolioSummary = IDL.Record({
    'worstPerformer' : IDL.Opt(IDL.Text),
    'totalProfitSharingEarnings' : IDL.Nat,
    'activeInvestments' : IDL.Nat,
    'completedInvestments' : IDL.Nat,
    'totalStartups' : IDL.Nat,
    'bestPerformer' : IDL.Opt(IDL.Text),
    'averageReturn' : IDL.Nat,
    'totalMonthlyCommitments' : IDL.Nat,
  });
  const MyInvestmentPortfolio = IDL.Record({
    'portfolioItems' : IDL.Vec(PortfolioItem),
    'totalPortfolioValue' : IDL.Nat,
    'returnPercentage' : IDL.Nat,
    'totalInvested' : IDL.Nat,
    'totalReturns' : IDL.Nat,
    'performanceMetrics' : PerformanceMetrics,
    'portfolioSummary' : PortfolioSummary,
  });
  const MyInvestmentPortfolioResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : MyInvestmentPortfolio,
  });
  const NFTBalanceResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({ 'balance' : IDL.Nat, 'account' : NFTAccount }),
  });
  const Result_16 = IDL.Variant({
    'ok' : NFTBalanceResponse,
    'err' : IDL.Text,
  });
  const Result_15 = IDL.Variant({ 'ok' : NFTInfo, 'err' : IDL.Text });
  const NFTOwnerResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'owner' : IDL.Opt(NFTAccount),
    }),
  });
  const Result_14 = IDL.Variant({ 'ok' : NFTOwnerResponse, 'err' : IDL.Text });
  const Result_13 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_12 = IDL.Variant({ 'ok' : IDL.Vec(NFTInfo), 'err' : IDL.Text });
  const Result_11 = IDL.Variant({ 'ok' : NFTPurchaseInfo, 'err' : IDL.Text });
  const NFTPurchaseStats = IDL.Record({
    'totalNFTsSold' : IDL.Nat,
    'totalPurchases' : IDL.Nat,
    'topStartup' : IDL.Opt(IDL.Text),
    'averagePurchaseAmount' : IDL.Nat,
    'totalRevenue' : IDL.Nat,
  });
  const VoteSummary = IDL.Record({
    'totalVotes' : IDL.Nat,
    'averageConfidence' : IDL.Nat,
    'rejectVotes' : IDL.Nat,
    'approvalRate' : IDL.Nat,
    'approveVotes' : IDL.Nat,
    'lastVoteTime' : IDL.Opt(Time),
    'positiveFeedback' : IDL.Nat,
    'abstainVotes' : IDL.Nat,
    'reportId' : IDL.Text,
    'negativeFeedback' : IDL.Nat,
    'neutralFeedback' : IDL.Nat,
  });
  const ReportVoteDetails = IDL.Record({
    'summary' : VoteSummary,
    'individualVotes' : IDL.Vec(InvestorVote),
    'reportId' : IDL.Text,
  });
  const Result_10 = IDL.Variant({ 'ok' : ReportVoteDetails, 'err' : IDL.Text });
  const TeamMemberOverview = IDL.Record({
    'id' : IDL.Nat,
    'linkedin' : IDL.Text,
    'background' : IDL.Text,
    'name' : IDL.Text,
    'role' : IDL.Text,
    'email' : IDL.Text,
    'isFounder' : IDL.Bool,
    'photo' : IDL.Opt(IDL.Text),
  });
  const TeamMembersResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Vec(TeamMemberOverview),
  });
  const PaginationParams = IDL.Record({ 'page' : IDL.Nat, 'limit' : IDL.Nat });
  const StartupSummary = IDL.Record({
    'id' : IDL.Text,
    'totalFunded' : IDL.Nat,
    'description' : IDL.Text,
    'availableNFTs' : IDL.Nat,
    'totalFunding' : IDL.Text,
    'builtByCaffeineAI' : IDL.Opt(IDL.Bool),
    'companyType' : IDL.Text,
    'startupName' : IDL.Text,
    'companyImages' : IDL.Vec(IDL.Text),
    'nftPrice' : IDL.Text,
    'location' : IDL.Text,
  });
  const PaginatedStartups = IDL.Record({
    'startups' : IDL.Vec(StartupSummary),
    'page' : IDL.Nat,
    'totalCount' : IDL.Nat,
    'limit' : IDL.Nat,
    'totalPages' : IDL.Nat,
  });
  const TokenInfoResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'name' : IDL.Text,
      'tokenType' : IDL.Text,
      'symbol' : IDL.Text,
    }),
  });
  const UserType = IDL.Variant({ 'Founder' : IDL.Null, 'Investor' : IDL.Null });
  const Result_8 = IDL.Variant({ 'ok' : VoteSummary, 'err' : IDL.Text });
  const VotingStats = IDL.Record({
    'totalVotes' : IDL.Nat,
    'mostActiveInvestor' : IDL.Opt(IDL.Text),
    'averageApprovalRate' : IDL.Nat,
    'averageConfidence' : IDL.Nat,
    'totalReportsVoted' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const MintNFTRequest = IDL.Record({
    'startupId' : IDL.Text,
    'metadata' : NFTMetadata,
    'memo' : IDL.Opt(IDL.Text),
    'toAccount' : NFTAccount,
  });
  const MintNFTResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'startupId' : IDL.Text,
      'transactionId' : IDL.Opt(IDL.Text),
    }),
  });
  const Result_7 = IDL.Variant({ 'ok' : MintNFTResponse, 'err' : IDL.Text });
  const FounderRegistrationRequest = IDL.Record({
    'linkedIn' : IDL.Text,
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'experience' : IDL.Text,
    'idNumber' : IDL.Text,
    'expertise' : IDL.Text,
    'taxNumber' : IDL.Text,
    'address' : IDL.Text,
    'phone' : IDL.Text,
    'previousBusinesses' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : Founder, 'err' : IDL.Text });
  const InvestorRegistrationRequest = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'occupation' : IDL.Opt(IDL.Text),
    'country' : IDL.Text,
    'riskTolerance' : IDL.Text,
    'monthlyBudget' : IDL.Text,
    'city' : IDL.Text,
    'profilePhoto' : IDL.Opt(IDL.Text),
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'company' : IDL.Opt(IDL.Text),
    'investmentGoals' : IDL.Text,
    'availableCapital' : IDL.Text,
    'phone' : IDL.Text,
    'investmentExperience' : IDL.Text,
    'location' : IDL.Opt(IDL.Text),
  });
  const Result_2 = IDL.Variant({ 'ok' : Investor, 'err' : IDL.Text });
  const TopUpRequest = IDL.Record({
    'startupId' : IDL.Text,
    'memo' : IDL.Opt(IDL.Text),
    'tokenType' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const TopUpResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'remainingAmount' : IDL.Nat,
      'newTotal' : IDL.Nat,
      'isFullyPaid' : IDL.Bool,
      'tokenType' : IDL.Text,
      'amount' : IDL.Nat,
      'topUpId' : IDL.Text,
      'transactionId' : IDL.Text,
    }),
  });
  const Result_4 = IDL.Variant({ 'ok' : TopUpResponse, 'err' : IDL.Text });
  const TransferResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'blockIndex' : IDL.Nat,
      'tokenType' : IDL.Text,
      'toAccount' : TransferAccount,
      'amount' : IDL.Nat,
      'transactionId' : IDL.Text,
    }),
  });
  const TransferNFTRequest = IDL.Record({
    'tokenId' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Text),
    'toAccount' : NFTAccount,
  });
  const TransferNFTResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'transactionId' : IDL.Opt(IDL.Text),
    }),
  });
  const Result_3 = IDL.Variant({
    'ok' : TransferNFTResponse,
    'err' : IDL.Text,
  });
  const TransferArgs = IDL.Record({
    'memo' : IDL.Opt(IDL.Text),
    'tokenType' : IDL.Text,
    'toAccount' : TransferAccount,
    'amount' : IDL.Nat,
  });
  const InvestorProfileUpdateRequest = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'occupation' : IDL.Opt(IDL.Text),
    'country' : IDL.Opt(IDL.Text),
    'riskTolerance' : IDL.Opt(IDL.Text),
    'monthlyBudget' : IDL.Opt(IDL.Text),
    'city' : IDL.Opt(IDL.Text),
    'profilePhoto' : IDL.Opt(IDL.Text),
    'fullName' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'company' : IDL.Opt(IDL.Text),
    'investmentGoals' : IDL.Opt(IDL.Text),
    'availableCapital' : IDL.Opt(IDL.Text),
    'phone' : IDL.Opt(IDL.Text),
    'investmentExperience' : IDL.Opt(IDL.Text),
    'location' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'approveMonthlyReport' : IDL.Func([IDL.Text], [Result_1], []),
    'calculateRequiredCollateral' : IDL.Func(
        [IDL.Nat, IDL.Text],
        [IDL.Nat],
        [],
      ),
    'canInvestorVote' : IDL.Func([IDL.Text], [Result_24], []),
    'canMintNFT' : IDL.Func([IDL.Text], [Result_24], []),
    'canPurchaseNFT' : IDL.Func([IDL.Text, IDL.Text], [Result_24], []),
    'castVote' : IDL.Func([VoteRequest], [Result], []),
    'checkAllowance' : IDL.Func([IDL.Text], [Result_23], []),
    'completeNFTPurchase' : IDL.Func(
        [NFTPurchaseRequest, IDL.Nat],
        [NFTPurchaseResponse],
        [],
      ),
    'createMonthlyReport' : IDL.Func([MonthlyReportRequest], [Result_1], []),
    'createStartup' : IDL.Func([StartupCreationRequest], [Result_22], []),
    'createStartupForFounder' : IDL.Func(
        [IDL.Text, StartupCreationRequest],
        [Result_22],
        [],
      ),
    'getAllCollateralInfo' : IDL.Func([], [IDL.Vec(CollateralInfo)], []),
    'getAllMonthlyReports' : IDL.Func([], [IDL.Vec(MonthlyReport)], []),
    'getAllNFTs' : IDL.Func([], [IDL.Vec(NFTInfo)], []),
    'getAllPurchases' : IDL.Func([], [IDL.Vec(NFTPurchaseInfo)], []),
    'getAllStartups' : IDL.Func([], [IDL.Vec(Startup)], []),
    'getAllVotes' : IDL.Func([], [IDL.Vec(InvestorVote)], []),
    'getBalance' : IDL.Func([TransferAccount, IDL.Text], [BalanceResponse], []),
    'getCanisterVersion' : IDL.Func([], [IDL.Nat], []),
    'getCkUSDCBalance' : IDL.Func([TransferAccount], [BalanceResponse], []),
    'getCkUSDCTokenConfig' : IDL.Func([], [TokenConfig], []),
    'getCollateralDashboard' : IDL.Func(
        [IDL.Text],
        [CollateralDashboardResponse],
        [],
      ),
    'getCollateralProgress' : IDL.Func(
        [IDL.Text],
        [CollateralProgressResponse],
        [],
      ),
    'getCollateralStatus' : IDL.Func([IDL.Text], [Result_21], []),
    'getCollateralTopUpHistory' : IDL.Func([IDL.Text], [Result_20], []),
    'getEnvironment' : IDL.Func([], [IDL.Text], []),
    'getEnvironmentConfig' : IDL.Func([], [EnvironmentConfig], []),
    'getFeaturedStartup' : IDL.Func([], [IDL.Opt(Startup)], []),
    'getFounderByPrincipal' : IDL.Func([], [IDL.Opt(Founder)], []),
    'getFounderDashboardOverview' : IDL.Func(
        [],
        [DashboardOverviewResponse],
        [],
      ),
    'getFounderStartupOverview' : IDL.Func(
        [IDL.Text],
        [StartupOverviewResponse],
        [],
      ),
    'getFounders' : IDL.Func([], [IDL.Vec(Founder)], []),
    'getFundingStatus' : IDL.Func([IDL.Text], [FundingStatusResponse], []),
    'getICPBalance' : IDL.Func([TransferAccount], [BalanceResponse], []),
    'getICPTokenConfig' : IDL.Func([], [TokenConfig], []),
    'getInvestorByPrincipal' : IDL.Func([], [IDL.Opt(Investor)], []),
    'getInvestorDashboard' : IDL.Func([], [InvestorDashboardResponse], []),
    'getInvestorDashboardOverview' : IDL.Func(
        [],
        [InvestorDashboardOverviewResponse],
        [],
      ),
    'getInvestorPerformance' : IDL.Func([], [InvestorPerformanceResponse], []),
    'getInvestorProfile' : IDL.Func([], [IDL.Opt(Investor)], []),
    'getInvestorPurchaseHistory' : IDL.Func([IDL.Text], [Result_9], []),
    'getInvestorStartupInvestment' : IDL.Func(
        [IDL.Text],
        [InvestorStartupInvestmentResponse],
        [],
      ),
    'getInvestorVoteForReport' : IDL.Func([IDL.Text], [Result_19], []),
    'getInvestorVoteHistory' : IDL.Func([IDL.Text], [Result_18], []),
    'getInvestors' : IDL.Func([], [IDL.Vec(Investor)], []),
    'getMonthlyReport' : IDL.Func([IDL.Text], [Result_1], []),
    'getMonthlyReportStats' : IDL.Func([], [MonthlyReportStats], []),
    'getMonthlyReportsByStartup' : IDL.Func([IDL.Text], [Result_17], []),
    'getMonthlyReportsByStatus' : IDL.Func(
        [MonthlyReportStatus],
        [IDL.Vec(MonthlyReport)],
        [],
      ),
    'getMyInvestmentPortfolio' : IDL.Func(
        [],
        [MyInvestmentPortfolioResponse],
        [],
      ),
    'getNFTBalance' : IDL.Func([NFTAccount], [Result_16], []),
    'getNFTInfo' : IDL.Func([IDL.Nat], [Result_15], []),
    'getNFTOwner' : IDL.Func([IDL.Nat], [Result_14], []),
    'getNFTPrice' : IDL.Func([IDL.Text], [Result_13], []),
    'getNFTStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalSupply' : IDL.Nat,
            'totalStartups' : IDL.Nat,
            'nextTokenId' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getNFTsByStartup' : IDL.Func([IDL.Text], [Result_12], []),
    'getPlantifyAccount' : IDL.Func([], [IDL.Text], []),
    'getPlantifyCanisterPrincipal' : IDL.Func([], [IDL.Text], []),
    'getPurchaseInfo' : IDL.Func([IDL.Text], [Result_11], []),
    'getPurchaseStats' : IDL.Func([], [NFTPurchaseStats], []),
    'getReportVoteDetails' : IDL.Func([IDL.Text], [Result_10], []),
    'getReportVotes' : IDL.Func([IDL.Text], [IDL.Vec(InvestorVote)], []),
    'getStartupDetails' : IDL.Func([IDL.Text], [IDL.Opt(Startup)], []),
    'getStartupPurchaseHistory' : IDL.Func([IDL.Text], [Result_9], []),
    'getStartupTeamMembers' : IDL.Func([IDL.Text], [TeamMembersResponse], []),
    'getStartupsByFounderNameAndId' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(Startup)],
        [],
      ),
    'getStartupsByFounderPrincipal' : IDL.Func([], [IDL.Vec(Startup)], []),
    'getStartupsByFounderPrincipalPaginated' : IDL.Func(
        [PaginationParams],
        [PaginatedStartups],
        [],
      ),
    'getStartupsCount' : IDL.Func([], [IDL.Nat], []),
    'getStartupsPaginated' : IDL.Func(
        [PaginationParams],
        [PaginatedStartups],
        [],
      ),
    'getTokenCanisterId' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'getTokenInfo' : IDL.Func([IDL.Text], [TokenInfoResponse], []),
    'getUserType' : IDL.Func([], [IDL.Opt(UserType)], []),
    'getVoteSummary' : IDL.Func([IDL.Text], [Result_8], []),
    'getVotingStats' : IDL.Func([], [VotingStats], []),
    'initializeCollateral' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text],
        [Result_6],
        [],
      ),
    'isUserFounder' : IDL.Func([], [IDL.Bool], []),
    'isUserInvestor' : IDL.Func([], [IDL.Bool], []),
    'isUsingTestTokens' : IDL.Func([], [IDL.Bool], []),
    'mintNFT' : IDL.Func([MintNFTRequest], [Result_7], []),
    'mintNFTForStartup' : IDL.Func([IDL.Text], [Result_6], []),
    'purchaseNFT' : IDL.Func([NFTPurchaseRequest], [NFTPurchaseResponse], []),
    'registerFounder' : IDL.Func([FounderRegistrationRequest], [Result_5], []),
    'registerInvestor' : IDL.Func(
        [InvestorRegistrationRequest],
        [Result_2],
        [],
      ),
    'rejectMonthlyReport' : IDL.Func([IDL.Text], [Result_1], []),
    'submitMonthlyReport' : IDL.Func([IDL.Text], [Result_1], []),
    'topUpCollateral' : IDL.Func([TopUpRequest], [Result_4], []),
    'transferCkUSDC' : IDL.Func(
        [TransferAccount, IDL.Nat, IDL.Opt(IDL.Text)],
        [TransferResponse],
        [],
      ),
    'transferICP' : IDL.Func(
        [TransferAccount, IDL.Nat, IDL.Opt(IDL.Text)],
        [TransferResponse],
        [],
      ),
    'transferNFT' : IDL.Func([TransferNFTRequest], [Result_3], []),
    'transferTokens' : IDL.Func([TransferArgs], [TransferResponse], []),
    'updateInvestorProfile' : IDL.Func(
        [InvestorProfileUpdateRequest],
        [Result_2],
        [],
      ),
    'updateMonthlyReport' : IDL.Func(
        [IDL.Text, MonthlyReportRequest],
        [Result_1],
        [],
      ),
    'updateStartupStatus' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'updateVote' : IDL.Func([IDL.Text, VoteRequest], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
