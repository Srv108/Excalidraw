FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.28.2

# Copy entire monorepo
COPY . .

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Build all packages and apps
RUN pnpm run build

# Expose port for HTTP backend
EXPOSE 3002

# Start HTTP backend by default
CMD ["node", "apps/http-backend/dist/index.js"]
