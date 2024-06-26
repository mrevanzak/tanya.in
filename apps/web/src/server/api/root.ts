import { analyticsRouter } from "@/server/api/routers/analytics/analytics.procedure";
import { authRouter } from "@/server/api/routers/auth/auth.procedure";
import { chatRouter } from "@/server/api/routers/chat/chat.procedure";
import { documentsRouter } from "@/server/api/routers/documents/documents.procedure";

import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  analytics: analyticsRouter,
  documents: documentsRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
