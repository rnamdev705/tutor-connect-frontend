"use client";

import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tutorResponseLimitMessage } from "@/lib/tutor-subscription";
import type { TutorMeProfile } from "@/api/types.gen";

interface TutorResponseLimitBannerProps {
  tutor: Pick<
    TutorMeProfile,
    "responsesUsed" | "responseLimit" | "subscribed" | "responsesRemaining"
  >;
  onSubscribe: () => void;
  className?: string;
}

export function TutorResponseLimitBanner({
  tutor,
  onSubscribe,
  className,
}: TutorResponseLimitBannerProps) {
  if (tutor.subscribed) {
    return null;
  }

  const atLimit = tutor.responsesUsed >= tutor.responseLimit;

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
        atLimit
          ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
          : "border-muted bg-muted/40"
      } ${className ?? ""}`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {atLimit ? "Free response limit reached" : "Free tutor plan"}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {tutorResponseLimitMessage(tutor)}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        className="shrink-0"
        variant={atLimit ? "default" : "outline"}
        onClick={onSubscribe}
      >
        <Crown className="mr-2 h-4 w-4" />
        Subscribe
      </Button>
    </div>
  );
}
