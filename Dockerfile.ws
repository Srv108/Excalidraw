FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.28.2

# Copy entire monorepo
COPY . .

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN cd packages/db && npx prisma generate

# Build all packages and apps
RUN pnpm run build

# Expose ports for WebSocket backend (8080 for WSS) and health check (8081 for HTTP)
EXPOSE 8080 8081

# Start WebSocket backend
CMD ["node", "apps/ws-backend/dist/index.js"]
