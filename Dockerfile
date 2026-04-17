FROM node:20-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Omit --frozen-lockfile for now in case your lockfile isn't synced
RUN npm ci

COPY . .

# Generate Prisma engine module natively
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Step 2. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# IMPORTANT: Copy custom Prisma generative layout explicitly ignoring auto-trace removals
COPY --from=builder --chown=nextjs:nodejs /app/app/generated/prisma ./app/generated/prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
