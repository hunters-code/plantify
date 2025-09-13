# ckUSDC Token

A fully compliant ICRC-1 and ICRC-2 token implementation for the Plantify project.

## Token Configuration

- **Name**: CkUSDC Token
- **Symbol**: ckUSDC
- **Decimals**: 8
- **Transfer Fee**: 10,000 (0.0001 ckUSDC)
- **Standards**: ICRC-1 & ICRC-2 compliant

## Quick Start

### Deploy the Token

```bash
# Deploy all canisters
dfx deploy

# Or deploy just the token
dfx deploy ckUSDC
```

### Initialize with Initial Supply

```bash
# Initialize token with 1,000,000 ckUSDC (1M tokens with 8 decimals)
dfx canister call ckUSDC initialize_with_supply '(100000000000000)'
```

### Check Token Info

```bash
# Get token name
dfx canister call ckUSDC icrc1_name

# Get token symbol  
dfx canister call ckUSDC icrc1_symbol

# Get decimals
dfx canister call ckUSDC icrc1_decimals

# Get transfer fee
dfx canister call ckUSDC icrc1_fee
```

### Mint More Tokens (Available for Anyone - Testing Token)

```bash
# Mint 100,000 ckUSDC to your account
dfx canister call ckUSDC mint '(
  record {
    owner = principal "YOUR_PRINCIPAL_ID";
    subaccount = null;
  },
  10000000000000
)'

# Or use the convenience function to mint to yourself
dfx canister call ckUSDC mint_to_self '(10000000000000)'
```

### Transfer Tokens

```bash
# Transfer 10,000 ckUSDC to another account
dfx canister call ckUSDC icrc1_transfer '(
  record {
    to = record {
      owner = principal "RECIPIENT_PRINCIPAL_ID";
      subaccount = null;
    };
    amount = 1000000000000;
    fee = null;
    memo = null;
    created_at_time = null;
  }
)'
```

### Check Balance

```bash
# Check your balance
dfx canister call ckUSDC icrc1_balance_of '(
  record {
    owner = principal "YOUR_PRINCIPAL_ID";
    subaccount = null;
  }
)'
```

## API Methods

### Token Management
- `initialize_with_supply(amount)` - Initialize token with initial supply
- `mint(to, amount)` - Mint new tokens (available for anyone - testing token)
- `mint_to_self(amount)` - Mint tokens to caller's account (convenience function)
- `token_created()` - Check if token is initialized

### ICRC-1 Standard
- `icrc1_transfer()` - Transfer tokens
- `icrc1_balance_of()` - Get account balance
- `icrc1_total_supply()` - Get total supply
- `icrc1_name()` - Get token name
- `icrc1_symbol()` - Get token symbol
- `icrc1_decimals()` - Get token decimals
- `icrc1_fee()` - Get transfer fee
- `icrc1_metadata()` - Get token metadata

### ICRC-2 Standard
- `icrc2_approve()` - Approve spending allowance
- `icrc2_transfer_from()` - Transfer from approved account
- `icrc2_allowance()` - Get current allowance

## Integration with Plantify

This token is designed to work seamlessly with the Plantify backend for:
- Startup collateral management
- Investment transactions
- Profit sharing distributions
- Platform fees

## Notes

- The token is pre-initialized with proper name, symbol, and decimals
- **Anyone can mint new tokens** (testing token - no restrictions)
- All transfers include a 10,000 unit fee (0.0001 ckUSDC)
- The token supports both ICRC-1 and ICRC-2 standards
- Use `mint_to_self()` for easy self-minting during testing