import alchemy from "alchemy";
import {
  D1Database,
  KVNamespace,
  Queue,
  R2Bucket,
  TanStackStart,
  Worker,
} from "alchemy/cloudflare";

const app = await alchemy("founder-mobile");
const stage = app.stage;
const isProd = stage === "prod";

const names = {
  d1: `founder-mobile-${stage}-db`,
  r2: `founder-mobile-${stage}-files`,
  kv: `founder-mobile-${stage}-cache`,
  queue: `founder-mobile-${stage}-jobs`,
  apiWorker: `founder-mobile-${stage}-api`,
  webWorker: `founder-mobile-${stage}-web`,
};

const db = await D1Database("db", {
  name: names.d1,
  migrationsDir: "packages/db/migrations",
  migrationsTable: "drizzle_migrations",
  readReplication: isProd ? { mode: "auto" } : { mode: "disabled" },
});

const files = await R2Bucket("files", {
  name: names.r2,
});

const cache = await KVNamespace("cache", {
  title: names.kv,
});

const jobs = await Queue("jobs", {
  name: names.queue,
});

const api = await Worker("api", {
  name: names.apiWorker,
  cwd: ".",
  entrypoint: "apps/backend/src/worker.ts",
  compatibility: "node",
  url: true,
  bindings: {
    DB: db,
    FILES: files,
    CACHE: cache,
    JOBS: jobs,
    ENVIRONMENT: stage,
  },
});

const web = await TanStackStart("web", {
  name: names.webWorker,
  cwd: "apps/web",
  build: {
    command: "bun run build",
    env: {
      VITE_API_URL: api.url ?? "",
    },
  },
  url: true,
  bindings: {
    API: api,
    ENVIRONMENT: stage,
  },
});

console.log({
  app: app.name,
  stage,
  production: isProd,
  resources: names,
  urls: {
    api: api.url,
    web: web.url,
  },
});

await app.finalize();
