# =============================================================================
# Dockerfile — Sudoku Web SPA (Multi-Stage Build)
#
# Stage 1 (builder): Node 20 Alpine + pnpm — install deps, build with Turborepo
# Stage 2 (runtime): Nginx Alpine — serve static assets with security hardening
#
# Build:  docker build -t sudoku-web:local .
# Run:    docker run --rm -p 8080:80 --read-only --cap-drop ALL \
#           --tmpfs /var/cache/nginx:mode=1777 \
#           --tmpfs /tmp:mode=1777 \
#           sudoku-web:local
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Builder — install dependencies and build the web app
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack (ships with Node 20)
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copy workspace manifests for layer cache optimization
# Only re-runs pnpm install when manifest files change, not on source edits
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy per-package manifests (keeps install layer stable across source changes)
COPY packages/core/package.json packages/core/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/

# Install all workspace dependencies
# --ignore-scripts skips native postinstall scripts (e.g. node-gyp from
# Expo/React Native packages) that need Python/make — not required for the
# web build and unavailable in node:20-alpine
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy base TypeScript config
COPY tsconfig.base.json ./

# Copy package source (separated so install cache is preserved)
COPY packages/ packages/
COPY apps/web/ apps/web/

# Build the web app (Turborepo builds @sudoku/core first via dependsOn, then web)
RUN pnpm --filter @sudoku/web build

# ---------------------------------------------------------------------------
# Stage 2: Runtime — serve static assets with hardened Nginx
# ---------------------------------------------------------------------------
FROM nginx:alpine-slim AS runtime

# Upgrade known vulnerable packages — targeted to avoid unnecessary bloat
RUN apk upgrade --no-cache zlib libcrypto3 libssl3 musl musl-utils

# Create non-root user for security hardening
# UID 1000, no home directory, no login shell
RUN addgroup -g 1000 -S app && \
    adduser -u 1000 -S -G app -s /sbin/nologin app

# Remove default Nginx HTML and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy built static assets from builder stage
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY .docker/nginx.conf /etc/nginx/nginx.conf

# Prepare writable directories for Nginx on read-only filesystem
# These are the only directories Nginx needs to write to at runtime
RUN mkdir -p /var/cache/nginx /tmp && \
    chown -R app:app /var/cache/nginx /tmp && \
    chown -R app:app /usr/share/nginx/html && \
    chown -R app:app /var/log/nginx

# Expose HTTP port
EXPOSE 80

# Health check for container orchestrators
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Switch to non-root user
USER app

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
