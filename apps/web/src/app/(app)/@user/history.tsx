"use client";

import { useState } from "react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/drawer";
import { api } from "@/trpc/react";
import { Tab, Tabs, Tooltip } from "@nextui-org/react";
import { FaChevronRight } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent } from "@tanya.in/ui/card";

function Content() {
  const chatHistory = api.chat.get.useQuery({});
  const unsolvable = api.chat.get.useQuery({ unsolvable: true });

  function List(props: { data: NonNullable<typeof chatHistory.data> }) {
    return (
      <ul className="h-full space-y-4">
        {props.data.map((chat) => (
          <Tooltip
            key={chat.id}
            content={chat.messages.at(0)?.content}
            placement="top-start"
            delay={500}
            closeDelay={0}
          >
            <Link
              href={`?id=${chat.id}`}
              className="flex rounded-r-md border-s-3 border-primary-its p-2 hover:bg-primary-its/20"
            >
              <p className="overflow-hidden text-ellipsis">
                {chat.messages.at(0)?.content}
              </p>
            </Link>
          </Tooltip>
        ))}
      </ul>
    );
  }

  return (
    <Tabs color="warning" variant="bordered" fullWidth>
      <Tab title="History">
        {chatHistory.data?.length ? (
          <List data={chatHistory.data} />
        ) : (
          <p className="text-center">No chat history</p>
        )}
      </Tab>
      <Tab title="Unsolvable">
        {unsolvable.data?.length ? (
          <List data={unsolvable.data} />
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
