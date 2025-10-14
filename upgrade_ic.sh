#!/bin/bash

# Script untuk upgrade canister di IC network dengan opsi yang benar
# Script ini akan menangani enhanced orthogonal persistence dengan benar

echo "🚀 Upgrading Plantify Backend on IC Network"
echo "==========================================="

# Check if dfx is running
if ! dfx ping 2>/dev/null; then
    echo "❌ dfx is not running. Please start dfx first:"
    echo "   dfx start --clean"
    exit 1
fi

echo "✅ dfx is running"

# Deploy dengan opsi yang benar untuk enhanced orthogonal persistence
echo "📦 Deploying with enhanced orthogonal persistence..."

# Method 1: Deploy dengan opsi wasm_memory_persistence
echo "🔄 Method 1: Deploy with wasm_memory_persistence option..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade --upgrade-unchanged --argument '--wasm_memory_persistence'

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful with wasm_memory_persistence option"
    exit 0
fi

echo "⚠️  Method 1 failed, trying Method 2..."

# Method 2: Deploy tanpa enhanced orthogonal persistence sementara
echo "🔄 Method 2: Temporarily removing enhanced orthogonal persistence..."

# Backup original dfx.json
cp dfx.json dfx.json.backup

# Create temporary dfx.json without enhanced orthogonal persistence
cat > dfx.json.temp << 'EOF'
{
  "canisters": {
    "internet_identity": {
      "type": "custom",
      "candid": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity.did",
      "wasm": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz",
      "remote": {
        "id": {
          "ic": "rdmx6-jaaaa-aaaaa-aaadq-cai"
        }
      },
      "frontend": {}
    },
    "plantify_backend": {
      "main": "src/plantify_backend/main.mo",
      "type": "motoko",
      "ic": "oncwy-yqaaa-aaaae-qfzja-cai"
    },
    "plantify_frontend": {
      "source": [
        "src/plantify_apps/dist"
      ],
      "type": "assets",
      "workspace": "src/plantify_apps",
      "ic": "ueifo-jqaaa-aaaah-qqewa-cai"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "output_env_file": ".env",
  "version": 1
}
EOF

# Replace dfx.json temporarily
mv dfx.json.temp dfx.json

# Deploy without enhanced orthogonal persistence
echo "📦 Deploying without enhanced orthogonal persistence..."
dfx deploy plantify_backend --ic --no-wallet -m upgrade

if [ $? -eq 0 ]; then
    echo "✅ Upgrade successful without enhanced orthogonal persistence"
    
    # Restore original dfx.json
    mv dfx.json.backup dfx.json
    echo "📝 Restored original dfx.json"
    
    echo ""
    echo "⚠️  WARNING: Enhanced orthogonal persistence is disabled"
    echo "   This means data persistence across upgrades may not work as expected"
    echo "   Consider using the --wasm_memory_persistence option for better data persistence"
    
    exit 0
else
    echo "❌ Both methods failed"
    
    # Restore original dfx.json
    mv dfx.json.backup dfx.json
    echo "📝 Restored original dfx.json"
    
    exit 1
fi
