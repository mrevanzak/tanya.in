"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/drawer";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { api } from "@/trpc/react";
import { FaChevronRight } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@tanya.in/ui/card";

export function ChatHistory() {
  const { data } = api.chat.get.useQuery();

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
          <CardHeader className="relative overflow-hidden">
            <CardTitle>Chat History</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {data?.length ? (
              <ul className="h-full space-y-6">
                {data.map((chat) => (
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
        <DrawerHeader className="text-left">
          <DrawerTitle>Chat History</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {data?.length ? (
            <ul className="h-full space-y-6">
              {data.map((chat) => (
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
