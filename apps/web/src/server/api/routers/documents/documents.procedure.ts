import { env } from "@/env";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { documentSchema } from "./documents.schema";

export const documentsRouter = createTRPCRouter({
  get: adminProcedure.query(async ({ ctx }) => {
    const res = await fetch(env.BACKEND_URL + "/files");

    if (!res.ok) {
      console.error("Failed to fetch documents", await res.json());
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: ctx.t("documents.error"),
      });
    }

    const validate = z
      .object({
        status: z.string(),
        files: documentSchema.array(),
      })
      .parse(await res.json());

    return validate.files;
  }),

  delete: adminProcedure
    .input(documentSchema.pick({ id: true, name: true }))
    .mutation(async ({ input, ctx }) => {
      const res = await fetch(env.BACKEND_URL + "/files/knowledge", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        console.error("Failed to delete document", await res.json());
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ctx.t("documents.deleteError"),
        });
      }

      return true;
    }),
});
