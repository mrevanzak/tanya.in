import { api } from "@/trpc/server";

import "@mantine/dropzone/styles.css";

import { DropzoneContainer } from "./dropzone";

export default async function DocumentsPage() {
  const documents = await api.documents.get();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h3 className="font-semibold">All Documents</h3>
      <DropzoneContainer initialData={documents} />
    </div>
  );
}
