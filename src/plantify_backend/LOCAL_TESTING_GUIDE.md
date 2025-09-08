# Plantify Backend Local Testing Guide

## 🚀 Deployment Status
✅ **Backend Canister Deployed Successfully**
- **Canister ID**: `uxrrr-q7777-77774-qaaaq-cai`
- **Candid UI**: http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=uxrrr-q7777-77774-qaaaq-cai
- **Network**: Local (127.0.0.1:4943)

## 📋 Available Functions

### 1. Registration Services
- `registerFounder(request: FounderRegistrationRequest)`
- `registerInvestor(request: InvestorRegistrationRequest)`

### 2. Startup Creation
- `createStartup(request: StartupCreationRequest)`

### 3. Transfer & Collateral Services
- `initializeCollateral(startupId: Text, requiredAmount: Nat)`
- `topUpCollateral(request: TopUpRequest)`
- `getCollateralStatus(startupId: Text)`
- `getCollateralTopUpHistory(startupId: Text)`
- `getCollateralProgress(startupId: Text)`

### 4. Token Management
- `mintTestTokens(amount: Nat)`
- `getTokenBalance()`
- `getTokenInfo()`
- `calculateRequiredCollateral(monthlyProfitSharing: Nat)`

### 5. Configuration
- `getEnvironmentConfig()`
- `isUsingTestToken()`
- `getPlantifyAccount()`
- `getMainnetConfig()`

## 🧪 Testing Commands

### Test 1: Check Environment Configuration
```bash
dfx canister call plantify_backend getEnvironmentConfig
dfx canister call plantify_backend isUsingTestToken
dfx canister call plantify_backend getPlantifyAccount
```

### Test 2: Token Management
```bash
# Get token info
dfx canister call plantify_backend getTokenInfo

# Mint test tokens (1000 tokens)
dfx canister call plantify_backend mintTestTokens '(1000)'

# Check token balance
dfx canister call plantify_backend getTokenBalance

# Calculate required collateral for 1000 monthly profit sharing
dfx canister call plantify_backend calculateRequiredCollateral '(1000)'
```

### Test 3: Founder Registration
```bash
dfx canister call plantify_backend registerFounder '(
  record {
    fullName = "John Doe";
    email = "john@example.com";
    phone = "+1234567890";
    address = "123 Main St, City, Country";
    experience = "5 years in tech";
    previousBusinesses = "Tech startup, Consulting firm";
    expertise = "blockchain, fintech";
    linkedIn = "https://linkedin.com/in/johndoe";
    idNumber = "ID123456789";
    taxNumber = "TAX987654321";
  }
)'
```

### Test 4: Investor Registration
```bash
dfx canister call plantify_backend registerInvestor '(
  record {
    fullName = "Jane Smith";
    email = "jane@example.com";
    phone = "+1987654321";
    country = "United States";
    city = "San Francisco";
    investmentExperience = "10 years angel investing";
    riskTolerance = "high";
    investmentGoals = "Long-term growth";
    availableCapital = "100000";
    monthlyBudget = "10000";
  }
)'
```

### Test 5: Startup Creation
```bash
dfx canister call plantify_backend createStartup '(
  record {
    startupName = "TechCorp";
    sector = "fintech";
    foundedYear = "2024";
    description = "Revolutionary blockchain solution";
    website = "https://techcorp.com";
    location = "San Francisco, CA";
    companyType = "LLC";
    problemStatement = "Traditional banking is slow and expensive";
    solution = "Blockchain-based instant payments";
    targetMarket = "Small businesses and freelancers";
    competitiveAdvantage = "Lower fees and faster processing";
    marketingStrategy = "Digital marketing and partnerships";
    operationalProcess = "Automated blockchain transactions";
    founderBackground = "10 years in fintech";
    teamMembers = vec {
      record {
        id = 1;
        name = "Alice Johnson";
        role = "CEO";
        background = "10 years in fintech";
        photo = null;
        linkedin = "https://linkedin.com/in/alice";
        email = "alice@techcorp.com";
        isFounder = true;
      }
    };
    advisors = "Industry experts from top companies";
    fundingGoal = "100000";
    nftPrice = "1000";
    periodicProfitSharing = "5000";
    revenueModel = "Transaction fees";
    monthlyRevenue = "10000";
    monthlyExpenses = "5000";
    useOfFunds = "Product development and marketing";
    collateralSource = "Company assets";
    collateralAmount = "50000";
    businessPlan = null;
    financialProjections = null;
    legalDocuments = null;
    status = "active";
  }
)'
```

### Test 6: Collateral Management
```bash
# Initialize collateral for startup (assuming startup ID from previous call)
dfx canister call plantify_backend initializeCollateral '("startup-1", 10000)'

# Check collateral status
dfx canister call plantify_backend getCollateralStatus '("startup-1")'

# Top up collateral
dfx canister call plantify_backend topUpCollateral '(
  record {
    startupId = "startup-1";
    amount = 5000;
  }
)'

# Get collateral progress
dfx canister call plantify_backend getCollateralProgress '("startup-1")'

# Get collateral top-up history
dfx canister call plantify_backend getCollateralTopUpHistory '("startup-1")'
```

## 🔍 Monitoring & Debugging

### View Candid Interface
Open your browser and go to:
http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=uxrrr-q7777-77774-qaaaq-cai

### Check Canister Status
```bash
dfx canister status plantify_backend
```

### View Canister Logs
```bash
dfx canister logs plantify_backend
```

### Stop Local Replica
```bash
dfx stop
```

## 🚨 Troubleshooting

### If deployment fails:
1. Check if dfx is running: `dfx ping`
2. Restart dfx: `dfx stop && dfx start --clean --background`
3. Recreate canister: `dfx canister delete plantify_backend && dfx canister create plantify_backend`

### If calls fail:
1. Check canister status: `dfx canister status plantify_backend`
2. View logs: `dfx canister logs plantify_backend`
3. Ensure you have sufficient cycles in your wallet

## 📊 Test Results Summary

### ✅ Successfully Tested Functions:
1. **Environment Configuration**: ✅ Working
   - `getEnvironmentConfig()` - Returns development config with test token enabled
   - `isUsingTestToken()` - Returns `true`
   - `getPlantifyAccount()` - Returns plantify account ID

2. **Token Management**: ✅ Working
   - `getTokenInfo()` - Returns "CkUSDC Test Token", "ckUSDC", 6 decimals, 1000 total supply
   - `mintTestTokens(1000)` - Successfully minted 1000 tokens
   - `getTokenBalance()` - Returns current balance (1000)
   - `calculateRequiredCollateral(5000)` - Returns 66000 (13.2x multiplier)

3. **Registration Services**: ✅ Working
   - `registerFounder()` - Successfully registered founder with ID "1"
   - `registerInvestor()` - Successfully registered investor with ID "1"

### ⚠️ Functions Requiring Further Testing:
1. **Startup Creation**: ⚠️ Needs founder registration persistence fix
   - `createStartup()` - Returns "Founder not found" error
   - Issue: Founder registration may not be persisting properly

2. **Collateral Management**: ⚠️ Depends on startup creation
   - `initializeCollateral()` - Returns "Startup not found"
   - `getCollateralStatus()` - Returns "Collateral info not found"
   - These will work once startup creation is fixed

### 🔧 Next Steps for Full Testing:
1. Fix founder registration persistence issue
2. Test startup creation with proper founder association
3. Test complete collateral management workflow
4. Test transfer and top-up functionality

## 🔄 Next Steps

1. Test all functions systematically
2. Verify data persistence across canister restarts
3. Test error handling with invalid inputs
4. Performance testing with multiple concurrent calls
5. Integration testing with frontend (when ready)
