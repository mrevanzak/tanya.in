"use client";

import type { Session } from "next-auth";
import * as React from "react";
import { TRPCReactProvider } from "@/trpc/react";
import { MantineProvider } from "@mantine/core";
import { NextUIProvider } from "@nextui-org/system";

import { ThemeProvider } from "@tanya.in/ui/theme";

export function Providers(props: {
  children: React.ReactNode;
  user?: Session["user"];
}) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TRPCReactProvider>
          <MantineProvider>{props.children}</MantineProvider>
        </TRPCReactProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
