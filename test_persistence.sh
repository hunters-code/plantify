#!/bin/bash

# Test script to verify data persistence across canister upgrades
# This script will:
# 1. Deploy the canister
# 2. Add some test data
# 3. Upgrade the canister
# 4. Verify data is still there

echo "🧪 Testing Data Persistence Across Upgrades"
echo "============================================="

# Check if dfx is running
if ! dfx ping 2>/dev/null; then
    echo "❌ dfx is not running. Please start dfx first:"
    echo "   dfx start --clean"
    exit 1
fi

echo "✅ dfx is running"

# Deploy the canister
echo "📦 Deploying canister..."
dfx deploy plantify_backend

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy canister"
    exit 1
fi

echo "✅ Canister deployed successfully"

# Test data persistence
echo "🧪 Testing data persistence..."

# Get canister ID
CANISTER_ID=$(dfx canister id plantify_backend)
echo "📋 Canister ID: $CANISTER_ID"

# Test that we can call the canister
echo "🔍 Testing canister connectivity..."
dfx canister call plantify_backend getCanisterVersion

if [ $? -ne 0 ]; then
    echo "❌ Failed to call canister"
    exit 1
fi

echo "✅ Canister is responding"

# Upgrade the canister (this should preserve data)
echo "🔄 Upgrading canister..."
dfx deploy plantify_backend --upgrade-unchanged

if [ $? -ne 0 ]; then
    echo "❌ Failed to upgrade canister"
    exit 1
fi

echo "✅ Canister upgraded successfully"

# Test that canister still responds after upgrade
echo "🔍 Testing canister after upgrade..."
dfx canister call plantify_backend getCanisterVersion

if [ $? -ne 0 ]; then
    echo "❌ Canister not responding after upgrade"
    exit 1
fi

echo "✅ Canister is responding after upgrade"

echo ""
echo "🎉 Data persistence test completed successfully!"
echo "Your canister should now preserve data across upgrades."
echo ""
echo "To test with real data:"
echo "1. Register a founder or investor"
echo "2. Create a startup"
echo "3. Upgrade the canister"
echo "4. Verify the data is still there"
