import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chats, messages } from "@/server/db/schema";
import { and, desc, eq, ilike, notExists, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
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
            orderBy: (message, { asc }) => [asc(message.createdAt)],
            limit: 1,
          },
        },
        orderBy: (chat, { desc }) => [desc(chat.createdAt)],
      });
    }),

  getRecentQuestion: protectedProcedure.query(async ({ ctx }) => {
    const m = alias(messages, "m");
    return await ctx.db
      .select()
      .from(m)
      .where(
        and(
          eq(m.role, "user"),
          notExists(
            ctx.db
              .select()
              .from(messages)
              .where(
                and(
                  eq(messages.chatId, m.chatId),
                  eq(messages.role, "assistant"),
                  or(
                    ilike(messages.content, "%saya tidak tahu%"),
                    ilike(messages.content, "%hi %"),
                    ilike(messages.content, "%halo%"),
                  ),
                ),
              )
              .orderBy(desc(messages.createdAt)),
          ),
        ),
      )
      .orderBy(desc(m.createdAt))
      .limit(3);
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
            orderBy: (message, { asc }) => [asc(message.createdAt)],
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
