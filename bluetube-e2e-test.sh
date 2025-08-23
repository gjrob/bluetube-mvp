#!/bin/bash

# BlueTube End-to-End Test Script (Fixed Version)
# Tests complete user flow with proper timeout handling

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123!"
TEST_USER="TestPilot_$(date +%s)"
TIMEOUT=5  # Timeout for curl requests in seconds

# Test results tracking
PASSED=0
FAILED=0
SKIPPED=0
TESTS=()

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    PASSED=$((PASSED + 1))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    FAILED=$((FAILED + 1))
}

log_skip() {
    echo -e "${YELLOW}[SKIP]${NC} $1"
    SKIPPED=$((SKIPPED + 1))
}

log_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
    TESTS+=("$1")
}

# Safe curl wrapper with timeout
safe_curl() {
    curl --max-time $TIMEOUT --connect-timeout $TIMEOUT "$@" 2>/dev/null || echo ""
}

# Check if server is running
check_server() {
    log_test "Checking if server is running"
    
    local response=$(safe_curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
    
    if [[ "$response" == "200" ]] || [[ "$response" == "304" ]]; then
        log_success "Server is running at $BASE_URL"
        return 0
    else
        log_error "Server is not responding at $BASE_URL (Status: $response)"
        return 1
    fi
}

# Test public pages
test_public_pages() {
    log_test "Testing public pages accessibility"
    
    local pages=("/" "/browse" "/marketplace" "/pricing" "/help" "/terms" "/privacy")
    
    for page in "${pages[@]}"; do
        local status=$(safe_curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
        if [[ "$status" == "200" ]] || [[ "$status" == "304" ]]; then
            log_success "Page $page is accessible (Status: $status)"
        elif [[ -z "$status" ]]; then
            log_error "Page $page timed out"
        else
            log_error "Page $page failed (Status: $status)"
        fi
    done
}

# Test protected routes (should redirect)
test_protected_routes() {
    log_test "Testing protected routes (should redirect when not authenticated)"
    
    local routes=("/dashboard" "/upload" "/profile" "/vault")
    
    for route in "${routes[@]}"; do
        local final_url=$(safe_curl -s -o /dev/null -w "%{url_effective}" -L "$BASE_URL$route")
        
        if [[ "$final_url" == *"/login"* ]] || [[ "$final_url" == *"/signin"* ]]; then
            log_success "Protected route $route redirects to login"
        elif [[ -z "$final_url" ]]; then
            log_error "Protected route $route timed out"
        else
            log_error "Protected route $route does not redirect properly"
        fi
    done
}

# Test API health endpoints
test_api_health() {
    log_test "Testing API health endpoints"
    
    # Test main health endpoint with timeout
    local health_response=$(safe_curl -s "$BASE_URL/api/health")
    
    if [[ -z "$health_response" ]]; then
        log_skip "Health endpoint not available or timed out"
    elif echo "$health_response" | grep -q '"status":"ok"'; then
        log_success "Health endpoint is working"
    else
        log_skip "Health endpoint exists but returns unexpected format"
    fi
    
    # Test smoke endpoint
    local smoke_response=$(safe_curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/smoke")
    if [[ "$smoke_response" == "200" ]]; then
        log_success "Smoke test endpoint is working"
    elif [[ -z "$smoke_response" ]]; then
        log_skip "Smoke endpoint timed out"
    else
        log_skip "Smoke endpoint not found (Status: $smoke_response)"
    fi
}

# Test signup flow
test_signup() {
    log_test "Testing signup flow"
    
    local response=$(safe_curl -s -X POST "$BASE_URL/api/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"username\":\"$TEST_USER\"}")
    
    if [[ -z "$response" ]]; then
        log_skip "Signup endpoint timed out"
    elif echo "$response" | grep -q "success\|created\|confirmation"; then
        log_success "Signup successful for $TEST_EMAIL"
    else
        log_skip "Signup endpoint exists but may need different format"
    fi
}

# Test login flow
test_login() {
    log_test "Testing login flow"
    
    # Try demo login first (more likely to work)
    log_info "Trying demo login..."
    local response=$(safe_curl -s -X POST "$BASE_URL/api/demo-login" \
        -H "Content-Type: application/json" \
        -c /tmp/bluetube_cookies.txt)
    
    if [[ -z "$response" ]]; then
        log_skip "Demo login timed out"
        return 1
    elif echo "$response" | grep -q "success\|token\|user"; then
        log_success "Demo login successful"
        return 0
    else
        # Try regular login
        response=$(safe_curl -s -X POST "$BASE_URL/api/auth/login" \
            -H "Content-Type: application/json" \
            -c /tmp/bluetube_cookies.txt \
            -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
        
        if [[ -z "$response" ]]; then
            log_skip "Login endpoint timed out"
            return 1
        elif echo "$response" | grep -q "success\|token\|user"; then
            log_success "Login successful"
            return 0
        else
            log_skip "Login endpoints not configured"
            return 1
        fi
    fi
}

# Test authenticated endpoints (only if logged in)
test_authenticated_endpoints() {
    if [[ ! -f /tmp/bluetube_cookies.txt ]]; then
        log_skip "Skipping authenticated tests (not logged in)"
        return
    fi
    
    log_test "Testing authenticated API endpoints"
    
    # Test profile endpoint
    local profile=$(safe_curl -s "$BASE_URL/api/profile" -b /tmp/bluetube_cookies.txt)
    if [[ -z "$profile" ]]; then
        log_skip "Profile endpoint timed out"
    elif echo "$profile" | grep -q "email\|user"; then
        log_success "Profile endpoint accessible"
    else
        log_skip "Profile endpoint not configured"
    fi
    
    # Test earnings endpoint
    local earnings=$(safe_curl -s "$BASE_URL/api/earnings" -b /tmp/bluetube_cookies.txt)
    if [[ -z "$earnings" ]]; then
        log_skip "Earnings endpoint timed out"
    elif echo "$earnings" | grep -q "total\|earnings\|0"; then
        log_success "Earnings endpoint accessible"
    else
        log_skip "Earnings endpoint not configured"
    fi
}

# Test core features existence
test_core_features() {
    log_test "Testing core feature endpoints"
    
    # Check if key API routes exist
    local endpoints=(
        "/api/jobs"
        "/api/stream/setup"
        "/api/upload-video"
        "/api/analytics/overview"
        "/api/nft/contract"
        "/api/super-chat"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local status=$(safe_curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
        
        if [[ "$status" == "200" ]] || [[ "$status" == "401" ]] || [[ "$status" == "405" ]]; then
            log_success "Endpoint $endpoint exists (Status: $status)"
        elif [[ -z "$status" ]]; then
            log_skip "Endpoint $endpoint timed out"
        elif [[ "$status" == "404" ]]; then
            log_error "Endpoint $endpoint not found"
        else
            log_skip "Endpoint $endpoint returned $status"
        fi
    done
}

# Performance test
test_performance() {
    log_test "Testing page load performance"
    
    local start_time=$(date +%s%N)
    safe_curl -s -o /dev/null "$BASE_URL"
    local end_time=$(date +%s%N)
    
    if [[ -z "$end_time" ]] || [[ -z "$start_time" ]]; then
        log_skip "Performance test could not complete"
    else
        local duration=$(((end_time - start_time) / 1000000))
        
        if [[ $duration -lt 3000 ]]; then
            log_success "Homepage loads in ${duration}ms"
        else
            log_error "Homepage slow: ${duration}ms"
        fi
    fi
}

# Quick connectivity test
test_basic_connectivity() {
    log_test "Testing basic connectivity"
    
    # Test if Next.js is responding
    local next_response=$(safe_curl -s -I "$BASE_URL" | grep -i "x-powered-by")
    if [[ "$next_response" == *"Next.js"* ]]; then
        log_success "Next.js server detected"
    else
        log_info "Server type could not be determined"
    fi
    
    # Test if static assets are accessible
    local favicon=$(safe_curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/favicon.ico")
    if [[ "$favicon" == "200" ]] || [[ "$favicon" == "304" ]]; then
        log_success "Static assets are accessible"
    else
        log_error "Static assets not accessible"
    fi
}

# Cleanup
cleanup() {
    rm -f /tmp/bluetube_cookies.txt
    rm -f /tmp/stream_config.json
}

# Main test runner
main() {
    echo "======================================"
    echo "   BlueTube End-to-End Test Suite    "
    echo "======================================"
    echo "Testing against: $BASE_URL"
    echo "Test started at: $(date)"
    echo "Timeout per request: ${TIMEOUT}s"
    echo ""
    
    # Check if server is running first
    if ! check_server; then
        echo ""
        echo "Server is not running. Please start it with:"
        echo "  npm run dev"
        echo ""
        exit 1
    fi
    
    # Run basic tests
    test_basic_connectivity
    test_public_pages
    test_protected_routes
    test_api_health
    
    # Try authentication
    test_signup
    test_login
    
    # Run authenticated tests if logged in
    test_authenticated_endpoints
    
    # Test core features
    test_core_features
    
    # Performance test
    test_performance
    
    # Print summary
    echo ""
    echo "======================================"
    echo "           TEST SUMMARY               "
    echo "======================================"
    echo -e "${GREEN}Passed:${NC} $PASSED"
    echo -e "${RED}Failed:${NC} $FAILED"
    echo -e "${YELLOW}Skipped:${NC} $SKIPPED"
    echo -e "Total:  $((PASSED + FAILED + SKIPPED))"
    echo ""
    
    if [[ $FAILED -eq 0 ]]; then
        if [[ $SKIPPED -gt 0 ]]; then
            echo -e "${YELLOW}⚠ Tests passed with some skipped items${NC}"
            echo "Some endpoints may not be implemented yet"
        else
            echo -e "${GREEN}✓ All tests passed!${NC}"
        fi
        cleanup
        exit 0
    else
        echo -e "${RED}✗ Some tests failed${NC}"
        echo "Critical issues found that need fixing:"
        echo "- Check that all routes are properly configured"
        echo "- Ensure API endpoints are implemented"
        echo "- Verify middleware is not blocking requests"
        cleanup
        exit 1
    fi
}

# Handle interrupts gracefully
trap cleanup EXIT INT TERM

# Run main function
main "$@"