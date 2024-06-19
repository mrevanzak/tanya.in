"use client";

import { useState } from "react";
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
import { FaChevronRight } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent } from "@tanya.in/ui/card";

function Content() {
  const chatHistory = api.chat.get.useQuery({});
  const unsolvable = api.chat.get.useQuery({ unsolvable: true });

  function List(props: { chat: NonNullable<typeof chatHistory.data>[0] }) {
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const utils = api.useUtils();

    const deleteChat = api.chat.delete.useMutation();

    const title = props.chat.title ?? props.chat.messages.at(0)?.content;

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
            className="flex items-center justify-between rounded-r-md border-s-3 border-primary-its p-2 hover:bg-primary-its/20"
          >
            <p className="overflow-hidden text-ellipsis">{title}</p>
            <Button
              variant="light"
              isIconOnly
              color="danger"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
                onOpen();
              }}
            >
              <RiDeleteBin2Line />
            </Button>
          </Link>
        </Tooltip>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Delete</ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete "<b>{title}</b>"?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onClick={onClose}>
                    Close
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
                            onClose();
                          },
                        },
                      );
                    }}
                    isLoading={deleteChat.isPending}
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

  return (
    <Tabs color="warning" variant="bordered" fullWidth>
      <Tab title="History">
        {chatHistory.data?.length ? (
          <ul className="h-full space-y-4">
            {chatHistory.data.map((chat) => (
              <List key={chat.id} chat={chat} />
            ))}
          </ul>
        ) : (
          <p className="text-center">No chat history</p>
        )}
      </Tab>
      <Tab title="Unsolvable">
        {unsolvable.data?.length ? (
          <ul className="h-full space-y-4">
            {unsolvable.data.map((chat) => (
              <List key={chat.id} chat={chat} />
            ))}
          </ul>
        ) : (
          <p className="text-center">No unsolvable question</p>
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
