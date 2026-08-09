#!/bin/sh
# Baseline script for existing databases
# 
# This script marks the Better Auth schema migration as already applied
# without actually running the migration SQL.
#
# Use this when:
# - Database already has tables (from prisma db push)
# - _prisma_migrations table doesn't exist or is empty
# - prisma migrate deploy fails with P3005 error
#
# Usage:
#   docker compose exec app sh scripts/baseline-migration.sh

set -e

echo "==========================================================="
echo "  Baseline: Mark migration as applied"
echo "==========================================================="
echo ""

# Check if _prisma_migrations table exists
echo "Step 1: Checking migration history..."
if npx prisma migrate status 2>&1 | grep -q "Table '_prisma_migrations' does not exist"; then
  echo "  _prisma_migrations table does not exist"
  echo "  Creating baseline..."
  
  # Mark the migration as already applied
  npx prisma migrate resolve --applied 20260807000000_better_auth_schema_alignment
  
  echo "  ✅ Migration baselined successfully"
else
  echo "  Migration history exists"
  
  # Check if our migration is already applied
  if npx prisma migrate status 2>&1 | grep -q "20260807000000_better_auth_schema_alignment.*Applied"; then
    echo "  ✅ Migration already applied"
  else
    echo "  Marking migration as applied..."
    npx prisma migrate resolve --applied 20260807000000_better_auth_schema_alignment
    echo "  ✅ Migration baselined successfully"
  fi
fi

echo ""
echo "Step 2: Verifying migration status..."
npx prisma migrate status

echo ""
echo "==========================================================="
echo "  Baseline complete"
echo "==========================================================="
