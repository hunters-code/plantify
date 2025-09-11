import Types "./modules/types";

module Config {
    public func getDevelopmentConfig() : Types.EnvironmentConfig {
        {
            // Add your development configuration fields here
        }
    };

    public func getProductionConfig() : Types.EnvironmentConfig {
        {
            // Add your production configuration fields here
        }
    };

    public func getTestnetConfig() : Types.EnvironmentConfig {
        {
            // Add your testnet configuration fields here
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
