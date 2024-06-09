"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/drawer";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { api } from "@/trpc/react";
import { Tab, Tabs } from "@nextui-org/react";
import { FaChevronRight } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent } from "@tanya.in/ui/card";

function Content() {
  const chatHistory = api.chat.get.useQuery({});
  const unsolvable = api.chat.get.useQuery({ unsolvable: true });

  return (
    <Tabs color="warning" variant="bordered" fullWidth>
      <Tab title="History">
        {chatHistory.data?.length ? (
          <ul className="h-full space-y-6">
            {chatHistory.data.map((chat) => (
              <li
                key={chat.id}
                className="rounded-r-md border-s-3 border-primary-its p-2 hover:bg-primary-its/20"
              >
                <p className="overflow-hidden text-ellipsis">
                  {chat.messages.at(0)?.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No chat history</p>
        )}
      </Tab>
      <Tab title="Unsolvable">
        {unsolvable.data?.length ? (
          <ul className="h-full space-y-6">
            {unsolvable.data.map((chat) => (
              <li
                key={chat.id}
                className="rounded-r-md border-s-3 border-primary-its p-2 hover:bg-primary-its/20"
              >
                <p className="overflow-hidden text-ellipsis">
                  {chat.messages.at(0)?.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No unsolvable chat</p>
        )}
      </Tab>
    </Tabs>
  );
}

export function ChatHistory() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
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
            <FaChevronRight className="size-6 transition-transform duration-500 group-data-[open=true]:rotate-180" />
          </Button>
          <CardContent className="h-full pt-6">
            <Content />
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <IoMenu className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[40vh] max-h-dvh">
        <div className="p-6">
          <Content />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
