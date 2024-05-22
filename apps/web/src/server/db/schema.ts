import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["user", "admin"]);
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});
export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
}));

export const documents = pgTable("document", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => users.id),
});
export const documentsRelations = relations(documents, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));
