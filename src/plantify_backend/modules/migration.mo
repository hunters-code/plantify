import Array "mo:base/Array";
import Time "mo:base/Time";
import Types "./types";

module Migration {
  // Old Investor type - only include fields that definitely existed
  public type OldInvestor = {
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

  // Migration function to transform old investors to new investors with bio field
  public func migration(old : {
    var investorsEntries : [(Text, OldInvestor)];
  }) : {
    var investorsEntries : [(Text, Types.Investor)];
  } {
    {
      var investorsEntries : [(Text, Types.Investor)] = Array.map<(Text, OldInvestor), (Text, Types.Investor)>(
        old.investorsEntries,
        func((id, investor) : (Text, OldInvestor)) : (Text, Types.Investor) {
          let migratedInvestor : Types.Investor = {
            id = investor.id;
            principal = investor.principal;
            fullName = investor.fullName;
            email = investor.email;
            phone = investor.phone;
            country = investor.country;
            city = investor.city;
            location = null;
            occupation = null;
            company = null;
            bio = null;
            profilePhoto = null;
            investmentExperience = investor.investmentExperience;
            riskTolerance = investor.riskTolerance;
            investmentGoals = investor.investmentGoals;
            availableCapital = investor.availableCapital;
            monthlyBudget = investor.monthlyBudget;
            createdAt = investor.createdAt;
            updatedAt = investor.updatedAt;
          };
          (id, migratedInvestor);
        }
      );
    };
  };
};
