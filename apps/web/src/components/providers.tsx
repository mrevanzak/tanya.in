"use client";

import * as React from "react";
import { useLockedBody } from "@/lib/hooks/useBodyLock";
import { TRPCReactProvider } from "@/trpc/react";
import { MantineProvider } from "@mantine/core";
import { NextUIProvider } from "@nextui-org/system";

import { ThemeProvider } from "@tanya.in/ui/theme";

import { SidebarContext } from "./sidebar/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TRPCReactProvider>
          <MantineProvider>
            <SidebarContext.Provider
              value={{
                collapsed: sidebarOpen,
                setCollapsed: handleToggleSidebar,
              }}
            >
              {children}
            </SidebarContext.Provider>
          </MantineProvider>
        </TRPCReactProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
