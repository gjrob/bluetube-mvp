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
