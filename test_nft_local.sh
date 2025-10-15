#!/bin/bash

# Test NFT functionality locally
# This script tests the NFT minting and retrieval process

echo "🚀 Testing NFT functionality locally..."

# Set the environment to local
export DFX_NETWORK=local

# Test 1: Check initial NFT count
echo "📊 Test 1: Checking initial NFT count..."
dfx canister call plantify_backend getAllNFTs

# Test 2: Get NFT stats
echo "📈 Test 2: Getting NFT stats..."
dfx canister call plantify_backend getNFTStats

# Test 3: Check if there are any startups
echo "🏢 Test 3: Checking available startups..."
dfx canister call plantify_backend getStartupsPaginated '(record { page = 1 : nat; limit = 10 : nat })'

# Test 4: Create a founder first
echo "👤 Test 4a: Creating test founder..."
FOUNDER_RESULT=$(dfx canister call plantify_backend registerFounder '(record { fullName = "Test Founder"; email = "test@example.com"; phone = "1234567890"; address = "123 Test Street"; experience = "5 years"; previousBusinesses = "Test businesses"; expertise = "blockchain"; linkedIn = "https://linkedin.com/test"; idNumber = "123456789"; taxNumber = "987654321" })')

echo "Founder creation result: $FOUNDER_RESULT"

# Extract founder ID from the result
FOUNDER_ID=$(echo "$FOUNDER_RESULT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
echo "Founder ID: $FOUNDER_ID"

# Test 4b: Create a test startup
echo "🏗️ Test 4b: Creating test startup..."
STARTUP_ID=$(dfx canister call plantify_backend createStartupForFounder '("'$FOUNDER_ID'", record {
  startupName = "Test Startup";
  sector = "Technology";
  foundedYear = "2024";
  description = "A test startup for NFT testing";
  website = "https://teststartup.com";
  location = "San Francisco";
  companyType = "Technology";
  companyLogo = null;
  companyImages = vec {};
  nftImage = null;
  problemStatement = "Test problem";
  solution = "Test solution";
  targetMarket = "Test market";
  competitiveAdvantage = "Test advantage";
  marketingStrategy = "Test strategy";
  operationalProcess = "Test process";
  founderBackground = "Test background";
  teamMembers = vec { record { id = 1; name = "Test Founder"; role = "CEO"; background = "Test background"; photo = null; linkedin = "https://linkedin.com/test"; email = "test@example.com"; isFounder = true } };
  advisors = "Test advisors";
  fundingGoal = "10000";
  nftPrice = "100";
  periodicProfitSharing = "10";
  revenueModel = "Test model";
  monthlyRevenue = "1000";
  monthlyExpenses = "500";
  useOfFunds = "Test use";
  businessPlan = null;
  financialProjections = null;
  legalDocuments = null;
  status = "Pending";
  builtByCaffeineAI = null;
})' | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

if [ -n "$STARTUP_ID" ]; then
  echo "✅ Test startup created with ID: $STARTUP_ID"
  
  # Test 5: Initialize collateral for the startup
  echo "💰 Test 5: Initializing collateral..."
  dfx canister call plantify_backend initializeCollateral "(\"$STARTUP_ID\", 1000, \"ICP\")"
  
  # Test 6: Update startup status to Active (this should trigger NFT minting)
  echo "🔄 Test 6: Updating startup status to Active..."
  dfx canister call plantify_backend updateStartupStatus "(\"$STARTUP_ID\", \"Active\")"
  
  # Wait a moment for the async minting to complete
  echo "⏳ Waiting for NFT minting to complete..."
  sleep 5
  
  # Test 7: Check NFT count after minting
  echo "🎨 Test 7: Checking NFT count after minting..."
  dfx canister call plantify_backend getAllNFTs
  
  # Test 8: Get NFTs by startup
  echo "🔍 Test 8: Getting NFTs by startup..."
  dfx canister call plantify_backend getNFTsByStartup "(\"$STARTUP_ID\")"
  
  # Test 9: Get NFT stats after minting
  echo "📊 Test 9: Getting NFT stats after minting..."
  dfx canister call plantify_backend getNFTStats
  
  # Test 10: Check startup status
  echo "📋 Test 10: Checking startup status..."
  dfx canister call plantify_backend getStartup "(\"$STARTUP_ID\")"
  
else
  echo "❌ Failed to create test startup"
fi

# Test 11: Manual NFT minting test
echo "🎯 Test 11: Testing manual NFT minting..."
if [ -n "$STARTUP_ID" ]; then
  dfx canister call plantify_backend mintNFTForStartup "(\"$STARTUP_ID\")"
  
  # Wait for minting
  sleep 3
  
  # Check NFTs again
  echo "🔍 Checking NFTs after manual minting..."
  dfx canister call plantify_backend getAllNFTs
  dfx canister call plantify_backend getNFTsByStartup "(\"$STARTUP_ID\")"
fi

echo "✅ NFT testing completed!"
echo "📝 Summary:"
echo "  - Check if NFTs are being minted successfully"
echo "  - Verify NFT data persistence"
echo "  - Confirm getAllNFTs returns data"
echo "  - Test getNFTsByStartup functionality"

# Keep the replica running for manual testing
echo "🔄 Local replica is still running. You can run additional tests manually."
echo "💡 To stop the replica, run: dfx stop"
