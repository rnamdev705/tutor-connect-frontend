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
 * Pending and accepted invites block a new invite in picker modals.
 * Declined and superseded tutors may be re-invited on open cases.
 */
export function blocksNewInviteForInvitationStatus(
  status: AppStatus | string | undefined,
): boolean {
  return status === "pending" || status === "accepted";
}

/** Parent may send a fresh invite when the tutor previously declined or was superseded. */
export function canReinviteTutor(status: AppStatus | string): boolean {
  return status === "declined" || status === "superseded";
}

export function reinviteStatusHint(status: AppStatus | string): string | null {
  if (status === "declined") {
    return "Previously declined — you can invite again.";
  }
  if (status === "superseded") {
    return "Previously superseded — you can invite again.";
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
