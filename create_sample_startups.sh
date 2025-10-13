#!/bin/bash

# Plantify Sample Data Generator for IC Network
# This script creates 10 sample startups with the following distribution:
# - 5 approved startups
# - 5 pending startups  
# - 5 startups built with Caffeine AI
# - 5 startups not built with Caffeine AI

# IC Network Canister ID
CANISTER_ID="oncwy-yqaaa-aaaae-qfzja-cai"

echo "🌱 Plantify Sample Data Generator for IC Network"
echo "================================================"
echo "Canister: $CANISTER_ID"
echo "Creating 10 sample startups with varied data..."
echo ""

# Set environment variables to avoid color issues
export DFX_COLOR=0
export NO_COLOR=1

# Check if dfx is available
if ! command -v dfx &> /dev/null; then
    echo "❌ Error: dfx is not installed or not in PATH"
    exit 1
fi

# Function to create a founder
create_founder() {
    local founder_id=$1
    local name=$2
    local email=$3
    
    echo "Creating founder: $name"
    
    dfx canister --network ic call $CANISTER_ID registerFounder "(
        record {
            fullName = \"$name\";
            email = \"$email\";
    phone = \"+1-555-$((RANDOM % 900 + 100))-$((RANDOM % 9000 + 1000))\";
    address = \"$((RANDOM % 900 + 100)) Main St, City, State $((RANDOM % 90000 + 10000))\";
    experience = \"$((RANDOM % 13 + 2)) years in technology and entrepreneurship\";
    previousBusinesses = \"Founded $((RANDOM % 3 + 1)) previous startups\";
    expertise = \"Technology, Business Development, Leadership\";
    linkedIn = \"https://linkedin.com/in/$name\";
    idNumber = \"ID$((RANDOM % 100000 + 10000))\";
    taxNumber = \"TAX$((RANDOM % 100000 + 10000))\";
        }
    )" --identity anonymous
}

# Function to create a startup
create_startup() {
    local founder_id=$1
    local startup_name=$2
    local sector=$3
    local status=$4
    local built_by_caffeine=$5
    local company_type=$6
    local description=$7
    local problem_statement=$8
    local solution=$9
    local target_market=${10}
    local competitive_advantage=${11}
    local marketing_strategy=${12}
    local operational_process=${13}
    local founder_background=${14}
    local funding_goal=${15}
    local nft_price=${16}
    local periodic_profit_sharing=${17}
    local revenue_model=${18}
    local monthly_revenue=${19}
    local monthly_expenses=${20}
    local use_of_funds=${21}
    local website=${22}
    local location=${23}
    local founded_year=${24}
    local company_logo=${25}
    local company_images=${26}
    local nft_image=${27}
    local team_member_name=${28}
    local team_member_role=${29}
    local team_member_background=${30}
    local team_member_linkedin=${31}
    local team_member_email=${32}
    local advisors=${33}
    
    echo "Creating startup: $startup_name"
    
    dfx canister --network ic call $CANISTER_ID createStartupForFounder "(
        \"$founder_id\",
        record {
            startupName = \"$startup_name\";
            sector = \"$sector\";
            foundedYear = \"$founded_year\";
            description = \"$description\";
            website = \"$website\";
            location = \"$location\";
            companyType = \"$company_type\";
            companyLogo = opt \"$company_logo\";
            companyImages = $company_images;
            nftImage = opt \"$nft_image\";
            problemStatement = \"$problem_statement\";
            solution = \"$solution\";
            targetMarket = \"$target_market\";
            competitiveAdvantage = \"$competitive_advantage\";
            marketingStrategy = \"$marketing_strategy\";
            operationalProcess = \"$operational_process\";
            founderBackground = \"$founder_background\";
            teamMembers = vec {
                record {
                    id = 1;
                    name = \"$team_member_name\";
                    role = \"$team_member_role\";
                    background = \"$team_member_background\";
                    photo = null;
                    linkedin = \"$team_member_linkedin\";
                    email = \"$team_member_email\";
                    isFounder = true;
                };
            };
            advisors = \"$advisors\";
            fundingGoal = \"$funding_goal\";
            nftPrice = \"$nft_price\";
            periodicProfitSharing = \"$periodic_profit_sharing\";
            revenueModel = \"$revenue_model\";
            monthlyRevenue = \"$monthly_revenue\";
            monthlyExpenses = \"$monthly_expenses\";
            useOfFunds = \"$use_of_funds\";
            businessPlan = null;
            financialProjections = null;
            legalDocuments = null;
            status = \"$status\";
            builtByCaffeineAI = opt $built_by_caffeine;
        }
    )" --identity anonymous
}

# Sample data arrays
declare -a sectors=("Technology" "HealthTech" "FinTech" "EdTech" "Agriculture" "Retail" "Manufacturing" "Services" "Artificial Intelligence" "Blockchain" "SaaS" "Clean Energy")
declare -a company_types=("Corporation" "LLC" "Partnership" "Sole Proprietorship")
declare -a statuses=("Approved" "Pending")
declare -a locations=("San Francisco, CA" "New York, NY" "Austin, TX" "Seattle, WA" "Boston, MA" "Los Angeles, CA" "Chicago, IL" "Denver, CO" "Miami, FL" "Portland, OR")
declare -a team_roles=("CEO" "CTO" "COO" "CFO" "VP Engineering" "VP Marketing" "VP Sales" "Head of Product" "Lead Developer" "Business Development Manager")

# Unsplash image URLs for different categories
declare -a tech_logos=(
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center"
)

declare -a health_logos=(
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1576091160550-2173dba0ef54?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center"
)

declare -a fintech_logos=(
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center"
)

declare -a company_images=(
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center"
)

declare -a nft_images=(
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop&crop=center"
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop&crop=center"
)

# Create founders first
echo "📝 Creating founders..."
for i in {1..5}; do
    founder_id="founder_$i"
    name="Founder $i"
    email="founder$i@example.com"
    create_founder "$founder_id" "$name" "$email"
    sleep 1
done

echo ""
echo "🚀 Creating startups..."

# Create 10 startups with varied data
for i in {1..10}; do
    founder_id="$i"
    
    # Determine status (5 approved, 5 pending)
    if [ $i -le 5 ]; then
        status="Approved"
    else
        status="Pending"
    fi
    
    # Determine if built by Caffeine (5 with, 5 without)
    if [ $((i % 2)) -eq 1 ]; then
        built_by_caffeine="true"
    else
        built_by_caffeine="false"
    fi
    
    # Random selection of data
    sector=${sectors[$((RANDOM % ${#sectors[@]}))]}
    company_type=${company_types[$((RANDOM % ${#company_types[@]}))]}
    location=${locations[$((RANDOM % ${#locations[@]}))]}
    team_role=${team_roles[$((RANDOM % ${#team_roles[@]}))]}
    
    # Select appropriate logo based on sector
    case $sector in
        "HealthTech")
            company_logo=${health_logos[$((RANDOM % ${#health_logos[@]}))]}
            ;;
        "FinTech")
            company_logo=${fintech_logos[$((RANDOM % ${#fintech_logos[@]}))]}
            ;;
        *)
            company_logo=${tech_logos[$((RANDOM % ${#tech_logos[@]}))]}
            ;;
    esac
    
    company_images_array="vec { \"${company_images[$((RANDOM % ${#company_images[@]}))]}\"; \"${company_images[$((RANDOM % ${#company_images[@]}))]}\"; }"
    nft_image=${nft_images[$((RANDOM % ${#nft_images[@]}))]}
    
    # Generate startup-specific data
    startup_name="Startup $i"
    description="Revolutionary $sector solution that transforms the industry through innovative technology and sustainable practices."
    problem_statement="Current market solutions are inefficient, expensive, and lack scalability, creating significant barriers for users and businesses."
    solution="Our platform leverages cutting-edge technology to provide an intuitive, cost-effective, and scalable solution that addresses these critical market gaps."
    target_market="Small to medium businesses, enterprise clients, and individual consumers seeking efficient $sector solutions."
    competitive_advantage="Proprietary algorithms, exclusive partnerships, and a unique business model that provides superior value at competitive pricing."
    marketing_strategy="Multi-channel approach including digital marketing, partnerships, content marketing, and direct sales to reach our target audience effectively."
    operational_process="Streamlined operations with automated workflows, quality assurance protocols, and continuous improvement processes to ensure optimal service delivery."
    founder_background="Experienced entrepreneur with $((RANDOM % 10 + 5)) years in $sector, previously founded successful companies and holds advanced degrees in relevant fields."
    funding_goal="$((RANDOM % 1000 + 100))000"
    nft_price="$((RANDOM % 400 + 10))"
    periodic_profit_sharing="$((RANDOM % 20 + 5))"
    revenue_model="Subscription-based SaaS with tiered pricing, transaction fees, and premium services."
    monthly_revenue="$((RANDOM % 80 + 10))000"
    monthly_expenses="$((RANDOM % 40 + 5))000"
    use_of_funds="Product development (40%), marketing (30%), team expansion (20%), and operational costs (10%)."
    website="https://startup$i.com"
    founded_year="$((RANDOM % 4 + 2021))"
    team_member_name="Team Member $i"
    team_member_background="Experienced professional with $((RANDOM % 7 + 3)) years in $sector, previously worked at leading companies and holds relevant certifications."
    team_member_linkedin="https://linkedin.com/in/teammember$i"
    team_member_email="teammember$i@startup$i.com"
    advisors="Industry experts from top companies including former executives, technical advisors, and business mentors."
    
    create_startup \
        "$founder_id" \
        "$startup_name" \
        "$sector" \
        "$status" \
        "$built_by_caffeine" \
        "$company_type" \
        "$description" \
        "$problem_statement" \
        "$solution" \
        "$target_market" \
        "$competitive_advantage" \
        "$marketing_strategy" \
        "$operational_process" \
        "$founder_background" \
        "$funding_goal" \
        "$nft_price" \
        "$periodic_profit_sharing" \
        "$revenue_model" \
        "$monthly_revenue" \
        "$monthly_expenses" \
        "$use_of_funds" \
        "$website" \
        "$location" \
        "$founded_year" \
        "$company_logo" \
        "$company_images_array" \
        "$nft_image" \
        "$team_member_name" \
        "$team_role" \
        "$team_member_background" \
        "$team_member_linkedin" \
        "$team_member_email" \
        "$advisors"
    
    sleep 1
done

echo ""
echo "✅ Sample data creation completed!"
echo ""
echo "📊 Summary:"
echo "- 5 founders created"
echo "- 10 startups created"
echo "- 5 approved startups"
echo "- 5 pending startups"
echo "- 5 startups built with Caffeine AI"
echo "- 5 startups not built with Caffeine AI"
echo ""
echo "🎉 All sample data has been successfully generated!"
