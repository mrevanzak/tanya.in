"use client";

import type { Document } from "@/server/api/routers/documents/documents.schema";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  SortDescriptor,
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
import { useTranslations } from "next-intl";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";

import { Button } from "@tanya.in/ui/button";
import { toast } from "@tanya.in/ui/toast";

const columns = [
  {
    key: "name" as const,
  },
  {
    key: "created" as const,
  },
  {
    key: "actions" as const,
  },
];
type ColumnKey = (typeof columns)[number]["key"];

export function DocumentsTable() {
  const t = useTranslations("Admin.documents");

  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = React.useState<Document>();

  const { data, isFetching } = api.documents.get.useQuery();
  const deleteDocument = api.documents.delete.useMutation();
  const utils = api.useUtils();

  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 9;
  const pages = useMemo(
    () => Math.ceil((data?.length ?? 1) / rowsPerPage),
    [data],
  );
  const [sort, setSort] = React.useState<SortDescriptor>({
    column: "created",
    direction: "descending",
  });

  const filteredData = useMemo(() => {
    if (sort) {
      const { column, direction } = sort;
      data?.sort((a, b) => {
        switch (column) {
          case "name":
            return direction === "ascending"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          case "created":
            return direction === "ascending"
              ? moment(a.created).diff(b.created)
              : moment(b.created).diff(a.created);
          default:
            return 0;
        }
      });
    }

    return data
      ?.filter(
        (file) =>
          file.name.toLowerCase().includes(search.toLowerCase()) ||
          file.filename.toLowerCase().includes(search.toLowerCase()),
      )
      .slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [data, search, page, sort]);

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
              <Tooltip content={t("download")} color="primary" className="p-2">
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
              <Tooltip content={t("delete")} color="danger" className="p-2">
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
    [onOpen, t],
  );

  return (
    <>
      <Table
        aria-label="Documents Table"
        classNames={{
          wrapper: "min-h-[31rem] relative p-0",
        }}
        sortDescriptor={sort}
        onSortChange={setSort}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
              className="pointer-events-auto"
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              hideHeader={column.key === "actions"}
              width={column.key === "actions" ? 80 : undefined}
              allowsSorting={column.key !== "actions"}
              className="pointer-events-auto"
            >
              {t(`columns.${column.key}`)}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredData}
          emptyContent={
            <p>
              {t("empty")} <br /> {t("hint")}
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
              <ModalHeader>{t("delete")}</ModalHeader>
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
