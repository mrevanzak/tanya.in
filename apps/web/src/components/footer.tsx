"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { cn } from "@tanya.in/ui";
import { useTheme } from "@tanya.in/ui/theme";

import { useSidebarContext } from "./sidebar/sidebar-context";

export function Footer() {
  const { resolvedTheme } = useTheme();
  const { collapsed } = useSidebarContext();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "admin";

  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center border-t-2 py-2 sm:mx-16 sm:px-4 sm:py-0",
        isAdmin && !collapsed ? "lg:justify-between" : "sm:justify-between",
        {
          "sm:justify-between": collapsed,
        },
      )}
    >
      <p className="py-2 text-center text-xs text-default-500">
        Copyright © {new Date().getFullYear()} Institut Teknologi Sepuluh
        Nopember
      </p>
      <Image
        src={`https://portal.its.ac.id/images/advhum-${resolvedTheme === "dark" ? "white" : "blue"}.png`}
        alt="ITS"
        width={135}
        height={60}
      />
    </footer>
  );
}
