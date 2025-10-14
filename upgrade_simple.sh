#!/bin/bash

# Simple upgrade script untuk IC network
# Script ini akan mencoba berbagai metode upgrade

echo "🚀 Simple IC Network Upgrade"
echo "============================"

# Method 1: Upgrade dengan wasm_memory_persistence
echo "🔄 Method 1: Upgrade with wasm_memory_persistence..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade --argument '--wasm_memory_persistence'

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful with wasm_memory_persistence"
    exit 0
fi

echo "⚠️  Method 1 failed, trying Method 2..."

# Method 2: Upgrade tanpa argument
echo "🔄 Method 2: Upgrade without arguments..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful without arguments"
    exit 0
fi

echo "⚠️  Method 2 failed, trying Method 3..."

# Method 3: Reinstall (akan kehilangan data)
echo "🔄 Method 3: Reinstall (WARNING: This will lose data)..."
read -p "Are you sure you want to reinstall? This will lose all data. (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    dfx deploy plantify_backend --ic --no-wallet -m reinstall
    if [ $? -eq 0 ]; then
        echo "✅ Reinstall successful (data lost)"
        exit 0
    fi
fi

echo "❌ All methods failed"
exit 1
