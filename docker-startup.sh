#!/bin/sh
set -e

echo "═══════════════════════════════════════════════════════"
echo "  Destiny Rising Hub - Docker Startup"
echo "═══════════════════════════════════════════════════════"
echo ""

echo "📍 Current directory: $(pwd)"
echo "📍 Node version: $(node --version)"
echo "📍 npm version: $(npm --version)"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Step 1: npm install"
echo "═══════════════════════════════════════════════════════"
npm install
echo "✅ npm install completed"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Step 2: Prisma Generate"
echo "═══════════════════════════════════════════════════════"
npx prisma generate
echo "✅ Prisma generate completed"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Step 3: Prisma DB Push"
echo "═══════════════════════════════════════════════════════"
npx prisma db push --accept-data-loss
echo "✅ Prisma db push completed"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Step 4: Database Seed (Optional)"
echo "═══════════════════════════════════════════════════════"
if npx tsx prisma/seed.ts; then
  echo "✅ Seed completed successfully"
else
  echo "⚠️ Seed failed, but continuing..."
fi
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Step 5: Starting Next.js Development Server"
echo "═══════════════════════════════════════════════════════"
echo "🚀 Running: npm run dev"
echo "═══════════════════════════════════════════════════════"
echo ""

exec npm run dev
