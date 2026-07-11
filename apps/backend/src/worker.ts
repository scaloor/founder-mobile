import { Hono } from "hono";
import { Effect, pipe } from "effect";
import { createAuth } from "@founder-mobile/auth";
import { createD1Database, schema } from "@founder-mobile/db";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ENVIRONMENT?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.on(["GET", "POST"], "/api/auth/**", (c) => createAuth(c.env).handler(c.req.raw));

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "founder-mobile-backend",
    environment: c.env.ENVIRONMENT ?? "local",
  }),
);

app.get("/api/reports/context", async (c) => {
  const program = pipe(
    Effect.succeed({
      app: "founder-mobile",
      database: "Cloudflare D1 via Drizzle",
      tables: Object.keys(schema),
      note: "Replace this with product-specific report/read-model queries.",
    }),
  );

  const result = await Effect.runPromise(program);
  return c.json(result);
});

app.get("/api/businesses", async (c) => {
  const db = createD1Database(c.env.DB);
  const rows = await db.select().from(schema.businesses).limit(25);
  return c.json({ businesses: rows });
});

export default app;
