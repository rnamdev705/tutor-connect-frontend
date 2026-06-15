import type { TutorMeProfile } from "@/api/types.gen";

type TutorSubscriptionFields = Pick<
  TutorMeProfile,
  "responsesUsed" | "responseLimit" | "subscribed" | "responsesRemaining"
>;

export function isTutorSubscribed(
  tutor: TutorSubscriptionFields | undefined,
): boolean {
  return tutor?.subscribed === true;
}

export function isResponseLimitReached(
  tutor: TutorSubscriptionFields | undefined,
): boolean {
  if (!tutor || isTutorSubscribed(tutor)) {
    return false;
  }

  return tutor.responsesUsed >= tutor.responseLimit;
}

export function tutorResponsesRemaining(
  tutor: TutorSubscriptionFields | undefined,
): number | null {
  if (!tutor || isTutorSubscribed(tutor)) {
    return null;
  }

  return tutor.responsesRemaining ?? Math.max(0, tutor.responseLimit - tutor.responsesUsed);
}

export function tutorResponseLimitMessage(
  tutor: TutorSubscriptionFields | undefined,
): string {
  if (!tutor) {
    return "Subscribe to respond to more case invitations.";
  }

  if (isTutorSubscribed(tutor)) {
    return "You have unlimited case responses.";
  }

  const remaining = tutorResponsesRemaining(tutor) ?? 0;
  if (remaining === 0) {
    return `You've used all ${tutor.responseLimit} free responses. Subscribe to continue.`;
  }

  return `${remaining} of ${tutor.responseLimit} free responses remaining.`;
}
