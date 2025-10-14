#!/bin/bash

# Test script untuk memverifikasi pembersihan karakter non-numerik
# Script ini akan menguji berbagai input dengan karakter khusus

echo "🧪 Testing Numeric String Cleaning"
echo "=================================="

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

# Test cases untuk input dengan karakter khusus
echo ""
echo "🧪 Testing various input formats..."

# First, create a founder to test with
echo "📝 Creating a test founder first..."
dfx canister call plantify_backend registerFounder '(
  record {
    fullName = "Test Founder";
    email = "founder@test.com";
    phone = "1234567890";
    address = "Test Address";
    experience = "5 years";
    previousBusinesses = "None";
    expertise = "Technology";
    linkedIn = "https://linkedin.com/test";
    idNumber = "1234567890";
    taxNumber = "9876543210";
  }
)'

echo ""
echo "🧪 Testing startup creation with special characters..."

# Test 1: Input dengan currency symbols
echo "Test 1: Currency symbols (Rp 1,000,000)"
dfx canister call plantify_backend createStartupForFounder '("1", record {
  startupName = "Test Startup 1";
  sector = "Technology";
  foundedYear = "2024";
  description = "Test startup with currency symbols";
  website = "https://test.com";
  location = "Jakarta";
  companyType = "PT";
  companyImages = vec {};
  problemStatement = "Test problem";
  solution = "Test solution";
  targetMarket = "Test market";
  competitiveAdvantage = "Test advantage";
  marketingStrategy = "Test strategy";
  operationalProcess = "Test process";
  founderBackground = "Test background";
  teamMembers = vec {
    record {
      id = 1;
      name = "Test Member";
      role = "Developer";
      background = "Software Engineer";
      photo = null;
      linkedin = "https://linkedin.com/member";
      email = "member@test.com";
      isFounder = false;
    };
  };
  advisors = "Test advisors";
  fundingGoal = "Rp 1,000,000";
  nftPrice = "$100";
  periodicProfitSharing = "10%";
  revenueModel = "Test model";
  monthlyRevenue = "IDR 5,000,000";
  monthlyExpenses = "USD 2,000";
  useOfFunds = "Test use";
  status = "Draft";
  builtByCaffeineAI = null;
})'

echo ""

# Test 2: Input dengan special characters
echo "Test 2: Special characters (1.000.000)"
dfx canister call plantify_backend createStartupForFounder '("1", record {
  startupName = "Test Startup 2";
  sector = "Technology";
  foundedYear = "2024";
  description = "Test startup with special characters";
  website = "https://test.com";
  location = "Jakarta";
  companyType = "PT";
  companyImages = vec {};
  problemStatement = "Test problem";
  solution = "Test solution";
  targetMarket = "Test market";
  competitiveAdvantage = "Test advantage";
  marketingStrategy = "Test strategy";
  operationalProcess = "Test process";
  founderBackground = "Test background";
  teamMembers = vec {
    record {
      id = 1;
      name = "Test Member";
      role = "Developer";
      background = "Software Engineer";
      photo = null;
      linkedin = "https://linkedin.com/member";
      email = "member@test.com";
      isFounder = false;
    };
  };
  advisors = "Test advisors";
  fundingGoal = "1.000.000";
  nftPrice = "100,50";
  periodicProfitSharing = "15.5%";
  revenueModel = "Test model";
  monthlyRevenue = "5.000.000";
  monthlyExpenses = "2,500.00";
  useOfFunds = "Test use";
  status = "Draft";
  builtByCaffeineAI = null;
})'

echo ""

# Test 3: Input dengan mixed characters
echo "Test 3: Mixed characters (abc123def456)"
dfx canister call plantify_backend createStartupForFounder '("1", record {
  startupName = "Test Startup 3";
  sector = "Technology";
  foundedYear = "2024";
  description = "Test startup with mixed characters";
  website = "https://test.com";
  location = "Jakarta";
  companyType = "PT";
  companyImages = vec {};
  problemStatement = "Test problem";
  solution = "Test solution";
  targetMarket = "Test market";
  competitiveAdvantage = "Test advantage";
  marketingStrategy = "Test strategy";
  operationalProcess = "Test process";
  founderBackground = "Test background";
  teamMembers = vec {
    record {
      id = 1;
      name = "Test Member";
      role = "Developer";
      background = "Software Engineer";
      photo = null;
      linkedin = "https://linkedin.com/member";
      email = "member@test.com";
      isFounder = false;
    };
  };
  advisors = "Test advisors";
  fundingGoal = "abc123def456";
  nftPrice = "xyz789";
  periodicProfitSharing = "test123";
  revenueModel = "Test model";
  monthlyRevenue = "abc456def";
  monthlyExpenses = "xyz123";
  useOfFunds = "Test use";
  status = "Draft";
  builtByCaffeineAI = null;
})'

echo ""

# Test 4: Input dengan empty strings
echo "Test 4: Empty strings"
dfx canister call plantify_backend createStartupForFounder '("1", record {
  startupName = "Test Startup 4";
  sector = "Technology";
  foundedYear = "2024";
  description = "Test startup with empty numeric fields";
  website = "https://test.com";
  location = "Jakarta";
  companyType = "PT";
  companyImages = vec {};
  problemStatement = "Test problem";
  solution = "Test solution";
  targetMarket = "Test market";
  competitiveAdvantage = "Test advantage";
  marketingStrategy = "Test strategy";
  operationalProcess = "Test process";
  founderBackground = "Test background";
  teamMembers = vec {
    record {
      id = 1;
      name = "Test Member";
      role = "Developer";
      background = "Software Engineer";
      photo = null;
      linkedin = "https://linkedin.com/member";
      email = "member@test.com";
      isFounder = false;
    };
  };
  advisors = "Test advisors";
  fundingGoal = "";
  nftPrice = "";
  periodicProfitSharing = "";
  revenueModel = "Test model";
  monthlyRevenue = "";
  monthlyExpenses = "";
  useOfFunds = "Test use";
  status = "Draft";
  builtByCaffeineAI = null;
})'

echo ""
echo "🎉 Numeric cleaning test completed!"
echo ""
echo "Expected behavior:"
echo "- Currency symbols (Rp, $, IDR, USD) should be removed"
echo "- Special characters (., ,, %) should be removed"
echo "- Mixed characters (abc123def) should keep only numbers (123)"
echo "- Empty strings should default to '0'"
echo ""
echo "Check the canister logs to see the cleaned values."
