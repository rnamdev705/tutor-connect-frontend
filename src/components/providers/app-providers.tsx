"use client";

import "@/api/setup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { isDbUnavailableError } from "@/lib/api-error";

/** Retry Neon cold-start 503s with backoff; other failures retry once. */
function queryRetry(failureCount: number, error: unknown): boolean {
  if (isDbUnavailableError(error)) {
    return failureCount < 3;
  }
  return failureCount < 1;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: queryRetry,
            retryDelay: (attempt, error) =>
              isDbUnavailableError(error) ? 2_000 * (attempt + 1) : 1_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: queryRetry,
            retryDelay: (attempt, error) =>
              isDbUnavailableError(error) ? 2_000 * (attempt + 1) : 1_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
