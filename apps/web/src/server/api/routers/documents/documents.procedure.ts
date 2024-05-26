import { env } from "@/env";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";

import { documentSchema } from "./documents.schema";

export const documentsRouter = createTRPCRouter({
  get: adminProcedure.query(async () => {
    const res = await fetch(env.BACKEND_URL + "/files");

    const validate = z
      .object({
        status: z.string(),
        files: documentSchema.array(),
      })
      .parse(await res.json());

    return validate.files;
  }),
});
