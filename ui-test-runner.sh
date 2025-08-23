#!/bin/bash

# BlueTube UI Test Runner
# Easy setup and execution of UI tests

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
HEADLESS="${HEADLESS:-false}"
SLOW_MO="${SLOW_MO:-50}"

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed${NC}"
        echo "Please install Node.js first"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Node.js found: $(node --version)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} npm found: $(npm --version)"
}

# Install Puppeteer if not present
install_puppeteer() {
    if [ ! -d "node_modules/puppeteer" ]; then
        echo -e "${YELLOW}Installing Puppeteer...${NC}"
        npm install puppeteer
        echo -e "${GREEN}✓${NC} Puppeteer installed"
    else
        echo -e "${GREEN}✓${NC} Puppeteer already installed"
    fi
}

# Create simple UI test if main one doesn't exist
create_simple_test() {
    if [ ! -f "bluetube-ui-test.js" ]; then
        echo -e "${YELLOW}Creating simple UI test file...${NC}"
        
        cat > bluetube-simple-ui-test.js << 'EOF'
// BlueTube Simple UI Test
const puppeteer = require('puppeteer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS === 'true';

async function runTests() {
    console.log('🚀 Starting BlueTube UI Tests...\n');
    console.log('URL:', BASE_URL);
    console.log('Mode:', HEADLESS ? 'Headless' : 'Visual');
    console.log('-'.repeat(50));
    
    let passed = 0, failed = 0;
    
    const browser = await puppeteer.launch({
        headless: HEADLESS,
        slowMo: 50,
        args: ['--no-sandbox'],
        defaultViewport: { width: 1280, height: 720 }
    });
    
    try {
        const page = await browser.newPage();
        
        // Test 1: Homepage loads
        console.log('\n📍 Testing Homepage...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        const title = await page.title();
        console.log('✓ Page title:', title);
        passed++;
        
        // Test 2: Navigation exists
        console.log('\n📍 Testing Navigation...');
        const nav = await page.$('nav, .navigation, header');
        if (nav) {
            console.log('✓ Navigation found');
            passed++;
        } else {
            console.log('✗ Navigation not found');
            failed++;
        }
        
        // Test 3: Check for buttons
        console.log('\n📍 Testing Buttons...');
        const buttons = await page.$$('button, [role="button"]');
        console.log(`✓ Found ${buttons.length} buttons`);
        if (buttons.length > 0) passed++;
        else failed++;
        
        // Test 4: Check for links
        console.log('\n📍 Testing Links...');
        const links = await page.$$('a[href]');
        console.log(`✓ Found ${links.length} links`);
        if (links.length > 0) passed++;
        else failed++;
        
        // Test 5: Test Browse page
        console.log('\n📍 Testing Browse Page...');
        const response = await page.goto(`${BASE_URL}/browse`, { 
            waitUntil: 'networkidle2',
            timeout: 10000 
        }).catch(() => null);
        
        if (response && response.status() === 200) {
            console.log('✓ Browse page loads');
            passed++;
            
            // Look for video cards
            const cards = await page.$$('.card, .video-card, [class*="card"]');
            console.log(`✓ Found ${cards.length} content cards`);
            if (cards.length > 0) passed++;
        } else {
            console.log('✗ Browse page not accessible');
            failed++;
        }
        
        // Test 6: Check for video players
        console.log('\n📍 Testing Video Elements...');
        const videos = await page.$$('video, iframe, .video-player');
        if (videos.length > 0) {
            console.log(`✓ Found ${videos.length} video elements`);
            passed++;
        } else {
            console.log('⚠ No video elements found');
        }
        
        // Test 7: Test search functionality
        console.log('\n📍 Testing Search...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        const searchInput = await page.$('input[type="search"], input[placeholder*="search" i]');
        if (searchInput) {
            await searchInput.type('test');
            console.log('✓ Search input works');
            passed++;
        } else {
            console.log('⚠ Search not found');
        }
        
        // Test 8: Check forms
        console.log('\n📍 Testing Forms...');
        const forms = await page.$$('form');
        console.log(`✓ Found ${forms.length} forms`);
        if (forms.length > 0) passed++;
        
        // Test 9: Test responsive design
        console.log('\n📍 Testing Mobile View...');
        await page.setViewport({ width: 375, height: 667 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        const mobileMenu = await page.$('[class*="mobile"], [class*="hamburger"]');
        if (mobileMenu) {
            console.log('✓ Mobile responsive');
            passed++;
        } else {
            console.log('⚠ Mobile menu not found');
        }
        
        // Test 10: Check page performance
        console.log('\n📍 Testing Performance...');
        const startTime = Date.now();
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        const loadTime = Date.now() - startTime;
        console.log(`✓ Page loads in ${loadTime}ms`);
        if (loadTime < 5000) passed++;
        else failed++;
        
    } catch (error) {
        console.error('Test error:', error.message);
        failed++;
    } finally {
        await browser.close();
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST RESULTS');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Total: ${passed + failed}`);
        console.log(`📊 Success Rate: ${((passed/(passed+failed))*100).toFixed(1)}%`);
        console.log('='.repeat(50));
        
        if (failed === 0) {
            console.log('\n🎉 All tests passed!\n');
            process.exit(0);
        } else {
            console.log('\n⚠️  Some tests need attention\n');
            process.exit(1);
        }
    }
}

runTests().catch(console.error);
EOF
        
        echo -e "${GREEN}✓${NC} Simple test file created"
    fi
}

# Check if server is running
check_server() {
    echo -e "${BLUE}Checking if server is running...${NC}"
    
    if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|304"; then
        echo -e "${GREEN}✓${NC} Server is running at $BASE_URL"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Server not detected at $BASE_URL"
        echo -e "${YELLOW}Starting server...${NC}"
        
        # Try to start the server
        if [ -f "package.json" ]; then
            npm run dev &
            SERVER_PID=$!
            echo "Waiting for server to start..."
            sleep 5
            
            # Check again
            if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|304"; then
                echo -e "${GREEN}✓${NC} Server started successfully"
                return 0
            else
                echo -e "${RED}✗${NC} Could not start server"
                kill $SERVER_PID 2>/dev/null
                return 1
            fi
        else
            echo -e "${RED}✗${NC} No package.json found"
            return 1
        fi
    fi
}

# Run tests
run_tests() {
    echo -e "\n${BLUE}🧪 Running UI Tests...${NC}\n"
    
    # Set environment variables
    export BASE_URL
    export HEADLESS
    export SLOW_MO
    
    # Run the appropriate test file
    if [ -f "bluetube-ui-test.js" ]; then
        echo "Running comprehensive UI tests..."
        node bluetube-ui-test.js
    elif [ -f "bluetube-simple-ui-test.js" ]; then
        echo "Running simple UI tests..."
        node bluetube-simple-ui-test.js
    else
        echo -e "${RED}No test file found${NC}"
        exit 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "======================================"
    echo "   BlueTube UI Test Runner"
    echo "======================================"
    echo "1. Run tests (with browser visible)"
    echo "2. Run tests (headless/fast)"
    echo "3. Run tests (slow motion)"
    echo "4. Install dependencies only"
    echo "5. Check server status"
    echo "6. Exit"
    echo ""
    read -p "Select option: " choice
    
    case $choice in
        1)
            HEADLESS=false
            SLOW_MO=50
            run_all
            ;;
        2)
            HEADLESS=true
            SLOW_MO=0
            run_all
            ;;
        3)
            HEADLESS=false
            SLOW_MO=250
            run_all
            ;;
        4)
            check_node
            check_npm
            install_puppeteer
            ;;
        5)
            check_server
            ;;
        6)
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            show_menu
            ;;
    esac
}

# Run all checks and tests
run_all() {
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}    BlueTube UI Testing Suite${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo ""
    
    # Pre-flight checks
    check_node
    check_npm
    install_puppeteer
    create_simple_test
    
    if check_server; then
        run_tests
    else
        echo -e "${RED}Cannot run tests without server${NC}"
        echo "Please start your server with: npm run dev"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    quick)
        HEADLESS=true
        SLOW_MO=0
        run_all
        ;;
    visual)
        HEADLESS=false
        SLOW_MO=50
        run_all
        ;;
    slow)
        HEADLESS=false
        SLOW_MO=250
        run_all
        ;;
    install)
        check_node
        check_npm
        install_puppeteer
        create_simple_test
        ;;
    *)
        if [ -z "$1" ]; then
            show_menu
        else
            echo "Usage: $0 {quick|visual|slow|install}"
            echo ""
            echo "Commands:"
            echo "  quick   - Run tests headless (fast)"
            echo "  visual  - Run tests with browser visible"
            echo "  slow    - Run tests in slow motion"
            echo "  install - Install dependencies only"
            echo ""
            echo "Or run without arguments for interactive menu"
            exit 1
        fi
        ;;
esac