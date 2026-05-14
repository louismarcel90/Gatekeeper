FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/gateway/package.json apps/gateway/package.json

RUN pnpm install --filter @gatekeeper/gateway... --frozen-lockfile

COPY . .

RUN pnpm --filter @gatekeeper/gateway build

EXPOSE 3002

CMD ["pnpm", "--filter", "@gatekeeper/gateway", "start"]