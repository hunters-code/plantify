import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Types "../types";
import Storage "../storage";

module Registration {
    public class RegistrationService() {
        private let storage = Storage.UserStorage();

        public func registerFounder(
            principal: Principal,
            request: Types.FounderRegistrationRequest
        ): Result.Result<Types.Founder, Text> {
            let validationErrors = validateFounderRequest(request);
            
            if (validationErrors.size() > 0) {
                let errorMessage = Text.join("; ", validationErrors.vals());
                return #err(errorMessage);
            };

            let founder: Types.Founder = {
                id = "";
                principal = principal;
                fullName = request.fullName;
                email = request.email;
                phone = request.phone;
                address = request.address;
                experience = request.experience;
                previousBusinesses = request.previousBusinesses;
                expertise = request.expertise;
                linkedIn = request.linkedIn;
                idNumber = request.idNumber;
                taxNumber = request.taxNumber;
                createdAt = Time.now();
                updatedAt = Time.now();
            };

            let founderId = storage.addFounder(founder);
            
            switch (storage.getFounder(founderId)) {
                case null {
                    #err("Failed to create founder registration")
                };
                case (?createdFounder) {
                    #ok(createdFounder)
                };
            }
        };

        public func registerInvestor(
            principal: Principal,
            request: Types.InvestorRegistrationRequest
        ): Result.Result<Types.Investor, Text> {
            let validationErrors = validateInvestorRequest(request);
            
            if (validationErrors.size() > 0) {
                let errorMessage = Text.join("; ", validationErrors.vals());
                return #err(errorMessage);
            };

            let investor: Types.Investor = {
                id = "";
                principal = principal;
                fullName = request.fullName;
                email = request.email;
                phone = request.phone;
                country = request.country;
                city = request.city;
                investmentExperience = request.investmentExperience;
                riskTolerance = request.riskTolerance;
                investmentGoals = request.investmentGoals;
                availableCapital = request.availableCapital;
                monthlyBudget = request.monthlyBudget;
                createdAt = Time.now();
                updatedAt = Time.now();
            };

            let investorId = storage.addInvestor(investor);
            
            switch (storage.getInvestor(investorId)) {
                case null {
                    #err("Failed to create investor registration")
                };
                case (?createdInvestor) {
                    #ok(createdInvestor)
                };
            }
        };

        public func getAllFounders(): [Types.Founder] {
            storage.getAllFounders();
        };

        private func validateFounderRequest(request: Types.FounderRegistrationRequest): [Text] {
            var errors: [Text] = [];

            if (Text.size(request.fullName) == 0) {
                errors := Array.append(errors, ["Full name is required"]);
            };
            if (Text.size(request.email) == 0) {
                errors := Array.append(errors, ["Email is required"]);
            };
            if (Text.size(request.phone) == 0) {
                errors := Array.append(errors, ["Phone is required"]);
            };
            if (Text.size(request.address) == 0) {
                errors := Array.append(errors, ["Address is required"]);
            };
            if (Text.size(request.idNumber) == 0) {
                errors := Array.append(errors, ["ID number is required"]);
            };
            if (Text.size(request.taxNumber) == 0) {
                errors := Array.append(errors, ["Tax number is required"]);
            };

            errors
        };

        private func validateInvestorRequest(request: Types.InvestorRegistrationRequest): [Text] {
            var errors: [Text] = [];

            if (Text.size(request.fullName) == 0) {
                errors := Array.append(errors, ["Full name is required"]);
            };
            if (Text.size(request.email) == 0) {
                errors := Array.append(errors, ["Email is required"]);
            };
            if (Text.size(request.phone) == 0) {
                errors := Array.append(errors, ["Phone is required"]);
            };
            if (Text.size(request.country) == 0) {
                errors := Array.append(errors, ["Country is required"]);
            };
            if (Text.size(request.city) == 0) {
                errors := Array.append(errors, ["City is required"]);
            };

            errors
        };
    }
};
