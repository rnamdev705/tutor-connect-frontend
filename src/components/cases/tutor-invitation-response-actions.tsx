"use client";

import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  canRespondToInvitation,
  invitationResponseBlockedReason,
} from "@/lib/case-invites";

interface TutorInvitationResponseActionsProps {
  invitationId: string;
  invitationStatus: string;
  caseStatus: string;
  isResponding: (invitationId: string) => boolean;
  getResponseAction: (invitationId: string) => "accept" | "decline" | undefined;
  onAcceptRequest: (invitationId: string) => void;
  onDeclineRequest: (invitationId: string) => void;
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
      <p className="max-w-xs text-right text-xs text-muted-foreground">{blockedReason}</p>
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
