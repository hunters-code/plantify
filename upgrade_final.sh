#!/bin/bash

# Final upgrade script untuk IC network
# Menggunakan stable variables untuk data persistence (tidak perlu preupgrade/postupgrade)

echo "🚀 Final IC Network Upgrade"
echo "============================"
echo "Using stable variables for data persistence"
echo ""

# Method 1: Simple upgrade tanpa opsi khusus
echo "🔄 Method 1: Simple upgrade without special options..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful!"
    echo ""
    echo "📊 Data persistence is handled by stable variables:"
    echo "   - foundersEntries"
    echo "   - investorsEntries" 
    echo "   - startupsEntries"
    echo "   - monthlyReportsEntries"
    echo "   - votesEntries"
    echo "   - All ID counters (nextFounderId, nextInvestorId, etc.)"
    echo ""
    echo "🎉 Your data should be preserved across upgrades!"
    exit 0
fi

echo "⚠️  Method 1 failed, trying Method 2..."

# Method 2: Upgrade dengan wasm-memory-persistence replace
echo "🔄 Method 2: Upgrade with wasm-memory-persistence replace..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade --wasm-memory-persistence replace

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful with wasm-memory-persistence!"
    echo ""
    echo "📊 Data persistence is handled by stable variables"
    echo "🎉 Your data should be preserved across upgrades!"
    exit 0
fi

echo "❌ Both methods failed"
echo ""
echo "🔧 Troubleshooting tips:"
echo "1. Check if you have the correct permissions"
echo "2. Verify your canister ID is correct"
echo "3. Try running: dfx identity whoami"
echo "4. Check if you have enough cycles"
exit 1
