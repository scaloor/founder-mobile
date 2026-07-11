# Preview Environments

Every branch/PR should map to an Alchemy stage:

```txt
branch/PR -> stage pr-123
  -> founder-mobile-pr-123-db
  -> founder-mobile-pr-123-api
  -> founder-mobile-pr-123-web
  -> founder-mobile-pr-123-files
  -> founder-mobile-pr-123-jobs
```

Deploy:

```bash
bun run deploy -- --stage pr-123
```

Destroy:

```bash
bun run destroy -- --stage pr-123
```

Production should use `--stage prod` and separate Cloudflare secrets/bindings.
