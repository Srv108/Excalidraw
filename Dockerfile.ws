FROM node:22-alpine

WORKDIR /app

# Install pnpm and Caddy
RUN npm install -g pnpm@10.28.2 && \
    apk add --no-cache caddy

# Copy entire monorepo
COPY . .

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN cd packages/db && npx prisma generate

# Build all packages and apps
RUN pnpm run build

# Expose ports for Caddy reverse proxy (8080 for WSS) and health check (8081 for HTTP)
EXPOSE 8080 8081

# Start both Caddy (reverse proxy with auto HTTPS) and Node.js WS backend
CMD ["sh", "-c", "WS_DOMAIN=${WS_DOMAIN:-excalidraw-2-pg7v.onrender.com} node apps/ws-backend/dist/index.js & caddy run --config /app/Caddyfile"]
