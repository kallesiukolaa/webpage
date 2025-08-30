FROM node:20-alpine

WORKDIR /app

# Only copy package manifest first (better layer caching)
COPY package.json ./

# Generate lockfile inside the image (not in your repo)
RUN npm install --package-lock-only

# Install deps strictly per the generated lock
RUN npm ci

# Now copy the rest of the source
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
  && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
