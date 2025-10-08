import Types "./modules/types";

module Config {
  // Version constants for canister upgrades
  public let CURRENT_CANISTER_VERSION : Nat = 2;
  // Development/Testing Configuration
  public func getDevelopmentConfig() : Types.EnvironmentConfig {
    {
      environment = "development";
      icpToken = {
        canisterId = "rdmx6-jaaaa-aaaah-qcaiq-cai"; // ICP Ledger on local replica
        ledgerId = "rdmx6-jaaaa-aaaah-qcaiq-cai";
        name = "Internet Computer";
        symbol = "ICP";
        decimals = 8;
        fee = 10000;
      };
      ckUSDCToken = {
        canisterId = "be2us-64aaa-aaaah-qzcya-cai"; // Local ckUSDC canister (will be set after deployment)
        ledgerId = "be2us-64aaa-aaaah-qzcya-cai";
        name = "CkUSDC Token";
        symbol = "ckUSDC";
        decimals = 8;
        fee = 10000;
      };
      nftToken = {
        canisterId = "NFT_CANISTER_ID_HERE"; // Replace with actual NFT canister ID
        name = "Plantify Startup NFTs";
        symbol = "PLANT";
        description = "NFTs representing ownership shares in Plantify startups";
        logo = ?"https://plantify.com/logo.png";
        maxMemoSize = 256;
        txWindow = 86400000000000; // 24 hours in nanoseconds
        permittedDrift = 60000000000; // 1 minute in nanoseconds
        supplyCap = ?10000;
        maxQueryBatchSize = ?100;
        maxUpdateBatchSize = ?50;
        defaultTakeValue = ?20;
        maxTakeValue = ?100;
        atomicBatchTransfers = ?true;
      };
      plantifyAccount = "rrkah-fqaaa-aaaah-qcvmq-cai";
      useTestTokens = true;
    };
  };

  // Production Configuration
  public func getProductionConfig() : Types.EnvironmentConfig {
    {
      environment = "production";
      icpToken = {
        canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai"; // ICP Ledger on mainnet
        ledgerId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
        name = "Internet Computer";
        symbol = "ICP";
        decimals = 8;
        fee = 10000;
      };
      ckUSDCToken = {
        canisterId = "mxzaz-hqaaa-aaaar-qaada-cai"; // ckUSDC on mainnet
        ledgerId = "mxzaz-hqaaa-aaaar-qaada-cai";
        name = "CkUSDC";
        symbol = "ckUSDC";
        decimals = 8;
        fee = 10000;
      };
      nftToken = {
        canisterId = "NFT_PRODUCTION_CANISTER_ID_HERE"; // Replace with production NFT canister ID
        name = "Plantify Startup NFTs";
        symbol = "PLANT";
        description = "NFTs representing ownership shares in Plantify startups";
        logo = ?"https://plantify.com/logo.png";
        maxMemoSize = 256;
        txWindow = 86400000000000; // 24 hours in nanoseconds
        permittedDrift = 60000000000; // 1 minute in nanoseconds
        supplyCap = ?10000;
        maxQueryBatchSize = ?100;
        maxUpdateBatchSize = ?50;
        defaultTakeValue = ?20;
        maxTakeValue = ?100;
        atomicBatchTransfers = ?true;
      };
      plantifyAccount = "PLANTIFY_PRODUCTION_ACCOUNT_HERE"; // Replace with actual production account
      useTestTokens = false;
    };
  };

  // Testnet Configuration
  public func getTestnetConfig() : Types.EnvironmentConfig {
    {
      environment = "testnet";
      icpToken = {
        canisterId = "rdmx6-jaaaa-aaaah-qcaiq-cai"; // ICP Ledger on testnet
        ledgerId = "rdmx6-jaaaa-aaaah-qcaiq-cai";
        name = "Internet Computer";
        symbol = "ICP";
        decimals = 8;
        fee = 10000;
      };
      ckUSDCToken = {
        canisterId = "ckUSDC_TESTNET_CANISTER_ID_HERE"; // Replace with testnet ckUSDC
        ledgerId = "ckUSDC_TESTNET_LEDGER_ID_HERE";
        name = "CkUSDC Test Token";
        symbol = "ckUSDC";
        decimals = 8;
        fee = 10000;
      };
      nftToken = {
        canisterId = "NFT_TESTNET_CANISTER_ID_HERE"; // Replace with testnet NFT canister ID
        name = "Plantify Startup NFTs";
        symbol = "PLANT";
        description = "NFTs representing ownership shares in Plantify startups";
        logo = ?"https://plantify.com/logo.png";
        maxMemoSize = 256;
        txWindow = 86400000000000; // 24 hours in nanoseconds
        permittedDrift = 60000000000; // 1 minute in nanoseconds
        supplyCap = ?10000;
        maxQueryBatchSize = ?100;
        maxUpdateBatchSize = ?50;
        defaultTakeValue = ?20;
        maxTakeValue = ?100;
        atomicBatchTransfers = ?true;
      };
      plantifyAccount = "PLANTIFY_TESTNET_ACCOUNT_HERE"; // Replace with testnet account
      useTestTokens = true;
    };
  };

  // Get configuration based on environment
  public func getConfigForEnvironment(environment : Text) : Types.EnvironmentConfig {
    switch (environment) {
      case ("production") { getProductionConfig() };
      case ("testnet") { getTestnetConfig() };
      case ("development") { getDevelopmentConfig() };
      case (_) { getProductionConfig() }; // Default to production for mainnet
    };
  };

  // Helper function to get current environment (can be modified based on your needs)
  public func getCurrentEnvironment() : Text {
    "production"; // Default to production for mainnet deployment
  };

  // Get the current configuration
  public func getCurrentConfig() : Types.EnvironmentConfig {
    getConfigForEnvironment(getCurrentEnvironment());
  };
};
