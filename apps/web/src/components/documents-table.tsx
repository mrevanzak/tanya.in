"use client";

import type { Document } from "@/server/api/routers/documents/documents.schema";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import moment from "moment";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";

import { Button } from "@tanya.in/ui/button";
import { toast } from "@tanya.in/ui/toast";

const columns = [
  {
    key: "name" as const,
    label: "NAME",
  },
  {
    key: "created" as const,
    label: "CREATED AT",
  },
  {
    key: "actions" as const,
    label: "ACTIONS",
  },
];
type ColumnKey = (typeof columns)[number]["key"];

export function DocumentsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showModal = searchParams.get("delete") === "true";

  const [selectedDocument, setSelectedDocument] = React.useState<Document>();

  const { data, isLoading } = api.documents.get.useQuery();

  const renderCell = React.useCallback(
    (file: Document, columnKey: ColumnKey) => {
      switch (columnKey) {
        case "created":
          return (
            <Chip size="sm" variant="flat" color="warning">
              <span className="text-xs capitalize">
                {moment(file[columnKey]).fromNow()}
              </span>
            </Chip>
          );
        case "actions":
          return (
            <div className="flex items-center gap-4 ">
              <Tooltip
                content="Download document"
                color="primary"
                className="p-2"
              >
                <button
                  className="pointer-events-auto text-primary"
                  onClick={() => {
                    toast.promise(
                      fetch(`/api/documents/${file.id}`)
                        .then((res) => {
                          if (!res.ok) throw new Error("Failed to download");
                          return res.blob();
                        })
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", file.filename);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        }),
                      {
                        loading: "Downloading...",
                        success: "Downloaded!",
                        error: "Failed to download",
                      },
                    );
                  }}
                >
                  <MdOutlineDownloadForOffline size={20} />
                </button>
              </Tooltip>
              <Tooltip content="Delete document" color="danger" className="p-2">
                <Link
                  href="?delete=true"
                  onClick={() => setSelectedDocument(file)}
                  className="pointer-events-auto"
                >
                  <RiDeleteBin2Line size={20} color="#FF0080" />
                </Link>
              </Tooltip>
            </div>
          );
        default:
          return file[columnKey];
      }
    },
    [],
  );

  return (
    <>
      <Table
        aria-label="Documents Table"
        classNames={{
          wrapper: "min-h-[31rem] relative",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              hideHeader={column.key === "actions"}
              width={column.key === "actions" ? 80 : undefined}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data ?? []}
          emptyContent={
            !isLoading && (
              <p>
                No documents found <br /> Drag and drop a document to upload
              </p>
            )
          }
          // isLoading={isLoading || uploadDocument.isPending}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as ColumnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={showModal} onClose={() => router.back()}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Document</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete {selectedDocument?.name}?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onClick={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  // onPress={() => {
                  //   if (document)
                  //     mutate(document._id, {
                  //       onSuccess: () => {
                  //         onClose();
                  //       },
                  //     });
                  // }}
                  // isLoading={isPending}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
