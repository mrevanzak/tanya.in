import React from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { RiCheckFill, RiDeleteBin2Line, RiPencilLine } from "react-icons/ri";

import { Button } from "@tanya.in/ui/button";
import { Input } from "@tanya.in/ui/form";
import { toast } from "@tanya.in/ui/toast";

export function HistoryList(props: { id: string; title: string }) {
  const t = useTranslations("Common");

  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [edit, setEdit] = React.useState(false);
  const utils = api.useUtils();

  const deleteChat = api.chat.delete.useMutation();
  const changeChatTitle = api.chat.changeTitle.useMutation();

  const titleRef = React.useRef<HTMLInputElement>(null);

  function preventDefault(e: React.MouseEvent) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  }

  function onUpdateTitle() {
    if (!titleRef.current?.value) {
      return;
    }
    changeChatTitle.mutate(
      {
        id: props.id,
        title: titleRef.current.value,
      },
      {
        onSuccess: (_, input) => {
          void utils.chat.get.invalidate();
          toast.success(
            t("changeTitleHistorySuccess", {
              name: input.title,
            }),
          );
          setEdit(false);
        },
      },
    );
  }

  return (
    <>
      <Tooltip
        content={props.title}
        placement="top-start"
        delay={500}
        closeDelay={0}
      >
        <Link
          href={`?id=${props.id}`}
          className="flex items-center justify-between gap-2 rounded-r-md border-s-3 border-primary-its p-2 hover:bg-primary-its/20"
        >
          {edit ? (
            <Input
              ref={titleRef}
              defaultValue={props.title}
              onClick={(e) => {
                preventDefault(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdateTitle();
                }
              }}
            />
          ) : (
            <p className="overflow-hidden text-ellipsis">{props.title}</p>
          )}
          <div className="min-w-fit">
            {edit ? (
              <Button
                variant="light"
                color="success"
                isIconOnly
                size="sm"
                isLoading={changeChatTitle.isPending}
                onClick={(e) => {
                  preventDefault(e);
                  onUpdateTitle();
                }}
              >
                <RiCheckFill />
              </Button>
            ) : (
              <>
                <Button
                  variant="light"
                  color="default"
                  isIconOnly
                  size="sm"
                  onClick={(e) => {
                    preventDefault(e);
                    setEdit(!edit);
                  }}
                >
                  <RiPencilLine />
                </Button>
                <Button
                  variant="light"
                  isIconOnly
                  color="danger"
                  size="sm"
                  onClick={(e) => {
                    preventDefault(e);
                    onOpen();
                  }}
                >
                  <RiDeleteBin2Line />
                </Button>
              </>
            )}
          </div>
        </Link>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t("delete")}</ModalHeader>
              <ModalBody>
                <p>
                  {t("confirmation")} "<b>{props.title}</b>"?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onClick={onClose}>
                  {t("close")}
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    deleteChat.mutate(
                      {
                        id: props.id,
                      },
                      {
                        onSuccess: () => {
                          void utils.chat.invalidate();
                          toast.success(t("deleteHistorySuccess"));
                          onClose();
                        },
                      },
                    );
                  }}
                  isLoading={deleteChat.isPending}
                >
                  {t("delete")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
