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
