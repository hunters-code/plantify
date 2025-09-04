import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Types "../types";
import Storage "../storage";

module Collateral {
  public class CollateralService() {
    private let storage = Storage.UserStorage();
    private let PLANTIFY_WALLET_PRINCIPAL : Principal = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");

    public func topUpCollateral(
      principal : Principal,
      request : Types.CollateralTopUpRequest,
    ) : Result.Result<Types.Collateral, Text> {
      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {
          let validationErrors = validateTopUpRequest(request);

          if (validationErrors.size() > 0) {
            let errorMessage = Text.join("; ", validationErrors.vals());
            return #err(errorMessage);
          };

          switch (storage.getStartup(request.startupId)) {
            case null {
              #err("Startup not found");
            };
            case (?startup) {
              if (startup.founderId != founder.id) {
                #err("You can only add collateral to your own startups");
              } else {
                let existingCollaterals = storage.getCollateralsByStartup(request.startupId);

                switch (Array.find<Types.Collateral>(existingCollaterals, func(c : Types.Collateral) : Bool { c.status == "active" })) {
                  case null {
                    #err("No active collateral found for this startup. Please create collateral first.");
                  };
                  case (?collateral) {
                    switch (Nat.fromText(collateral.currentAmount), Nat.fromText(collateral.totalRequiredAmount), Nat.fromText(request.amount)) {
                      case (?currentAmount, ?totalRequired, ?topUpAmount) {
                        if (currentAmount >= totalRequired) {
                          #err("Collateral is already fully funded");
                        } else {
                          let newTotal = currentAmount + topUpAmount;
                          if (newTotal > totalRequired) {
                            let remaining = if (totalRequired > currentAmount) {
                              totalRequired - currentAmount;
                            } else { 0 };
                            #err("Top-up amount exceeds remaining required amount. Remaining: " # Nat.toText(remaining));
                          } else {
                            let now = Time.now();
                            let topUp : Types.CollateralTopUp = {
                              id = "";
                              collateralId = collateral.id;
                              amount = request.amount;
                              transactionHash = null;
                              status = "pending";
                              createdAt = now;
                            };

                            if (storage.addTopUpToCollateral(collateral.id, topUp)) {
                              switch (storage.getCollateral(collateral.id)) {
                                case null {
                                  #err("Failed to retrieve updated collateral");
                                };
                                case (?updatedCollateral) {
                                  #ok(updatedCollateral);
                                };
                              };
                            } else {
                              #err("Failed to process top-up");
                            };
                          };
                        };
                      };
                      case (_, _, _) {
                        #err("Invalid amount format");
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };

    public func createCollateral(
      principal : Principal,
      startupId : Text,
      totalRequiredAmount : Text,
    ) : Result.Result<Types.Collateral, Text> {
      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {
          switch (storage.getStartup(startupId)) {
            case null {
              #err("Startup not found");
            };
            case (?startup) {
              if (startup.founderId != founder.id) {
                #err("You can only create collateral for your own startups");
              } else {
                let existingCollaterals = storage.getCollateralsByStartup(startupId);
                let hasActiveCollateral = Array.find<Types.Collateral>(existingCollaterals, func(c : Types.Collateral) : Bool { c.status == "active" });

                switch (hasActiveCollateral) {
                  case (?_) {
                    #err("Active collateral already exists for this startup");
                  };
                  case null {
                    let now = Time.now();
                    let collateral : Types.Collateral = {
                      id = "";
                      startupId = startupId;
                      founderId = founder.id;
                      totalRequiredAmount = totalRequiredAmount;
                      currentAmount = "0";
                      currency = "ckUSDC";
                      status = "active";
                      topUpHistory = [];
                      createdAt = now;
                      updatedAt = now;
                    };

                    let collateralId = storage.addCollateral(collateral);

                    switch (storage.getCollateral(collateralId)) {
                      case null {
                        #err("Failed to create collateral");
                      };
                      case (?createdCollateral) {
                        #ok(createdCollateral);
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };

    public func getCollateralsByStartup(
      principal : Principal,
      startupId : Text,
    ) : Result.Result<[Types.Collateral], Text> {
      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {
          switch (storage.getStartup(startupId)) {
            case null {
              #err("Startup not found");
            };
            case (?startup) {
              if (startup.founderId != founder.id) {
                #err("You can only view collateral for your own startups");
              } else {
                let collaterals = storage.getCollateralsByStartup(startupId);
                #ok(collaterals);
              };
            };
          };
        };
      };
    };

    public func getCollateral(
      principal : Principal,
      collateralId : Text,
    ) : Result.Result<Types.Collateral, Text> {
      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {
          switch (storage.getCollateral(collateralId)) {
            case null {
              #err("Collateral not found");
            };
            case (?collateral) {
              if (collateral.founderId != founder.id) {
                #err("You can only view your own collateral");
              } else {
                #ok(collateral);
              };
            };
          };
        };
      };
    };

    public func updateCollateralStatus(
      principal : Principal,
      collateralId : Text,
      newStatus : Text,
    ) : Result.Result<Types.Collateral, Text> {
      switch (storage.getFounderByPrincipal(principal)) {
        case null {
          #err("Founder not found. Please register as a founder first.");
        };
        case (?founder) {
          switch (storage.getCollateral(collateralId)) {
            case null {
              #err("Collateral not found");
            };
            case (?collateral) {
              if (collateral.founderId != founder.id) {
                #err("You can only update your own collateral");
              } else {
                let updatedCollateral = {
                  id = collateral.id;
                  startupId = collateral.startupId;
                  founderId = collateral.founderId;
                  totalRequiredAmount = collateral.totalRequiredAmount;
                  currentAmount = collateral.currentAmount;
                  currency = collateral.currency;
                  status = newStatus;
                  topUpHistory = collateral.topUpHistory;
                  createdAt = collateral.createdAt;
                  updatedAt = Time.now();
                };

                if (storage.updateCollateral(collateralId, updatedCollateral)) {
                  #ok(updatedCollateral);
                } else {
                  #err("Failed to update collateral");
                };
              };
            };
          };
        };
      };
    };

    public func getPlantifyWalletAddress() : Principal {
      PLANTIFY_WALLET_PRINCIPAL;
    };

    private func validateTopUpRequest(request : Types.CollateralTopUpRequest) : [Text] {
      var errors : [Text] = [];

      if (Text.size(request.startupId) == 0) {
        errors := Array.append(errors, ["Startup ID is required"]);
      };
      if (Text.size(request.amount) == 0) {
        errors := Array.append(errors, ["Amount is required"]);
      } else {
        switch (Nat.fromText(request.amount)) {
          case null {
            errors := Array.append(errors, ["Invalid amount format"]);
          };
          case (?amount) {
            if (amount == 0) {
              errors := Array.append(errors, ["Amount must be greater than 0"]);
            };
          };
        };
      };

      errors;
    };
  };
};
