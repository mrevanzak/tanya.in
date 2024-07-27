import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { chats, messages } from "@/server/db/schema";
import { and, desc, eq, ilike, notExists, notLike, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

function getQuestion(input?: string) {
  const m = alias(messages, "m");
  return db
    .select()
    .from(m)
    .where(
      and(
        eq(m.role, "user"),
        ilike(m.content, `%${input}%`).if(input && input.length > 0),
        notLike(m.content, "%</%>%"),
        notExists(
          db
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
}

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

  getSuggestion: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getQuestion(input);
    }),

  getRecentQuestion: protectedProcedure.query(async () => {
    return await getQuestion();
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
