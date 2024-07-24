"use client";

import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";

import type { Message } from "@tanya.in/ui";
import { cn } from "@tanya.in/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tanya.in/ui/card";
import { Chat } from "@tanya.in/ui/chat";

export function ChatCard(props: { className?: string }) {
  const t = useTranslations("Home");
  const searchParams = useSearchParams();
  const utils = api.useUtils();

  const { data } = api.chat.show.useQuery(
    { id: searchParams.get("id") ?? "" },
    { enabled: searchParams.has("id") && !searchParams.has("new") },
  );
  const initialMessages = data?.messages as Message[] | undefined;

  return (
    <Card
      className={cn(
        "m-2 mx-auto w-full duration-500 transition-size has-[[data-started=false]]:min-[450px]:w-[28rem]",
        props.className,
      )}
    >
      <CardHeader>
        <CardTitle className="text-center">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Chat
          onFinish={() => utils.chat.get.invalidate()}
          initialMessages={initialMessages}
          placeholder={t("chooseTopic")}
          value={searchParams.get("ask") ?? ""}
          id={searchParams.get("id") ?? undefined}
        />
      </CardContent>
      <CardFooter>
        <Card className="m-auto shadow-none">
          <CardContent className="text-balance py-4 text-center text-sm">
            {t("hint")}
          </CardContent>
        </Card>
      </CardFooter>
    </Card>
  );
}
