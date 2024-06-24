"use client";

import type { Document } from "@/server/api/routers/documents/documents.schema";
import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { Spinner } from "@nextui-org/react";
import { FaUpload, FaXmark } from "react-icons/fa6";
import { useDebounceCallback } from "usehooks-ts";

import { Button } from "@tanya.in/ui/button";
import { Input } from "@tanya.in/ui/form";
import { toast } from "@tanya.in/ui/toast";

import { DocumentsTable } from "./table";

export function DropzoneContainer({
  initialData,
}: {
  initialData: Document[];
}) {
  const openRef = useRef<() => void>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchHandler = useDebounceCallback((search: string) => {
    const params = new URLSearchParams(searchParams);
    search ? params.set("search", search) : params.delete("search");

    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  const [loading, setLoading] = useState(false);
  api.documents.get.useQuery(undefined, { initialData });
  const utils = api.useUtils();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          className="max-w-sm"
          placeholder="Search documents"
          onChange={(e) => searchHandler(e.target.value)}
          defaultValue={searchParams.get("search") ?? ""}
          isClearable
          onClear={() => searchHandler("")}
        />
        <Button color="primary" onClick={() => openRef.current?.()}>
          Upload New Document
        </Button>
      </div>
      <div className="mx-auto w-full">
        <Dropzone
          onDrop={(file) => {
            if (file[0]) {
              const formData = new FormData();
              formData.append("file", file[0]);
              formData.append("name", file[0].name.split(".")[0] ?? "file");

              setLoading(true);
              toast.promise(
                fetch("/api/documents/upload", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => {
                    if (res.ok) {
                      return res.json();
                    }
                    throw new Error("Failed to upload document");
                  })
                  .finally(() => {
                    void utils.documents.get.invalidate();
                    setLoading(false);
                  }),
                {
                  loading: "Uploading document...",
                  success: "Document uploaded",
                  error: "Failed to upload document",
                },
              );
            }
          }}
          onReject={(file) =>
            file.forEach((f) => toast.error(f.errors[0]?.message))
          }
          disabled={loading}
          accept={PDF_MIME_TYPE}
          openRef={openRef}
          multiple={false}
          //10MB
          maxSize={10 * 1024 ** 2}
          activateOnClick={false}
          className="group relative overflow-clip !rounded-xl !border-0 !bg-transparent"
        >
          <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center group-data-[accept]:bg-success group-data-[reject]:bg-danger group-data-[accept]:bg-opacity-10 group-data-[reject]:bg-opacity-10">
            {loading && (
              <Spinner className="absolute inset-0 bg-overlay/20 dark:bg-overlay/70" />
            )}
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
