#!/bin/sh
set -e

echo "==========================================================="
echo "  Destiny Rising Hub - Application Startup"
echo "==========================================================="
echo ""

# Wait for PostgreSQL to be ready
echo "Step 1: Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if nc -z postgres 5432 2>/dev/null; then
    echo "PostgreSQL is ready!"
    break
  fi

  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "  Attempt $RETRY_COUNT/$MAX_RETRIES: PostgreSQL not ready, waiting..."
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Failed to connect to PostgreSQL after $MAX_RETRIES attempts"
  exit 1
fi

echo ""
echo "Step 2: Installing dependencies..."
npm install

echo ""
echo "Step 3: Generating Prisma Client..."
npx prisma generate

echo ""
echo "Step 4: Running database migrations..."
# Try migrate deploy first (proper migration management)
if ! npx prisma migrate deploy; then
  echo "migrate deploy failed - checking error type..."
  
  # Check if it's P3009 error (failed migrations in history)
  if npx prisma migrate status 2>&1 | grep -q "P3009\|failed migration"; then
    echo "P3009 detected: Failed migration in history"
    echo "Attempting to reset failed migration state..."
    
    # Mark the failed migration as rolled back
    npx prisma migrate resolve --rolled-back 20260807000000_better_auth_schema_alignment || true
    
    # Try deploy again
    if ! npx prisma migrate deploy; then
      echo ""
      echo "❌ Migration still failed after reset."
      echo ""
      echo "Manual intervention required:"
      echo "  1. Check _prisma_migrations table state"
      echo "  2. Verify database schema compatibility"
      echo "  3. If schema is compatible, run manually:"
      echo "     npx prisma migrate resolve --applied 20260807000000_better_auth_schema_alignment"
      echo "  4. Then run: npx prisma migrate deploy"
      echo ""
      exit 1
    fi
    
  # Check if it's P3005 error (database schema not empty)
  elif npx prisma migrate status 2>&1 | grep -q "P3005\|not empty"; then
    echo "Database has tables but no migration history"
    echo ""
    echo "Manual baseline required:"
    echo "  npx prisma migrate resolve --applied 20260807000000_better_auth_schema_alignment"
    echo ""
    exit 1
  else
    echo "Migration failed for unknown reason"
    echo ""
    echo "Manual intervention required."
    echo ""
    exit 1
  fi
fi

echo ""
echo "Step 5: Running seed (optional)..."
npx tsx prisma/seed.ts || echo "Seed failed, but continuing..."

echo ""
echo "Step 6: Starting Next.js development server..."
echo "==========================================================="
echo ""

if pgrep -f "next dev" >/dev/null 2>&1; then
  echo "Stopping existing Next.js dev server..."
  pkill -f "next dev" || true
  sleep 2
fi

exec npm run dev
