import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const businesses = sqliteTable("businesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  businessId: text("business_id").notNull().references(() => businesses.id),
  kind: text("kind").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  summaryJson: text("summary_json", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
