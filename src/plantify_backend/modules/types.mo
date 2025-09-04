import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

module Types {
    public type UserType = {
        #Founder;
        #Investor;
    };

    public type Founder = {
        id: Text;
        principal: Principal;
        fullName: Text;
        email: Text;
        phone: Text;
        address: Text;
        experience: Text;
        previousBusinesses: Text;
        expertise: Text;
        linkedIn: Text;
        idNumber: Text;
        taxNumber: Text;
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };

    public type Investor = {
        id: Text;
        principal: Principal;
        fullName: Text;
        email: Text;
        phone: Text;
        country: Text;
        city: Text;
        investmentExperience: Text;
        riskTolerance: Text;
        investmentGoals: Text;
        availableCapital: Text;
        monthlyBudget: Text;
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };

    public type FounderRegistrationRequest = {
        fullName: Text;
        email: Text;
        phone: Text;
        address: Text;
        experience: Text;
        previousBusinesses: Text;
        expertise: Text;
        linkedIn: Text;
        idNumber: Text;
        taxNumber: Text;
    };

    public type InvestorRegistrationRequest = {
        fullName: Text;
        email: Text;
        phone: Text;
        country: Text;
        city: Text;
        investmentExperience: Text;
        riskTolerance: Text;
        investmentGoals: Text;
        availableCapital: Text;
        monthlyBudget: Text;
    };

    public type Startup = {
        id: Text;
        founderId: Text;
        name: Text;
        description: Text;
        sector: Text;
        companyType: Text;
        establishmentDate: Text;
        website: Text;
        socialMedia: Text;
        businessPlan: Text;
        financialProjections: Text;
        fundingRequired: Text;
        profitSharingCommitment: Text;
        collateralAmount: Text;
        collateralStatus: Text;
        status: Text;
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };

    public type StartupCreationRequest = {
        name: Text;
        description: Text;
        sector: Text;
        companyType: Text;
        establishmentDate: Text;
        website: Text;
        socialMedia: Text;
        businessPlan: Text;
        financialProjections: Text;
        fundingRequired: Text;
        profitSharingCommitment: Text;
    };

    public type FileUpload = {
        id: Text;
        startupId: Text;
        fileName: Text;
        fileType: Text;
        fileSize: Nat;
        fileHash: Text;
        uploadDate: Time.Time;
        status: Text;
    };

    public type FileUploadRequest = {
        fileName: Text;
        fileType: Text;
        fileSize: Nat;
        fileHash: Text;
    };
};