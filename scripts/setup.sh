#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# Destiny Rising Hub — Quick Setup Script
# Yeni geliştiriciler için tek komutla kurulum
# ═══════════════════════════════════════════════════════════════

set -e

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  🎮 Destiny Rising Hub — Quick Setup"
echo "═══════════════════════════════════════════════════════"
echo ""

# ─── Step 1: Check prerequisites ──────────────────────────────
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Please install Docker Desktop."
  echo "   https://docs.docker.com/get-docker/"
  exit 1
fi

if ! command -v docker compose &> /dev/null; then
  echo "❌ Docker Compose not found. Please update Docker Desktop."
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "⚠️  Node.js not found. Docker will handle this, but local dev requires Node.js 20+"
  echo "   https://nodejs.org/"
fi

echo "✅ Prerequisites OK"
echo ""

# ─── Step 2: Copy environment file ────────────────────────────
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.docker..."
  cp .env.docker .env
  echo "✅ .env created"
else
  echo "ℹ️  .env already exists, skipping..."
fi
echo ""

# ─── Step 3: Start Docker services ────────────────────────────
echo "🐳 Starting Docker services..."
docker compose up -d
echo ""

# ─── Step 4: Wait for services ────────────────────────────────
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for PostgreSQL
echo -n "  PostgreSQL: "
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U destiny_user > /dev/null 2>&1; then
    echo "✅ Ready"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Timeout"
    exit 1
  fi
  sleep 2
  echo -n "."
done

# Wait for Redis
echo -n "  Redis: "
for i in {1..30}; do
  if docker compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Ready"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Timeout"
    exit 1
  fi
  sleep 2
  echo -n "."
done

# Wait for MinIO
echo -n "  MinIO: "
for i in {1..30}; do
  if curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo "✅ Ready"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Timeout"
    exit 1
  fi
  sleep 2
  echo -n "."
done

echo ""

# ─── Step 5: Wait for application ─────────────────────────────
echo "⏳ Waiting for application to start (migration + seed)..."
echo -n "  Application: "
for i in {1..60}; do
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Ready"
    break
  fi
  if [ $i -eq 60 ]; then
    echo "❌ Timeout — check logs: docker compose logs app"
    exit 1
  fi
  sleep 3
  echo -n "."
done
echo ""

# ─── Step 6: Run tests ────────────────────────────────────────
echo "🧪 Running integration tests..."
npm test -- --ci 2>/dev/null && echo "✅ Tests passed" || echo "⚠️  Tests had issues — check manually with: npm test"
echo ""

# ─── Done ──────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  🌐 Application:     http://localhost:3000"
echo "  🐘 PostgreSQL:      localhost:5432"
echo "  🔴 Redis:           localhost:6379"
echo "  📦 MinIO API:       http://localhost:9000"
echo "  📦 MinIO Console:   http://localhost:9001"
echo "  📧 Mailpit (Email): http://localhost:8025"
echo ""
echo "  Useful commands:"
echo "    make logs       — Follow application logs"
echo "    make test       — Run integration tests"
echo "    make db-studio  — Open Prisma Studio"
echo "    make stop       — Stop all services"
echo ""
