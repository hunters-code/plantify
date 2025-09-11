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
    businessPlan : ?Text;
    financialProjections : ?Text;
    legalDocuments : ?Text;
    status : Text;
  };

  public type EnvironmentConfig = {
    // Add your new configuration fields here
  };

};
