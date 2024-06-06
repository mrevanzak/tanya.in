"use client";

import type { Session } from "next-auth";
import Image from "next/image";

import { cn } from "@tanya.in/ui";
import { useTheme } from "@tanya.in/ui/theme";

export function Footer(props: { user?: Session["user"] }) {
  const { resolvedTheme } = useTheme();
  const isAdmin = props.user?.role === "admin";

  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center text-balance border-t-2 p-2 sm:mx-16 sm:justify-between sm:px-4 sm:py-0",
        {
          "md:justify-center lg:justify-between": isAdmin,
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
