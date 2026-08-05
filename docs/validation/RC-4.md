# RC-4: Storage Validation

## Objective

MinIO/S3 object storage çalışıyor mu? Dosya upload, download, resize, format dönüşümü
(WebP, AVIF) fonksiyonel mu?

## Environment

- **Storage:** MinIO (S3-compatible)
- **Image Processing:** sharp
- **Tarih:** [Doğrulama tarihi]

## Prerequisites

- ✅ RC-1 PASS (MinIO servisi running)

## Commands

### 1. MinIO Connectivity

```bash
# MinIO health
curl -sf http://localhost:9000/minio/health/live

# MinIO Console
curl -sf -o /dev/null -w "%{http_code}" http://localhost:9001

# Bucket listesi
docker compose exec minio mc alias set local http://localhost:9000 minioadmin minioadmin
docker compose exec minio mc ls local
```

### 2. Upload

```bash
# Test dosyası oluştur
echo "test content" > /tmp/test-upload.txt

# MinIO'ya yükle
docker compose exec minio mc cp /tmp/test-upload.txt local/destiny-assets/test-upload.txt

# Yüklendi mi?
docker compose exec minio mc ls local/destiny-assets/
```

### 3. Download

```bash
# Dosyayı indir
docker compose exec minio mc cat local/destiny-assets/test-upload.txt

# HTTP ile erişim
curl -sf http://localhost:9000/destiny-assets/test-upload.txt
```

### 4. Image Processing

```bash
# Upload test image
# Resize test
# WebP conversion test
# AVIF conversion test
# Thumbnail generation test
```

### 5. Delete

```bash
# Dosya sil
docker compose exec minio mc rm local/destiny-assets/test-upload.txt

# Silindi mi?
docker compose exec minio mc ls local/destiny-assets/
```

## Expected Results

| Kontrol | Beklenen Sonuç |
|---------|----------------|
| MinIO health | 200 OK |
| MinIO Console | 200 OK |
| Upload | Dosya bucket'ta |
| Download | İçerik doğru |
| Image resize | Doğru boyut |
| WebP conversion | Valid WebP dosyası |
| AVIF conversion | Valid AVIF dosyası |
| Thumbnail | 150x150 |
| Delete | Dosya silindi |

## Actual Results

> **⏳ PENDING**

## Evidence

> **⏳ PENDING**

## Status

⏳ **PENDING**

---

### Checklist

- [ ] MinIO health check PASS
- [ ] Bucket oluşturulabilir
- [ ] Dosya upload başarılı
- [ ] Dosya download başarılı
- [ ] Image resize doğru boyutta
- [ ] WebP conversion valid
- [ ] AVIF conversion valid
- [ ] Thumbnail generation başarılı
- [ ] Dosya delete başarılı
- [ ] Storage API testler PASS
