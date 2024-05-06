"use client";

import * as React from "react";
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

export function Providers({ children }: { children: React.ReactNode }) {
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
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
