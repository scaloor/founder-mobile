# founder-mobile

A Bun monorepo template for Cloudflare-native, agent-friendly product builds.

## Stack

- **Bun workspaces** for monorepo/package management
- **Web:** TanStack Start-ready React app
- **Mobile:** Expo + Expo Router
- **Backend:** Hono + Effect on Cloudflare Workers
- **DB:** Drizzle ORM targeting Cloudflare D1
- **Infra:** Alchemy stages for preview/prod environments

## Layout

```txt
apps/
  web/
  mobile/
  backend/
packages/
  ui/
  db/
infra/
  alchemy.run.ts
docs/
```

## Commands

```bash
bun install
bun run typecheck
bun run dev:web
bun run dev:mobile
bun run dev:backend
bun run deploy -- --stage pr-123
bun run destroy -- --stage pr-123
```

## Notes

The scaffold intentionally avoids product-specific features. Clone it, rename it,
then add schema, routes, report endpoints, CI, and concrete Alchemy resources for
the product you are building.
