import { DropzoneContainer } from "@/components/dropzone-container";
import { api } from "@/trpc/server";

import "@mantine/dropzone/styles.css";

export default async function DocumentsPage() {
  const documents = await api.documents.get();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h3 className="font-semibold">All Files</h3>
      <DropzoneContainer initialData={documents} />
    </div>
  );
}
