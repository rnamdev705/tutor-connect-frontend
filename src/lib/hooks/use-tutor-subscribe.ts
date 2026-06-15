"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTutorsMeProfileQueryKey,
  postTutorsMeSubscribeMutation,
} from "@/api/@tanstack/react-query.gen";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

export function useTutorSubscribe() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...postTutorsMeSubscribeMutation(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getTutorsMeProfileQueryKey() });
      toast.success("Subscribed — unlimited case responses unlocked");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    subscribe: () => mutation.mutateAsync({}),
    isSubscribing: mutation.isPending,
  };
}
