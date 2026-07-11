import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import { PROJECT_SLUG, projectResourceName } from "../project";

export default Alchemy.Stack(
  PROJECT_SLUG,
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const stack = yield* Alchemy.Stack;
    const stage = stack.stage;
    const isProd = stage === "prod";

    const names = {
      d1: projectResourceName(stage, "db"),
      r2: projectResourceName(stage, "files"),
      kv: projectResourceName(stage, "cache"),
      queue: projectResourceName(stage, "jobs"),
      apiWorker: projectResourceName(stage, "api"),
      webWorker: projectResourceName(stage, "web"),
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
