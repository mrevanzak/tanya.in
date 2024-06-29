import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chats } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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
        where: (chat, { eq, and, isNull }) =>
          and(
            isNull(chat.deletedAt),
            eq(chat.createdBy, ctx.session.user.id),
            eq(chat.unsolvable, input.unsolvable).if(input.unsolvable === true),
          ),
        with: {
          messages: {
            limit: 1,
          },
        },
        orderBy: (chat, { desc }) => [desc(chat.createdAt)],
      });
    }),

  show: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chats.findFirst({
        where: (chat, { eq }) => eq(chat.id, input.id),
        with: {
          messages: {
            columns: {
              chatId: false,
            },
          },
        },
      });
    }),

  changeTitle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(chats)
        .set({
          title: input.title,
        })
        .where(eq(chats.id, input.id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(chats)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(chats.id, input.id));
    }),
});
