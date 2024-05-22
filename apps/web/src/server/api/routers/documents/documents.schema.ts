import type { z } from "zod";
import { documents } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const documentSchema = createSelectSchema(documents);
export type Document = z.infer<typeof documentSchema>;
