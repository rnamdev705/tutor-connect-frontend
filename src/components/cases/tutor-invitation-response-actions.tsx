"use client";

import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  canRespondToInvitation,
  invitationResponseBlockedReason,
} from "@/lib/case-invites";
import { textOverflow } from "@/lib/text-overflow";
import { cn } from "@/lib/utils";

interface TutorInvitationResponseActionsProps {
  invitationId: string;
  invitationStatus: string;
  caseStatus: string;
  isResponding: (invitationId: string) => boolean;
  getResponseAction: (invitationId: string) => "accept" | "decline" | undefined;
  onAcceptRequest: (invitationId: string) => void;
  onDeclineRequest: (invitationId: string) => void;
  responseLimitReached?: boolean;
  onSubscribeRequest?: () => void;
  size?: "sm" | "default";
}

export function TutorInvitationResponseActions({
  invitationId,
  invitationStatus,
  caseStatus,
  isResponding,
  getResponseAction,
  onAcceptRequest,
  onDeclineRequest,
  responseLimitReached = false,
  onSubscribeRequest,
  size = "sm",
}: TutorInvitationResponseActionsProps) {
  const canRespond = canRespondToInvitation(invitationStatus, caseStatus);
  const blockedReason = invitationResponseBlockedReason(invitationStatus, caseStatus);
  const responding = isResponding(invitationId);
  const responseAction = getResponseAction(invitationId);
  const accepting = responding && responseAction === "accept";
  const declining = responding && responseAction === "decline";

  if (!canRespond && !blockedReason) {
    return null;
  }

  if (blockedReason) {
    return (
      <p className={cn(textOverflow.statusMessage, "max-w-xs text-right")}>{blockedReason}</p>
    );
  }

  if (responseLimitReached) {
    return (
      <div className="flex max-w-xs flex-col items-end gap-2">
        <p className={cn(textOverflow.statusMessage, "text-right")}>
          Free response limit reached. Subscribe to accept or decline.
        </p>
        {onSubscribeRequest && (
          <Button size={size} onClick={onSubscribeRequest}>
            Subscribe
          </Button>
        )}
      </div>
    );
  }

  if (responding) {
    return (
      <Button size={size} disabled>
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        {accepting ? "Accepting..." : "Declining..."}
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size={size}
        variant="outline"
        disabled={responding}
        onClick={() => onDeclineRequest(invitationId)}
      >
        <X className="mr-1.5 h-3.5 w-3.5" />
        Decline
      </Button>
      <Button
        size={size}
        disabled={responding}
        onClick={() => onAcceptRequest(invitationId)}
      >
        <Check className="mr-1.5 h-3.5 w-3.5" />
        Accept
      </Button>
    </div>
  );
}
