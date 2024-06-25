"use client";

import type { Document } from "@/server/api/routers/documents/documents.schema";
import React from "react";
import { useSearchParams } from "next/navigation";
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
  useDisclosure,
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
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = React.useState<Document>();

  const { data, isFetching } = api.documents.get.useQuery();
  const deleteDocument = api.documents.delete.useMutation();
  const utils = api.useUtils();

  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

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
            <div className="flex items-center gap-2">
              <Tooltip
                content="Download document"
                color="primary"
                className="p-2"
              >
                <Button
                  className="pointer-events-auto"
                  isIconOnly
                  variant="light"
                  color="primary"
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
                  <MdOutlineDownloadForOffline />
                </Button>
              </Tooltip>
              <Tooltip content="Delete document" color="danger" className="p-2">
                <Button
                  className="pointer-events-auto"
                  isIconOnly
                  variant="light"
                  color="danger"
                  onClick={() => {
                    setSelectedDocument(file);
                    onOpen();
                  }}
                >
                  <RiDeleteBin2Line />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return file[columnKey];
      }
    },
    [onOpen],
  );

  return (
    <>
      <Table
        aria-label="Documents Table"
        classNames={{
          wrapper: "min-h-[31rem] relative p-0",
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
          items={data?.filter((item) =>
            search
              ? item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.filename.toLowerCase().includes(search.toLowerCase())
              : true,
          )}
          emptyContent={
            <p>
              No documents found <br /> Drag and drop a document to upload
            </p>
          }
          isLoading={isFetching}
          loadingContent={
            <Spinner className="absolute inset-0 bg-overlay/20 dark:bg-overlay/70" />
          }
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                  onPress={() => {
                    if (selectedDocument)
                      deleteDocument.mutate(
                        {
                          id: selectedDocument.id,
                          name: selectedDocument.name,
                        },
                        {
                          onSuccess: () => {
                            void utils.documents.get.invalidate();
                            onClose();
                          },
                        },
                      );
                  }}
                  isLoading={deleteDocument.isPending}
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
