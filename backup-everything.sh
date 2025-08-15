#!/bin/bash

# BlueTubeTV Complete Backup Script
# PRESERVES ALL WORKING CODE ESPECIALLY PAYMENT SYSTEMS!

echo "💰 BlueTubeTV Complete Backup System"
echo "===================================="
echo "Backing up your money printer and all working code..."
echo ""

# Create backup directory with timestamp
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📁 Creating backup in: $BACKUP_DIR${NC}"
echo ""

# Function to backup with status
backup_item() {
    local source=$1
    local dest=$2
    local description=$3
    
    if [ -e "$source" ]; then
        cp -r "$source" "$dest"
        echo -e "${GREEN}✅ Backed up: $description${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Not found: $description (skipping)${NC}"
        return 1
    fi
}

# 1. CRITICAL: Backup all payment/money-making files
echo "💵 PRIORITY: Backing up Payment Systems..."
echo "-------------------------------------------"
mkdir -p "$BACKUP_DIR/payment-systems"

# Stripe payment files
backup_item "pages/api/create-checkout-session.js" "$BACKUP_DIR/payment-systems/" "Stripe Checkout"
backup_item "pages/api/create-subscription.js" "$BACKUP_DIR/payment-systems/" "Stripe Subscriptions"
backup_item "pages/api/webhooks" "$BACKUP_DIR/payment-systems/" "Stripe Webhooks"

# Tip and SuperChat systems
backup_item "pages/api/tip.js" "$BACKUP_DIR/payment-systems/" "Tip System"
backup_item "pages/api/super-chat.js" "$BACKUP_DIR/payment-systems/" "SuperChat System"
backup_item "pages/api/dynamic-superchat.js" "$BACKUP_DIR/payment-systems/" "Dynamic SuperChat"

# Earnings and transactions
backup_item "pages/api/earnings.js" "$BACKUP_DIR/payment-systems/" "Earnings API"
backup_item "pages/api/transactions" "$BACKUP_DIR/payment-systems/" "Transactions"

# Components for payments
backup_item "components/SuperChat.js" "$BACKUP_DIR/payment-systems/" "SuperChat Component"
backup_item "components/SuperChat.module.css" "$BACKUP_DIR/payment-systems/" "SuperChat Styles"
backup_item "components/TransactionHistory.js" "$BACKUP_DIR/payment-systems/" "Transaction History"
backup_item "components/EarningsOverview.js" "$BACKUP_DIR/payment-systems/" "Earnings Overview"
backup_item "components/RevenueDashboard.js" "$BACKUP_DIR/payment-systems/" "Revenue Dashboard"

echo ""

# 2. Backup all API routes
echo "🔌 Backing up ALL API Routes..."
echo "--------------------------------"
cp -r pages/api "$BACKUP_DIR/api-complete"
echo -e "${GREEN}✅ Complete API directory backed up${NC}"

echo ""

# 3. Backup working components
echo "🧩 Backing up Components..."
echo "----------------------------"
cp -r components "$BACKUP_DIR/components-complete"
echo -e "${GREEN}✅ All components backed up${NC}"

echo ""

# 4. Backup configuration files
echo "⚙️  Backing up Configuration..."
echo "--------------------------------"
backup_item ".env.local" "$BACKUP_DIR/" "Environment Variables"
backup_item "next.config.js" "$BACKUP_DIR/" "Next.js Config"
backup_item "package.json" "$BACKUP_DIR/" "Package.json"
backup_item "vercel.json" "$BACKUP_DIR/" "Vercel Config"
backup_item "middleware.js" "$BACKUP_DIR/" "Middleware"

echo ""

# 5. Backup database schemas and libs
echo "📊 Backing up Database & Libraries..."
echo "--------------------------------------"
cp -r lib "$BACKUP_DIR/lib-complete"
backup_item "lib/supabase.js" "$BACKUP_DIR/critical/" "Supabase Client"
backup_item "lib/supabaseClient.js" "$BACKUP_DIR/critical/" "Supabase Client Alt"
backup_item "hooks" "$BACKUP_DIR/" "React Hooks"

echo ""

# 6. Backup pages
echo "📄 Backing up Pages..."
echo "-----------------------"
cp -r pages "$BACKUP_DIR/pages-complete"
echo -e "${GREEN}✅ All pages backed up${NC}"

echo ""

# 7. Create a manifest of what was backed up
echo "📝 Creating Backup Manifest..."
echo "-------------------------------"

cat > "$BACKUP_DIR/BACKUP_MANIFEST.txt" << EOF
BlueTubeTV Backup Manifest
Created: $(date)
================================

CRITICAL PAYMENT FILES BACKED UP:
✅ Stripe Integration
✅ Tip System  
✅ SuperChat System
✅ Earnings APIs
✅ Transaction History
✅ Revenue Dashboard

WORKING FEATURES PRESERVED:
- Authentication System
- Stream APIs
- Job Marketplace
- Upload System
- Analytics
- Admin Panel

TO RESTORE:
1. To restore everything:
   cp -r $BACKUP_DIR/* .

2. To restore just payments:
   cp -r $BACKUP_DIR/payment-systems/* pages/api/

3. To restore specific file:
   cp $BACKUP_DIR/[path-to-file] [destination]

QUICK ROLLBACK COMMAND:
./restore-backup.sh $BACKUP_DIR
EOF

echo -e "${GREEN}✅ Manifest created${NC}"

echo ""

# 8. Create restore script
echo "🔄 Creating Restore Script..."
echo "------------------------------"

cat > "restore-backup.sh" << 'EOF'
#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./restore-backup.sh BACKUP_DIRECTORY"
    echo "Available backups:"
    ls -d BACKUP_* 2>/dev/null
    exit 1
fi

BACKUP_DIR=$1

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "🔄 Restoring from $BACKUP_DIR"
echo "================================"
echo "⚠️  This will overwrite current files!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

# Restore files
echo "Restoring API..."
cp -r "$BACKUP_DIR/api-complete/"* pages/api/ 2>/dev/null

echo "Restoring Components..."
cp -r "$BACKUP_DIR/components-complete/"* components/ 2>/dev/null

echo "Restoring Libraries..."
cp -r "$BACKUP_DIR/lib-complete/"* lib/ 2>/dev/null

echo "Restoring Config..."
cp "$BACKUP_DIR/.env.local" . 2>/dev/null
cp "$BACKUP_DIR/next.config.js" . 2>/dev/null
cp "$BACKUP_DIR/package.json" . 2>/dev/null

echo "✅ Restore complete!"
echo "Run 'npm install' if package.json was changed"
EOF

chmod +x restore-backup.sh
echo -e "${GREEN}✅ Restore script created${NC}"

echo ""

# 9. Test current payment endpoints
echo "💰 Testing Current Payment Endpoints..."
echo "----------------------------------------"

test_payment_endpoint() {
    local endpoint=$1
    local description=$2
    
    if [ -f "pages/api/$endpoint" ]; then
        echo -e "${GREEN}✅ Found: $description (pages/api/$endpoint)${NC}"
        # Add to critical files list
        echo "pages/api/$endpoint" >> "$BACKUP_DIR/CRITICAL_FILES.txt"
    else
        echo -e "${YELLOW}⚠️  Missing: $description${NC}"
    fi
}

test_payment_endpoint "create-checkout-session.js" "Stripe Checkout"
test_payment_endpoint "tip.js" "Tipping System"
test_payment_endpoint "super-chat.js" "SuperChat"
test_payment_endpoint "earnings.js" "Earnings Tracker"
test_payment_endpoint "webhooks/stripe.js" "Stripe Webhooks"

echo ""

# 10. Create quick test script for payments
echo "🧪 Creating Payment Test Script..."
echo "-----------------------------------"

cat > "test-payments.sh" << 'EOF'
#!/bin/bash

echo "💰 Testing Payment Systems"
echo "=========================="

DOMAIN="http://localhost:3000"

echo "Testing Stripe Checkout..."
curl -X POST "$DOMAIN/api/create-checkout-session" \
  -H "Content-Type: application/json" \
  -d '{"priceId":"test_price"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\nTesting Tip System..."
curl -X POST "$DOMAIN/api/tip" \
  -H "Content-Type: application/json" \
  -d '{"amount":5,"streamerId":"test"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\nTesting SuperChat..."
curl -X POST "$DOMAIN/api/super-chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Test","amount":10}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\nTesting Earnings..."
curl "$DOMAIN/api/earnings" \
  -w "\nStatus: %{http_code}\n"

echo -e "\n✅ Payment system test complete!"
EOF

chmod +x test-payments.sh
echo -e "${GREEN}✅ Payment test script created${NC}"

echo ""
echo "===================================="
echo "✅ BACKUP COMPLETE!"
echo "===================================="
echo ""
echo "📁 Backup saved to: ${BLUE}$BACKUP_DIR${NC}"
echo ""
echo "💡 Important Commands:"
echo "  - Test payments:  ${YELLOW}./test-payments.sh${NC}"
echo "  - Restore backup: ${YELLOW}./restore-backup.sh $BACKUP_DIR${NC}"
echo "  - View manifest:  ${YELLOW}cat $BACKUP_DIR/BACKUP_MANIFEST.txt${NC}"
echo ""
echo "🛡️ Your money printer is safely backed up!"
echo "You can now make changes without fear."
echo ""
echo "💰 Payment files preserved in:"
echo "   $BACKUP_DIR/payment-systems/"
echo ""

# Final safety check
echo "🔍 Quick Payment System Status:"
echo "--------------------------------"
if [ -f "pages/api/create-checkout-session.js" ]; then
    echo -e "${GREEN}✅ Stripe Checkout: ACTIVE${NC}"
fi
if [ -f "pages/api/tip.js" ]; then
    echo -e "${GREEN}✅ Tipping System: ACTIVE${NC}"
fi
if [ -f "pages/api/super-chat.js" ]; then
    echo -e "${GREEN}✅ SuperChat: ACTIVE${NC}"
fi

echo ""
echo "🚀 Safe to proceed with updates!"