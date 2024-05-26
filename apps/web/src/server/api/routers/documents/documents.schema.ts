import { z } from "zod";

export const documentSchema = z.object({
  id: z.number(),
  name: z.string(),
  filename: z.string(),
  created: z.coerce.date(),
  lastModified: z.coerce.date(),
});

export type Document = z.infer<typeof documentSchema>;
