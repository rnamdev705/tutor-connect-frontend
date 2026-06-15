import type { TutorMeProfile } from "@/api/types.gen";
import { TUTOR_FREE_RESPONSE_LIMIT } from "@/lib/constants";

export type TutorSubscriptionState = {
  responsesUsed: number;
  responseLimit: number;
  subscribed: boolean;
  responsesRemaining: number | null;
};

type TutorSubscriptionInput = Partial<
  Pick<
    TutorMeProfile,
    "responsesUsed" | "responseLimit" | "subscribed" | "responsesRemaining" | "subscribedAt"
  >
> | undefined;

/** Fills safe defaults when API fields are missing (e.g. stale cache or old deploy). */
export function normalizeTutorSubscription(
  tutor: TutorSubscriptionInput,
): TutorSubscriptionState {
  const responseLimit =
    typeof tutor?.responseLimit === "number" && tutor.responseLimit > 0
      ? tutor.responseLimit
      : TUTOR_FREE_RESPONSE_LIMIT;
  const responsesUsed =
    typeof tutor?.responsesUsed === "number" && tutor.responsesUsed >= 0
      ? tutor.responsesUsed
      : 0;
  const subscribed =
    tutor?.subscribed === true || tutor?.subscribedAt != null;

  const responsesRemaining = subscribed
    ? null
    : typeof tutor?.responsesRemaining === "number"
      ? Math.max(0, tutor.responsesRemaining)
      : Math.max(0, responseLimit - responsesUsed);

  return {
    responsesUsed,
    responseLimit,
    subscribed,
    responsesRemaining,
  };
}

export function isTutorSubscribed(subscription: TutorSubscriptionState): boolean {
  return subscription.subscribed;
}

export function isResponseLimitReached(
  subscription: TutorSubscriptionState | undefined,
): boolean {
  if (!subscription || subscription.subscribed) {
    return false;
  }

  return subscription.responsesUsed >= subscription.responseLimit;
}

export function tutorResponseLimitMessage(
  subscription: TutorSubscriptionState,
): string {
  if (subscription.subscribed) {
    return "You have unlimited case responses.";
  }

  const { responsesUsed, responseLimit, responsesRemaining } = subscription;

  if (responsesRemaining === 0) {
    return `You've used all ${responseLimit} free responses. Subscribe to accept or decline more invitations.`;
  }

  return `${responsesRemaining} of ${responseLimit} free responses remaining (${responsesUsed} used).`;
}
