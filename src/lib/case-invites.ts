import type { AppStatus } from "@/components/common/status-badge";

/** Parents may invite tutors only while the case is still open. */
export function canInviteTutorsToCase(status: string): boolean {
  return status === "open";
}

export function inviteClosedMessage(status: string): string | null {
  if (status === "matched") {
    return "This case is matched — no new tutors can be invited.";
  }
  if (status === "closed") {
    return "This case is closed — no new tutors can be invited.";
  }
  return null;
}

/** Tutors may accept or decline only pending invitations on open cases. */
export function canRespondToInvitation(
  invitationStatus: string,
  caseStatus?: string,
): boolean {
  if (invitationStatus !== "pending") {
    return false;
  }

  return caseStatus === undefined || caseStatus === "open";
}

/** Shown when invitation is still pending but the case no longer accepts responses. */
export function invitationResponseBlockedReason(
  invitationStatus: string,
  caseStatus: string,
): string | null {
  if (invitationStatus !== "pending") {
    return null;
  }

  if (caseStatus === "matched") {
    return "This case has already been matched with another tutor.";
  }

  if (caseStatus === "closed") {
    return "This case is closed and no longer accepts responses.";
  }

  return null;
}

/** Parents may revoke invitations except accepted ones. */
export function canRevokeInvitation(status: string): boolean {
  return status !== "accepted";
}

/**
 * Pending, accepted, and superseded invites block a new invite in picker modals.
 * Only tutors who declined on an open case may be re-invited.
 */
export function blocksNewInviteForInvitationStatus(
  status: AppStatus | string | undefined,
): boolean {
  return status === "pending" || status === "accepted" || status === "superseded";
}

/** Parent may re-invite only when the case is still open and the tutor previously declined. */
export function canReinviteTutor(
  invitationStatus: AppStatus | string,
  caseStatus: string,
): boolean {
  return caseStatus === "open" && invitationStatus === "declined";
}

export function reinviteStatusHint(
  invitationStatus: AppStatus | string,
  caseStatus: string,
): string | null {
  if (canReinviteTutor(invitationStatus, caseStatus)) {
    return "Previously declined — you can invite again.";
  }
  return null;
}

/** Context copy for non-actionable invitation rows on parent case views. */
export function invitationHistoryHint(
  invitationStatus: AppStatus | string,
  caseStatus: string,
): string | null {
  const reinvite = reinviteStatusHint(invitationStatus, caseStatus);
  if (reinvite) {
    return reinvite;
  }

  if (invitationStatus === "superseded" && caseStatus === "matched") {
    return "Another tutor was matched for this case.";
  }

  if (invitationStatus === "superseded" && caseStatus === "closed") {
    return "Case closed before this tutor responded.";
  }

  return null;
}

export function isCaseClosed(status: string): boolean {
  return status === "closed";
}

export function isCaseMatched(status: string): boolean {
  return status === "matched";
}

/** Closed cases are final — fields and status cannot be changed. */
export function isCaseEditLocked(status: string): boolean {
  return status === "closed";
}

/** Only open cases may be deleted (matched and closed are kept for audit). */
export function canDeleteCase(status: string): boolean {
  return status === "open";
}

export function matchedCaseHint(): string {
  return "A tutor has accepted. Close the case when tuition is complete.";
}
