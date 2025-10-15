import Types "./modules/types";

module Config {
  // Version constants for canister upgrades
  public let CURRENT_CANISTER_VERSION : Nat = 3;
  // Development/Testing Configuration
  public func getDevelopmentConfig() : Types.EnvironmentConfig {
    {
      environment = "development";
      icpToken = {
        canisterId = "72oxd-oyaaa-aaaam-qd5na-cai";
        ledgerId = "72oxd-oyaaa-aaaam-qd5na-cai";
        name = "Internet Computer";
        symbol = "ICP";
        decimals = 8;
        fee = 10000;
      };
      ckUSDCToken = {
        canisterId = "hbxhn-uiaaa-aaaak-qumlq-cai";
        ledgerId = "hbxhn-uiaaa-aaaak-qumlq-cai";
        name = "CkUSDC Token";
        symbol = "ckUSDC";
        decimals = 8;
        fee = 10000;
      };
      nftToken = {
        canisterId = "oncwy-yqaaa-aaaae-qfzja-cai"; // Use Plantify backend canister ID
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
      plantifyAccount = "qzvg3-e2uko-chkzo-bpegv-vf6ev-hvbjc-bky6t-2t3ye-lf5lk-gw5rm-fqe";
      useTestTokens = true;
    };
  };

  // Production Configuration
  public func getProductionConfig() : Types.EnvironmentConfig {
    {
      environment = "production";
      icpToken = {
        canisterId = "72oxd-oyaaa-aaaam-qd5na-cai"; // ICP Ledger on mainnet
        ledgerId = "72oxd-oyaaa-aaaam-qd5na-cai";
        name = "Internet Computer";
        symbol = "ICP";
        decimals = 8;
        fee = 10000;
      };
      ckUSDCToken = {
        canisterId = "hbxhn-uiaaa-aaaak-qumlq-cai"; // ckUSDC on mainnet
        ledgerId = "hbxhn-uiaaa-aaaak-qumlq-cai";
        name = "CkUSDC";
        symbol = "ckUSDC";
        decimals = 8;
        fee = 10000;
      };
      nftToken = {
        canisterId = "oncwy-yqaaa-aaaae-qfzja-cai"; // Use Plantify backend canister ID
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
      plantifyAccount = "qzvg3-e2uko-chkzo-bpegv-vf6ev-hvbjc-bky6t-2t3ye-lf5lk-gw5rm-fqe"; // Replace with actual production account
      useTestTokens = false;
    };
  };

  // Testnet Configuration
  public func getTestnetConfig() : Types.EnvironmentConfig {
    {
      environment = "testnet";
      icpToken = {
        canisterId = "72oxd-oyaaa-aaaam-qd5na-cai"; // ICP Ledger on testnet
        ledgerId = "72oxd-oyaaa-aaaam-qd5na-cai";
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
        canisterId = "oncwy-yqaaa-aaaae-qfzja-cai"; // Use Plantify backend canister ID
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
      plantifyAccount = "qzvg3-e2uko-chkzo-bpegv-vf6ev-hvbjc-bky6t-2t3ye-lf5lk-gw5rm-fqe"; // Replace with testnet account
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
    "development"; // Using development environment for testnet ckUSDC
  };

  // Get the current configuration
  public func getCurrentConfig() : Types.EnvironmentConfig {
    getConfigForEnvironment(getCurrentEnvironment());
  };
};
