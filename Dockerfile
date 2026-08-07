# ═══════════════════════════════════════════════════════════════
# Destiny Rising Hub - Multi-stage Dockerfile
# Stage 1: Dependencies
# Stage 2: Prisma Generate
# Stage 3: Build
# Stage 4: Production Runner
# ═══════════════════════════════════════════════════════════════

# ─── Stage 1: Install dependencies ────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files (package-lock.json is tracked in Git)
COPY package.json package-lock.json ./

# Install dependencies with npm ci for deterministic builds
RUN npm ci && npm cache clean --force

# ─── Stage 2: Generate Prisma Client ──────────────────────────
FROM deps AS prisma
WORKDIR /app

# DATABASE_URL required for prisma generate (dummy value for build)
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npx prisma generate

# ─── Stage 3: Build the application ───────────────────────────
FROM deps AS builder
WORKDIR /app

COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=prisma /app/node_modules/prisma ./node_modules/prisma

COPY . .

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ─── Stage 4: Development runner ──────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Install required tools
RUN apk add --no-cache dumb-init curl postgresql-client

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy Prisma client
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=prisma /app/node_modules/prisma ./node_modules/prisma

# Copy source code
COPY . .

# Copy entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/app/entrypoint.sh"]

# ─── Stage 5: Production runner ───────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install required tools
RUN apk add --no-cache dumb-init curl postgresql-client && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema and client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Copy entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
