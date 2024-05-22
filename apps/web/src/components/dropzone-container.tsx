"use client";

import type { Document } from "@/server/api/routers/documents/documents.schema";
import { useRef } from "react";
import { DocumentsTable } from "@/components/documents-table";
import { api } from "@/trpc/react";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { FaUpload, FaXmark } from "react-icons/fa6";

import { Button } from "@tanya.in/ui/button";
import { Input } from "@tanya.in/ui/form";

export function DropzoneContainer({
  initialData,
}: {
  initialData: Document[];
}) {
  const openRef = useRef<() => void>(null);

  api.documents.get.useQuery(undefined, { initialData });
  // const uploadDocument = useUploadDocument();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          className="max-w-sm"
          placeholder="Search files"
          classNames={{ inputWrapper: "dark:bg-content2 bg-content1" }}
        />
        {/* //TODO: fix full reload when clicking this button */}
        <Button color="primary" onClick={() => openRef.current?.()}>
          Upload New Files
        </Button>
      </div>
      <div className="mx-auto w-full">
        <Dropzone
          onDrop={(file) => {
            if (file[0]) {
              // uploadDocument.mutate(file[0]);
            }
          }}
          accept={PDF_MIME_TYPE}
          openRef={openRef}
          //10MB
          maxSize={10 * 1024 ** 2}
          activateOnClick={false}
          className="group"
        >
          <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center group-data-[accept]:bg-success group-data-[reject]:bg-danger group-data-[accept]:bg-opacity-10 group-data-[reject]:bg-opacity-10">
            <Dropzone.Accept>
              <FaUpload className="text-success" size={54} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <FaXmark className="text-danger" size={54} />
            </Dropzone.Reject>
          </div>

          <DocumentsTable />
        </Dropzone>
      </div>
    </>
  );
}
