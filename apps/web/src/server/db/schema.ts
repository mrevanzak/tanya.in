import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["user", "admin"]);
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
});
