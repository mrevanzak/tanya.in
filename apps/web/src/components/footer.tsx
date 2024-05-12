"use client";

import Image from "next/image";

import { useTheme } from "@tanya.in/ui/theme";

export function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="flex flex-wrap items-center justify-center border-t-2 px-4 py-4 sm:mx-16 sm:justify-between sm:py-0">
      <p className="text-xs text-default-400">
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
