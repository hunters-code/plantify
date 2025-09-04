import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "./types";

module Storage {
    public class UserStorage() {
        private var founders = HashMap.HashMap<Text, Types.Founder>(
            0, Text.equal, Text.hash
        );
        private var investors = HashMap.HashMap<Text, Types.Investor>(
            0, Text.equal, Text.hash
        );
        private var founderPrincipals = HashMap.HashMap<Principal, Text>(
            0, Principal.equal, Principal.hash
        );
        private var investorPrincipals = HashMap.HashMap<Principal, Text>(
            0, Principal.equal, Principal.hash
        );
        private var nextFounderId: Nat = 1;
        private var nextInvestorId: Nat = 1;

        public func addFounder(founder: Types.Founder): Text {
            let id = Nat.toText(nextFounderId);
            nextFounderId += 1;
            let newFounder = {
                id = id;
                principal = founder.principal;
                fullName = founder.fullName;
                email = founder.email;
                phone = founder.phone;
                address = founder.address;
                experience = founder.experience;
                previousBusinesses = founder.previousBusinesses;
                expertise = founder.expertise;
                linkedIn = founder.linkedIn;
                idNumber = founder.idNumber;
                taxNumber = founder.taxNumber;
                createdAt = founder.createdAt;
                updatedAt = founder.updatedAt;
            };
            founders.put(id, newFounder);
            founderPrincipals.put(founder.principal, id);
            id
        };

        public func addInvestor(investor: Types.Investor): Text {
            let id = Nat.toText(nextInvestorId);
            nextInvestorId += 1;
            let newInvestor = {
                id = id;
                principal = investor.principal;
                fullName = investor.fullName;
                email = investor.email;
                phone = investor.phone;
                country = investor.country;
                city = investor.city;
                investmentExperience = investor.investmentExperience;
                riskTolerance = investor.riskTolerance;
                investmentGoals = investor.investmentGoals;
                availableCapital = investor.availableCapital;
                monthlyBudget = investor.monthlyBudget;
                createdAt = investor.createdAt;
                updatedAt = investor.updatedAt;
            };
            investors.put(id, newInvestor);
            investorPrincipals.put(investor.principal, id);
            id
        };

        public func getFounder(id: Text): ?Types.Founder {
            founders.get(id)
        };

        public func getInvestor(id: Text): ?Types.Investor {
            investors.get(id)
        };

        public func getFounderByPrincipal(principal: Principal): ?Types.Founder {
            switch (founderPrincipals.get(principal)) {
                case null { null };
                case (?id) { founders.get(id) };
            }
        };

        public func getInvestorByPrincipal(principal: Principal): ?Types.Investor {
            switch (investorPrincipals.get(principal)) {
                case null { null };
                case (?id) { investors.get(id) };
            }
        };

        public func getAllFounders(): [Types.Founder] {
            Iter.toArray(founders.vals())
        };

        public func getAllInvestors(): [Types.Investor] {
            Iter.toArray(investors.vals())
        };


        public func updateFounder(id: Text, updatedFounder: Types.Founder): Bool {
            switch (founders.get(id)) {
                case null { false };
                case (?_) {
                    founders.put(id, updatedFounder);
                    true
                };
            }
        };

        public func updateInvestor(id: Text, updatedInvestor: Types.Investor): Bool {
            switch (investors.get(id)) {
                case null { false };
                case (?_) {
                    investors.put(id, updatedInvestor);
                    true
                };
            }
        };

        public func deleteFounder(id: Text): Bool {
            switch (founders.get(id)) {
                case null { false };
                case (?founder) {
                    founders.delete(id);
                    founderPrincipals.delete(founder.principal);
                    true
                };
            }
        };

        public func deleteInvestor(id: Text): Bool {
            switch (investors.get(id)) {
                case null { false };
                case (?investor) {
                    investors.delete(id);
                    investorPrincipals.delete(investor.principal);
                    true
                };
            }
        };

        public func getFounderCount(): Nat {
            founders.size()
        };

        public func getInvestorCount(): Nat {
            investors.size()
        };
    }
};
