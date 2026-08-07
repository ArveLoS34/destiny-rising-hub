#!/bin/sh
set -e

echo "═══════════════════════════════════════════════════════════"
echo "  Destiny Rising Hub - Application Startup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Wait for PostgreSQL to be ready
echo "Step 1: Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if nc -z postgres 5432 2>/dev/null; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "  Attempt $RETRY_COUNT/$MAX_RETRIES: PostgreSQL not ready, waiting..."
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Failed to connect to PostgreSQL after $MAX_RETRIES attempts"
  exit 1
fi

echo ""
echo "Step 2: Installing dependencies..."
npm install

echo ""
echo "Step 3: Generating Prisma Client..."
npx prisma generate

echo ""
echo "Step 4: Pushing database schema..."
npx prisma db push --accept-data-loss

echo ""
echo "Step 5: Running seed (optional)..."
npx tsx prisma/seed.ts || echo "⚠️  Seed failed, but continuing..."

echo ""
echo "Step 6: Starting Next.js development server..."
echo "═══════════════════════════════════════════════════════════"
echo ""
# npm run dev öncesi ekle
if pgrep -f "next dev" >/dev/null 2>&1; then
  echo "Stopping existing Next.js dev server..."
  pkill -f "next dev" || true
  sleep 2
fi

exec npm run dev
