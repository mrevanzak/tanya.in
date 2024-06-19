"use client";

import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";

import type { Message } from "@tanya.in/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tanya.in/ui/card";
import { Chat } from "@tanya.in/ui/chat";

export function ChatCard() {
  const searchParams = useSearchParams();
  const utils = api.useUtils();

  const { data } = api.chat.show.useQuery(
    { id: searchParams.get("id") ?? "" },
    { enabled: searchParams.has("id") },
  );
  const initialMessages = data?.messages as Message[] | undefined;

  return (
    <Card className="m-2 mx-auto w-full duration-500 transition-size has-[[data-started=false]]:min-[450px]:w-96">
      <CardHeader>
        <CardTitle className="text-center">Tanya.in saja!</CardTitle>
      </CardHeader>
      <CardContent>
        <Chat
          onFinish={() => utils.chat.get.invalidate()}
          initialMessages={initialMessages}
        />
      </CardContent>
      <CardFooter>
        <Card className="m-auto shadow-none">
          <CardContent className="py-4 text-center">
            /: To choose the topic
          </CardContent>
        </Card>
      </CardFooter>
    </Card>
  );
}
