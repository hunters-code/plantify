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
    investmentExperience : Text;
    riskTolerance : Text;
    investmentGoals : Text;
    availableCapital : Text;
    monthlyBudget : Text;
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
    subaccount : ?Blob;
  };

  public type TransferArgs = {
    amount : Nat;
    toAccount : TransferAccount;
    tokenType : Text; // "ICP" or "ckUSDC"
    memo : ?Text;
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
    amount : Nat; // Amount in ckUSDC
    memo : ?Text;
  };

  public type NFTPurchaseResponse = {
    #Success : {
      tokenId : Nat;
      transactionId : Text;
      startupId : Text;
      investorId : Text;
      amount : Nat;
      nftPrice : Nat;
      change : Nat; // Amount returned to investor if overpaid
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

};
