import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type BalanceResponse = { 'Error' : string } |
  {
    'Success' : {
      'balance' : bigint,
      'account' : TransferAccount,
      'tokenType' : string,
    }
  };
export interface CollateralDashboard {
  'status' : string,
  'topUpHistory' : Array<CollateralTopUpSummary>,
  'remainingAmount' : bigint,
  'startupId' : string,
  'nextPaymentDue' : [] | [Time],
  'progressPercentage' : bigint,
  'lockEndTime' : [] | [Time],
  'isFullyPaid' : boolean,
  'tokenType' : string,
  'currentAmount' : bigint,
  'requiredAmount' : bigint,
  'lockStartTime' : [] | [Time],
}
export type CollateralDashboardResponse = { 'Error' : string } |
  { 'Success' : CollateralDashboard };
export interface CollateralInfo {
  'status' : CollateralStatus,
  'topUpHistory' : Array<CollateralTopUp>,
  'startupId' : string,
  'lockEndTime' : [] | [Time],
  'createdAt' : Time,
  'updatedAt' : Time,
  'tokenType' : string,
  'currentAmount' : bigint,
  'requiredAmount' : bigint,
  'lockStartTime' : [] | [Time],
}
export interface CollateralProgress {
  'status' : string,
  'isFullyPaid' : boolean,
  'tokenType' : string,
  'currentAmount' : bigint,
  'requiredAmount' : bigint,
  'percentage' : bigint,
}
export type CollateralProgressResponse = { 'Error' : string } |
  { 'Success' : CollateralProgress };
export type CollateralStatus = { 'Active' : null } |
  { 'Released' : null } |
  { 'Locked' : null } |
  { 'Pending' : null };
export interface CollateralTopUp {
  'id' : string,
  'status' : string,
  'startupId' : string,
  'timestamp' : Time,
  'tokenType' : string,
  'amount' : bigint,
  'transactionId' : [] | [string],
}
export interface CollateralTopUpSummary {
  'id' : string,
  'status' : string,
  'timestamp' : Time,
  'amount' : bigint,
  'transactionId' : [] | [string],
}
export interface DashboardOverview {
  'pendingStartups' : bigint,
  'totalFundingRaised' : bigint,
  'activeStartups' : bigint,
  'totalNFTHolders' : bigint,
  'draftStartups' : bigint,
  'totalMonthlyCommitments' : bigint,
}
export type DashboardOverviewResponse = { 'Error' : string } |
  { 'Success' : DashboardOverview };
export interface EnvironmentConfig {
  'nftToken' : NFTConfig,
  'ckUSDCToken' : TokenConfig,
  'environment' : string,
  'plantifyAccount' : string,
  'useTestTokens' : boolean,
  'icpToken' : TokenConfig,
}
export type FeedbackType = { 'Negative' : null } |
  { 'Positive' : null } |
  { 'Neutral' : null };
export interface Founder {
  'id' : string,
  'linkedIn' : string,
  'principal' : Principal,
  'createdAt' : Time,
  'fullName' : string,
  'email' : string,
  'experience' : string,
  'updatedAt' : Time,
  'idNumber' : string,
  'expertise' : string,
  'taxNumber' : string,
  'address' : string,
  'phone' : string,
  'previousBusinesses' : string,
}
export interface FounderRegistrationRequest {
  'linkedIn' : string,
  'fullName' : string,
  'email' : string,
  'experience' : string,
  'idNumber' : string,
  'expertise' : string,
  'taxNumber' : string,
  'address' : string,
  'phone' : string,
  'previousBusinesses' : string,
}
export interface FundingMilestone {
  'achievedDate' : [] | [Time],
  'isAchieved' : boolean,
  'targetAmount' : bigint,
  'milestone' : string,
}
export interface FundingStatus {
  'remainingAmount' : bigint,
  'progressPercentage' : bigint,
  'recentInvestments' : Array<RecentInvestment>,
  'fundingStatus' : string,
  'totalRaised' : bigint,
  'isFullyFunded' : boolean,
  'fundingGoal' : bigint,
  'fundingMilestones' : Array<FundingMilestone>,
}
export type FundingStatusResponse = { 'Error' : string } |
  { 'Success' : FundingStatus };
export interface Investor {
  'id' : string,
  'bio' : [] | [string],
  'occupation' : [] | [string],
  'principal' : Principal,
  'country' : string,
  'riskTolerance' : string,
  'monthlyBudget' : string,
  'city' : string,
  'createdAt' : Time,
  'profilePhoto' : [] | [string],
  'fullName' : string,
  'email' : string,
  'updatedAt' : Time,
  'company' : [] | [string],
  'investmentGoals' : string,
  'availableCapital' : string,
  'phone' : string,
  'investmentExperience' : string,
  'location' : [] | [string],
}
export interface InvestorDashboard {
  'averageInvestmentPerInvestor' : bigint,
  'recentInvestments' : Array<RecentInvestmentSummary>,
  'activeInvestors' : bigint,
  'investorGrowth' : Array<InvestorGrowthData>,
  'topInvestors' : Array<TopInvestor>,
  'newInvestorsThisMonth' : bigint,
  'totalInvestmentAmount' : bigint,
  'totalInvestors' : bigint,
}
export interface InvestorDashboardOverview {
  'averageInvestmentPerStartup' : bigint,
  'uniqueStartupsInvested' : bigint,
  'monthlyCommitment' : bigint,
  'recentInvestments' : Array<InvestorRecentInvestment>,
  'totalAmountInvested' : bigint,
  'totalInvestments' : bigint,
  'totalNFTsOwned' : bigint,
  'votingPending' : bigint,
  'profitSharingEarnings' : bigint,
  'investmentPortfolio' : Array<InvestorPortfolioItem>,
}
export type InvestorDashboardOverviewResponse = { 'Error' : string } |
  { 'Success' : InvestorDashboardOverview };
export type InvestorDashboardResponse = { 'Error' : string } |
  { 'Success' : InvestorDashboard };
export interface InvestorGrowthData {
  'month' : bigint,
  'newInvestors' : bigint,
  'year' : bigint,
  'totalInvestors' : bigint,
}
export interface InvestorPerformance {
  'uniqueStartups' : bigint,
  'averageInvestmentSize' : bigint,
  'investmentTrend' : string,
  'totalInvested' : bigint,
  'diversificationScore' : bigint,
  'totalNFTs' : bigint,
  'profitSharingEarnings' : bigint,
  'riskProfile' : string,
}
export type InvestorPerformanceResponse = { 'Error' : string } |
  { 'Success' : InvestorPerformance };
export interface InvestorPortfolioItem {
  'startupId' : string,
  'totalInvested' : bigint,
  'averagePrice' : bigint,
  'nftCount' : bigint,
  'firstInvestment' : Time,
  'startupStatus' : string,
  'startupName' : string,
  'lastInvestment' : Time,
}
export interface InvestorProfileUpdateRequest {
  'bio' : [] | [string],
  'occupation' : [] | [string],
  'country' : [] | [string],
  'riskTolerance' : [] | [string],
  'monthlyBudget' : [] | [string],
  'city' : [] | [string],
  'profilePhoto' : [] | [string],
  'fullName' : [] | [string],
  'email' : [] | [string],
  'company' : [] | [string],
  'investmentGoals' : [] | [string],
  'availableCapital' : [] | [string],
  'phone' : [] | [string],
  'investmentExperience' : [] | [string],
  'location' : [] | [string],
}
export interface InvestorRecentInvestment {
  'status' : string,
  'startupId' : string,
  'date' : Time,
  'quantity' : bigint,
  'startupName' : string,
  'amount' : bigint,
  'nftPrice' : bigint,
}
export interface InvestorRegistrationRequest {
  'bio' : [] | [string],
  'occupation' : [] | [string],
  'country' : string,
  'riskTolerance' : string,
  'monthlyBudget' : string,
  'city' : string,
  'profilePhoto' : [] | [string],
  'fullName' : string,
  'email' : string,
  'company' : [] | [string],
  'investmentGoals' : string,
  'availableCapital' : string,
  'phone' : string,
  'investmentExperience' : string,
  'location' : [] | [string],
}
export interface InvestorStartupInvestment {
  'startupId' : string,
  'totalInvested' : bigint,
  'averagePrice' : bigint,
  'nftCount' : bigint,
  'firstInvestment' : Time,
  'profitSharingEarnings' : bigint,
  'startupStatus' : string,
  'startupName' : string,
  'lastInvestment' : Time,
}
export type InvestorStartupInvestmentResponse = { 'Error' : string } |
  { 'Success' : InvestorStartupInvestment };
export interface InvestorVote {
  'id' : string,
  'vote' : VoteType,
  'investorId' : string,
  'feedbackType' : [] | [FeedbackType],
  'feedback' : [] | [string],
  'timestamp' : Time,
  'confidence' : bigint,
  'reportId' : string,
}
export interface InvestorVoteHistory {
  'votes' : Array<InvestorVote>,
  'totalVotes' : bigint,
  'averageConfidence' : bigint,
  'approvalRate' : bigint,
}
export interface MintNFTRequest {
  'startupId' : string,
  'metadata' : NFTMetadata,
  'memo' : [] | [string],
  'toAccount' : NFTAccount,
}
export type MintNFTResponse = { 'Error' : string } |
  {
    'Success' : {
      'tokenId' : bigint,
      'startupId' : string,
      'transactionId' : [] | [string],
    }
  };
export interface MonthlyReport {
  'id' : string,
  'status' : MonthlyReportStatus,
  'month' : bigint,
  'revenue' : bigint,
  'startupId' : string,
  'newInvestors' : bigint,
  'approvedAt' : [] | [Time],
  'expenses' : bigint,
  'investorCount' : bigint,
  'createdAt' : Time,
  'year' : bigint,
  'submittedAt' : [] | [Time],
  'profitSharingAmount' : bigint,
  'updatedAt' : Time,
  'profit' : bigint,
}
export interface MonthlyReportList {
  'totalProfitSharing' : bigint,
  'totalReports' : bigint,
  'totalProfit' : bigint,
  'totalExpenses' : bigint,
  'reports' : Array<MonthlyReport>,
  'totalRevenue' : bigint,
}
export interface MonthlyReportRequest {
  'month' : bigint,
  'revenue' : bigint,
  'startupId' : string,
  'newInvestors' : bigint,
  'expenses' : bigint,
  'investorCount' : bigint,
  'year' : bigint,
  'profitSharingAmount' : bigint,
  'profit' : bigint,
}
export interface MonthlyReportStats {
  'bestMonth' : [] | [string],
  'worstMonth' : [] | [string],
  'totalProfitSharing' : bigint,
  'averageMonthlyRevenue' : bigint,
  'averageMonthlyProfit' : bigint,
  'totalReports' : bigint,
  'totalProfit' : bigint,
  'totalExpenses' : bigint,
  'totalRevenue' : bigint,
  'averageMonthlyExpenses' : bigint,
}
export type MonthlyReportStatus = { 'Approved' : null } |
  { 'Draft' : null } |
  { 'Rejected' : null } |
  { 'Submitted' : null };
export interface MyInvestmentPortfolio {
  'portfolioItems' : Array<PortfolioItem>,
  'totalPortfolioValue' : bigint,
  'returnPercentage' : bigint,
  'totalInvested' : bigint,
  'totalReturns' : bigint,
  'performanceMetrics' : PerformanceMetrics,
  'portfolioSummary' : PortfolioSummary,
}
export type MyInvestmentPortfolioResponse = { 'Error' : string } |
  { 'Success' : MyInvestmentPortfolio };
export interface NFTAccount {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export type NFTBalanceResponse = { 'Error' : string } |
  { 'Success' : { 'balance' : bigint, 'account' : NFTAccount } };
export interface NFTConfig {
  'permittedDrift' : bigint,
  'logo' : [] | [string],
  'name' : string,
  'maxQueryBatchSize' : [] | [bigint],
  'description' : string,
  'supplyCap' : [] | [bigint],
  'maxTakeValue' : [] | [bigint],
  'atomicBatchTransfers' : [] | [boolean],
  'maxUpdateBatchSize' : [] | [bigint],
  'defaultTakeValue' : [] | [bigint],
  'maxMemoSize' : bigint,
  'symbol' : string,
  'txWindow' : bigint,
  'canisterId' : string,
}
export interface NFTInfo {
  'tokenId' : bigint,
  'startupId' : string,
  'owner' : NFTAccount,
  'metadata' : NFTMetadata,
  'mintedAt' : Time,
}
export interface NFTMetadata {
  'tokenUri' : string,
  'name' : [] | [string],
  'description' : [] | [string],
  'attributes' : [] | [Array<[string, string]>],
  'image' : [] | [string],
}
export type NFTOwnerResponse = { 'Error' : string } |
  { 'Success' : { 'tokenId' : bigint, 'owner' : [] | [NFTAccount] } };
export interface NFTPurchaseHistory {
  'totalNFTs' : bigint,
  'totalPurchases' : bigint,
  'totalSpent' : bigint,
  'purchases' : Array<NFTPurchaseInfo>,
}
export interface NFTPurchaseInfo {
  'id' : string,
  'status' : string,
  'tokenId' : bigint,
  'startupId' : string,
  'investorId' : string,
  'timestamp' : Time,
  'change' : bigint,
  'amount' : bigint,
  'nftPrice' : bigint,
  'transactionId' : string,
}
export interface NFTPurchaseRequest {
  'startupId' : string,
  'memo' : [] | [string],
  'investorId' : string,
  'quantity' : bigint,
}
export type NFTPurchaseResponse = { 'Error' : string } |
  {
    'Success' : {
      'startupId' : string,
      'tokenIds' : Array<bigint>,
      'investorId' : string,
      'totalAmount' : bigint,
      'quantity' : bigint,
      'nftPrice' : bigint,
      'transactionId' : string,
    }
  };
export interface NFTPurchaseStats {
  'totalNFTsSold' : bigint,
  'totalPurchases' : bigint,
  'topStartup' : [] | [string],
  'averagePurchaseAmount' : bigint,
  'totalRevenue' : bigint,
}
export interface PaginatedStartups {
  'startups' : Array<StartupSummary>,
  'page' : bigint,
  'totalCount' : bigint,
  'limit' : bigint,
  'totalPages' : bigint,
}
export interface PaginationParams { 'page' : bigint, 'limit' : bigint }
export interface PerformanceMetrics {
  'monthlyCommitmentTrend' : string,
  'investmentTrend' : string,
  'profitSharingTrend' : string,
  'diversificationScore' : bigint,
  'riskScore' : bigint,
  'portfolioGrowth' : bigint,
}
export interface PortfolioItem {
  'status' : string,
  'returnAmount' : bigint,
  'startupId' : string,
  'returnPercentage' : bigint,
  'monthlyCommitment' : bigint,
  'nftCount' : bigint,
  'sector' : string,
  'lastUpdateDate' : Time,
  'currentValue' : bigint,
  'profitSharingEarnings' : bigint,
  'investmentDate' : Time,
  'startupLogo' : [] | [string],
  'startupName' : string,
  'investedAmount' : bigint,
}
export interface PortfolioSummary {
  'worstPerformer' : [] | [string],
  'totalProfitSharingEarnings' : bigint,
  'activeInvestments' : bigint,
  'completedInvestments' : bigint,
  'totalStartups' : bigint,
  'bestPerformer' : [] | [string],
  'averageReturn' : bigint,
  'totalMonthlyCommitments' : bigint,
}
export interface RecentInvestment {
  'date' : Time,
  'tokenType' : string,
  'amount' : bigint,
  'investorName' : string,
}
export interface RecentInvestmentSummary {
  'startupId' : string,
  'date' : Time,
  'investorId' : string,
  'tokenType' : string,
  'startupName' : string,
  'amount' : bigint,
  'investorName' : string,
}
export interface ReportVoteDetails {
  'summary' : VoteSummary,
  'individualVotes' : Array<InvestorVote>,
  'reportId' : string,
}
export type Result = { 'ok' : InvestorVote } |
  { 'err' : string };
export type Result_1 = { 'ok' : MonthlyReport } |
  { 'err' : string };
export type Result_10 = { 'ok' : ReportVoteDetails } |
  { 'err' : string };
export type Result_11 = { 'ok' : NFTPurchaseInfo } |
  { 'err' : string };
export type Result_12 = { 'ok' : Array<NFTInfo> } |
  { 'err' : string };
export type Result_13 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_14 = { 'ok' : NFTOwnerResponse } |
  { 'err' : string };
export type Result_15 = { 'ok' : NFTInfo } |
  { 'err' : string };
export type Result_16 = { 'ok' : NFTBalanceResponse } |
  { 'err' : string };
export type Result_17 = { 'ok' : MonthlyReportList } |
  { 'err' : string };
export type Result_18 = { 'ok' : InvestorVoteHistory } |
  { 'err' : string };
export type Result_19 = { 'ok' : [] | [InvestorVote] } |
  { 'err' : string };
export type Result_2 = { 'ok' : Investor } |
  { 'err' : string };
export type Result_20 = { 'ok' : Array<CollateralTopUp> } |
  { 'err' : string };
export type Result_21 = { 'ok' : CollateralInfo } |
  { 'err' : string };
export type Result_22 = { 'ok' : Startup } |
  { 'err' : string };
export type Result_23 = {
    'ok' : { 'expiresAt' : [] | [bigint], 'allowance' : bigint }
  } |
  { 'err' : string };
export type Result_24 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_3 = { 'ok' : TransferNFTResponse } |
  { 'err' : string };
export type Result_4 = { 'ok' : TopUpResponse } |
  { 'err' : string };
export type Result_5 = { 'ok' : Founder } |
  { 'err' : string };
export type Result_6 = { 'ok' : string } |
  { 'err' : string };
export type Result_7 = { 'ok' : MintNFTResponse } |
  { 'err' : string };
export type Result_8 = { 'ok' : VoteSummary } |
  { 'err' : string };
export type Result_9 = { 'ok' : NFTPurchaseHistory } |
  { 'err' : string };
export interface Startup {
  'id' : string,
  'status' : string,
  'periodicProfitSharing' : string,
  'foundedYear' : string,
  'competitiveAdvantage' : string,
  'totalFunded' : bigint,
  'createdAt' : Time,
  'businessPlan' : [] | [string],
  'description' : string,
  'sector' : string,
  'useOfFunds' : string,
  'website' : string,
  'teamMembers' : Array<TeamMember>,
  'targetMarket' : string,
  'updatedAt' : Time,
  'revenueModel' : string,
  'solution' : string,
  'builtByCaffeineAI' : [] | [boolean],
  'companyLogo' : [] | [string],
  'founderId' : string,
  'companyType' : string,
  'financialProjections' : [] | [string],
  'marketingStrategy' : string,
  'startupName' : string,
  'fundingGoal' : string,
  'legalDocuments' : [] | [string],
  'monthlyRevenue' : string,
  'operationalProcess' : string,
  'companyImages' : Array<string>,
  'nftImage' : [] | [string],
  'advisors' : string,
  'nftPrice' : string,
  'location' : string,
  'monthlyExpenses' : string,
  'problemStatement' : string,
  'founderBackground' : string,
}
export interface StartupCreationRequest {
  'status' : string,
  'periodicProfitSharing' : string,
  'foundedYear' : string,
  'competitiveAdvantage' : string,
  'businessPlan' : [] | [string],
  'description' : string,
  'sector' : string,
  'useOfFunds' : string,
  'website' : string,
  'teamMembers' : Array<TeamMember>,
  'targetMarket' : string,
  'revenueModel' : string,
  'solution' : string,
  'builtByCaffeineAI' : [] | [boolean],
  'companyLogo' : [] | [string],
  'companyType' : string,
  'financialProjections' : [] | [string],
  'marketingStrategy' : string,
  'startupName' : string,
  'fundingGoal' : string,
  'legalDocuments' : [] | [string],
  'monthlyRevenue' : string,
  'operationalProcess' : string,
  'companyImages' : Array<string>,
  'nftImage' : [] | [string],
  'advisors' : string,
  'nftPrice' : string,
  'location' : string,
  'monthlyExpenses' : string,
  'problemStatement' : string,
  'founderBackground' : string,
}
export interface StartupOverview {
  'totalNFTSale' : bigint,
  'totalFunded' : bigint,
  'name' : string,
  'description' : string,
  'totalNFT' : bigint,
  'totalTeamMembers' : bigint,
  'fundTarget' : bigint,
  'companyType' : string,
  'location' : string,
}
export type StartupOverviewResponse = { 'Error' : string } |
  { 'Success' : StartupOverview };
export interface StartupSummary {
  'id' : string,
  'totalFunded' : bigint,
  'description' : string,
  'availableNFTs' : bigint,
  'totalFunding' : string,
  'builtByCaffeineAI' : [] | [boolean],
  'companyType' : string,
  'startupName' : string,
  'companyImages' : Array<string>,
  'nftPrice' : string,
  'location' : string,
}
export interface TeamMember {
  'id' : bigint,
  'linkedin' : string,
  'background' : string,
  'name' : string,
  'role' : string,
  'email' : string,
  'isFounder' : boolean,
  'photo' : [] | [string],
}
export interface TeamMemberOverview {
  'id' : bigint,
  'linkedin' : string,
  'background' : string,
  'name' : string,
  'role' : string,
  'email' : string,
  'isFounder' : boolean,
  'photo' : [] | [string],
}
export type TeamMembersResponse = { 'Error' : string } |
  { 'Success' : Array<TeamMemberOverview> };
export type Time = bigint;
export interface TokenConfig {
  'fee' : bigint,
  'decimals' : number,
  'ledgerId' : string,
  'name' : string,
  'symbol' : string,
  'canisterId' : string,
}
export type TokenInfoResponse = { 'Error' : string } |
  {
    'Success' : {
      'fee' : bigint,
      'decimals' : number,
      'name' : string,
      'tokenType' : string,
      'symbol' : string,
    }
  };
export interface TopInvestor {
  'numberOfInvestments' : bigint,
  'totalInvested' : bigint,
  'profilePhoto' : [] | [string],
  'investorId' : string,
  'lastInvestmentDate' : Time,
  'investorName' : string,
}
export interface TopUpRequest {
  'startupId' : string,
  'memo' : [] | [string],
  'tokenType' : string,
  'amount' : bigint,
}
export type TopUpResponse = { 'Error' : string } |
  {
    'Success' : {
      'remainingAmount' : bigint,
      'newTotal' : bigint,
      'isFullyPaid' : boolean,
      'tokenType' : string,
      'amount' : bigint,
      'topUpId' : string,
      'transactionId' : string,
    }
  };
export interface TransferAccount {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface TransferArgs {
  'memo' : [] | [string],
  'tokenType' : string,
  'toAccount' : TransferAccount,
  'amount' : bigint,
}
export interface TransferNFTRequest {
  'tokenId' : bigint,
  'memo' : [] | [string],
  'toAccount' : NFTAccount,
}
export type TransferNFTResponse = { 'Error' : string } |
  { 'Success' : { 'tokenId' : bigint, 'transactionId' : [] | [string] } };
export type TransferResponse = { 'Error' : string } |
  {
    'Success' : {
      'blockIndex' : bigint,
      'tokenType' : string,
      'toAccount' : TransferAccount,
      'amount' : bigint,
      'transactionId' : string,
    }
  };
export type UserType = { 'Founder' : null } |
  { 'Investor' : null };
export interface VoteRequest {
  'vote' : VoteType,
  'feedbackType' : [] | [FeedbackType],
  'feedback' : [] | [string],
  'confidence' : bigint,
  'reportId' : string,
}
export interface VoteSummary {
  'totalVotes' : bigint,
  'averageConfidence' : bigint,
  'rejectVotes' : bigint,
  'approvalRate' : bigint,
  'approveVotes' : bigint,
  'lastVoteTime' : [] | [Time],
  'positiveFeedback' : bigint,
  'abstainVotes' : bigint,
  'reportId' : string,
  'negativeFeedback' : bigint,
  'neutralFeedback' : bigint,
}
export type VoteType = { 'Approve' : null } |
  { 'Reject' : null } |
  { 'Abstain' : null };
export interface VotingStats {
  'totalVotes' : bigint,
  'mostActiveInvestor' : [] | [string],
  'averageApprovalRate' : bigint,
  'averageConfidence' : bigint,
  'totalReportsVoted' : bigint,
}
export interface _SERVICE {
  'approveMonthlyReport' : ActorMethod<[string], Result_1>,
  'calculateRequiredCollateral' : ActorMethod<[bigint, string], bigint>,
  'canInvestorVote' : ActorMethod<[string], Result_24>,
  'canMintNFT' : ActorMethod<[string], Result_24>,
  'canPurchaseNFT' : ActorMethod<[string, string], Result_24>,
  'castVote' : ActorMethod<[VoteRequest], Result>,
  'checkAllowance' : ActorMethod<[string], Result_23>,
  'completeNFTPurchase' : ActorMethod<
    [NFTPurchaseRequest, bigint],
    NFTPurchaseResponse
  >,
  'createMonthlyReport' : ActorMethod<[MonthlyReportRequest], Result_1>,
  'createStartup' : ActorMethod<[StartupCreationRequest], Result_22>,
  'createStartupForFounder' : ActorMethod<
    [string, StartupCreationRequest],
    Result_22
  >,
  'getAllCollateralInfo' : ActorMethod<[], Array<CollateralInfo>>,
  'getAllMonthlyReports' : ActorMethod<[], Array<MonthlyReport>>,
  'getAllNFTs' : ActorMethod<[], Array<NFTInfo>>,
  'getAllPurchases' : ActorMethod<[], Array<NFTPurchaseInfo>>,
  'getAllStartups' : ActorMethod<[], Array<Startup>>,
  'getAllVotes' : ActorMethod<[], Array<InvestorVote>>,
  'getBalance' : ActorMethod<[TransferAccount, string], BalanceResponse>,
  'getCanisterVersion' : ActorMethod<[], bigint>,
  'getCkUSDCBalance' : ActorMethod<[TransferAccount], BalanceResponse>,
  'getCkUSDCTokenConfig' : ActorMethod<[], TokenConfig>,
  'getCollateralDashboard' : ActorMethod<[string], CollateralDashboardResponse>,
  'getCollateralProgress' : ActorMethod<[string], CollateralProgressResponse>,
  'getCollateralStatus' : ActorMethod<[string], Result_21>,
  'getCollateralTopUpHistory' : ActorMethod<[string], Result_20>,
  'getEnvironment' : ActorMethod<[], string>,
  'getEnvironmentConfig' : ActorMethod<[], EnvironmentConfig>,
  'getFeaturedStartup' : ActorMethod<[], [] | [Startup]>,
  'getFounderByPrincipal' : ActorMethod<[], [] | [Founder]>,
  'getFounderDashboardOverview' : ActorMethod<[], DashboardOverviewResponse>,
  'getFounderStartupOverview' : ActorMethod<[string], StartupOverviewResponse>,
  'getFounders' : ActorMethod<[], Array<Founder>>,
  'getFundingStatus' : ActorMethod<[string], FundingStatusResponse>,
  'getICPBalance' : ActorMethod<[TransferAccount], BalanceResponse>,
  'getICPTokenConfig' : ActorMethod<[], TokenConfig>,
  'getInvestorByPrincipal' : ActorMethod<[], [] | [Investor]>,
  'getInvestorDashboard' : ActorMethod<[], InvestorDashboardResponse>,
  'getInvestorDashboardOverview' : ActorMethod<
    [],
    InvestorDashboardOverviewResponse
  >,
  'getInvestorPerformance' : ActorMethod<[], InvestorPerformanceResponse>,
  'getInvestorProfile' : ActorMethod<[], [] | [Investor]>,
  'getInvestorPurchaseHistory' : ActorMethod<[string], Result_9>,
  'getInvestorStartupInvestment' : ActorMethod<
    [string],
    InvestorStartupInvestmentResponse
  >,
  'getInvestorVoteForReport' : ActorMethod<[string], Result_19>,
  'getInvestorVoteHistory' : ActorMethod<[string], Result_18>,
  'getInvestors' : ActorMethod<[], Array<Investor>>,
  'getMonthlyReport' : ActorMethod<[string], Result_1>,
  'getMonthlyReportStats' : ActorMethod<[], MonthlyReportStats>,
  'getMonthlyReportsByStartup' : ActorMethod<[string], Result_17>,
  'getMonthlyReportsByStatus' : ActorMethod<
    [MonthlyReportStatus],
    Array<MonthlyReport>
  >,
  'getMyInvestmentPortfolio' : ActorMethod<[], MyInvestmentPortfolioResponse>,
  'getNFTBalance' : ActorMethod<[NFTAccount], Result_16>,
  'getNFTInfo' : ActorMethod<[bigint], Result_15>,
  'getNFTOwner' : ActorMethod<[bigint], Result_14>,
  'getNFTPrice' : ActorMethod<[string], Result_13>,
  'getNFTStats' : ActorMethod<
    [],
    { 'totalSupply' : bigint, 'totalStartups' : bigint, 'nextTokenId' : bigint }
  >,
  'getNFTsByStartup' : ActorMethod<[string], Result_12>,
  'getPlantifyAccount' : ActorMethod<[], string>,
  'getPlantifyCanisterPrincipal' : ActorMethod<[], string>,
  'getPurchaseInfo' : ActorMethod<[string], Result_11>,
  'getPurchaseStats' : ActorMethod<[], NFTPurchaseStats>,
  'getReportVoteDetails' : ActorMethod<[string], Result_10>,
  'getReportVotes' : ActorMethod<[string], Array<InvestorVote>>,
  'getStartupDetails' : ActorMethod<[string], [] | [Startup]>,
  'getStartupPurchaseHistory' : ActorMethod<[string], Result_9>,
  'getStartupTeamMembers' : ActorMethod<[string], TeamMembersResponse>,
  'getStartupsByFounderNameAndId' : ActorMethod<
    [string, string],
    Array<Startup>
  >,
  'getStartupsByFounderPrincipal' : ActorMethod<[], Array<Startup>>,
  'getStartupsByFounderPrincipalPaginated' : ActorMethod<
    [PaginationParams],
    PaginatedStartups
  >,
  'getStartupsCount' : ActorMethod<[], bigint>,
  'getStartupsPaginated' : ActorMethod<[PaginationParams], PaginatedStartups>,
  'getTokenCanisterId' : ActorMethod<[string], [] | [string]>,
  'getTokenInfo' : ActorMethod<[string], TokenInfoResponse>,
  'getUserType' : ActorMethod<[], [] | [UserType]>,
  'getVoteSummary' : ActorMethod<[string], Result_8>,
  'getVotingStats' : ActorMethod<[], VotingStats>,
  'initializeCollateral' : ActorMethod<[string, bigint, string], Result_6>,
  'isUserFounder' : ActorMethod<[], boolean>,
  'isUserInvestor' : ActorMethod<[], boolean>,
  'isUsingTestTokens' : ActorMethod<[], boolean>,
  'mintNFT' : ActorMethod<[MintNFTRequest], Result_7>,
  'mintNFTForStartup' : ActorMethod<[string], Result_6>,
  'purchaseNFT' : ActorMethod<[NFTPurchaseRequest], NFTPurchaseResponse>,
  'registerFounder' : ActorMethod<[FounderRegistrationRequest], Result_5>,
  'registerInvestor' : ActorMethod<[InvestorRegistrationRequest], Result_2>,
  'rejectMonthlyReport' : ActorMethod<[string], Result_1>,
  'submitMonthlyReport' : ActorMethod<[string], Result_1>,
  'topUpCollateral' : ActorMethod<[TopUpRequest], Result_4>,
  'transferCkUSDC' : ActorMethod<
    [TransferAccount, bigint, [] | [string]],
    TransferResponse
  >,
  'transferICP' : ActorMethod<
    [TransferAccount, bigint, [] | [string]],
    TransferResponse
  >,
  'transferNFT' : ActorMethod<[TransferNFTRequest], Result_3>,
  'transferTokens' : ActorMethod<[TransferArgs], TransferResponse>,
  'updateInvestorProfile' : ActorMethod<
    [InvestorProfileUpdateRequest],
    Result_2
  >,
  'updateMonthlyReport' : ActorMethod<[string, MonthlyReportRequest], Result_1>,
  'updateStartupStatus' : ActorMethod<[string, string], boolean>,
  'updateVote' : ActorMethod<[string, VoteRequest], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
