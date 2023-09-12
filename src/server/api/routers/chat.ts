import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { httpClient } from '@/utils/api';

export const chatRouter = createTRPCRouter({
  send: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const request = await httpClient.post<{ prompt: string; answer: string }>(
        '/prompt_route',
        {
          prompt: input.prompt,
        }
      );
      return request.data;
    }),
});
