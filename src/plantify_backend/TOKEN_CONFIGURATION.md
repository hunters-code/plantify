# Token Configuration Guide

This document explains how to configure the Plantify backend to use either test tokens or mainnet ckUSDC tokens.

## Configuration Overview

The system now supports two token modes:
1. **Test Token Mode** - Uses a local test token for development and testing
2. **Mainnet Token Mode** - Uses real ckUSDC tokens from ICP mainnet

## Environment Configuration

### Development Mode (Default)
```motoko
{
    useTestToken = true;
    mainnetCkUSDC = null;
    plantifyAccount = "rrkah-fqaaa-aaaah-qcvmq-cai";
}
```

### Production Mode
```motoko
{
    useTestToken = false;
    mainnetCkUSDC = ?{
        canisterId = "ckUSDC_CANISTER_ID_HERE";
        ledgerId = "ckUSDC_LEDGER_ID_HERE";
    };
    plantifyAccount = "PLANTIFY_PRODUCTION_ACCOUNT_HERE";
}
```

### Testnet Mode
```motoko
{
    useTestToken = false;
    mainnetCkUSDC = ?{
        canisterId = "ckUSDC_TESTNET_CANISTER_ID_HERE";
        ledgerId = "ckUSDC_TESTNET_LEDGER_ID_HERE";
    };
    plantifyAccount = "PLANTIFY_TESTNET_ACCOUNT_HERE";
}
```

## How to Switch Environments

### Method 1: Update main.mo
Change the configuration in `src/plantify_backend/main.mo`:

```motoko
// For development
private let config : Types.EnvironmentConfig = Config.getDevelopmentConfig();

// For production
private let config : Types.EnvironmentConfig = Config.getProductionConfig();

// For testnet
private let config : Types.EnvironmentConfig = Config.getTestnetConfig();
```

### Method 2: Use Environment Variable
You can also use the `getConfigForEnvironment()` function:

```motoko
private let config : Types.EnvironmentConfig = Config.getConfigForEnvironment("production");
```

## Configuration Files

### config.mo
Contains predefined configurations for different environments:
- `getDevelopmentConfig()` - Test token mode
- `getProductionConfig()` - Mainnet ckUSDC mode
- `getTestnetConfig()` - Testnet ckUSDC mode
- `getConfigForEnvironment(environment)` - Dynamic configuration

### Required Mainnet Configuration

When using mainnet mode, you need to provide:

1. **ckUSDC Canister ID** - The canister ID of the ckUSDC token on ICP mainnet
2. **ckUSDC Ledger ID** - The ledger canister ID for ckUSDC
3. **Plantify Account** - The principal ID where collateral will be sent

## API Methods

### Configuration Queries
- `getEnvironmentConfig()` - Get current configuration
- `isUsingTestToken()` - Check if using test token
- `getPlantifyAccount()` - Get Plantify account principal
- `getMainnetConfig()` - Get mainnet configuration (if any)

### Token Operations
All token operations work the same regardless of configuration:
- `mintTestTokens()` - Only works in test mode
- `getTokenBalance()` - Get user's token balance
- `getTokenInfo()` - Get token metadata
- `topUpCollateral()` - Transfer tokens as collateral

## Security Considerations

### Test Mode
- ✅ Safe for development
- ✅ No real tokens involved
- ✅ Can mint unlimited test tokens
- ❌ Not suitable for production

### Mainnet Mode
- ✅ Uses real ckUSDC tokens
- ✅ Production-ready
- ❌ Requires proper mainnet configuration
- ❌ Real tokens at risk if misconfigured

## Deployment Checklist

### For Production Deployment:

1. **Update Configuration**
   ```motoko
   private let config : Types.EnvironmentConfig = Config.getProductionConfig();
   ```

2. **Set Mainnet Values**
   - Replace `ckUSDC_CANISTER_ID_HERE` with actual ckUSDC canister ID
   - Replace `ckUSDC_LEDGER_ID_HERE` with actual ledger ID
   - Replace `PLANTIFY_PRODUCTION_ACCOUNT_HERE` with Plantify's mainnet account

3. **Verify Configuration**
   ```bash
   # Check if using test token (should return false)
   dfx canister call plantify_backend isUsingTestToken

   # Get current configuration
   dfx canister call plantify_backend getEnvironmentConfig
   ```

4. **Test Token Operations**
   ```bash
   # Test token info (should show real ckUSDC info)
   dfx canister call plantify_backend getTokenInfo

   # Test balance (should show real balance)
   dfx canister call plantify_backend getTokenBalance
   ```

## Troubleshooting

### Common Issues:

1. **"Mainnet token not configured"**
   - Ensure `mainnetCkUSDC` is not null in production config
   - Verify canister IDs are correct

2. **"Transfer failed"**
   - Check if user has sufficient ckUSDC balance
   - Verify Plantify account is correct
   - Ensure mainnet canister IDs are valid

3. **"Minting not available"**
   - Minting only works in test mode
   - Use `isUsingTestToken()` to check current mode

### Debug Commands:

```bash
# Check current environment
dfx canister call plantify_backend isUsingTestToken

# Get full configuration
dfx canister call plantify_backend getEnvironmentConfig

# Test token operations
dfx canister call plantify_backend getTokenInfo
dfx canister call plantify_backend getTokenBalance
```

## Migration from Test to Production

1. **Backup Test Data** (if needed)
2. **Update Configuration** to production mode
3. **Deploy to Mainnet**
4. **Verify Configuration** using debug commands
5. **Test with Small Amounts** first
6. **Monitor Transactions** for any issues

## Support

For issues with token configuration:
1. Check the configuration using the debug commands above
2. Verify mainnet canister IDs are correct
3. Ensure sufficient token balance for operations
4. Check Plantify account principal is valid
