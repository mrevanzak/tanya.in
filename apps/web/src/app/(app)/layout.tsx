import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { get } from "@vercel/edge-config";

import { cn } from "@tanya.in/ui";

import ErrorPage from "../error";

export default async function AuthLayout(props: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user.role === "admin";

  const isMaintenance = await get("maintenance");

  if (isMaintenance && !isAdmin && env.NODE_ENV !== "development") {
    const message =
      "Unfortunately, the site is currently under maintenance. We'll be back soon!";

    return (
      <ErrorPage
        error={{
          message,
        }}
      />
    );
  }

  return (
    <div className="flex flex-row">
      {session?.user.role === "admin" && <SidebarWrapper />}
      <div className="flex-1">
        <Navbar />
        <main
          className={cn("container flex min-h-[calc(100vh-8rem)]", {
            "p-4 2xl:pt-8": isAdmin,
          })}
        >
          {isAdmin ? props.admin : props.user}
        </main>
        <Footer />
      </div>
    </div>
  );
}
