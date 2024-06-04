import { auth } from "@/server/auth";

import { cn } from "@tanya.in/ui";

import Logo from "~/logo.svg";
import { SidebarButton } from "./sidebar/sidebar-button";
import { UserButton } from "./user";

export async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user.role === "admin";

  return (
    <header className="sticky top-0 z-10 bg-content1 px-4 sm:px-8">
      <div className="flex h-16 items-center justify-between">
        <Logo
          className={cn("hidden h-7 sm:h-9 md:block", {
            invisible: isAdmin,
            block: !isAdmin,
          })}
        />
        <SidebarButton user={session?.user} />
        <UserButton user={session?.user} />
      </div>
    </header>
  );
}
