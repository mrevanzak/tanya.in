"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/drawer";
import { HistoryList } from "@/components/history-list";
import { api } from "@/trpc/react";
import { Tab, Tabs, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { MdHistory } from "react-icons/md";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@tanya.in/ui/button";
import { Card, CardContent } from "@tanya.in/ui/card";

import NewChat from "~/new-chat.svg";

function Content() {
  const chatHistory = api.chat.get.useQuery({});
  const unsolvable = api.chat.get.useQuery({ unsolvable: true });

  const t = useTranslations("Home");

  return (
    <Tabs
      color="warning"
      variant="solid"
      fullWidth
      classNames={{ panel: "h-full overflow-y-scroll" }}
    >
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

export function SidebarUser() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const t = useTranslations("Home.history");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed right-0 top-1/4 z-10"
            isIconOnly
            onClick={() => setOpen(!open)}
            radius="full"
            variant="solid"
            color="warning"
          >
            <MdHistory className="size-7" />
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
              <NewChat className="size-5" />
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
      <Card className="flex h-full flex-col overflow-hidden whitespace-nowrap rounded-lg rounded-s-none rounded-t-none">
        <div className="w-full self-center px-4 pt-3">
          <Tooltip content={t("new")} placement="bottom-end">
            <Button
              variant="ghost"
              color="default"
              fullWidth
              className="relative min-w-10 justify-start overflow-clip px-0 transition-all group-data-[open=true]:min-w-20 group-data-[open=false]:-translate-x-[13px]"
              onClick={() => {
                setOpen(false);
                searchParams.has("id")
                  ? router.push("/")
                  : router.push(`/?id=${crypto.randomUUID()}&new`);
              }}
            >
              <NewChat className="size-5 translate-x-2 transition-transform" />
              <span className="absolute left-10">{t("new")}</span>
            </Button>
          </Tooltip>
        </div>

        <Tooltip content={t("show")} placement="bottom-end">
          <Button
            className="absolute -right-5 top-1/4 z-10"
            isIconOnly
            onClick={() => setOpen(!open)}
            radius="full"
            variant="solid"
            color="warning"
          >
            <MdHistory className="size-7 transition-transform duration-500 group-data-[open=true]:rotate-180" />
          </Button>
        </Tooltip>

        <CardContent className="h-full p-4 pt-2 opacity-100 transition-opacity group-data-[open=false]:pointer-events-none group-data-[open=false]:opacity-0">
          <Content />
        </CardContent>
      </Card>
    </div>
  );
}
