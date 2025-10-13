#!/bin/bash

# Debug NFT Service Script
export TERM=dumb
export NO_COLOR=1
export DFX_COLOR=0

echo "🔍 Debug NFT Service"
echo "Canister: oncwy-yqaaa-aaaae-qfzja-cai"
echo ""

# Test 1: Check if NFT service is working
echo "📋 Step 1: Testing NFT service availability..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getEnvironmentConfig

echo ""
echo "📋 Step 2: Testing NFT service with startup ID '1'..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getNFTsByStartup '("1")'

echo ""
echo "📋 Step 3: Testing NFT service with invalid startup ID..."
dfx canister --network ic call oncwy-yqaaa-aaaae-qfzja-cai getNFTsByStartup '("999")'

echo ""
echo "🔍 Debug completed!"
echo "If all steps work, the issue is in the NFT transfer logic"
echo "If steps fail, the issue is in the NFT service configuration"
