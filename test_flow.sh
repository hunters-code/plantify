#!/bin/bash

# Test Flow Script for Plantify on IC Network
# Canister ID: oncwy-yqaaa-aaaae-qfzja-cai

echo "🚀 Starting Plantify Test Flow on IC Network"
echo "Canister: oncwy-yqaaa-aaaae-qfzja-cai"
echo "Principal: oq7j7-au25h-xzu3k-bvzfe-ip3jg-4sdkj-46gjh-db6oe-mcdea-z7mv4-bae"
echo ""

# Set environment variables to avoid color issues
export DFX_COLOR=0
export NO_COLOR=1

# Step 1: Check canister status
echo "📋 Step 1: Checking canister status..."
dfx canister --network ic status oncwy-yqaaa-aaaae-qfzja-cai

echo ""
echo "📋 Step 2: Getting environment configuration..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getEnvironmentConfig

echo ""
echo "📋 Step 3: Registering as Founder..."
FOUNDER_REQUEST='(record {
  fullName = "Test Founder";
  email = "founder@test.com";
  phone = "+1234567890";
  address = "123 Test St, San Francisco, CA, USA";
  experience = "5 years in tech";
  previousBusinesses = "Tech startup";
  expertise = "Software development";
  linkedIn = "https://linkedin.com/in/testfounder";
  idNumber = "123456789";
  taxNumber = "987654321";
})'

dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai registerFounder "$FOUNDER_REQUEST"

echo ""
echo "📋 Step 4: Creating startup..."
STARTUP_REQUEST='(record {
  startupName = "Test Startup";
  sector = "Technology";
  foundedYear = "2024";
  description = "A test startup for NFT testing";
  website = "https://teststartup.com";
  location = "San Francisco, CA";
  companyType = "LLC";
  companyLogo = null;
  companyImages = vec {};
  nftImage = null;
  problemStatement = "Test problem";
  solution = "Test solution";
  targetMarket = "Global";
  competitiveAdvantage = "Test advantage";
  marketingStrategy = "Test strategy";
  operationalProcess = "Test process";
  founderBackground = "Test background";
  teamMembers = vec {
    record {
      id = 1;
      name = "Test Founder";
      role = "CEO";
      background = "Test background";
      photo = null;
      linkedin = "https://linkedin.com/in/test";
      email = "founder@test.com";
      isFounder = true;
    };
  };
  advisors = "Test advisors";
  fundingGoal = "1000000";
  nftPrice = "100";
  periodicProfitSharing = "10";
  revenueModel = "SaaS";
  monthlyRevenue = "50000";
  monthlyExpenses = "30000";
  useOfFunds = "Development";
  businessPlan = null;
  financialProjections = null;
  legalDocuments = null;
  status = "pending";
  builtByCaffeineAI = null;
})'

dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai createStartup "$STARTUP_REQUEST"

echo ""
echo "📋 Step 5: Getting startup ID (assuming it's the first one)..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getStartupsByFounderPrincipalPaginated '(record { page = 1; limit = 10 })'

echo ""
echo "📋 Step 6: Approving startup (assuming startup ID is '1')..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai updateStartupStatus '("1", "Active")'

echo ""
echo "📋 Step 7: Registering as Investor..."
INVESTOR_REQUEST='(record {
  fullName = "Test Investor";
  email = "investor@test.com";
  phone = "+1234567890";
  country = "USA";
  city = "New York";
  location = opt "New York, NY";
  occupation = opt "Investor";
  company = opt "Test Investment Co";
  bio = opt "Test investor bio";
  profilePhoto = null;
  investmentExperience = "10 years";
  riskTolerance = "High";
  investmentGoals = "High returns";
  availableCapital = "500000";
  monthlyBudget = "50000";
})'

dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai registerInvestor "$INVESTOR_REQUEST"

echo ""
echo "📋 Step 8: Getting investor ID..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getInvestorByPrincipal

echo ""
echo "📋 Step 9: Testing single NFT purchase (quantity = 1)..."
echo "Note: NFT purchase may fail due to principal handling issue - this needs to be debugged"
SINGLE_PURCHASE='(record {
  startupId = "1";
  investorId = "1";
  quantity = 1;
  memo = opt "Single NFT test purchase";
})'

dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai purchaseNFT "$SINGLE_PURCHASE"

echo ""
echo "📋 Step 10: Testing multiple NFT purchase (quantity = 2)..."
echo "Note: NFT purchase may fail due to principal handling issue - this needs to be debugged"
MULTIPLE_PURCHASE='(record {
  startupId = "1";
  investorId = "1";
  quantity = 2;
  memo = opt "Multiple NFT test purchase";
})'

dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai purchaseNFT "$MULTIPLE_PURCHASE"

echo ""
echo "📋 Step 11: Checking startup totalFunded..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getStartup '("1")'

echo ""
echo "📋 Step 12: Checking investor purchases..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getInvestorPurchases '("1")'

echo ""
echo "✅ Test flow completed!"
echo "Summary:"
echo "- Founder registered and startup created"
echo "- Startup approved and made active"
echo "- Investor registered"
echo "- NFT purchase testing (may fail due to principal issue)"
echo ""
echo "🔍 Debug Notes:"
echo "- If NFT purchase fails with 'blob_of_principal: invalid principal' error,"
echo "  this indicates an issue with principal handling in the NFT service"
echo "- The issue might be in the NFT service initialization or principal passing"
echo "- Check the NFT service configuration and principal handling"
echo "- Consider testing NFT purchase through the frontend application instead"
