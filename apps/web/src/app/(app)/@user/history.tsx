"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/drawer";
import { api } from "@/trpc/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FaChevronRight } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { RiCheckFill, RiDeleteBin2Line, RiPencilLine } from "react-icons/ri";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent } from "@tanya.in/ui/card";
import { Input } from "@tanya.in/ui/form";
import { toast } from "@tanya.in/ui/toast";

function Content() {
  const chatHistory = api.chat.get.useQuery({});
  const unsolvable = api.chat.get.useQuery({ unsolvable: true });

  function List(props: { chat: NonNullable<typeof chatHistory.data>[0] }) {
    const t = useTranslations("Common");

    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [edit, setEdit] = useState(false);
    const utils = api.useUtils();

    const deleteChat = api.chat.delete.useMutation();
    const changeChatTitle = api.chat.changeTitle.useMutation();

    const title = props.chat.title ?? props.chat.messages.at(0)?.content;
    const titleRef = useRef<HTMLInputElement>(null);

    function preventDefault(e: React.MouseEvent) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }

    return (
      <>
        <Tooltip
          content={title}
          placement="top-start"
          delay={500}
          closeDelay={0}
        >
          <Link
            href={`?id=${props.chat.id}`}
            className="flex items-center justify-between gap-2 rounded-r-md border-s-3 border-primary-its p-2 hover:bg-primary-its/20"
          >
            {edit ? (
              <Input
                ref={titleRef}
                defaultValue={title}
                onClick={(e) => {
                  preventDefault(e);
                }}
              />
            ) : (
              <p className="overflow-hidden text-ellipsis">{title}</p>
            )}
            <div className="">
              {edit ? (
                <Button
                  variant="light"
                  color="success"
                  isIconOnly
                  size="sm"
                  isLoading={changeChatTitle.isPending}
                  onClick={(e) => {
                    preventDefault(e);
                    if (!titleRef.current?.value) {
                      return;
                    }
                    changeChatTitle.mutate(
                      {
                        id: props.chat.id,
                        title: titleRef.current.value,
                      },
                      {
                        onSuccess: () => {
                          void utils.chat.get.invalidate();
                          toast.success(
                            `"${titleRef.current?.value}" has been updated`,
                          );
                          setEdit(false);
                        },
                      },
                    );
                  }}
                >
                  <RiCheckFill />
                </Button>
              ) : (
                <>
                  <Button
                    variant="light"
                    color="secondary"
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
                    {t("confirmation")} "<b>{title}</b>"?
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
                          id: props.chat.id,
                        },
                        {
                          onSuccess: () => {
                            void utils.chat.invalidate();
                            toast.success(`"${title}" has been deleted`);
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

  const t = useTranslations("Home");

  return (
    <Tabs color="warning" variant="bordered" fullWidth>
      <Tab title={t("history.title")}>
        {chatHistory.data?.length ? (
          <ul className="h-full space-y-4">
            {chatHistory.data.map((chat) => (
              <List key={chat.id} chat={chat} />
            ))}
          </ul>
        ) : (
          <p className="text-center">{t("history.empty")}</p>
        )}
      </Tab>
      <Tab title={t("unsolvable.title")}>
        {unsolvable.data?.length ? (
          <ul className="h-full space-y-4">
            {unsolvable.data.map((chat) => (
              <List key={chat.id} chat={chat} />
            ))}
          </ul>
        ) : (
          <p className="text-center">{t("unsolvable.empty")}</p>
        )}
      </Tab>
    </Tabs>
  );
}

export function ChatHistory() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            className="absolute right-0 top-1/4"
            isIconOnly
            onClick={() => setOpen(!open)}
            radius="full"
            variant="solid"
            color="warning"
          >
            <IoMenu className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[40vh] max-h-dvh bg-content1">
          <div className="overflow-auto p-6">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className="group relative hidden h-5/6 w-80 self-center duration-500 transition-size data-[open=false]:w-0 sm:block"
      data-open={open}
      // onMouseLeave={() => setOpen(false)}
    >
      <Card className="h-full overflow-x-hidden whitespace-nowrap rounded-lg rounded-s-none">
        <Button
          className="absolute -right-7 top-1/4"
          isIconOnly
          onClick={() => setOpen(!open)}
          radius="full"
          variant="solid"
          color="warning"
          // onMouseEnter={() => setOpen(true)}
        >
          <FaChevronRight className="size-5 transition-transform duration-500 group-data-[open=true]:rotate-180" />
        </Button>
        <CardContent className="h-full pt-6">
          <Content />
        </CardContent>
      </Card>
    </div>
  );
}
