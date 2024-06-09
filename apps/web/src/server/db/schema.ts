import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `tanyain_${name}`);

const roleEnum = pgEnum("role", ["user", "admin"]);
export const users = createTable("user", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const chats = createTable("chat", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  unsolvable: boolean("unsolvable").notNull().default(false),
});
export const chatRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

export const messages = createTable("message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id),
});
export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
