"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/drawer";
import { HistoryList } from "@/components/history-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { api } from "@/trpc/react";
import { Tab, Tabs, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FaChevronRight, FaPlus } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent, CardFooter } from "@tanya.in/ui/card";

function Content() {
  const chatHistory = api.chat.get.useQuery({});
  const unsolvable = api.chat.get.useQuery({ unsolvable: true });

  const t = useTranslations("Home");

  return (
    <Tabs color="warning" variant="solid" fullWidth>
      <Tab title={t("history.title")} className="px-0">
        {chatHistory.data?.length ? (
          <ul className="h-full space-y-4">
            {chatHistory.data.map((chat) => (
              <HistoryList
                key={chat.id}
                id={chat.id}
                title={chat.title ?? chat.messages.at(0)?.content ?? ""}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center">{t("history.empty")}</p>
        )}
      </Tab>
      <Tab title={t("unsolvable.title")} className="px-0">
        {unsolvable.data?.length ? (
          <ul className="h-full space-y-4">
            {unsolvable.data.map((chat) => (
              <HistoryList
                key={chat.id}
                id={chat.id}
                title={chat.title ?? chat.messages.at(0)?.content ?? ""}
              />
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
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const t = useTranslations("Home.history");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            className="absolute right-0 top-1/4 z-10"
            isIconOnly
            onClick={() => setOpen(!open)}
            radius="full"
            variant="solid"
            color="warning"
          >
            <IoMenu className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="min-h-[60vh] bg-content1">
          <div className="space-y-4 overflow-auto p-6">
            <Button
              variant="bordered"
              color="default"
              fullWidth
              onClick={() => {
                setOpen(false);
                router.push("/");
              }}
            >
              <FaPlus />
              {t("new")}
            </Button>

            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className="group relative hidden h-dvh w-80 self-center duration-500 transition-size data-[open=false]:w-12 sm:block"
      data-open={open}
    >
      <Card className="flex h-full flex-col overflow-x-hidden whitespace-nowrap rounded-lg rounded-s-none rounded-t-none">
        <div className="w-full self-center px-4 pt-3">
          <Button
            variant="ghost"
            color="default"
            fullWidth
            className="relative min-w-10 justify-start overflow-clip px-0 transition-all group-data-[open=true]:min-w-20 group-data-[open=false]:-translate-x-3.5"
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
          >
            <FaPlus className="translate-x-3/4 transition-all" />
            <span className="absolute left-9">{t("new")}</span>
          </Button>
        </div>

        <Tooltip content={t("show")} placement="bottom-end">
          <Button
            className="absolute -right-7 top-1/4 z-10"
            isIconOnly
            onClick={() => setOpen(!open)}
            radius="full"
            variant="solid"
            color="warning"
          >
            <FaChevronRight className="size-5 transition-transform duration-500 group-data-[open=true]:rotate-180" />
          </Button>
        </Tooltip>

        <CardContent className="h-full flex-1 overflow-y-scroll p-4 pt-2 opacity-100 transition-opacity group-data-[open=false]:pointer-events-none group-data-[open=false]:opacity-0">
          <Content />
        </CardContent>

        <CardFooter className="h-1/6 p-1 transition-transform group-data-[open=true]:translate-x-4">
          <ThemeToggle />
        </CardFooter>
      </Card>
    </div>
  );
}
