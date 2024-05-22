import { env } from "process";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
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

  if (isMaintenance && !isAdmin) {
    const message =
      "Unfortunatly, we are under maintenance. We will be back soon!";
    if (env.NODE_ENV === "development") throw new Error(message);

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
