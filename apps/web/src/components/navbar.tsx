import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import { LanguageToggle } from "@/components/language-toggle";
import { SidebarButton } from "@/components/sidebar/sidebar-button";
import { UserButton } from "@/components/user";
import { auth } from "@/server/auth";
import { get } from "@vercel/edge-config";

import { cn } from "@tanya.in/ui";

import Logo from "~/logo.svg";
import { ThemeToggle } from "./theme-toggle";

export async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user.role === "admin";
  const isTesting = await get("testing");

  return (
    <header className="sticky top-0 z-10 bg-content1">
      {!isAdmin && isTesting && (
        <Alert className="rounded-none bg-warning text-warning-foreground">
          <AlertTitle>Testing mode: ON</AlertTitle>
          <AlertDescription>
            Sorry, currently the site is in testing mode. Chat responses may not
            be accurate.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/">
          <Logo
            className={cn("hidden h-7 sm:h-9 md:block", {
              invisible: isAdmin,
              block: !isAdmin,
            })}
          />
        </Link>
        <SidebarButton user={session?.user} />
        <div className="flex gap-3">
          <ThemeToggle />
          <LanguageToggle />
          <UserButton user={session?.user} />
        </div>
      </div>
    </header>
  );
}
