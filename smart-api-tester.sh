#!/bin/bash

echo "🔍 BlueTubeTV Smart API Discovery"
echo "=================================="
echo "Finding all working endpoints..."
echo ""

# First, let's see what files actually exist
echo "📂 Discovering API Structure..."
echo "-------------------------------"

# Function to check and list APIs in a directory
check_api_directory() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir" ]; then
        echo -e "\n📁 $name APIs found:"
        find "$dir" -name "*.js" -type f | while read file; do
            # Get relative path from pages/api/
            rel_path=${file#pages/api/}
            # Convert to endpoint
            endpoint="/api/${rel_path%.js}"
            echo "  → $endpoint"
        done
    fi
}

# Check main API directory
if [ -d "pages/api" ]; then
    echo "✅ API directory exists"
    
    # Count total API files
    total_apis=$(find pages/api -name "*.js" -type f | wc -l)
    echo "📊 Total API endpoints found: $total_apis"
    
    # Check subdirectories
    check_api_directory "pages/api/stream" "Stream"
    check_api_directory "pages/api/jobs" "Jobs"
    check_api_directory "pages/api/auth" "Auth"
    check_api_directory "pages/api/webhooks" "Webhooks"
    check_api_directory "pages/api/admin" "Admin"
    check_api_directory "pages/api/analytics" "Analytics"
    check_api_directory "pages/api/transactions" "Transactions"
    check_api_directory "pages/api/nft" "NFT"
    check_api_directory "pages/api/drone" "Drone"
    check_api_directory "pages/api/pilots" "Pilots"
    
    echo -e "\n💰 Payment APIs:"
    for payment_api in "create-checkout-session" "tip" "super-chat" "earnings" "create-subscription" "dynamic-superchat"; do
        if [ -f "pages/api/$payment_api.js" ]; then
            echo "  ✅ /api/$payment_api"
        fi
    done
else
    echo "❌ No API directory found!"
    exit 1
fi

echo ""
echo "=================================="
echo "🧪 Testing Live Endpoints"
echo "=================================="

# Check if server is running
echo -e "\n🔌 Checking if server is running..."
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" | grep -q "200\|404"; then
    echo "✅ Local server is running"
    DOMAIN="http://localhost:3000"
else
    echo "⚠️  Local server not running. Testing production..."
    DOMAIN="https://bluetubetv.live"
fi

echo "🌐 Testing against: $DOMAIN"
echo ""

# Array to store working endpoints
working_endpoints=()
auth_required_endpoints=()
broken_endpoints=()

# Test function with better error handling
test_endpoint() {
    local method=$1
    local endpoint=$2
    local needs_auth=${3:-false}
    
    # Skip if file doesn't exist locally
    local file_path="pages${endpoint%.js}.js"
    if [ ! -f "$file_path" ] && [ ! -f "pages${endpoint}/index.js" ]; then
        return
    fi
    
    printf "Testing %-40s " "$endpoint..."
    
    # Add auth header if needed
    if [ "$needs_auth" = "true" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$DOMAIN$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer test-token" 2>/dev/null)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$DOMAIN$endpoint" \
            -H "Content-Type: application/json" 2>/dev/null)
    fi
    
    case $response in
        200|201)
            echo "✅ Working"
            working_endpoints+=("$endpoint")
            ;;
        401|403)
            echo "🔐 Auth Required"
            auth_required_endpoints+=("$endpoint")
            ;;
        404)
            echo "❌ Not Found"
            broken_endpoints+=("$endpoint")
            ;;
        405)
            echo "⚠️  Method Not Allowed"
            ;;
        500|502|503)
            echo "💥 Server Error"
            broken_endpoints+=("$endpoint")
            ;;
        *)
            echo "❓ Unknown ($response)"
            ;;
    esac
}

# Test all discovered endpoints
echo "🔬 Testing discovered endpoints..."
echo "----------------------------------"

# Find and test all API files
find pages/api -name "*.js" -type f | while read file; do
    # Convert file path to endpoint
    endpoint="/api/${file#pages/api/}"
    endpoint="${endpoint%.js}"
    
    # Skip test files and internal files
    if [[ "$endpoint" == *"test"* ]] || [[ "$endpoint" == *"_"* ]]; then
        continue
    fi
    
    # Determine method (most are POST, some are GET)
    if [[ "$endpoint" == *"list"* ]] || [[ "$endpoint" == *"get"* ]] || [[ "$endpoint" == *"earnings"* ]]; then
        test_endpoint "GET" "$endpoint"
    else
        test_endpoint "POST" "$endpoint"
    fi
done

echo ""
echo "=================================="
echo "📊 SUMMARY REPORT"
echo "=================================="

echo -e "\n✅ WORKING ENDPOINTS (${#working_endpoints[@]}):"
for endpoint in "${working_endpoints[@]}"; do
    echo "   • $endpoint"
done

echo -e "\n🔐 AUTH REQUIRED (${#auth_required_endpoints[@]}):"
for endpoint in "${auth_required_endpoints[@]}"; do
    echo "   • $endpoint"
done

echo -e "\n❌ BROKEN/MISSING (${#broken_endpoints[@]}):"
for endpoint in "${broken_endpoints[@]}"; do
    echo "   • $endpoint"
done

echo ""
echo "=================================="
echo "💡 RECOMMENDATIONS"
echo "=================================="

if [ ${#working_endpoints[@]} -gt 0 ]; then
    echo "✅ You have ${#working_endpoints[@]} working endpoints - DON'T TOUCH THESE!"
fi

if [ ${#auth_required_endpoints[@]} -gt 0 ]; then
    echo "🔐 ${#auth_required_endpoints[@]} endpoints need auth - these are probably fine"
fi

if [ ${#broken_endpoints[@]} -gt 0 ]; then
    echo "🔧 ${#broken_endpoints[@]} endpoints need fixing"
fi

echo ""
echo "💰 Payment System Status:"
if [[ " ${working_endpoints[@]} " =~ "/api/create-checkout-session" ]] || [[ " ${auth_required_endpoints[@]} " =~ "/api/create-checkout-session" ]]; then
    echo "   ✅ Stripe integration appears functional"
fi
if [[ " ${working_endpoints[@]} " =~ "/api/tip" ]] || [[ " ${auth_required_endpoints[@]} " =~ "/api/tip" ]]; then
    echo "   ✅ Tipping system appears functional"
fi
if [[ " ${working_endpoints[@]} " =~ "/api/super-chat" ]] || [[ " ${auth_required_endpoints[@]} " =~ "/api/super-chat" ]]; then
    echo "   ✅ SuperChat system appears functional"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Run: ./backup-everything.sh (to backup working code)"
echo "2. Fix only the broken endpoints"
echo "3. Don't modify working payment systems!"
echo "4. Test with: ./test-payments.sh"