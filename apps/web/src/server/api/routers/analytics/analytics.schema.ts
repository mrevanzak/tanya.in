import { z } from "zod";

export const analyticsSchema = z.object({
  key: z.string().date(),
  total: z.number().int(),
  devices: z.number().int(),
});
