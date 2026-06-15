"use client";

import "@/api/setup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Decorator } from "@storybook/nextjs-vite";
import { useState } from "react";

/** Query client tuned for Storybook — no retries, stable cache. */
export function createStoryQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
      mutations: { retry: false },
    },
  });
}

/** TanStack Query + tooltip — matches app shell minus auth/toasts. */
export const withStoryProviders: Decorator = (Story) => {
  const [queryClient] = useState(() => createStoryQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    </QueryClientProvider>
  );
};
