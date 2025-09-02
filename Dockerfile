# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (use npm ci for reproducible builds)
COPY package*.json ./
RUN npm ci

# Build TypeScript
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only what's needed to run (and install prod deps)
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled JS from builder, owned by non-root user
COPY --from=builder --chown=node:node /app/dist ./dist

# Drop privileges
USER node

EXPOSE 3000

# Simple container healthcheck hitting your /healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:${PORT}/healthcheck >/dev/null 2>&1 || exit 1

CMD ["node", "dist/index.js"]
