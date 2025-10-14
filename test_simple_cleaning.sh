#!/bin/bash

# Simple test script untuk memverifikasi fungsi pembersih
# Script ini akan menguji fungsi pembersih dengan cara yang lebih sederhana

echo "🧪 Testing Numeric String Cleaning (Simple Test)"
echo "==============================================="

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

# Test investor registration dengan input yang perlu dibersihkan
echo ""
echo "🧪 Testing investor registration with special characters..."

# Test investor registration dengan availableCapital dan monthlyBudget yang perlu dibersihkan
dfx canister call plantify_backend registerInvestor '(
  record {
    fullName = "Test Investor";
    email = "test@example.com";
    phone = "1234567890";
    country = "Indonesia";
    city = "Jakarta";
    location = null;
    occupation = null;
    company = null;
    bio = null;
    profilePhoto = null;
    investmentExperience = "Beginner";
    riskTolerance = "Medium";
    investmentGoals = "Long term growth";
    availableCapital = "Rp 10,000,000";  // Input dengan currency symbol
    monthlyBudget = "$500.00";           // Input dengan currency symbol
  }
)'

echo ""
echo "🧪 Testing investor registration with special characters (dots and commas)..."

dfx canister call plantify_backend registerInvestor '(
  record {
    fullName = "Test Investor 2";
    email = "test2@example.com";
    phone = "1234567891";
    country = "Indonesia";
    city = "Jakarta";
    location = null;
    occupation = null;
    company = null;
    bio = null;
    profilePhoto = null;
    investmentExperience = "Intermediate";
    riskTolerance = "High";
    investmentGoals = "Quick returns";
    availableCapital = "1.000.000";     // Input dengan dots
    monthlyBudget = "2,500.50";         // Input dengan comma dan decimal
  }
)'

echo ""
echo "🧪 Testing investor registration with mixed characters..."

dfx canister call plantify_backend registerInvestor '(
  record {
    fullName = "Test Investor 3";
    email = "test3@example.com";
    phone = "1234567892";
    country = "Indonesia";
    city = "Jakarta";
    location = null;
    occupation = null;
    company = null;
    bio = null;
    profilePhoto = null;
    investmentExperience = "Expert";
    riskTolerance = "Low";
    investmentGoals = "Stable income";
    availableCapital = "abc123def456";  // Input dengan mixed characters
    monthlyBudget = "xyz789";           // Input dengan mixed characters
  }
)'

echo ""
echo "🧪 Testing investor registration with empty strings..."

dfx canister call plantify_backend registerInvestor '(
  record {
    fullName = "Test Investor 4";
    email = "test4@example.com";
    phone = "1234567893";
    country = "Indonesia";
    city = "Jakarta";
    location = null;
    occupation = null;
    company = null;
    bio = null;
    profilePhoto = null;
    investmentExperience = "Beginner";
    riskTolerance = "Medium";
    investmentGoals = "Learning";
    availableCapital = "";              // Empty string
    monthlyBudget = "";                 // Empty string
  }
)'

echo ""
echo "🎉 Numeric cleaning test completed!"
echo ""
echo "Expected behavior:"
echo "- Currency symbols (Rp, $) should be removed from availableCapital and monthlyBudget"
echo "- Special characters (., ,) should be removed"
echo "- Mixed characters (abc123def) should keep only numbers (123)"
echo "- Empty strings should default to '0'"
echo ""
echo "Check the canister logs to see the cleaned values."
echo "You can also check the registered investors to see the cleaned values:"
echo "dfx canister call plantify_backend getInvestors"
