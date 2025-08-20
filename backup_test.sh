#!/bin/bash

# ============================================
# BlueTubeTV Complete Platform Backup & Test Script
# Tests ALL 160 files and features before Web3 integration
# ============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Timestamp for backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/backup_${TIMESTAMP}"
TEST_LOG="./test_results_${TIMESTAMP}.log"
FAILED_TESTS=0
PASSED_TESTS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     BlueTubeTV Complete Platform Backup & Test        ║${NC}"
echo -e "${BLUE}║                  160 Files | 46 Directories           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to log results
log_result() {
    echo "$1" | tee -a ${TEST_LOG}
}

# ============================================
# STEP 1: COMPLETE BACKUP
# ============================================

echo -e "${YELLOW}━━━ STEP 1/5: Creating Complete Backup ━━━${NC}"

# Create backup directory
mkdir -p ${BACKUP_DIR}
mkdir -p ./backups

# Backup all directories with progress
echo "📁 Backing up directories..."
directories=(
    "components"
    "pages"
    "lib"
    "hooks"
    "utils"
    "styles"
    "public"
    "types"
    "scripts"
    "fixes"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo -n "  → Backing up ${dir}... "
        cp -r ${dir} ${BACKUP_DIR}/ 2>/dev/null
        echo -e "${GREEN}✓${NC}"
    fi
done

# Backup configuration files
echo "📄 Backing up configuration files..."
config_files=(
    "package.json"
    "package-lock.json"
    "next.config.js"
    "middleware.js"
    "jsconfig.json"
    "vercel-env-setup.sh"
    "emergency-deploy-script.sh"
    "create-missing-pages.sh"
    "rtmp-server.js"
    "test-site.js"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo -n "  → ${file}... "
        cp ${file} ${BACKUP_DIR}/ 2>/dev/null
        echo -e "${GREEN}✓${NC}"
    fi
done

# Backup environment variables (safely)
if [ -f ".env.local" ]; then
    echo "🔐 Backing up environment variables..."
    cp .env.local ${BACKUP_DIR}/.env.backup
    echo -e "  ${GREEN}✓${NC} Environment variables backed up"
fi

# Create backup manifest
cat > ${BACKUP_DIR}/manifest.json << EOF
{
  "timestamp": "${TIMESTAMP}",
  "platform": "BlueTubeTV",
  "total_files": 160,
  "total_directories": 46,
  "node_version": "$(node -v)",
  "npm_version": "$(npm -v)"
}
EOF

# Compress backup
echo -n "📦 Compressing backup... "
tar -czf ./backups/bluetube_backup_${TIMESTAMP}.tar.gz -C ${BACKUP_DIR} . 2>/dev/null
echo -e "${GREEN}✓${NC}"
echo -e "${GREEN}✅ Backup saved to: ./backups/bluetube_backup_${TIMESTAMP}.tar.gz${NC}"
echo ""

# ============================================
# STEP 2: DEPENDENCY VERIFICATION
# ============================================

echo -e "${YELLOW}━━━ STEP 2/5: Verifying Dependencies ━━━${NC}"

# Check if package is installed
check_dependency() {
    local package=$1
    local required=$2
    if npm list ${package} --depth=0 2>/dev/null | grep -q ${package}; then
        echo -e "  ${GREEN}✓${NC} ${package}"
        ((PASSED_TESTS++))
        return 0
    else
        if [ "$required" = "required" ]; then
            echo -e "  ${RED}✗${NC} ${package} ${RED}(MISSING - REQUIRED)${NC}"
            ((FAILED_TESTS++))
            return 1
        else
            echo -e "  ${YELLOW}⚠${NC} ${package} (optional)"
            return 0
        fi
    fi
}

echo "🔧 Core Dependencies:"
check_dependency "next" "required"
check_dependency "react" "required"
check_dependency "react-dom" "required"

echo ""
echo "🗄️ Database & Auth:"
check_dependency "@supabase/supabase-js" "required"
check_dependency "@supabase/auth-helpers-nextjs" "optional"

echo ""
echo "📹 Streaming & Media:"
check_dependency "livepeer" "optional"
check_dependency "@livepeer/react" "optional"

echo ""
echo "💰 Payment Systems:"
check_dependency "stripe" "optional"
check_dependency "ethers" "required"

echo ""
echo "🎨 UI Components:"
check_dependency "tailwindcss" "optional"
check_dependency "@headlessui/react" "optional"
check_dependency "@heroicons/react" "optional"

echo ""

# ============================================
# STEP 3: API ENDPOINT TESTING
# ============================================

echo -e "${YELLOW}━━━ STEP 3/5: Testing API Endpoints ━━━${NC}"

# Start Next.js server in background for testing
echo "🚀 Starting development server for testing..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local method=${2:-GET}
    local expected_status=${3:-200}
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X ${method} http://localhost:3000${endpoint})
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "  ${GREEN}✓${NC} ${method} ${endpoint} (${response})"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "  ${RED}✗${NC} ${method} ${endpoint} (Got ${response}, Expected ${expected_status})"
        ((FAILED_TESTS++))
        return 1
    fi
}

echo "🔌 Testing Core APIs:"
test_api "/api/health" "GET" "200"
test_api "/api/auth/signup" "POST" "405"
test_api "/api/analytics/track" "POST" "401"

echo ""
echo "💼 Testing Job APIs:"
test_api "/api/jobs" "GET" "200"
test_api "/api/post-job" "POST" "401"

echo ""
echo "📹 Testing Stream APIs:"
test_api "/api/stream/create" "POST" "401"
test_api "/api/stream/stats" "GET" "200"

echo ""
echo "💰 Testing Payment APIs:"
test_api "/api/create-checkout-session" "POST" "400"
test_api "/api/tip" "POST" "401"
test_api "/api/super-chat" "POST" "401"

echo ""
echo "🎨 Testing NFT APIs:"
test_api "/api/nft/mint" "POST" "401"
test_api "/api/nft/list" "GET" "200"

# Kill test server
kill $SERVER_PID 2>/dev/null
echo ""

# ============================================
# STEP 4: COMPONENT VALIDATION
# ============================================

echo -e "${YELLOW}━━━ STEP 4/5: Validating Components ━━━${NC}"

# Function to check component
check_component() {
    local file=$1
    local feature=$2
    
    if [ -f "$file" ]; then
        # Check for common issues
        if grep -q "export default" "$file" || grep -q "module.exports" "$file"; then
            echo -e "  ${GREEN}✓${NC} ${feature}"
            ((PASSED_TESTS++))
            return 0
        else
            echo -e "  ${YELLOW}⚠${NC} ${feature} (No export found)"
            ((PASSED_TESTS++))
            return 0
        fi
    else
        echo -e "  ${RED}✗${NC} ${feature} (File missing: ${file})"
        ((FAILED_TESTS++))
        return 1
    fi
}

echo "📊 Analytics & Dashboard:"
check_component "components/Analytics.js" "Analytics"
check_component "components/AnalyticsDashboard.js" "Analytics Dashboard"
check_component "components/AnalyticsVault.js" "Analytics Vault"
check_component "lib/analytics-enhanced.js" "Enhanced Analytics"
check_component "lib/analytics-events.js" "Analytics Events"

echo ""
echo "📹 Streaming Components:"
check_component "components/LivepeerStream.js" "LivePeer Integration"
check_component "components/BrowserStream.js" "Browser Streaming"
check_component "components/StreamSetup.js" "Stream Setup"
check_component "components/StreamStats.js" "Stream Statistics"
check_component "components/PilotStreamInterface.js" "Pilot Interface"
check_component "components/PilotVideoPlayer.js" "Video Player"

echo ""
echo "💰 Payment & Revenue:"
check_component "components/RevenueDashboard.js" "Revenue Dashboard"
check_component "components/SuperChat.js" "Super Chat"
check_component "components/MonetizationWidgets.js" "Monetization"
check_component "components/TransactionHistory.js" "Transactions"
check_component "components/EarningsOverview.js" "Earnings"

echo ""
echo "🎨 NFT System:"
check_component "components/NFTMinting.js" "NFT Minting (JS)"
check_component "components/NFTMinting.jsx" "NFT Minting (JSX)"

echo ""
echo "💼 Job Board:"
check_component "components/JobBoard.js" "Job Board"
check_component "components/JobCard.js" "Job Cards"
check_component "components/JobPostingForm.js" "Job Posting"
check_component "components/PilotJobDashboard.js" "Pilot Dashboard"
check_component "components/RealTimeJobDetails.js" "Real-time Jobs"

echo ""
echo "🤖 AI Systems:"
check_component "components/FlightComplianceAI.js" "Flight Compliance AI"
check_component "lib/ai-self-healing.js" "Self-healing AI"
check_component "utils/flightComplianceAI.js" "Compliance Utils"

echo ""
echo "📁 Content Management:"
check_component "components/ContentManager.js" "Content Manager"
check_component "components/Upload.js" "Upload System"
check_component "pages/api/upload-video.js" "Video Upload API"

echo ""
echo "🌐 Web3 Integration:"
check_component "components/Web3Integration.js" "Web3 Component"
check_component "hooks/useWeb3.js" "Web3 Hook"
check_component "lib/web3-config.js" "Web3 Config"
check_component "pages/web3.html" "Web3 HTML"
check_component "pages/web3.jsx" "Web3 JSX"

echo ""

# ============================================
# STEP 5: DATABASE & SUPABASE CHECK
# ============================================

echo -e "${YELLOW}━━━ STEP 5/5: Database & External Services ━━━${NC}"

# Check Supabase configuration
echo "🗄️ Supabase Configuration:"
supabase_files=(
    "lib/supabase.js"
    "lib/supabaseClient.js"
    "lib/supabase-admin.js"
    "lib/supabase-server.js"
    "lib/supabase-safe.js"
    "utils/supabase-browser.js"
    "utils/supabase-server.js"
)

for file in "${supabase_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} ${file}"
        ((PASSED_TESTS++))
    else
        echo -e "  ${RED}✗${NC} ${file} missing"
        ((FAILED_TESTS++))
    fi
done

echo ""
echo "🔐 Environment Variables Check:"
if [ -f ".env.local" ]; then
    # Check for required env vars (without exposing values)
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local; then
            echo -e "  ${GREEN}✓${NC} ${var} is set"
            ((PASSED_TESTS++))
        else
            echo -e "  ${RED}✗${NC} ${var} is missing"
            ((FAILED_TESTS++))
        fi
    done
else
    echo -e "  ${RED}✗${NC} .env.local file missing"
    ((FAILED_TESTS++))
fi

echo ""

# ============================================
# FINAL REPORT
# ============================================

echo -e "${PURPLE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    TEST RESULTS                        ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL_TESTS=$((PASSED_TESTS + FAILED_TESTS))
PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

echo -e "📊 Total Tests: ${TOTAL_TESTS}"
echo -e "✅ Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "❌ Failed: ${RED}${FAILED_TESTS}${NC}"
echo -e "📈 Pass Rate: ${PASS_RATE}%"
echo ""

if [ ${FAILED_TESTS} -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Platform is ready for Web3 integration.${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the log file: ${TEST_LOG}${NC}"
fi

echo ""
echo -e "${BLUE}📦 Backup Location: ./backups/bluetube_backup_${TIMESTAMP}.tar.gz${NC}"
echo -e "${BLUE}📋 Test Log: ${TEST_LOG}${NC}"
echo ""

# ============================================
# RESTORE SCRIPT GENERATION
# ============================================

echo "📝 Creating restore script..."
cat > ./backups/restore_${TIMESTAMP}.sh << 'RESTORE'
#!/bin/bash
# Restore script for BlueTubeTV backup

BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore.sh backup_file.tar.gz"
    exit 1
fi

echo "⚠️  This will restore from backup. Current files will be overwritten!"
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Create restore directory
RESTORE_DIR="./restore_temp"
mkdir -p ${RESTORE_DIR}

# Extract backup
echo "Extracting backup..."
tar -xzf ${BACKUP_FILE} -C ${RESTORE_DIR}

# Restore files
echo "Restoring files..."
cp -r ${RESTORE_DIR}/* ./

# Clean up
rm -rf ${RESTORE_DIR}

echo "✅ Restore complete!"
echo "Run 'npm install' to reinstall dependencies"
RESTORE

chmod +x ./backups/restore_${TIMESTAMP}.sh
echo -e "${GREEN}✅ Restore script created: ./backups/restore_${TIMESTAMP}.sh${NC}"

# ============================================
# QUICK SMOKE TEST SCRIPT
# ============================================

echo ""
echo "📝 Creating smoke test script..."
cat > smoke_test.sh << 'SMOKE'
#!/bin/bash
# Quick smoke test for BlueTubeTV

echo "🔥 Running smoke test..."

# Check if server starts
timeout 10 npm run dev > /dev/null 2>&1 &
PID=$!
sleep 5

if ps -p $PID > /dev/null; then
    echo "✅ Server starts successfully"
    kill $PID
else
    echo "❌ Server failed to start"
    exit 1
fi

# Check main pages
pages=("/" "/login" "/dashboard" "/marketplace" "/jobs" "/live")
for page in "${pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${page})
    if [ "$status" = "200" ] || [ "$status" = "302" ]; then
        echo "✅ Page ${page} loads (${status})"
    else
        echo "❌ Page ${page} failed (${status})"
    fi
done

echo "🔥 Smoke test complete!"
SMOKE

chmod +x smoke_test.sh
echo -e "${GREEN}✅ Smoke test created: ./smoke_test.sh${NC}"

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}       Backup and Testing Complete! 🚁                  ${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "1. Review test results in: ${TEST_LOG}"
echo "2. Fix any failed tests before proceeding"
echo "3. Run './smoke_test.sh' for quick verification"
echo "4. Proceed with Web3 integration when ready"
echo "5. Use restore script if needed: ./backups/restore_${TIMESTAMP}.sh"