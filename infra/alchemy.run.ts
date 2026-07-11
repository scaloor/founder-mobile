import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

export default Alchemy.Stack(
  "founder-mobile",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const stack = yield* Alchemy.Stack;
    const stage = stack.stage;
    const isProd = stage === "prod";

    const names = {
      d1: `founder-mobile-${stage}-db`,
      r2: `founder-mobile-${stage}-files`,
      kv: `founder-mobile-${stage}-cache`,
      queue: `founder-mobile-${stage}-jobs`,
      apiWorker: `founder-mobile-${stage}-api`,
      webWorker: `founder-mobile-${stage}-web`,
    };

    const db = yield* Cloudflare.D1.Database("db", {
      name: names.d1,
      migrationsDir: "packages/db/migrations",
      migrationsTable: "drizzle_migrations",
      readReplication: isProd ? { mode: "auto" } : { mode: "disabled" },
    });

    const files = yield* Cloudflare.R2.Bucket("files", {
      name: names.r2,
    });

    const cache = yield* Cloudflare.KV.Namespace("cache", {
      title: names.kv,
    });

    const jobs = yield* Cloudflare.Queues.Queue("jobs", {
      name: names.queue,
    });

    const api = yield* Cloudflare.Worker("api", {
      name: names.apiWorker,
      main: "apps/backend/src/worker.ts",
      compatibility: {
        flags: ["nodejs_compat"],
      },
      url: true,
      env: {
        DB: db,
        FILES: files,
        CACHE: cache,
        JOBS: jobs,
        ENVIRONMENT: stage,
      },
    });

    const web = yield* Cloudflare.Website.Vite("web", {
      name: names.webWorker,
      rootDir: "apps/web",
      compatibility: {
        flags: ["nodejs_compat"],
      },
      url: true,
      env: {
        API: api,
        ENVIRONMENT: stage,
      },
      assets: {
        htmlHandling: "auto-trailing-slash",
        notFoundHandling: "single-page-application",
      },
    });

    return {
      app: stack.name,
      stage,
      production: isProd,
      resources: names,
      urls: {
        api: api.url,
        web: web.url,
      },
    };
  }),
);
