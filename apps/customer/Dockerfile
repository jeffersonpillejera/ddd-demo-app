FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# ---- Prune monorepo to only what customer-service needs ----
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune customer-service --docker

# ---- Install dependencies (layer is cached until package.jsons or lockfile change) ----
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# ---- Build ----
COPY --from=pruner /app/out/full/ .
RUN pnpm exec turbo run build --filter=customer-service
RUN pnpm --filter=customer-service deploy --prod --legacy /standalone

# ---- Production image ----
FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=installer /standalone .
EXPOSE 3008
CMD ["node", "dist/src/main"]
