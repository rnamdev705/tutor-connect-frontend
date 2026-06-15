"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Decorator } from "@storybook/nextjs-vite";
import { useState } from "react";
import { tutorsSearchQueryOptions } from "@/lib/queries/list-queries";
import { mockTutors, mockTutorsListResponse } from "@/stories/fixtures/mock-data";
import { createStoryQueryClient } from "./story-providers";

/** Seeds the tutors list query so invite-modal stories work offline. */
export const withMockTutorsQuery: Decorator = (Story) => {
  const [queryClient] = useState(() => {
    const client = createStoryQueryClient();
    client.setQueryData(
      tutorsSearchQueryOptions("", true).queryKey,
      mockTutorsListResponse(mockTutors),
    );
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    </QueryClientProvider>
  );
};
