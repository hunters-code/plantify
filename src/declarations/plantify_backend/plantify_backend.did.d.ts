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
export interface Investor {
  'id' : string,
  'principal' : Principal,
  'country' : string,
  'riskTolerance' : string,
  'monthlyBudget' : string,
  'city' : string,
  'createdAt' : Time,
  'fullName' : string,
  'email' : string,
  'updatedAt' : Time,
  'investmentGoals' : string,
  'availableCapital' : string,
  'phone' : string,
  'investmentExperience' : string,
}
export interface InvestorRegistrationRequest {
  'country' : string,
  'riskTolerance' : string,
  'monthlyBudget' : string,
  'city' : string,
  'fullName' : string,
  'email' : string,
  'investmentGoals' : string,
  'availableCapital' : string,
  'phone' : string,
  'investmentExperience' : string,
}
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
  'amount' : bigint,
}
export type NFTPurchaseResponse = { 'Error' : string } |
  {
    'Success' : {
      'tokenId' : bigint,
      'startupId' : string,
      'investorId' : string,
      'change' : bigint,
      'amount' : bigint,
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
export interface ReportVoteDetails {
  'summary' : VoteSummary,
  'individualVotes' : Array<InvestorVote>,
  'reportId' : string,
}
export type Result = { 'ok' : InvestorVote } |
  { 'err' : string };
export type Result_1 = { 'ok' : MonthlyReport } |
  { 'err' : string };
export type Result_10 = { 'ok' : NFTPurchaseHistory } |
  { 'err' : string };
export type Result_11 = { 'ok' : ReportVoteDetails } |
  { 'err' : string };
export type Result_12 = { 'ok' : NFTPurchaseInfo } |
  { 'err' : string };
export type Result_13 = { 'ok' : Array<NFTInfo> } |
  { 'err' : string };
export type Result_14 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_15 = { 'ok' : NFTOwnerResponse } |
  { 'err' : string };
export type Result_16 = { 'ok' : NFTInfo } |
  { 'err' : string };
export type Result_17 = { 'ok' : NFTBalanceResponse } |
  { 'err' : string };
export type Result_18 = { 'ok' : MonthlyReportList } |
  { 'err' : string };
export type Result_19 = { 'ok' : InvestorVoteHistory } |
  { 'err' : string };
export type Result_2 = { 'ok' : TransferNFTResponse } |
  { 'err' : string };
export type Result_20 = { 'ok' : [] | [InvestorVote] } |
  { 'err' : string };
export type Result_21 = { 'ok' : Array<CollateralTopUp> } |
  { 'err' : string };
export type Result_22 = { 'ok' : CollateralInfo } |
  { 'err' : string };
export type Result_23 = { 'ok' : Startup } |
  { 'err' : string };
export type Result_24 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_3 = { 'ok' : TopUpResponse } |
  { 'err' : string };
export type Result_4 = { 'ok' : Investor } |
  { 'err' : string };
export type Result_5 = { 'ok' : Founder } |
  { 'err' : string };
export type Result_6 = { 'ok' : NFTPurchaseResponse } |
  { 'err' : string };
export type Result_7 = { 'ok' : string } |
  { 'err' : string };
export type Result_8 = { 'ok' : MintNFTResponse } |
  { 'err' : string };
export type Result_9 = { 'ok' : VoteSummary } |
  { 'err' : string };
export interface Startup {
  'id' : string,
  'status' : string,
  'periodicProfitSharing' : string,
  'foundedYear' : string,
  'competitiveAdvantage' : string,
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
  'createMonthlyReport' : ActorMethod<[MonthlyReportRequest], Result_1>,
  'createStartup' : ActorMethod<[StartupCreationRequest], Result_23>,
  'createStartupForFounder' : ActorMethod<
    [string, StartupCreationRequest],
    Result_23
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
  'getCollateralProgress' : ActorMethod<[string], CollateralProgressResponse>,
  'getCollateralStatus' : ActorMethod<[string], Result_22>,
  'getCollateralTopUpHistory' : ActorMethod<[string], Result_21>,
  'getCollectionInfo' : ActorMethod<[], NFTConfig>,
  'getEnvironment' : ActorMethod<[], string>,
  'getEnvironmentConfig' : ActorMethod<[], EnvironmentConfig>,
  'getFeaturedStartup' : ActorMethod<[], [] | [Startup]>,
  'getFounderByPrincipal' : ActorMethod<[], [] | [Founder]>,
  'getFounders' : ActorMethod<[], Array<Founder>>,
  'getICPBalance' : ActorMethod<[TransferAccount], BalanceResponse>,
  'getICPTokenConfig' : ActorMethod<[], TokenConfig>,
  'getInvestorByPrincipal' : ActorMethod<[], [] | [Investor]>,
  'getInvestorPurchaseHistory' : ActorMethod<[string], Result_10>,
  'getInvestorVoteForReport' : ActorMethod<[string], Result_20>,
  'getInvestorVoteHistory' : ActorMethod<[string], Result_19>,
  'getInvestors' : ActorMethod<[], Array<Investor>>,
  'getMonthlyReport' : ActorMethod<[string], Result_1>,
  'getMonthlyReportStats' : ActorMethod<[], MonthlyReportStats>,
  'getMonthlyReportsByStartup' : ActorMethod<[string], Result_18>,
  'getMonthlyReportsByStatus' : ActorMethod<
    [MonthlyReportStatus],
    Array<MonthlyReport>
  >,
  'getNFTBalance' : ActorMethod<[NFTAccount], Result_17>,
  'getNFTInfo' : ActorMethod<[bigint], Result_16>,
  'getNFTOwner' : ActorMethod<[bigint], Result_15>,
  'getNFTPrice' : ActorMethod<[string], Result_14>,
  'getNFTStats' : ActorMethod<
    [],
    { 'totalSupply' : bigint, 'totalStartups' : bigint, 'nextTokenId' : bigint }
  >,
  'getNFTsByStartup' : ActorMethod<[string], Result_13>,
  'getPlantifyAccount' : ActorMethod<[], string>,
  'getPurchaseInfo' : ActorMethod<[string], Result_12>,
  'getPurchaseStats' : ActorMethod<[], NFTPurchaseStats>,
  'getReportVoteDetails' : ActorMethod<[string], Result_11>,
  'getReportVotes' : ActorMethod<[string], Array<InvestorVote>>,
  'getStartupDetails' : ActorMethod<[string], [] | [Startup]>,
  'getStartupPurchaseHistory' : ActorMethod<[string], Result_10>,
  'getTokenCanisterId' : ActorMethod<[string], [] | [string]>,
  'getTokenInfo' : ActorMethod<[string], TokenInfoResponse>,
  'getUserType' : ActorMethod<[], [] | [UserType]>,
  'getVoteSummary' : ActorMethod<[string], Result_9>,
  'getVotingStats' : ActorMethod<[], VotingStats>,
  'initializeCollateral' : ActorMethod<[string, bigint, string], Result_7>,
  'isUserFounder' : ActorMethod<[], boolean>,
  'isUserInvestor' : ActorMethod<[], boolean>,
  'isUsingTestTokens' : ActorMethod<[], boolean>,
  'mintNFT' : ActorMethod<[MintNFTRequest], Result_8>,
  'mintNFTForStartup' : ActorMethod<[string], Result_7>,
  'purchaseNFT' : ActorMethod<[NFTPurchaseRequest], Result_6>,
  'registerFounder' : ActorMethod<[FounderRegistrationRequest], Result_5>,
  'registerInvestor' : ActorMethod<[InvestorRegistrationRequest], Result_4>,
  'rejectMonthlyReport' : ActorMethod<[string], Result_1>,
  'submitMonthlyReport' : ActorMethod<[string], Result_1>,
  'topUpCollateral' : ActorMethod<[TopUpRequest], Result_3>,
  'transferCkUSDC' : ActorMethod<
    [TransferAccount, bigint, [] | [string]],
    TransferResponse
  >,
  'transferICP' : ActorMethod<
    [TransferAccount, bigint, [] | [string]],
    TransferResponse
  >,
  'transferNFT' : ActorMethod<[TransferNFTRequest], Result_2>,
  'transferTokens' : ActorMethod<[TransferArgs], TransferResponse>,
  'updateMonthlyReport' : ActorMethod<[string, MonthlyReportRequest], Result_1>,
  'updateStartupStatus' : ActorMethod<[string, string], boolean>,
  'updateVote' : ActorMethod<[string, VoteRequest], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
