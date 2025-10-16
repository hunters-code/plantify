import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

module Types {
  public type UserType = {
    #Founder;
    #Investor;
  };

  public type Founder = {
    id : Text;
    principal : Principal;
    fullName : Text;
    email : Text;
    phone : Text;
    address : Text;
    experience : Text;
    previousBusinesses : Text;
    expertise : Text;
    linkedIn : Text;
    idNumber : Text;
    taxNumber : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type Investor = {
    id : Text;
    principal : Principal;
    fullName : Text;
    email : Text;
    phone : Text;
    country : Text;
    city : Text;
    location : ?Text;
    occupation : ?Text;
    company : ?Text;
    bio : ?Text;
    profilePhoto : ?Text;
    investmentExperience : Text;
    riskTolerance : Text;
    investmentGoals : Text;
    availableCapital : Text;
    monthlyBudget : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type FounderRegistrationRequest = {
    fullName : Text;
    email : Text;
    phone : Text;
    address : Text;
    experience : Text;
    previousBusinesses : Text;
    expertise : Text;
    linkedIn : Text;
    idNumber : Text;
    taxNumber : Text;
  };

  public type InvestorRegistrationRequest = {
    fullName : Text;
    email : Text;
    phone : Text;
    country : Text;
    city : Text;
    location : ?Text;
    occupation : ?Text;
    company : ?Text;
    bio : ?Text;
    profilePhoto : ?Text;
    investmentExperience : Text;
    riskTolerance : Text;
    investmentGoals : Text;
    availableCapital : Text;
    monthlyBudget : Text;
  };

  public type InvestorProfileUpdateRequest = {
    fullName : ?Text;
    email : ?Text;
    phone : ?Text;
    country : ?Text;
    city : ?Text;
    location : ?Text;
    occupation : ?Text;
    company : ?Text;
    bio : ?Text;
    profilePhoto : ?Text;
    investmentExperience : ?Text;
    riskTolerance : ?Text;
    investmentGoals : ?Text;
    availableCapital : ?Text;
    monthlyBudget : ?Text;
  };

  public type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    background : Text;
    photo : ?Text;
    linkedin : Text;
    email : Text;
    isFounder : Bool;
  };

  public type Startup = {
    id : Text;
    founderId : Text;
    startupName : Text;
    sector : Text;
    foundedYear : Text;
    description : Text;
    website : Text;
    location : Text;
    companyType : Text;
    companyLogo : ?Text;
    companyImages : [Text];
    nftImage : ?Text;
    problemStatement : Text;
    solution : Text;
    targetMarket : Text;
    competitiveAdvantage : Text;
    marketingStrategy : Text;
    operationalProcess : Text;
    founderBackground : Text;
    teamMembers : [TeamMember];
    advisors : Text;
    fundingGoal : Text;
    nftPrice : Text;
    periodicProfitSharing : Text;
    revenueModel : Text;
    monthlyRevenue : Text;
    monthlyExpenses : Text;
    useOfFunds : Text;
    businessPlan : ?Text;
    financialProjections : ?Text;
    legalDocuments : ?Text;
    status : Text;
    builtByCaffeineAI : ?Bool;
    totalFunded : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type StartupCreationRequest = {
    startupName : Text;
    sector : Text;
    foundedYear : Text;
    description : Text;
    website : Text;
    location : Text;
    companyType : Text;
    companyLogo : ?Text;
    companyImages : [Text];
    nftImage : ?Text;
    problemStatement : Text;
    solution : Text;
    targetMarket : Text;
    competitiveAdvantage : Text;
    marketingStrategy : Text;
    operationalProcess : Text;
    founderBackground : Text;
    teamMembers : [TeamMember];
    advisors : Text;
    fundingGoal : Text;
    nftPrice : Text;
    periodicProfitSharing : Text;
    revenueModel : Text;
    monthlyRevenue : Text;
    monthlyExpenses : Text;
    useOfFunds : Text;
    businessPlan : ?Text;
    financialProjections : ?Text;
    legalDocuments : ?Text;
    status : Text;
    builtByCaffeineAI : ?Bool;
  };


  // Enhanced startup details with related information
  public type EnhancedStartupDetails = {
    startup : Startup;
    founder : ?Founder;
    relatedStartups : [Startup];
    monthlyReports : [MonthlyReport];
    nftInfo : ?{
      tokenId : Nat;
      owner : NFTAccount;
      metadata : NFTMetadata;
    };
    collateralInfo : ?CollateralInfo;
    totalVotes : Nat;
    averageVoteScore : ?Float;
  };

  public type TokenConfig = {
    canisterId : Text;
    ledgerId : Text;
    name : Text;
    symbol : Text;
    decimals : Nat8;
    fee : Nat;
  };

  public type NFTConfig = {
    canisterId : Text;
    name : Text;
    symbol : Text;
    description : Text;
    logo : ?Text;
    maxMemoSize : Nat;
    txWindow : Nat;
    permittedDrift : Nat;
    supplyCap : ?Nat;
    maxQueryBatchSize : ?Nat;
    maxUpdateBatchSize : ?Nat;
    defaultTakeValue : ?Nat;
    maxTakeValue : ?Nat;
    atomicBatchTransfers : ?Bool;
  };

  public type EnvironmentConfig = {
    environment : Text;
    icpToken : TokenConfig;
    ckUSDCToken : TokenConfig;
    nftToken : NFTConfig;
    plantifyAccount : Text;
    useTestTokens : Bool;
  };

  // Transfer Service Types
  public type TransferAccount = {
    owner : Principal;
    subaccount : ?[Nat8];
  };

  public type TransferArgs = {
    amount : Nat;
    toAccount : TransferAccount;
    tokenType : Text; // "ICP" or "ckUSDC"
    memo : ?Text;
  };

  public type TransferFromArgs = {
    amount : Nat;
    fromAccount : TransferAccount;
    toAccount : TransferAccount;
    tokenType : Text; // "ICP" or "ckUSDC"
    memo : ?Text;
  };

  public type ApproveArgs = {
    amount : Nat;
    spenderAccount : TransferAccount;
    tokenType : Text; // "ICP" or "ckUSDC"
    memo : ?Text;
    expiresAt : ?Nat;
  };

  public type TransferResponse = {
    #Success : {
      blockIndex : Nat;
      transactionId : Text;
      amount : Nat;
      toAccount : TransferAccount;
      tokenType : Text;
    };
    #Error : Text;
  };

  public type BalanceResponse = {
    #Success : {
      balance : Nat;
      tokenType : Text;
      account : TransferAccount;
    };
    #Error : Text;
  };

  public type TokenInfoResponse = {
    #Success : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      fee : Nat;
      tokenType : Text;
    };
    #Error : Text;
  };

  // Collateral Service Types
  public type CollateralStatus = {
    #Pending;
    #Active;
    #Locked;
    #Released;
  };

  public type CollateralInfo = {
    startupId : Text;
    requiredAmount : Nat;
    currentAmount : Nat;
    status : CollateralStatus;
    tokenType : Text; // "ICP" or "ckUSDC"
    topUpHistory : [CollateralTopUp];
    lockStartTime : ?Time.Time;
    lockEndTime : ?Time.Time;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type CollateralTopUp = {
    id : Text;
    startupId : Text;
    amount : Nat;
    tokenType : Text;
    timestamp : Time.Time;
    transactionId : ?Text;
    status : Text;
  };

  public type TopUpRequest = {
    startupId : Text;
    amount : Nat;
    tokenType : Text; // "ICP" or "ckUSDC"
    memo : ?Text;
  };

  public type TopUpResponse = {
    #Success : {
      topUpId : Text;
      transactionId : Text;
      amount : Nat;
      newTotal : Nat;
      remainingAmount : Nat;
      isFullyPaid : Bool;
      tokenType : Text;
    };
    #Error : Text;
  };

  public type CollateralProgress = {
    currentAmount : Nat;
    requiredAmount : Nat;
    percentage : Nat;
    status : Text;
    isFullyPaid : Bool;
    tokenType : Text;
  };

  public type CollateralProgressResponse = {
    #Success : CollateralProgress;
    #Error : Text;
  };

  // NFT Service Types
  public type NFTAccount = {
    owner : Principal;
    subaccount : ?Blob;
  };

  public type NFTMetadata = {
    tokenUri : Text;
    name : ?Text;
    description : ?Text;
    image : ?Text;
    attributes : ?[(Text, Text)];
  };

  public type MintNFTRequest = {
    startupId : Text;
    toAccount : NFTAccount;
    metadata : NFTMetadata;
    memo : ?Text;
  };

  public type MintNFTResponse = {
    #Success : {
      tokenId : Nat;
      transactionId : ?Text;
      startupId : Text;
    };
    #Error : Text;
  };

  public type NFTInfo = {
    tokenId : Nat;
    startupId : Text;
    owner : NFTAccount;
    metadata : NFTMetadata;
    mintedAt : Time.Time;
  };

  public type TransferNFTRequest = {
    tokenId : Nat;
    toAccount : NFTAccount;
    memo : ?Text;
  };

  public type TransferNFTResponse = {
    #Success : {
      tokenId : Nat;
      transactionId : ?Text;
    };
    #Error : Text;
  };

  public type NFTBalanceResponse = {
    #Success : {
      balance : Nat;
      account : NFTAccount;
    };
    #Error : Text;
  };

  public type NFTOwnerResponse = {
    #Success : {
      tokenId : Nat;
      owner : ?NFTAccount;
    };
    #Error : Text;
  };

  // NFT Purchase Service Types
  public type NFTPurchaseRequest = {
    startupId : Text;
    investorId : Text;
    quantity : Nat; // Number of NFTs to purchase
    memo : ?Text;
  };

  public type NFTPurchaseResponse = {
    #Success : {
      tokenIds : [Nat]; // List of purchased NFT token IDs
      transactionId : Text;
      startupId : Text;
      investorId : Text;
      totalAmount : Nat; // Total amount charged (nftPrice * quantity)
      nftPrice : Nat;
      quantity : Nat; // Number of NFTs purchased
    };
    #Error : Text;
  };

  public type NFTPurchaseInfo = {
    id : Text;
    startupId : Text;
    investorId : Text;
    tokenId : Nat;
    amount : Nat;
    nftPrice : Nat;
    change : Nat;
    transactionId : Text;
    timestamp : Time.Time;
    status : Text; // "Pending", "Completed", "Failed", "Refunded"
  };

  public type NFTPurchaseStatus = {
    #Pending;
    #Completed;
    #Failed;
    #Refunded;
  };

  public type NFTPurchaseHistory = {
    purchases : [NFTPurchaseInfo];
    totalPurchases : Nat;
    totalSpent : Nat;
    totalNFTs : Nat;
  };

  public type NFTPurchaseHistoryResponse = {
    #Success : NFTPurchaseHistory;
    #Error : Text;
  };

  public type NFTPurchaseStats = {
    totalPurchases : Nat;
    totalRevenue : Nat;
    totalNFTsSold : Nat;
    averagePurchaseAmount : Nat;
    topStartup : ?Text;
  };

  public type NFTPurchaseStatsResponse = {
    #Success : NFTPurchaseStats;
    #Error : Text;
  };

  // Monthly Report Service Types
  public type MonthlyReportStatus = {
    #Draft;
    #Submitted;
    #Approved;
    #Rejected;
  };

  public type MonthlyReport = {
    id : Text;
    startupId : Text;
    month : Nat; // 1-12
    year : Nat;
    revenue : Nat;
    expenses : Nat;
    profit : Nat;
    profitSharingAmount : Nat;
    investorCount : Nat;
    newInvestors : Nat;
    status : MonthlyReportStatus;
    submittedAt : ?Time.Time;
    approvedAt : ?Time.Time;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type MonthlyReportRequest = {
    startupId : Text;
    month : Nat;
    year : Nat;
    revenue : Nat;
    expenses : Nat;
    profit : Nat;
    profitSharingAmount : Nat;
    investorCount : Nat;
    newInvestors : Nat;
  };

  public type MonthlyReportResponse = {
    #Success : MonthlyReport;
    #Error : Text;
  };

  public type MonthlyReportList = {
    reports : [MonthlyReport];
    totalReports : Nat;
    totalRevenue : Nat;
    totalExpenses : Nat;
    totalProfit : Nat;
    totalProfitSharing : Nat;
  };

  public type MonthlyReportListResponse = {
    #Success : MonthlyReportList;
    #Error : Text;
  };

  public type MonthlyReportStats = {
    totalReports : Nat;
    totalRevenue : Nat;
    totalExpenses : Nat;
    totalProfit : Nat;
    totalProfitSharing : Nat;
    averageMonthlyRevenue : Nat;
    averageMonthlyExpenses : Nat;
    averageMonthlyProfit : Nat;
    bestMonth : ?Text;
    worstMonth : ?Text;
  };

  public type MonthlyReportStatsResponse = {
    #Success : MonthlyReportStats;
    #Error : Text;
  };

  // Voting and Feedback Service Types
  public type VoteType = {
    #Approve;
    #Reject;
    #Abstain;
  };

  public type FeedbackType = {
    #Positive;
    #Neutral;
    #Negative;
  };

  public type InvestorVote = {
    id : Text;
    reportId : Text;
    investorId : Text;
    vote : VoteType;
    feedback : ?Text;
    feedbackType : ?FeedbackType;
    confidence : Nat; // 1-10 scale
    timestamp : Time.Time;
  };

  public type VoteRequest = {
    reportId : Text;
    vote : VoteType;
    feedback : ?Text;
    feedbackType : ?FeedbackType;
    confidence : Nat;
  };

  public type VoteResponse = {
    #Success : InvestorVote;
    #Error : Text;
  };

  public type VoteSummary = {
    reportId : Text;
    totalVotes : Nat;
    approveVotes : Nat;
    rejectVotes : Nat;
    abstainVotes : Nat;
    approvalRate : Nat; // Percentage
    averageConfidence : Nat;
    positiveFeedback : Nat;
    neutralFeedback : Nat;
    negativeFeedback : Nat;
    lastVoteTime : ?Time.Time;
  };

  public type VoteSummaryResponse = {
    #Success : VoteSummary;
    #Error : Text;
  };

  public type InvestorVoteHistory = {
    votes : [InvestorVote];
    totalVotes : Nat;
    approvalRate : Nat;
    averageConfidence : Nat;
  };

  public type InvestorVoteHistoryResponse = {
    #Success : InvestorVoteHistory;
    #Error : Text;
  };

  public type ReportVoteDetails = {
    reportId : Text;
    summary : VoteSummary;
    individualVotes : [InvestorVote];
  };

  public type ReportVoteDetailsResponse = {
    #Success : ReportVoteDetails;
    #Error : Text;
  };

  public type VotingStats = {
    totalVotes : Nat;
    totalReportsVoted : Nat;
    averageApprovalRate : Nat;
    mostActiveInvestor : ?Text;
    averageConfidence : Nat;
  };

  public type VotingStatsResponse = {
    #Success : VotingStats;
    #Error : Text;
  };

  // Pagination types
  public type PaginationParams = {
    page : Nat;
    limit : Nat;
  };

  public type PaginatedNFTs = {
    nfts : [NFTInfo];
    totalCount : Nat;
    page : Nat;
    limit : Nat;
    totalPages : Nat;
  };

  // Lightweight startup data for pagination
  public type StartupSummary = {
    id : Text;
    startupName : Text;
    description : Text;
    nftPrice : Text;
    companyImages : [Text];
    companyType : Text;
    totalFunding : Text;
    availableNFTs : Nat;
    totalFunded : Nat;
    builtByCaffeineAI : ?Bool;
    location : Text;
  };

  public type PaginatedStartups = {
    startups : [StartupSummary];
    totalCount : Nat;
    page : Nat;
    limit : Nat;
    totalPages : Nat;
  };

  // Dashboard Founder Service Types
  public type DashboardOverview = {
    totalFundingRaised : Nat;
    activeStartups : Nat;
    pendingStartups : Nat;
    draftStartups : Nat;
    totalNFTHolders : Nat;
    totalMonthlyCommitments : Nat;
  };

  public type DashboardOverviewResponse = {
    #Success : DashboardOverview;
    #Error : Text;
  };

  // Dashboard Startup Overview Types
  public type StartupOverview = {
    name : Text;
    companyType : Text;
    location : Text;
    description : Text;
    totalFunded : Nat;
    fundTarget : Nat;
    totalNFTSale : Nat;
    totalNFT : Nat;
    totalTeamMembers : Nat;
  };

  public type StartupOverviewResponse = {
    #Success : StartupOverview;
    #Error : Text;
  };

  // Dashboard Team Members Types
  public type TeamMemberOverview = {
    id : Nat;
    name : Text;
    role : Text;
    background : Text;
    photo : ?Text;
    linkedin : Text;
    email : Text;
    isFounder : Bool;
  };

  public type TeamMembersResponse = {
    #Success : [TeamMemberOverview];
    #Error : Text;
  };

  // Dashboard Funding Status Types
  public type FundingStatus = {
    totalRaised : Nat;
    fundingGoal : Nat;
    progressPercentage : Nat;
    remainingAmount : Nat;
    isFullyFunded : Bool;
    fundingStatus : Text; // "Not Started", "In Progress", "Fully Funded", "Over Funded"
    recentInvestments : [RecentInvestment];
    fundingMilestones : [FundingMilestone];
  };

  public type RecentInvestment = {
    investorName : Text;
    amount : Nat;
    date : Time.Time;
    tokenType : Text;
  };

  public type FundingMilestone = {
    milestone : Text;
    targetAmount : Nat;
    isAchieved : Bool;
    achievedDate : ?Time.Time;
  };

  public type FundingStatusResponse = {
    #Success : FundingStatus;
    #Error : Text;
  };

  // Dashboard Collateral Status Types
  public type CollateralDashboard = {
    startupId : Text;
    requiredAmount : Nat;
    currentAmount : Nat;
    progressPercentage : Nat;
    status : Text; // "Pending", "Active", "Locked", "Released"
    tokenType : Text;
    isFullyPaid : Bool;
    remainingAmount : Nat;
    lockStartTime : ?Time.Time;
    lockEndTime : ?Time.Time;
    topUpHistory : [CollateralTopUpSummary];
    nextPaymentDue : ?Time.Time;
  };

  public type CollateralTopUpSummary = {
    id : Text;
    amount : Nat;
    timestamp : Time.Time;
    status : Text;
    transactionId : ?Text;
  };

  public type CollateralDashboardResponse = {
    #Success : CollateralDashboard;
    #Error : Text;
  };

  // Dashboard Investor Types
  public type InvestorDashboard = {
    totalInvestors : Nat;
    activeInvestors : Nat;
    newInvestorsThisMonth : Nat;
    totalInvestmentAmount : Nat;
    averageInvestmentPerInvestor : Nat;
    topInvestors : [TopInvestor];
    recentInvestments : [RecentInvestmentSummary];
    investorGrowth : [InvestorGrowthData];
  };

  public type TopInvestor = {
    investorId : Text;
    investorName : Text;
    totalInvested : Nat;
    numberOfInvestments : Nat;
    lastInvestmentDate : Time.Time;
    profilePhoto : ?Text;
  };

  public type RecentInvestmentSummary = {
    investorId : Text;
    investorName : Text;
    startupId : Text;
    startupName : Text;
    amount : Nat;
    date : Time.Time;
    tokenType : Text;
  };

  public type InvestorGrowthData = {
    month : Nat;
    year : Nat;
    newInvestors : Nat;
    totalInvestors : Nat;
  };

  public type InvestorDashboardResponse = {
    #Success : InvestorDashboard;
    #Error : Text;
  };

  // Dashboard Investor Service Types
  public type InvestorDashboardOverview = {
    totalInvestments : Nat;
    totalAmountInvested : Nat;
    totalNFTsOwned : Nat;
    uniqueStartupsInvested : Nat;
    averageInvestmentPerStartup : Nat;
    recentInvestments : [InvestorRecentInvestment];
    investmentPortfolio : [InvestorPortfolioItem];
    profitSharingEarnings : Nat;
    monthlyCommitment : Nat;
    votingPending : Nat;
  };

  public type InvestorDashboardOverviewResponse = {
    #Success : InvestorDashboardOverview;
    #Error : Text;
  };

  public type InvestorRecentInvestment = {
    startupId : Text;
    startupName : Text;
    amount : Nat;
    nftPrice : Nat;
    quantity : Nat;
    date : Time.Time;
    status : Text;
  };

  public type InvestorPortfolioItem = {
    startupId : Text;
    startupName : Text;
    totalInvested : Nat;
    nftCount : Nat;
    averagePrice : Nat;
    firstInvestment : Time.Time;
    lastInvestment : Time.Time;
    startupStatus : Text;
  };

  public type InvestorPerformance = {
    totalInvested : Nat;
    totalNFTs : Nat;
    uniqueStartups : Nat;
    averageInvestmentSize : Nat;
    diversificationScore : Nat; // 0-100
    investmentTrend : Text; // "Increasing", "Decreasing", "Stable"
    riskProfile : Text;
    profitSharingEarnings : Nat;
  };

  public type InvestorPerformanceResponse = {
    #Success : InvestorPerformance;
    #Error : Text;
  };

  public type InvestorStartupInvestment = {
    startupId : Text;
    startupName : Text;
    totalInvested : Nat;
    nftCount : Nat;
    averagePrice : Nat;
    firstInvestment : Time.Time;
    lastInvestment : Time.Time;
    startupStatus : Text;
    profitSharingEarnings : Nat;
  };

  public type InvestorStartupInvestmentResponse = {
    #Success : InvestorStartupInvestment;
    #Error : Text;
  };

  // My Investment Portfolio Types
  public type MyInvestmentPortfolio = {
    totalPortfolioValue : Nat;
    totalInvested : Nat;
    totalReturns : Nat;
    returnPercentage : Nat; // Percentage as integer (e.g., 15 for 15%)
    portfolioItems : [PortfolioItem];
    portfolioSummary : PortfolioSummary;
    performanceMetrics : PerformanceMetrics;
  };

  public type PortfolioItem = {
    startupId : Text;
    startupName : Text;
    startupLogo : ?Text;
    sector : Text;
    investedAmount : Nat;
    currentValue : Nat;
    nftCount : Nat;
    returnAmount : Nat;
    returnPercentage : Nat;
    investmentDate : Time.Time;
    lastUpdateDate : Time.Time;
    status : Text; // "Active", "Completed", "Pending"
    profitSharingEarnings : Nat;
    monthlyCommitment : Nat;
  };

  public type PortfolioSummary = {
    totalStartups : Nat;
    activeInvestments : Nat;
    completedInvestments : Nat;
    averageReturn : Nat;
    bestPerformer : ?Text;
    worstPerformer : ?Text;
    totalMonthlyCommitments : Nat;
    totalProfitSharingEarnings : Nat;
  };

  public type PerformanceMetrics = {
    portfolioGrowth : Nat; // Percentage growth
    riskScore : Nat; // 1-10 scale
    diversificationScore : Nat; // 1-10 scale
    investmentTrend : Text; // "Growing", "Stable", "Declining"
    monthlyCommitmentTrend : Text;
    profitSharingTrend : Text;
  };

  public type MyInvestmentPortfolioResponse = {
    #Success : MyInvestmentPortfolio;
    #Error : Text;
  };

};
