"use client";

import * as React from "react";
import { useLockedBody } from "@/lib/hooks/useBodyLock";
import { NextUIProvider } from "@nextui-org/system";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ZodError } from "zod";

import { ThemeProvider } from "@tanya.in/ui/theme";

import { SidebarContext } from "./sidebar/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
        queryCache: new QueryCache({
          onError: (err) => {
            if (err instanceof ZodError) {
              err.issues.map((issue) =>
                toast.error(`${issue.path.toString()}: ${issue.message}`),
              );
              return;
            }

            toast.error(err.message);
          },
        }),
        mutationCache: new MutationCache({
          onError: (err) => {
            toast.error(err.message);
          },
        }),
      }),
  );

  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <SidebarContext.Provider
            value={{
              collapsed: sidebarOpen,
              setCollapsed: handleToggleSidebar,
            }}
          >
            {children}
          </SidebarContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
