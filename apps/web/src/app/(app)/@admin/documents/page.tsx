import { api } from "@/trpc/server";

import "@mantine/dropzone/styles.css";

import { Card, CardContent, CardHeader, CardTitle } from "@tanya.in/ui/card";

import { DropzoneContainer } from "./dropzone";

export default async function DocumentsPage() {
  const documents = await api.documents.get();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <DropzoneContainer initialData={documents} />
        </CardContent>
      </Card>
    </div>
  );
}
