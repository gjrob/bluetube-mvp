#!/bin/bash
# save as quick-test.sh

echo "🚁 BlueTubeTV Quick Test"
echo "========================"

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server not running - start with: npm run dev"
    exit 1
fi

# Test main pages
echo ""
echo "Testing Pages:"
for page in "/" "/login" "/dashboard" "/live" "/jobs" "/marketplace"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$page)
    if [ "$status" = "200" ] || [ "$status" = "302" ]; then
        echo "  ✅ $page (Status: $status)"
    else
        echo "  ❌ $page (Status: $status)"
    fi
done

# Test API endpoints
echo ""
echo "Testing APIs:"
for api in "/api/health" "/api/stream/stats" "/api/jobs"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$api)
    if [ "$status" = "200" ] || [ "$status" = "401" ]; then
        echo "  ✅ $api (Status: $status)"
    else
        echo "  ❌ $api (Status: $status)"
    fi
done

# Check component files
echo ""
echo "Checking Components:"
for file in "components/Analytics.js" "components/LivepeerStream.js" "components/NFTMinting.js"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done

echo ""
echo "Test Complete!"