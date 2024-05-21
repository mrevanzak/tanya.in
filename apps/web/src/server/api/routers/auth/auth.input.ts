import { users } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const authSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});
