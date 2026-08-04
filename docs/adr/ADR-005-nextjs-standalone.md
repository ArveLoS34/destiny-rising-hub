# ADR-005: Next.js 16 Standalone Output

## Durum
✅ Kabul Edildi

## Bağlam
Destiny Rising Hub Next.js 16.3.0 ile geliştiriliyor. Docker container'da production deployment için optimize edilmiş build çıktısı gerekiyor.

**Gereksinimler:**
- Minimal Docker image size
- Bağımsız çalışabilen çıktı (node_modules bağımlılığı olmamalı)
- Static assets ayrımı (CDN-friendly)
- Production-ready security headers

## Karar
Next.js `output: 'standalone'` kullanıyoruz.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};
```

### Docker Build Yapısı

```
┌─────────────────────────────────────┐
│ Stage 1: deps (npm ci)              │
├─────────────────────────────────────┤
│ Stage 2: prisma (prisma generate)   │
├─────────────────────────────────────┤
│ Stage 3: builder (next build)       │
├─────────────────────────────────────┤
│ Stage 4: runner (standalone output) │
│   - .next/standalone/               │
│   - .next/static/                   │
│   - public/                         │
│   - Prisma client + schema          │
│   → ~200MB image                    │
└─────────────────────────────────────┘
```

### Neden Standalone?

1. **Minimal Image:** Sadece gerekli dosyalar — `node_modules` tamamen dahil değil
2. **Self-contained:** `node server.js` ile direkt çalışır
3. **Multi-stage friendly:** Build stage'dan runner stage'a sadece gerekli dosyalar kopyalanır
4. **No npm runtime:** Production image'de npm/yarn yok — attack surface azalır

## Sonuçlar

### Olumlu
- ✅ Image size: ~200MB (normal build ~800MB+)
- ✅ Startup time: `node server.js` → <2sn
- ✅ Security: Gereksiz paket yok
- ✅ Consistency: Geliştirme ve production aynı build artifact'ı kullanır

### Olumsuz
- ⚠️ Native modules: `sharp` gibi native bağımlılıkların runner stage'da da olması gerekir
- ⚠️ Static assets: `.next/static` ayrı kopyalanmalı (otomatik değil)
- ⚠️ Prisma: Generated client + WASM dosyaları ayrı kopyalanmalı

### Notlar
- `dumb-init` ile signal handling (SIGTERM → graceful shutdown)
- `nextjs` user ile çalışır (root değil)
- Port 3000'de bind eder, `0.0.0.0` üzerinde dinler

## Alternatifler Değerlendirilen

| Yaklaşım | Artı | Eksi | Karar |
|----------|------|------|-------|
| **Standalone** | Minimal image, self-contained | Manual static file copying | ✅ Seçildi |
| Full node_modules | Basit, her şey dahil | ~800MB image, yavaş deploy | ❌ Reddedildi |
| Static export | Çok hızlı, CDN-ready | API routes çalışmaz, SSR yok | ❌ Reddedildi |
| Vercel deployment | Zero config | Vendor lock-in, maliyet | ❌ Reddedildi |
