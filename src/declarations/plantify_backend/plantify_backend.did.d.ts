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
export type Result = { 'ok' : TransferNFTResponse } |
  { 'err' : string };
export type Result_1 = { 'ok' : TopUpResponse } |
  { 'err' : string };
export type Result_10 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_11 = { 'ok' : NFTOwnerResponse } |
  { 'err' : string };
export type Result_12 = { 'ok' : NFTInfo } |
  { 'err' : string };
export type Result_13 = { 'ok' : NFTBalanceResponse } |
  { 'err' : string };
export type Result_14 = { 'ok' : Array<CollateralTopUp> } |
  { 'err' : string };
export type Result_15 = { 'ok' : CollateralInfo } |
  { 'err' : string };
export type Result_16 = { 'ok' : Startup } |
  { 'err' : string };
export type Result_17 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_2 = { 'ok' : Investor } |
  { 'err' : string };
export type Result_3 = { 'ok' : Founder } |
  { 'err' : string };
export type Result_4 = { 'ok' : NFTPurchaseResponse } |
  { 'err' : string };
export type Result_5 = { 'ok' : string } |
  { 'err' : string };
export type Result_6 = { 'ok' : MintNFTResponse } |
  { 'err' : string };
export type Result_7 = { 'ok' : NFTPurchaseHistory } |
  { 'err' : string };
export type Result_8 = { 'ok' : NFTPurchaseInfo } |
  { 'err' : string };
export type Result_9 = { 'ok' : Array<NFTInfo> } |
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
export interface _SERVICE {
  'calculateRequiredCollateral' : ActorMethod<[bigint, string], bigint>,
  'canMintNFT' : ActorMethod<[string], Result_17>,
  'canPurchaseNFT' : ActorMethod<[string, string], Result_17>,
  'createStartup' : ActorMethod<[StartupCreationRequest], Result_16>,
  'createStartupForFounder' : ActorMethod<
    [string, StartupCreationRequest],
    Result_16
  >,
  'getAllCollateralInfo' : ActorMethod<[], Array<CollateralInfo>>,
  'getAllNFTs' : ActorMethod<[], Array<NFTInfo>>,
  'getAllPurchases' : ActorMethod<[], Array<NFTPurchaseInfo>>,
  'getAllStartups' : ActorMethod<[], Array<Startup>>,
  'getBalance' : ActorMethod<[TransferAccount, string], BalanceResponse>,
  'getCkUSDCBalance' : ActorMethod<[TransferAccount], BalanceResponse>,
  'getCkUSDCTokenConfig' : ActorMethod<[], TokenConfig>,
  'getCollateralProgress' : ActorMethod<[string], CollateralProgressResponse>,
  'getCollateralStatus' : ActorMethod<[string], Result_15>,
  'getCollateralTopUpHistory' : ActorMethod<[string], Result_14>,
  'getCollectionInfo' : ActorMethod<[], NFTConfig>,
  'getEnvironment' : ActorMethod<[], string>,
  'getEnvironmentConfig' : ActorMethod<[], EnvironmentConfig>,
  'getFounderByPrincipal' : ActorMethod<[], [] | [Founder]>,
  'getFounders' : ActorMethod<[], Array<Founder>>,
  'getICPBalance' : ActorMethod<[TransferAccount], BalanceResponse>,
  'getICPTokenConfig' : ActorMethod<[], TokenConfig>,
  'getInvestorByPrincipal' : ActorMethod<[], [] | [Investor]>,
  'getInvestorPurchaseHistory' : ActorMethod<[string], Result_7>,
  'getInvestors' : ActorMethod<[], Array<Investor>>,
  'getNFTBalance' : ActorMethod<[NFTAccount], Result_13>,
  'getNFTInfo' : ActorMethod<[bigint], Result_12>,
  'getNFTOwner' : ActorMethod<[bigint], Result_11>,
  'getNFTPrice' : ActorMethod<[string], Result_10>,
  'getNFTStats' : ActorMethod<
    [],
    { 'totalSupply' : bigint, 'totalStartups' : bigint, 'nextTokenId' : bigint }
  >,
  'getNFTsByStartup' : ActorMethod<[string], Result_9>,
  'getPlantifyAccount' : ActorMethod<[], string>,
  'getPurchaseInfo' : ActorMethod<[string], Result_8>,
  'getPurchaseStats' : ActorMethod<[], NFTPurchaseStats>,
  'getStartupDetails' : ActorMethod<[string], [] | [Startup]>,
  'getStartupPurchaseHistory' : ActorMethod<[string], Result_7>,
  'getTokenCanisterId' : ActorMethod<[string], [] | [string]>,
  'getTokenInfo' : ActorMethod<[string], TokenInfoResponse>,
  'getUserType' : ActorMethod<[], [] | [UserType]>,
  'initializeCollateral' : ActorMethod<[string, bigint, string], Result_5>,
  'isUserFounder' : ActorMethod<[], boolean>,
  'isUserInvestor' : ActorMethod<[], boolean>,
  'isUsingTestTokens' : ActorMethod<[], boolean>,
  'mintNFT' : ActorMethod<[MintNFTRequest], Result_6>,
  'mintNFTForStartup' : ActorMethod<[string], Result_5>,
  'purchaseNFT' : ActorMethod<[NFTPurchaseRequest], Result_4>,
  'registerFounder' : ActorMethod<[FounderRegistrationRequest], Result_3>,
  'registerInvestor' : ActorMethod<[InvestorRegistrationRequest], Result_2>,
  'topUpCollateral' : ActorMethod<[TopUpRequest], Result_1>,
  'transferCkUSDC' : ActorMethod<
    [TransferAccount, bigint, [] | [string]],
    TransferResponse
  >,
  'transferICP' : ActorMethod<
    [TransferAccount, bigint, [] | [string]],
    TransferResponse
  >,
  'transferNFT' : ActorMethod<[TransferNFTRequest], Result>,
  'transferTokens' : ActorMethod<[TransferArgs], TransferResponse>,
  'updateStartupStatus' : ActorMethod<[string, string], boolean>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
