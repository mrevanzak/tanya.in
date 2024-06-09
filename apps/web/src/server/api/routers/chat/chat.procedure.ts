import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        unsolvable: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chats.findMany({
        where: (chat, { eq, and }) =>
          and(
            eq(chat.createdBy, ctx.session.user.id),
            eq(chat.unsolvable, input.unsolvable).if(input.unsolvable === true),
          ),
        with: {
          messages: true,
        },
      });
    }),
});
