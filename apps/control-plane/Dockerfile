FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/control-plane/package.json apps/control-plane/package.json

RUN pnpm install --filter @gatekeeper/control-plane... --frozen-lockfile

COPY . .

RUN pnpm --filter @gatekeeper/control-plane build

EXPOSE 3001

CMD ["pnpm", "--filter", "@gatekeeper/control-plane", "start"]