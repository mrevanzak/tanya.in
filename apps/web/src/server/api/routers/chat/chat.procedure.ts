import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.chats.findMany({
      where: (chat, { eq }) => eq(chat.createdBy, ctx.session.user.id),
      with: {
        messages: true,
      },
    });
  }),
});
