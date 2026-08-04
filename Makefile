# Destiny Rising Hub — Makefile
# Geliştirme ve production komutları

# ═══════════════════════════════════════════════════════════════
# Değişkenler
# ═══════════════════════════════════════════════════════════════
DOCKER_COMPOSE_DEV = docker compose
DOCKER_COMPOSE_PROD = docker compose -f docker-compose.prod.yml
APP_NAME = destiny-rising-hub

# ═══════════════════════════════════════════════════════════════
# Geliştirme Ortamı
# ═══════════════════════════════════════════════════════════════

.PHONY: help
help: ## Bu yardım mesajını göster
	@echo ""
	@echo "═══════════════════════════════════════════════════════"
	@echo "  Destiny Rising Hub — Komut Satırı Yardımı"
	@echo "═══════════════════════════════════════════════════════"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

.PHONY: setup
setup: ## İlk kurulum (env kopyala, bağımlılıkları yükle)
	cp -n .env.docker .env || true
	npm install
	@echo "✅ Kurulum tamamlandı. 'make dev' ile başlatın."

.PHONY: dev
dev: ## Geliştirme ortamını başlat (tüm servisler)
	$(DOCKER_COMPOSE_DEV) up -d
	@echo ""
	@echo "═══════════════════════════════════════════════════════"
	@echo "  🚀 Destiny Rising Hub Geliştirme Ortamı"
	@echo "═══════════════════════════════════════════════════════"
	@echo ""
	@echo "  Application:    http://localhost:3000"
	@echo "  PostgreSQL:     localhost:5432"
	@echo "  Redis:          localhost:6379"
	@echo "  MinIO API:      http://localhost:9000"
	@echo "  MinIO Console:  http://localhost:9001"
	@echo "  Mailpit UI:     http://localhost:8025"
	@echo "  Redis Commander:http://localhost:8081 (make dev-tools)"
	@echo ""

.PHONY: dev-tools
dev-tools: ## Geliştirme araçlarıyla başlat (Redis GUI dahil)
	$(DOCKER_COMPOSE_DEV) --profile tools up -d
	@echo "✅ Redis Commander: http://localhost:8081"

.PHONY: stop
stop: ## Tüm servisleri durdur
	$(DOCKER_COMPOSE_DEV) down
	@echo "✅ Tüm servisler durduruldu."

.PHONY: restart
restart: ## Tüm servisleri yeniden başlat
	$(DOCKER_COMPOSE_DEV) restart
	@echo "✅ Tüm servisler yeniden başlatıldı."

.PHONY: logs
logs: ## Uygulama loglarını göster
	$(DOCKER_COMPOSE_DEV) logs -f app

.PHONY: logs-all
logs-all: ## Tüm servis loglarını göster
	$(DOCKER_COMPOSE_DEV) logs -f

# ═══════════════════════════════════════════════════════════════
# Database Komutları
# ═══════════════════════════════════════════════════════════════

.PHONY: db-migrate
db-migrate: ## Prisma migration'ı uygula
	$(DOCKER_COMPOSE_DEV) exec app npx prisma migrate dev
	@echo "✅ Migration uygulandı."

.PHONY: db-seed
db-seed: ## Seed data'yı yükle
	$(DOCKER_COMPOSE_DEV) exec app npm run db:seed
	@echo "✅ Seed data yüklendi."

.PHONY: db-studio
db-studio: ## Prisma Studio'yu aç
	$(DOCKER_COMPOSE_DEV) exec app npx prisma studio --port 5555
	@echo "📊 Prisma Studio: http://localhost:5555"

.PHONY: db-reset
db-reset: ## Veritabanını sıfırla (DİKKAT: Tüm veri silinir!)
	@echo "⚠️  DİKKAT: Bu işlem TÜM verileri silecek!"
	@read -p "Devam etmek istiyor musunuz? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	$(DOCKER_COMPOSE_DEV) exec app npx prisma migrate reset --force
	@echo "✅ Veritabanı sıfırlandı ve seed yüklendi."

.PHONY: db-backup
db-backup: ## Veritabanı yedeği oluştur
	$(DOCKER_COMPOSE_DEV) exec postgres pg_dump -U destiny_user destiny_rising_hub > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Yedek oluşturuldu: backup_$$(date +%Y%m%d_%H%M%S).sql"

# ═══════════════════════════════════════════════════════════════
# Test Komutları
# ═══════════════════════════════════════════════════════════════

.PHONY: test
test: ## Tüm testleri çalıştır
	$(DOCKER_COMPOSE_DEV) exec app npm test
	@echo "✅ Testler tamamlandı."

.PHONY: test-integration
test-integration: ## Integration testlerini çalıştır
	$(DOCKER_COMPOSE_DEV) exec app npm test -- --testPathPattern=integration
	@echo "✅ Integration testler tamamlandı."

.PHONY: test-coverage
test-coverage: ## Test coverage raporunu oluştur
	$(DOCKER_COMPOSE_DEV) exec app npm run test:coverage
	@echo "✅ Coverage raporu oluşturuldu."

.PHONY: lint
lint: ## ESLint çalıştır
	$(DOCKER_COMPOSE_DEV) exec app npm run lint
	@echo "✅ Lint tamamlandı."

# ═══════════════════════════════════════════════════════════════
# Build Komutları
# ═══════════════════════════════════════════════════════════════

.PHONY: build
build: ## Docker image oluştur (production)
	docker build -t $(APP_NAME):latest .
	@echo "✅ Docker image oluşturuldu: $(APP_NAME):latest"

.PHONY: build-dev
build-dev: ## Docker image oluştur (development)
	$(DOCKER_COMPOSE_DEV) build
	@echo "✅ Development image oluşturuldu."

# ═══════════════════════════════════════════════════════════════
# Production Komutları
# ═══════════════════════════════════════════════════════════════

.PHONY: prod-up
prod-up: ## Production ortamını başlat
	$(DOCKER_COMPOSE_PROD) up -d
	@echo "✅ Production ortamı başlatıldı."

.PHONY: prod-down
prod-down: ## Production ortamını durdur
	$(DOCKER_COMPOSE_PROD) down
	@echo "✅ Production ortamı durduruldu."

.PHONY: prod-logs
prod-logs: ## Production loglarını göster
	$(DOCKER_COMPOSE_PROD) logs -f app

.PHONY: prod-status
prod-status: ## Production servislerinin durumunu göster
	$(DOCKER_COMPOSE_PROD) ps
	$(DOCKER_COMPOSE_PROD) exec app curl -s http://localhost:3000/api/health || echo "❌ Health check başarısız"

# ═══════════════════════════════════════════════════════════════
# Temizlik
# ═══════════════════════════════════════════════════════════════

.PHONY: clean
clean: ## Tüm container, volume ve image'ları temizle
	$(DOCKER_COMPOSE_DEV) down -v --rmi local
	@echo "✅ Geliştirme ortamı temizlendi."

.PHONY: clean-all
clean-all: ## TÜM Docker kaynaklarını temizle (dikkat!)
	$(DOCKER_COMPOSE_DEV) down -v --rmi local --remove-orphans
	$(DOCKER_COMPOSE_PROD) down -v --rmi local --remove-orphans
	docker system prune -f
	@echo "✅ Tüm Docker kaynakları temizlendi."
