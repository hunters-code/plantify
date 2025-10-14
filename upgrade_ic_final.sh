#!/bin/bash

# Final IC Network Upgrade Script
# Menggunakan stable variables untuk data persistence

echo "🚀 IC Network Upgrade - Final Version"
echo "====================================="
echo "✅ Data persistence menggunakan stable variables"
echo "✅ Tidak menggunakan preupgrade/postupgrade (deprecated)"
echo "✅ Fungsi pembersih karakter non-numerik sudah aktif"
echo ""

# Check if dfx is running
if ! dfx ping 2>/dev/null; then
    echo "❌ dfx is not running. Please start dfx first:"
    echo "   dfx start --clean"
    exit 1
fi

echo "✅ dfx is running"

# Deploy ke IC network
echo "📦 Deploying to IC network..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful!"
    echo ""
    echo "🎉 Your canister has been upgraded successfully!"
    echo ""
    echo "📊 Data persistence features:"
    echo "   ✅ Stable variables preserve all data across upgrades"
    echo "   ✅ Founders, investors, startups, reports, and votes are preserved"
    echo "   ✅ Numeric string cleaning is active for all financial inputs"
    echo ""
    echo "🔧 What's new in this version:"
    echo "   ✅ Automatic cleaning of currency symbols (Rp, $, IDR, USD)"
    echo "   ✅ Automatic cleaning of special characters (., ,, %)"
    echo "   ✅ Automatic cleaning of mixed characters (abc123def → 123)"
    echo "   ✅ Empty strings default to '0'"
    echo ""
    echo "🚀 Your Plantify backend is now ready!"
    exit 0
else
    echo "❌ Upgrade failed"
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "1. Check your internet connection"
    echo "2. Verify you have enough cycles: dfx wallet balance"
    echo "3. Check your identity: dfx identity whoami"
    echo "4. Try again in a few minutes"
    exit 1
fi
