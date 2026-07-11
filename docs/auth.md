# Authentication foundation

This repo includes a deliberately small Better Auth foundation in `packages/auth` and wires it into the Cloudflare Worker backend at `/api/auth/**`.

The goal is not to pick every product auth feature up front. It is to give future implementers a safe, typed starting point that can be extended after checking the current Better Auth docs for the product requirements.

## What is included

- `packages/auth`: shared auth package.
- `packages/auth/src/server.ts`: `createAuth(env)` server factory for the worker.
- `packages/auth/src/client.ts`: tiny Better Auth client factory for frontend packages.
- `packages/auth/src/config.ts`: shared auth constants and trusted-origin parsing.
- `packages/db/src/schema.ts`: baseline Better Auth tables for D1/SQLite:
  - `user`
  - `session`
  - `account`
  - `verification`
- `apps/backend/src/worker.ts`: forwards `GET` and `POST` requests under `/api/auth/**` to Better Auth.

## Current behavior

The starter enables email/password auth because it is the simplest default:

```ts
emailAndPassword: {
  enabled: true,
}
```

OAuth providers, usernames, organizations, teams, passkeys, two-factor auth, admin controls, and other product-specific features are intentionally not enabled yet.

## Runtime environment

The worker auth package expects these environment bindings/variables:

| Name                          | Required             | Purpose                                                                           |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| `DB`                          | yes                  | Cloudflare D1 database binding used by Better Auth and Drizzle.                   |
| `BETTER_AUTH_SECRET`          | production           | Secret used by Better Auth. Never commit it.                                      |
| `BETTER_AUTH_URL`             | deployment-dependent | Canonical backend URL used by Better Auth callbacks/cookies.                      |
| `BETTER_AUTH_TRUSTED_ORIGINS` | deployment-dependent | Comma-separated list of allowed frontend origins.                                 |
| `ENVIRONMENT`                 | no                   | Used to reject missing secrets in production while allowing a local dev fallback. |

`BETTER_AUTH_SECRET` must be set through the deployment secret mechanism, not source control. Local development currently falls back to a fixed development-only value so the starter can typecheck and run without secret setup.

## How agents should extend auth

Before changing Better Auth options or adding plugins, agents should check the current Better Auth docs:

- Main docs: <https://www.better-auth.com/docs>
- Installation: <https://www.better-auth.com/docs/installation>
- Authentication methods: <https://www.better-auth.com/docs/authentication/email-password>
- Social sign-on: <https://www.better-auth.com/docs/authentication/social-sign-on>
- Organizations plugin: <https://www.better-auth.com/docs/plugins/organization>

Then decide what the product actually needs:

1. **Email/password only** — keep the current starter and add UI flows.
2. **OAuth/social login** — add the specific provider config and secrets only for the providers requested.
3. **Username login** — add the appropriate Better Auth plugin/fields after confirming current docs and schema changes.
4. **Organizations/teams** — add the Better Auth organization plugin only when the product needs multi-tenant membership, roles, or invites.
5. **Mobile auth** — confirm Better Auth's latest mobile/client guidance before adding Expo-specific session handling.

When adding a Better Auth plugin, also update:

- `packages/auth/src/server.ts`
- `packages/auth/src/client.ts` if the client API changes
- `packages/db/src/schema.ts` and generated migrations if the plugin needs extra tables/columns
- this document
- `AGENTS.md` if the agent workflow changes

## Validation

After auth changes, run the repo-standard checks:

```bash
bun install # if dependencies changed
bun run format
bun run lint
bun run typecheck
bun run check
```
