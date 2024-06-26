import { users } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const authSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
}).pick({
  email: true,
  password: true,
});
