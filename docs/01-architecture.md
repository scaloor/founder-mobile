# Architecture

## Workspace layout

```txt
apps/web       TanStack Start-ready React web app
apps/mobile    Expo app
apps/backend   Hono + Effect Cloudflare Worker
packages/ui    shared UI primitives
packages/db    Drizzle schema/client targeting Cloudflare D1
infra           Alchemy stage-aware infrastructure entrypoint
```

## Cloudflare-native services

Use Cloudflare primitives before reaching for external services:

- D1: relational app/report data for small-to-medium internal products
- R2: generated files, exports, attachments
- KV: cache/config/feature flags, not source-of-truth relational data
- Queues: ingestion, report generation, webhook jobs
- Workers: web and backend deployments
- Durable Objects: add later for realtime/session coordination

## Agent boundary

Agents should call safe app/reporting endpoints or CLIs. They should not receive raw secrets, unrestricted SQL access, or production write access by default.
