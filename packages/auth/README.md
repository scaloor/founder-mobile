# `@founder-mobile/auth`

Minimal Better Auth foundation for the repo.

This package intentionally keeps auth basic and product-neutral. It exports:

- `createAuth(env)` for the Cloudflare Worker backend.
- `createFounderAuthClient(options)` for frontend packages.
- shared constants such as `authBasePath`.

The backend mounts Better Auth at:

```txt
/api/auth/**
```

Before adding OAuth providers, username flows, organizations, teams, passkeys, or other Better Auth plugins, read `docs/auth.md` and check the latest Better Auth docs at <https://www.better-auth.com/docs>.
