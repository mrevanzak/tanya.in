import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signIn } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { AuthError } from "next-auth";

import { authSchema } from "./auth.input";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(authSchema).mutation(async ({ input }) => {
    try {
      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirectTo: "/",
      });
    } catch (error) {
      if (error instanceof AuthError)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.cause?.err?.message ?? "Oops! Something went wrong!",
        });
    }
  }),
});
