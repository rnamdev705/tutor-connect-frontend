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

/** Tutors may accept or decline only pending invitations. */
export function canRespondToInvitation(status: string): boolean {
  return status === "pending";
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
