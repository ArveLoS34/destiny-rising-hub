#!/bin/bash
# RC-4 Production Smoke Test
# Run after: git pull && docker compose down -v && docker compose up --build -d

set -e

echo "=== RC-4 SMOKE TEST ==="
echo ""

# Wait for server
echo "1/4 Waiting for server..."
for i in {1..30}; do
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Server ready"
    break
  fi
  sleep 1
done

# Health check
echo ""
echo "2/4 Health check..."
HEALTH=$(curl -s http://localhost:3000/api/health)
echo "$HEALTH" | jq -r '.status' | grep -q "healthy" && echo "✅ Health OK" || echo "❌ Health failed"

# Login + cookies
echo ""
echo "3/4 Demo login..."
LOGIN=$(curl -s -c /tmp/cookies.txt -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}')
echo "$LOGIN" | jq -r '.user.username' | grep -q "guardian" && echo "✅ Login OK" || echo "❌ Login failed"

CSRF=$(echo "$LOGIN" | jq -r '.csrfToken')

# CSRF test (no header → 403)
echo ""
echo "4/4 CSRF validation..."
SIGNOUT_NO_CSRF=$(curl -s -w "%{http_code}" -b /tmp/cookies.txt -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-out"}')
echo "$SIGNOUT_NO_CSRF" | grep -q "403" && echo "✅ CSRF block OK (403)" || echo "❌ CSRF block failed"

# CSRF test (with header → 200)
SIGNOUT_WITH_CSRF=$(curl -s -w "%{http_code}" -b /tmp/cookies.txt -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -d '{"action":"sign-out"}')
echo "$SIGNOUT_WITH_CSRF" | grep -q "200" && echo "✅ CSRF pass OK (200)" || echo "❌ CSRF pass failed"

echo ""
echo "=== SMOKE TEST COMPLETE ==="
