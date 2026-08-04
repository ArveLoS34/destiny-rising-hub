# API Platform Documentation

**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Status:** ✅ Production Ready

---

## Overview

The Destiny Rising Hub API provides a RESTful interface for all platform features. The API follows industry best practices with comprehensive validation, error handling, rate limiting, and monitoring.

### Architecture

```
Client (Web/Mobile/Desktop/CLI)
         ↓
    API Routes (/api/v1)
         ↓
      Controllers
         ↓
       Services
         ↓
     Repositories
         ↓
      Database
```

### Key Features

- ✅ RESTful design
- ✅ Versioned API (`/api/v1`, `/api/v2`)
- ✅ OpenAPI/Swagger documentation
- ✅ Input/Output validation with Zod
- ✅ Standardized error format
- ✅ Pagination, filtering, sorting
- ✅ Role-based permissions
- ✅ Rate limiting
- ✅ Request tracking
- ✅ Performance metrics
- ✅ Caching support

---

## Authentication

### Public Endpoints
No authentication required. Accessible to everyone.

### Authenticated Endpoints
Require valid Bearer token in Authorization header:

```bash
Authorization: Bearer <token>
```

### Permission Levels

| Level | Description |
|-------|-------------|
| `public` | No authentication required |
| `authenticated` | Valid user token required |
| `moderator` | Moderator role or higher |
| `admin` | Admin role |
| `superadmin` | Super admin role |

---

## Request Format

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
X-Request-Id: <optional-request-id>
```

### Query Parameters

All list endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (e.g., `name`, `createdAt`, `popularity`)
- `order` - Sort order (`asc` or `desc`, default: `desc`)
- `filter[field]` - Filter by field value

### Example Request

```http
GET /api/v1/characters?page=1&limit=20&sort=popularity&order=desc&filter[rarity]=SSR
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "requestId": "req_1234567890_abc123",
  "timestamp": "2026-08-04T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "errors": {
      "name": ["Name is required"],
      "email": ["Invalid email format"]
    }
  },
  "requestId": "req_1234567890_abc123",
  "timestamp": "2026-08-04T12:00:00.000Z",
  "path": "/api/v1/characters"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service unavailable |

---

## Rate Limiting

Rate limits are applied per endpoint type:

| Endpoint Type | Window | Max Requests |
|---------------|--------|--------------|
| `public` | 1 minute | 60 |
| `authenticated` | 1 minute | 120 |
| `auth` | 15 minutes | 5 |
| `write` | 1 minute | 30 |
| `search` | 1 minute | 30 |
| `admin` | 1 minute | 100 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1691150400
Retry-After: 60
```

---

## Endpoints

### Characters

#### GET /api/v1/characters

List all characters with pagination and filtering.

**Permission:** `public`  
**Rate Limit:** `public` (60/min)

**Query Parameters:**
- `filter[rarity]` - Filter by rarity (SSR, SR, R, N)
- `filter[element]` - Filter by element
- `filter[role]` - Filter by role
- `filter[faction]` - Filter by faction
- `sort` - Sort by (name, rarity, element, role, popularity, winRate)
- `order` - Sort order (asc, desc)

**Example:**

```bash
curl -X GET "https://api.example.com/api/v1/characters?filter[rarity]=SSR&sort=popularity&order=desc"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "dr-char-001",
      "name": "Nova",
      "title": "Stellar Vanguard",
      "rarity": "SSR",
      "element": "Fire",
      "role": "DPS",
      "popularity": 92,
      "winRate": 58.3
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  },
  "requestId": "req_1234567890_abc123",
  "timestamp": "2026-08-04T12:00:00.000Z"
}
```

#### GET /api/v1/characters/:id

Get a specific character by ID.

**Permission:** `public`  
**Rate Limit:** `public` (60/min)

**Example:**

```bash
curl -X GET "https://api.example.com/api/v1/characters/dr-char-001"
```

#### POST /api/v1/characters

Create a new character.

**Permission:** `admin`  
**Rate Limit:** `write` (30/min)

**Request Body:**

```json
{
  "name": "New Character",
  "title": "Character Title",
  "rarity": "SSR",
  "element": "Fire",
  "role": "DPS",
  "weaponType": "Sword",
  "faction": "Genesis",
  "icon": "https://example.com/icon.png",
  "portrait": "https://example.com/portrait.png"
}
```

---

## Caching

### HTTP Cache

All GET responses include cache headers:

```http
Cache-Control: public, max-age=300
ETag: "abc123"
```

### Redis Cache

Frequently accessed data is cached in Redis with configurable TTL.

### CDN Cache

Static assets are cached at the CDN edge.

---

## Webhooks

Webhooks allow external systems to receive notifications for specific events.

### Supported Events

- `content.published` - New content published
- `content.updated` - Content updated
- `content.archived` - Content archived
- `patch.released` - New game patch released
- `import.completed` - Data import completed

### Webhook Payload

```json
{
  "event": "content.published",
  "data": {
    "type": "character",
    "id": "dr-char-001",
    "name": "Nova"
  },
  "timestamp": "2026-08-04T12:00:00.000Z",
  "webhookId": "wh_123456"
}
```

### Webhook Security

All webhooks are signed with HMAC-SHA256:

```http
X-Webhook-Signature: sha256=abc123...
```

---

## SDK

### TypeScript SDK

```bash
npm install @destiny-rising-hub/sdk
```

**Usage:**

```typescript
import { DestinyRisingHub } from '@destiny-rising-hub/sdk';

const client = new DestinyRisingHub({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com',
});

// Get characters
const characters = await client.characters.list({
  rarity: 'SSR',
  sort: 'popularity',
  order: 'desc',
});

// Get specific character
const character = await client.characters.get('dr-char-001');
```

---

## Error Handling

### Client-Side Error Handling

```typescript
try {
  const response = await fetch('/api/v1/characters', {
    headers: {
      'Authorization': 'Bearer <token>',
    },
  });
  
  const data = await response.json();
  
  if (!data.success) {
    console.error('API Error:', data.code, data.message);
    
    if (data.code === 'VALIDATION_ERROR') {
      console.error('Validation errors:', data.details.errors);
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Monitoring

### Request Metrics

All API requests are tracked with:

- Response time
- Status code
- Error rate
- Cache hit rate
- Usage patterns

### Health Check

```bash
curl https://api.example.com/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-08-04T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 86400
}
```

---

## Best Practices

### 1. Use Pagination

Always use pagination for list endpoints to avoid large payloads:

```javascript
// ❌ Bad
const allCharacters = await fetch('/api/v1/characters?limit=1000');

// ✅ Good
let page = 1;
let allCharacters = [];
let hasMore = true;

while (hasMore) {
  const response = await fetch(`/api/v1/characters?page=${page}&limit=100`);
  const data = await response.json();
  allCharacters.push(...data.data);
  hasMore = data.meta.hasNextPage;
  page++;
}
```

### 2. Handle Rate Limits

Implement exponential backoff for rate-limited requests:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}
```

### 3. Cache Responses

Cache API responses when appropriate:

```javascript
const cache = new Map();

async function getCachedCharacter(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const response = await fetch(`/api/v1/characters/${id}`);
  const data = await response.json();
  
  cache.set(id, data);
  setTimeout(() => cache.delete(id), 5 * 60 * 1000); // 5 minutes
  
  return data;
}
```

### 4. Use Request IDs

Include request IDs for debugging:

```javascript
const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const response = await fetch('/api/v1/characters', {
  headers: {
    'X-Request-Id': requestId,
  },
});
```

---

## Changelog

### v1.0.0 (2026-08-04)

- ✅ Initial release
- ✅ Character endpoints
- ✅ Authentication system
- ✅ Rate limiting
- ✅ Pagination and filtering
- ✅ Error handling
- ✅ Metrics tracking

---

## Support

- **Documentation:** https://docs.destinyrisinghub.com
- **GitHub:** https://github.com/ArveLoS34/destiny-rising-hub
- **Discord:** https://discord.gg/destinyrisinghub
- **Email:** support@destinyrisinghub.com

---

**Last Updated:** 2026-08-04  
**API Version:** 1.0.0
