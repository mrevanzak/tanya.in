import Link from "next/link";
import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@tanya.in/ui/card";

import { ChatCard } from "./card";

export default async function HomePage() {
  const t = await getTranslations("Home");
  const recent = await api.chat.getRecentQuestion();

  return (
    <div className="container relative flex-1 -translate-y-10 self-center has-[[data-started=true]]:translate-y-0 md:-translate-x-6">
      <ChatCard className="peer" />
      <Card className="absolute inset-x-0 -z-10 mx-auto w-[26rem] -translate-y-2 rounded-t-none bg-default-100 p-2 transition-transform delay-300 ease-in-out peer-has-[[data-started=true]]:-translate-y-28">
        <p className="p-1 text-xs font-bold text-foreground/40">
          {t("examples")}
        </p>

        <div className="flex flex-row gap-1">
          {recent.map((chat) => (
            <Link href={`/?ask=${chat.content}`} key={chat.id}>
              <Card className="bg-card shadow-none hover:bg-card/40">
                <CardContent className="line-clamp-2 rounded-md p-2 text-sm">
                  {chat.content}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
