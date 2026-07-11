# AGENTS.md

Guidance for coding agents working in this repo.

## Principles

- Keep the template generic unless the user explicitly asks to specialize it.
- Prefer Cloudflare-native primitives before introducing external infrastructure.
- Use Alchemy stages for every deployed environment.
- Use Alchemy's Infrastructure-as-Effects style for new infrastructure/runtime work where the installed Alchemy version supports it: bind capabilities through typed services/layers rather than hand-rolled env lookups.
- Do not put secrets in source, docs, prompts, or generated reports.
- Keep agent-facing tools/endpoints narrow and semantic; avoid raw SQL/API escape hatches.

## Agent commit and preview workflow

Coding agents should treat a completed code-changing turn as a validated checkpoint:

1. Run the standard end-of-turn checks:

   ```bash
   bun install # if dependencies changed
   bun run format
   bun run lint
   bun run typecheck
   ```

   `bun run check` can be used when you want the non-writing formatter check plus lint and typecheck in one command.

2. Commit the finished changes with a clear message.
3. The `post-commit` hook deploys the current feature branch as an Alchemy stage.
4. Wait for the hook to finish before reporting success.
5. Report the branch, stage, commit hash, validation result, and preview deploy result.

Feature branches map to preview stages by sanitizing the branch name:

```txt
feat/meta-ads-reporting -> feat-meta-ads-reporting
```

Protected branches are not auto-deployed by default:

```txt
main
master
prod
production
```

Use explicit production/staging deploy commands for protected branches. If you need to skip preview deployment for a one-off commit, set:

```bash
SKIP_PREVIEW_DEPLOY=1 git commit -m "..."
```

Useful preview commands:

```bash
bun run preview:deploy
bun run preview:info
CONFIRM_DESTROY_PREVIEW=1 bun run preview:destroy
```

Preview deployment state and logs live under `.git/` and must not be committed.

## Validation

Before committing changes, run:

```bash
bun install # if dependencies changed
bun run format
bun run lint
bun run typecheck
```

For CI-style validation without rewriting files, run:

```bash
bun run check
```

If infrastructure files change, also run a dry/planning deploy once the project has concrete Cloudflare resources configured.

## Structure

- `apps/web`: web app shell, intended to become TanStack Start.
- `apps/mobile`: Expo app shell.
- `apps/backend`: Hono + Effect worker API.
- `packages/ui`: shared web/native UI primitives.
- `packages/db`: Drizzle schema and D1 database helper.
- `infra`: Alchemy stage-aware infra code.
- `docs`: durable repo context for humans and agents.
