import type { Document } from "@/server/api/routers/documents/documents.schema";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const documentsRouter = createTRPCRouter({
  get: adminProcedure.query(() => {
    const documents: Document[] = [
      {
        id: "1",
        name: "Document 1.pdf",
        createdAt: new Date(),
        uploadedBy: "3152ffe5-6496-4214-8fcd-b69fb4f70fd5",
      },

      {
        id: "2",
        name: "Document 2.pdf",
        createdAt: new Date(),
        uploadedBy: "3152ffe5-6496-4214-8fcd-b69fb4f70fd5",
      },
    ];

    return documents;
  }),
});
