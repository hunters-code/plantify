import Types "./modules/types";

module Config {
    public func getDevelopmentConfig() : Types.EnvironmentConfig {
        {
            useTestToken = true;
            mainnetCkUSDC = null;
            plantifyAccount = "rrkah-fqaaa-aaaah-qcvmq-cai";
        }
    };

    public func getProductionConfig() : Types.EnvironmentConfig {
        {
            useTestToken = false;
            mainnetCkUSDC = ?{
                canisterId = "ckUSDC_CANISTER_ID_HERE";
                ledgerId = "ckUSDC_LEDGER_ID_HERE";
            };
            plantifyAccount = "PLANTIFY_PRODUCTION_ACCOUNT_HERE";
        }
    };

    public func getTestnetConfig() : Types.EnvironmentConfig {
        {
            useTestToken = false;
            mainnetCkUSDC = ?{
                canisterId = "ckUSDC_TESTNET_CANISTER_ID_HERE";
                ledgerId = "ckUSDC_TESTNET_LEDGER_ID_HERE";
            };
            plantifyAccount = "PLANTIFY_TESTNET_ACCOUNT_HERE";
        }
    };

    public func getConfigForEnvironment(environment : Text) : Types.EnvironmentConfig {
        switch (environment) {
            case ("production") { getProductionConfig() };
            case ("testnet") { getTestnetConfig() };
            case (_) { getDevelopmentConfig() };
        }
    };
};
