#!/bin/bash

# Test NFT persistence on IC network
echo "🌐 Testing NFT persistence on IC network..."

# Set the environment to IC
export DFX_NETWORK=ic

# Deploy the backend
echo "🔧 Deploying plantify_backend to IC..."
dfx deploy plantify_backend --mode upgrade --wasm-memory-persistence keep --network ic

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 5

echo ""
echo "📊 Step 1: Check initial NFT state"
echo "=================================="
echo "NFT Stats:"
dfx canister call plantify_backend getNFTStats --network ic

echo ""
echo "All NFTs:"
dfx canister call plantify_backend getAllNFTs --network ic

echo ""
echo "Debug NFT Persistence:"
dfx canister call plantify_backend debugNFTPersistence --network ic

echo ""
echo "Canister Version:"
dfx canister call plantify_backend getCanisterVersion --network ic

echo ""
echo "💡 Manual testing commands for IC network:"
echo "=========================================="
echo "1. Create founder:"
echo "   dfx canister call plantify_backend registerFounder '(record { fullName = \"Test Founder\"; email = \"test@example.com\"; phone = \"1234567890\"; address = \"123 Test Street\"; experience = \"5 years\"; previousBusinesses = \"Test businesses\"; expertise = \"blockchain\"; linkedIn = \"https://linkedin.com/test\"; idNumber = \"123456789\"; taxNumber = \"987654321\" })' --network ic"
echo ""
echo "2. Create startup (replace FOUNDER_ID with actual ID):"
echo "   dfx canister call plantify_backend createStartupForFounder '(\"FOUNDER_ID\", record { startupName = \"Test Startup\"; sector = \"Technology\"; foundedYear = \"2024\"; description = \"Test description\"; website = \"https://teststartup.com\"; location = \"San Francisco\"; companyType = \"Technology\"; companyLogo = null; companyImages = vec {}; nftImage = null; problemStatement = \"Test problem\"; solution = \"Test solution\"; targetMarket = \"Test market\"; competitiveAdvantage = \"Test advantage\"; marketingStrategy = \"Test strategy\"; operationalProcess = \"Test process\"; founderBackground = \"Test background\"; teamMembers = vec { record { id = 1; name = \"Test Founder\"; role = \"CEO\"; background = \"Test background\"; photo = null; linkedin = \"https://linkedin.com/test\"; email = \"test@example.com\"; isFounder = true } }; advisors = \"Test advisors\"; fundingGoal = \"10000\"; nftPrice = \"100\"; periodicProfitSharing = \"10\"; revenueModel = \"Test model\"; monthlyRevenue = \"1000\"; monthlyExpenses = \"500\"; useOfFunds = \"Test use\"; businessPlan = null; financialProjections = null; legalDocuments = null; status = \"Pending\"; builtByCaffeineAI = null })' --network ic"
echo ""
echo "3. Initialize collateral:"
echo "   dfx canister call plantify_backend initializeCollateral '(\"STARTUP_ID\", 1000, \"ICP\")' --network ic"
echo ""
echo "4. Update startup status to Active:"
echo "   dfx canister call plantify_backend updateStartupStatus '(\"STARTUP_ID\", \"Active\")' --network ic"
echo ""
echo "5. Check NFTs:"
echo "   dfx canister call plantify_backend getAllNFTs --network ic"
echo "   dfx canister call plantify_backend getNFTsByStartup '(\"STARTUP_ID\")' --network ic"
echo "   dfx canister call plantify_backend debugNFTPersistence --network ic"

echo ""
echo "🔄 Test completed! Use the manual commands above to test NFT persistence on IC network."
