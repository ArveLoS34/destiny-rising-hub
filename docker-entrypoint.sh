#!/bin/sh
set -e

echo "==========================================================="
echo "  Destiny Rising Hub - Starting Application"
echo "==========================================================="

# Wait for database to be ready
echo "Waiting for database..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "  Database not ready, retrying in 3s..."
  sleep 3
done
echo "Database is ready"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate
echo "Prisma Client generated"

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss
echo "Migrations applied"

# Run seed (only if DATABASE_SEED=true)
if [ "${DATABASE_SEED:-false}" = "true" ]; then
  echo "Running seed..."
  npx tsx prisma/seed.ts || echo "Seed skipped (may already be seeded)"
  echo "Seed completed"
fi

# Start the application
echo "==========================================================="
echo "  Starting Next.js application..."
echo "==========================================================="

exec "$@"
