import {
  pgTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  email: varchar("email", { length: 150 })
    .unique()
    .notNull(),

  password: varchar("password", { length: 255 }).notNull(),

  role: varchar("role", { length: 20 })
    .default("USER")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});