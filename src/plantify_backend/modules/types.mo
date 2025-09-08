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
    collateralSource : Text;
    collateralAmount : Text;
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
    collateralSource : Text;
    collateralAmount : Text;
    businessPlan : ?Text;
    financialProjections : ?Text;
    legalDocuments : ?Text;
    status : Text;
  };

  public type CollateralStatus = {
    #Pending;
    #Active;
    #Locked;
    #Released;
  };

  public type CollateralTopUp = {
    id : Text;
    startupId : Text;
    amount : Nat;
    timestamp : Time.Time;
    transactionId : ?Text;
    status : Text;
  };

  public type CollateralInfo = {
    startupId : Text;
    requiredAmount : Nat;
    currentAmount : Nat;
    status : CollateralStatus;
    topUpHistory : [CollateralTopUp];
    lockStartTime : ?Time.Time;
    lockEndTime : ?Time.Time;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type TopUpRequest = {
    startupId : Text;
    amount : Nat;
    paymentMethod : Text;
  };

  public type TopUpResult = {
    #Success : {
      transactionId : Text;
      newTotal : Nat;
      remainingAmount : Nat;
      isFullyPaid : Bool;
    };
    #Error : Text;
  };

  public type TokenConfig = {
    #TestToken;
    #MainnetToken : {
      canisterId : Text;
      ledgerId : Text;
    };
  };

  public type EnvironmentConfig = {
    useTestToken : Bool;
    mainnetCkUSDC : ?{
      canisterId : Text;
      ledgerId : Text;
    };
    plantifyAccount : Text;
  };

};
