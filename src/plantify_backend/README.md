# Plantify Backend API Documentation

## Overview

Plantify is a decentralized platform that connects startups with investors through NFT-based ownership shares. The backend is built on the Internet Computer Protocol (ICP) using Motoko and provides comprehensive APIs for user registration, startup management, token transfers, NFT operations, monthly reporting, and voting systems.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [User Registration](#user-registration)
4. [Startup Management](#startup-management)
5. [Token Operations](#token-operations)
6. [Collateral Management](#collateral-management)
7. [NFT Operations](#nft-operations)
8. [Monthly Reports](#monthly-reports)
9. [Voting System](#voting-system)
10. [Configuration](#configuration)

## Getting Started

### Prerequisites

- Internet Computer SDK (dfx)
- Motoko compiler
- ICP wallet with test tokens (for development)

### Deployment

```bash
# Deploy to local replica
dfx deploy --no-wallet

# Deploy to testnet
dfx deploy --network testnet --no-wallet

# Deploy to mainnet
dfx deploy --network ic --no-wallet
```

### Environment Configuration

The backend supports three environments:
- **Development**: Local replica with test tokens
- **Testnet**: ICP testnet with test tokens
- **Production**: Mainnet with real tokens

## Authentication

All API calls require authentication through ICP's principal system. The backend automatically identifies users through their principal ID.

### Get Current User
```motoko
public shared (msg) func whoami() : async Principal
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend whoami
```

### Get User Type
```motoko
public shared (msg) func getUserType() : async ?UserType
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend getUserType
```

### Check User Roles
```motoko
public shared (msg) func isUserFounder() : async Bool
public shared (msg) func isUserInvestor() : async Bool
```

**ICP Terminal Calls:**
```bash
dfx canister call plantify_backend isUserFounder
dfx canister call plantify_backend isUserInvestor
```

## User Registration

### Register as Founder

```motoko
public shared (msg) func registerFounder(request : FounderRegistrationRequest) : async Result.Result<Founder, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend registerFounder '(
  record {
    fullName = "John Doe";
    email = "john@example.com";
    phone = "+1234567890";
    address = "123 Main St, City, Country";
    experience = "5 years in tech";
    previousBusinesses = "Tech startup";
    expertise = "Software development";
    linkedIn = "https://linkedin.com/in/johndoe";
    idNumber = "123456789";
    taxNumber = "TAX123456";
  }
)'
```

**Request Type:**
```motoko
type FounderRegistrationRequest = {
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
```

### Register as Investor

```motoko
public shared (msg) func registerInvestor(request : InvestorRegistrationRequest) : async Result.Result<Investor, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend registerInvestor '(
  record {
    fullName = "Jane Smith";
    email = "jane@example.com";
    phone = "+1987654321";
    country = "United States";
    city = "New York";
    investmentExperience = "3 years";
    riskTolerance = "Medium";
    investmentGoals = "Long-term growth";
    availableCapital = "100000";
    monthlyBudget = "5000";
  }
)'
```

**Request Type:**
```motoko
type InvestorRegistrationRequest = {
  fullName : Text;
  email : Text;
  phone : Text;
  country : Text;
  city : Text;
  investmentExperience : Text;
  riskTolerance : Text;
  investmentGoals : Text;
  availableCapital : Text;
  monthlyBudget : Text;
};
```

### Get User Information

```motoko
public shared (msg) func getFounderByPrincipal() : async ?Founder
public shared (msg) func getInvestorByPrincipal() : async ?Investor
public shared func getFounders() : async [Founder]
public shared func getInvestors() : async [Investor]
```

**ICP Terminal Calls:**
```bash
# Get current user's founder profile
dfx canister call plantify_backend getFounderByPrincipal

# Get current user's investor profile
dfx canister call plantify_backend getInvestorByPrincipal

# Get all founders (public)
dfx canister call plantify_backend getFounders

# Get all investors (public)
dfx canister call plantify_backend getInvestors
```

## Startup Management

### Create Startup

```motoko
public shared (msg) func createStartup(request : StartupCreationRequest) : async Result.Result<Startup, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend createStartup '(
  record {
    startupName = "TechCorp";
    sector = "Technology";
    foundedYear = "2023";
    description = "Innovative tech solution";
    website = "https://techcorp.com";
    location = "San Francisco, CA";
    companyType = "LLC";
    companyLogo = opt "https://techcorp.com/logo.png";
    companyImages = vec {};
    nftImage = opt "https://techcorp.com/nft.png";
    problemStatement = "Current solutions are inefficient";
    solution = "Our platform solves this";
    targetMarket = "Small businesses";
    competitiveAdvantage = "Unique algorithm";
    marketingStrategy = "Digital marketing";
    operationalProcess = "Agile development";
    founderBackground = "Tech entrepreneur";
    teamMembers = vec {};
    advisors = "Industry experts";
    fundingGoal = "1000000";
    nftPrice = "100";
    periodicProfitSharing = "10";
    revenueModel = "Subscription";
    monthlyRevenue = "50000";
    monthlyExpenses = "30000";
    useOfFunds = "Product development";
    businessPlan = opt "https://techcorp.com/plan.pdf";
    financialProjections = opt "https://techcorp.com/projections.pdf";
    legalDocuments = opt "https://techcorp.com/legal.pdf";
    status = "Active";
  }
)'
```

**Request Type:**
```motoko
type StartupCreationRequest = {
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
};
```

### Get Startup Information

```motoko
public shared func getAllStartups() : async [Startup]
public shared func getStartupDetails(startupId : Text) : async ?Startup
```

**ICP Terminal Calls:**
```bash
# Get all startups (public)
dfx canister call plantify_backend getAllStartups

# Get specific startup details
dfx canister call plantify_backend getStartupDetails '("startup_123")'
```

### Admin Functions

```motoko
public shared (_msg) func createStartupForFounder(founderId : Text, request : StartupCreationRequest) : async Result.Result<Startup, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend createStartupForFounder '(
  "founder_123",
  record {
    startupName = "AdminCreated Startup";
    sector = "Technology";
    foundedYear = "2023";
    description = "Admin created startup";
    website = "https://adminstartup.com";
    location = "New York, NY";
    companyType = "Corp";
    companyLogo = null;
    companyImages = vec {};
    nftImage = null;
    problemStatement = "Problem statement";
    solution = "Solution description";
    targetMarket = "Enterprise";
    competitiveAdvantage = "Unique features";
    marketingStrategy = "B2B marketing";
    operationalProcess = "Standard process";
    founderBackground = "Experienced founder";
    teamMembers = vec {};
    advisors = "Industry advisors";
    fundingGoal = "2000000";
    nftPrice = "200";
    periodicProfitSharing = "15";
    revenueModel = "SaaS";
    monthlyRevenue = "100000";
    monthlyExpenses = "60000";
    useOfFunds = "Scaling operations";
    businessPlan = null;
    financialProjections = null;
    legalDocuments = null;
    status = "Active";
  }
)'
```

## Token Operations

### Transfer Tokens

```motoko
public shared func transferTokens(args : TransferArgs) : async TransferResponse
public shared func transferICP(toAccount : TransferAccount, amount : Nat, memo : ?Text) : async TransferResponse
public shared func transferCkUSDC(toAccount : TransferAccount, amount : Nat, memo : ?Text) : async TransferResponse
```

**ICP Terminal Calls:**
```bash
# Transfer tokens with full arguments
dfx canister call plantify_backend transferTokens '(
  record {
    amount = 100000000; # 1 ICP (8 decimals)
    toAccount = record {
      owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
      subaccount = null;
    };
    tokenType = "ICP";
    memo = opt "Payment for NFT";
  }
)'

# Transfer ICP directly
dfx canister call plantify_backend transferICP '(
  record {
    owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
    subaccount = null;
  },
  100000000,
  opt "ICP transfer"
)'

# Transfer ckUSDC directly
dfx canister call plantify_backend transferCkUSDC '(
  record {
    owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
    subaccount = null;
  },
  50000000,
  opt "ckUSDC transfer"
)'
```

**Transfer Arguments:**
```motoko
type TransferArgs = {
  amount : Nat;
  toAccount : TransferAccount;
  tokenType : Text; // "ICP" or "ckUSDC"
  memo : ?Text;
};
```

### Get Balances

```motoko
public shared func getBalance(account : TransferAccount, tokenType : Text) : async BalanceResponse
public shared func getICPBalance(account : TransferAccount) : async BalanceResponse
public shared func getCkUSDCBalance(account : TransferAccount) : async BalanceResponse
```

**ICP Terminal Calls:**
```bash
# Get balance for specific token type
dfx canister call plantify_backend getBalance '(
  record {
    owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
    subaccount = null;
  },
  "ICP"
)'

# Get ICP balance
dfx canister call plantify_backend getICPBalance '(
  record {
    owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
    subaccount = null;
  }
)'

# Get ckUSDC balance
dfx canister call plantify_backend getCkUSDCBalance '(
  record {
    owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
    subaccount = null;
  }
)'
```

### Token Information

```motoko
public shared func getTokenInfo(tokenType : Text) : async TokenInfoResponse
```

**ICP Terminal Call:**
```bash
# Get token information
dfx canister call plantify_backend getTokenInfo '("ICP")'
dfx canister call plantify_backend getTokenInfo '("ckUSDC")'
```

## Collateral Management

### Initialize Collateral

```motoko
public shared (_msg) func initializeCollateral(
  startupId : Text, 
  requiredAmount : Nat, 
  tokenType : Text
) : async Result.Result<Text, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend initializeCollateral '(
  "startup_123",
  1000000000, # 10 ICP
  "ICP"
)'
```

### Top Up Collateral

```motoko
public shared (msg) func topUpCollateral(request : TopUpRequest) : async Result.Result<TopUpResponse, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend topUpCollateral '(
  record {
    startupId = "startup_123";
    amount = 500000000; # 5 ICP
    tokenType = "ICP";
    memo = opt "Collateral top-up";
  }
)'
```

**Request Type:**
```motoko
type TopUpRequest = {
  startupId : Text;
  amount : Nat;
  tokenType : Text; // "ICP" or "ckUSDC"
  memo : ?Text;
};
```

### Get Collateral Information

```motoko
public shared (_msg) func getCollateralStatus(startupId : Text) : async Result.Result<CollateralInfo, Text>
public shared (_msg) func getCollateralTopUpHistory(startupId : Text) : async Result.Result<[CollateralTopUp], Text>
public shared (_msg) func getCollateralProgress(startupId : Text) : async CollateralProgressResponse
public shared (_msg) func getAllCollateralInfo() : async [CollateralInfo]
```

**ICP Terminal Calls:**
```bash
# Get collateral status for a startup
dfx canister call plantify_backend getCollateralStatus '("startup_123")'

# Get collateral top-up history
dfx canister call plantify_backend getCollateralTopUpHistory '("startup_123")'

# Get collateral progress
dfx canister call plantify_backend getCollateralProgress '("startup_123")'

# Get all collateral information
dfx canister call plantify_backend getAllCollateralInfo
```

### Collateral Utilities

```motoko
public shared func calculateRequiredCollateral(monthlyProfitSharing : Nat, tokenType : Text) : async Nat
public shared (_msg) func updateStartupStatus(startupId : Text, newStatus : Text) : async Bool
public shared (_msg) func mintNFTForStartup(startupId : Text) : async Result.Result<Text, Text>
```

**ICP Terminal Calls:**
```bash
# Calculate required collateral
dfx canister call plantify_backend calculateRequiredCollateral '(1000000, "ICP")'

# Update startup status
dfx canister call plantify_backend updateStartupStatus '("startup_123", "Active")'

# Mint NFT for startup
dfx canister call plantify_backend mintNFTForStartup '("startup_123")'
```

## NFT Operations

### Mint NFTs

```motoko
public shared (msg) func mintNFT(request : MintNFTRequest) : async Result.Result<MintNFTResponse, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend mintNFT '(
  record {
    startupId = "startup_123";
    toAccount = record {
      owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
      subaccount = null;
    };
    metadata = record {
      tokenUri = "https://plantify.com/nft/123";
      name = opt "TechCorp NFT";
      description = opt "Ownership share in TechCorp";
      image = opt "https://plantify.com/nft/123/image.png";
      attributes = opt vec {
        record { "startup", "TechCorp" };
        record { "share", "1%" };
      };
    };
    memo = opt "NFT minting";
  }
)'
```

**Request Type:**
```motoko
type MintNFTRequest = {
  startupId : Text;
  toAccount : NFTAccount;
  metadata : NFTMetadata;
  memo : ?Text;
};
```

### Transfer NFTs

```motoko
public shared (msg) func transferNFT(request : TransferNFTRequest) : async Result.Result<TransferNFTResponse, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend transferNFT '(
  record {
    tokenId = 1;
    toAccount = record {
      owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
      subaccount = null;
    };
    memo = opt "NFT transfer";
  }
)'
```

### Get NFT Information

```motoko
public shared (_msg) func getNFTInfo(tokenId : Nat) : async Result.Result<NFTInfo, Text>
public shared (_msg) func getNFTsByStartup(startupId : Text) : async Result.Result<[NFTInfo], Text>
public shared (_msg) func getNFTBalance(account : NFTAccount) : async Result.Result<NFTBalanceResponse, Text>
public shared (_msg) func getNFTOwner(tokenId : Nat) : async Result.Result<NFTOwnerResponse, Text>
public shared (_msg) func getAllNFTs() : async [NFTInfo]
```

**ICP Terminal Calls:**
```bash
# Get NFT information by token ID
dfx canister call plantify_backend getNFTInfo '(1)'

# Get NFTs by startup
dfx canister call plantify_backend getNFTsByStartup '("startup_123")'

# Get NFT balance for account
dfx canister call plantify_backend getNFTBalance '(
  record {
    owner = principal "rrkah-fqaaa-aaaah-qcvmq-cai";
    subaccount = null;
  }
)'

# Get NFT owner
dfx canister call plantify_backend getNFTOwner '(1)'

# Get all NFTs
dfx canister call plantify_backend getAllNFTs
```

### NFT Collection Information

```motoko
public shared (_msg) func getCollectionInfo() : async NFTConfig
public shared (_msg) func canMintNFT(startupId : Text) : async Result.Result<Bool, Text>
public shared (_msg) func getNFTStats() : async {
  totalSupply : Nat;
  totalStartups : Nat;
  nextTokenId : Nat;
}
```

**ICP Terminal Calls:**
```bash
# Get collection information
dfx canister call plantify_backend getCollectionInfo

# Check if NFT can be minted for startup
dfx canister call plantify_backend canMintNFT '("startup_123")'

# Get NFT statistics
dfx canister call plantify_backend getNFTStats
```

## NFT Purchase System

### Purchase NFTs

```motoko
public shared (msg) func purchaseNFT(request : NFTPurchaseRequest) : async Result.Result<NFTPurchaseResponse, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend purchaseNFT '(
  record {
    startupId = "startup_123";
    investorId = "investor_456";
    amount = 100000000; # 100 ckUSDC
    memo = opt "NFT purchase";
  }
)'
```

**Request Type:**
```motoko
type NFTPurchaseRequest = {
  startupId : Text;
  investorId : Text;
  amount : Nat; // Amount in ckUSDC
  memo : ?Text;
};
```

### Get Purchase Information

```motoko
public shared (_msg) func getPurchaseInfo(purchaseId : Text) : async Result.Result<NFTPurchaseInfo, Text>
public shared (_msg) func getInvestorPurchaseHistory(investorId : Text) : async Result.Result<NFTPurchaseHistory, Text>
public shared (_msg) func getStartupPurchaseHistory(startupId : Text) : async Result.Result<NFTPurchaseHistory, Text>
public shared (_msg) func getAllPurchases() : async [NFTPurchaseInfo]
```

**ICP Terminal Calls:**
```bash
# Get purchase information by ID
dfx canister call plantify_backend getPurchaseInfo '("purchase_123")'

# Get investor purchase history
dfx canister call plantify_backend getInvestorPurchaseHistory '("investor_456")'

# Get startup purchase history
dfx canister call plantify_backend getStartupPurchaseHistory '("startup_123")'

# Get all purchases
dfx canister call plantify_backend getAllPurchases
```

### Purchase Analytics

```motoko
public shared (_msg) func getPurchaseStats() : async NFTPurchaseStats
public shared (_msg) func canPurchaseNFT(investorId : Text, startupId : Text) : async Result.Result<Bool, Text>
public shared (_msg) func getNFTPrice(startupId : Text) : async Result.Result<Nat, Text>
```

**ICP Terminal Calls:**
```bash
# Get purchase statistics
dfx canister call plantify_backend getPurchaseStats

# Check if investor can purchase NFT
dfx canister call plantify_backend canPurchaseNFT '("investor_456", "startup_123")'

# Get NFT price for startup
dfx canister call plantify_backend getNFTPrice '("startup_123")'
```

## Monthly Reports

### Create Monthly Report

```motoko
public shared (msg) func createMonthlyReport(request : MonthlyReportRequest) : async Result.Result<MonthlyReport, Text>
```

**ICP Terminal Call:**
```bash
dfx canister call plantify_backend createMonthlyReport '(
  record {
    startupId = "startup_123";
    month = 12;
    year = 2023;
    revenue = 50000000; # $50,000
    expenses = 30000000; # $30,000
    profit = 20000000; # $20,000
    profitSharingAmount = 2000000; # $2,000
    investorCount = 10;
    newInvestors = 2;
  }
)'
```

**Request Type:**
```motoko
type MonthlyReportRequest = {
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
```

### Update and Submit Reports

```motoko
public shared (msg) func updateMonthlyReport(reportId : Text, request : MonthlyReportRequest) : async Result.Result<MonthlyReport, Text>
public shared (msg) func submitMonthlyReport(reportId : Text) : async Result.Result<MonthlyReport, Text>
```

**ICP Terminal Calls:**
```bash
# Update monthly report
dfx canister call plantify_backend updateMonthlyReport '(
  "report_123",
  record {
    startupId = "startup_123";
    month = 12;
    year = 2023;
    revenue = 60000000; # Updated revenue
    expenses = 35000000; # Updated expenses
    profit = 25000000; # Updated profit
    profitSharingAmount = 2500000; # Updated profit sharing
    investorCount = 12;
    newInvestors = 3;
  }
)'

# Submit monthly report
dfx canister call plantify_backend submitMonthlyReport '("report_123")'
```

### Approve/Reject Reports

```motoko
public shared (_msg) func approveMonthlyReport(reportId : Text) : async Result.Result<MonthlyReport, Text>
public shared (_msg) func rejectMonthlyReport(reportId : Text) : async Result.Result<MonthlyReport, Text>
```

**ICP Terminal Calls:**
```bash
# Approve monthly report
dfx canister call plantify_backend approveMonthlyReport '("report_123")'

# Reject monthly report
dfx canister call plantify_backend rejectMonthlyReport '("report_123")'
```

### Get Report Information

```motoko
public shared (_msg) func getMonthlyReport(reportId : Text) : async Result.Result<MonthlyReport, Text>
public shared (_msg) func getMonthlyReportsByStartup(startupId : Text) : async Result.Result<MonthlyReportList, Text>
public shared (_msg) func getAllMonthlyReports() : async [MonthlyReport]
public shared (_msg) func getMonthlyReportStats() : async MonthlyReportStats
public shared (_msg) func getMonthlyReportsByStatus(status : MonthlyReportStatus) : async [MonthlyReport]
```

**ICP Terminal Calls:**
```bash
# Get specific monthly report
dfx canister call plantify_backend getMonthlyReport '("report_123")'

# Get reports by startup
dfx canister call plantify_backend getMonthlyReportsByStartup '("startup_123")'

# Get all monthly reports
dfx canister call plantify_backend getAllMonthlyReports

# Get monthly report statistics
dfx canister call plantify_backend getMonthlyReportStats

# Get reports by status
dfx canister call plantify_backend getMonthlyReportsByStatus '(variant { Approved })'
```

## Voting System

### Cast Votes

```motoko
public shared (msg) func castVote(request : VoteRequest) : async Result.Result<InvestorVote, Text>
public shared (msg) func updateVote(reportId : Text, request : VoteRequest) : async Result.Result<InvestorVote, Text>
```

**ICP Terminal Calls:**
```bash
# Cast a vote
dfx canister call plantify_backend castVote '(
  record {
    reportId = "report_123";
    vote = variant { Approve };
    feedback = opt "Great progress this month!";
    feedbackType = opt variant { Positive };
    confidence = 8;
  }
)'

# Update a vote
dfx canister call plantify_backend updateVote '(
  "report_123",
  record {
    reportId = "report_123";
    vote = variant { Reject };
    feedback = opt "Need more details on expenses";
    feedbackType = opt variant { Negative };
    confidence = 6;
  }
)'
```

**Request Type:**
```motoko
type VoteRequest = {
  reportId : Text;
  vote : VoteType; // #Approve, #Reject, #Abstain
  feedback : ?Text;
  feedbackType : ?FeedbackType; // #Positive, #Neutral, #Negative
  confidence : Nat; // 1-10 scale
};
```

### Get Voting Information

```motoko
public shared (_msg) func getVoteSummary(reportId : Text) : async Result.Result<VoteSummary, Text>
public shared (_msg) func getReportVotes(reportId : Text) : async [InvestorVote]
public shared (_msg) func getReportVoteDetails(reportId : Text) : async Result.Result<ReportVoteDetails, Text>
public shared (_msg) func getInvestorVoteHistory(investorId : Text) : async Result.Result<InvestorVoteHistory, Text>
public shared (msg) func getInvestorVoteForReport(reportId : Text) : async Result.Result<?InvestorVote, Text>
```

**ICP Terminal Calls:**
```bash
# Get vote summary for a report
dfx canister call plantify_backend getVoteSummary '("report_123")'

# Get all votes for a report
dfx canister call plantify_backend getReportVotes '("report_123")'

# Get detailed vote information
dfx canister call plantify_backend getReportVoteDetails '("report_123")'

# Get investor vote history
dfx canister call plantify_backend getInvestorVoteHistory '("investor_456")'

# Get current user's vote for a report
dfx canister call plantify_backend getInvestorVoteForReport '("report_123")'
```

### Voting Analytics

```motoko
public shared (_msg) func getAllVotes() : async [InvestorVote]
public shared (_msg) func getVotingStats() : async VotingStats
public shared (msg) func canInvestorVote(reportId : Text) : async Result.Result<Bool, Text>
```

**ICP Terminal Calls:**
```bash
# Get all votes
dfx canister call plantify_backend getAllVotes

# Get voting statistics
dfx canister call plantify_backend getVotingStats

# Check if current user can vote
dfx canister call plantify_backend canInvestorVote '("report_123")'
```

## Configuration

### Environment Configuration

```motoko
public shared func getEnvironmentConfig() : async EnvironmentConfig
public shared func getEnvironment() : async Text
public shared func getICPTokenConfig() : async TokenConfig
public shared func getCkUSDCTokenConfig() : async TokenConfig
public shared func getPlantifyAccount() : async Text
public shared func isUsingTestTokens() : async Bool
public shared func getTokenCanisterId(tokenType : Text) : async ?Text
```

**ICP Terminal Calls:**
```bash
# Get environment configuration
dfx canister call plantify_backend getEnvironmentConfig

# Get current environment
dfx canister call plantify_backend getEnvironment

# Get ICP token configuration
dfx canister call plantify_backend getICPTokenConfig

# Get ckUSDC token configuration
dfx canister call plantify_backend getCkUSDCTokenConfig

# Get Plantify account
dfx canister call plantify_backend getPlantifyAccount

# Check if using test tokens
dfx canister call plantify_backend isUsingTestTokens

# Get token canister ID
dfx canister call plantify_backend getTokenCanisterId '("ICP")'
dfx canister call plantify_backend getTokenCanisterId '("ckUSDC")'
```

## Error Handling

All API methods return `Result.Result<T, Text>` where:
- `#ok(value)` indicates success
- `#err(errorMessage)` indicates failure with error description

## Data Types

### Core Types

```motoko
type UserType = {
  #Founder;
  #Investor;
};

type MonthlyReportStatus = {
  #Draft;
  #Submitted;
  #Approved;
  #Rejected;
};

type CollateralStatus = {
  #Pending;
  #Active;
  #Locked;
  #Released;
};

type VoteType = {
  #Approve;
  #Reject;
  #Abstain;
};
```

### Account Types

```motoko
type TransferAccount = {
  owner : Principal;
  subaccount : ?Blob;
};

type NFTAccount = {
  owner : Principal;
  subaccount : ?Blob;
};
```

## Usage Examples

### Register as Founder

```motoko
let founderRequest : FounderRegistrationRequest = {
  fullName = "John Doe";
  email = "john@example.com";
  phone = "+1234567890";
  address = "123 Main St, City, Country";
  experience = "5 years in tech";
  previousBusinesses = "Tech startup";
  expertise = "Software development";
  linkedIn = "https://linkedin.com/in/johndoe";
  idNumber = "123456789";
  taxNumber = "TAX123456";
};

let result = await plantifyBackend.registerFounder(founderRequest);
```

### Create Startup

```motoko
let startupRequest : StartupCreationRequest = {
  startupName = "TechCorp";
  sector = "Technology";
  foundedYear = "2023";
  description = "Innovative tech solution";
  website = "https://techcorp.com";
  location = "San Francisco, CA";
  companyType = "LLC";
  companyLogo = ?"https://techcorp.com/logo.png";
  companyImages = [];
  nftImage = ?"https://techcorp.com/nft.png";
  problemStatement = "Current solutions are inefficient";
  solution = "Our platform solves this";
  targetMarket = "Small businesses";
  competitiveAdvantage = "Unique algorithm";
  marketingStrategy = "Digital marketing";
  operationalProcess = "Agile development";
  founderBackground = "Tech entrepreneur";
  teamMembers = [];
  advisors = "Industry experts";
  fundingGoal = "1000000";
  nftPrice = "100";
  periodicProfitSharing = "10";
  revenueModel = "Subscription";
  monthlyRevenue = "50000";
  monthlyExpenses = "30000";
  useOfFunds = "Product development";
  businessPlan = ?"https://techcorp.com/plan.pdf";
  financialProjections = ?"https://techcorp.com/projections.pdf";
  legalDocuments = ?"https://techcorp.com/legal.pdf";
  status = "Active";
};

let result = await plantifyBackend.createStartup(startupRequest);
```

### Transfer Tokens

```motoko
let transferArgs : TransferArgs = {
  amount = 100000000; // 1 ICP (8 decimals)
  toAccount = {
    owner = Principal.fromText("rrkah-fqaaa-aaaah-qcvmq-cai");
    subaccount = null;
  };
  tokenType = "ICP";
  memo = ?"Payment for NFT";
};

let result = await plantifyBackend.transferTokens(transferArgs);
```

### Purchase NFT

```motoko
let purchaseRequest : NFTPurchaseRequest = {
  startupId = "startup_123";
  investorId = "investor_456";
  amount = 100000000; // 100 ckUSDC
  memo = ?"NFT purchase";
};

let result = await plantifyBackend.purchaseNFT(purchaseRequest);
```

## Security Considerations

1. **Authentication**: All operations require valid ICP principal authentication
2. **Authorization**: Users can only access their own data and public information
3. **Token Security**: All token operations use ICP's secure ledger system
4. **Data Validation**: All inputs are validated before processing
5. **Error Handling**: Comprehensive error handling prevents system failures

## Development Notes

- The backend uses persistent storage for data persistence across upgrades
- All monetary values are stored in the smallest unit (e.g., 8 decimals for ICP)
- Time values use ICP's Time.Time type for consistency
- The system supports both test and production token configurations

## Support

For technical support or questions about the API, please refer to the ICP documentation or contact the development team.