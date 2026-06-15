"use client";

import { useMemo } from "react";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import {
  isResponseLimitReached,
  normalizeTutorSubscription,
} from "@/lib/tutor-subscription";

export function useTutorSubscription() {
  const { tutor, isLoading, isError } = useCurrentTutor();

  const subscription = useMemo(
    () => normalizeTutorSubscription(tutor),
    [tutor],
  );

  return {
    tutor,
    subscription,
    isLoading,
    isError,
    isSubscribed: subscription.subscribed,
    isResponseLimitReached: isResponseLimitReached(subscription),
    responsesRemaining: subscription.responsesRemaining,
  };
}
