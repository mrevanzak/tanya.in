import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { httpClient } from '@/utils/api';

export const documentRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    const request = await httpClient.get<{ files: string[] }>(
      '/list_documents'
    );
    return request.data;
  }),
  delete: publicProcedure
    .input(z.object({ filename: z.string() }))
    .mutation(async ({ input }) => {
      await httpClient.post('/delete_document', {
        filename: input.filename,
      });
    }),
});
