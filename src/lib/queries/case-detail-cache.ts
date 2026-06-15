import type { CaseDetail } from "@/api/types.gen";

type CaseInvitationRecord = CaseDetail["invitations"][number];

export function appendInvitationToCaseDetail(
  current: CaseDetail,
  invitation: CaseInvitationRecord,
  tutorProfileId?: string,
): CaseDetail {
  if (
    current.invitations.some(
      (item) =>
        item.id === invitation.id ||
        (tutorProfileId && item.tutorProfileId === tutorProfileId),
    )
  ) {
    return current;
  }

  return {
    ...current,
    invitedCount: current.invitedCount + 1,
    invitedTutorIds:
      tutorProfileId && !current.invitedTutorIds.includes(tutorProfileId)
        ? [...current.invitedTutorIds, tutorProfileId]
        : current.invitedTutorIds,
    invitations: [{ ...invitation, caseId: current.id }, ...current.invitations],
  };
}

export function removeInvitationFromCaseDetail(
  current: CaseDetail,
  tutorUserId: string,
): CaseDetail {
  const removed = current.invitations.find((inv) => inv.tutorUserId === tutorUserId);

  return {
    ...current,
    invitedCount: Math.max(0, current.invitedCount - 1),
    invitedTutorIds: removed?.tutorProfileId
      ? current.invitedTutorIds.filter((id) => id !== removed.tutorProfileId)
      : current.invitedTutorIds,
    invitations: current.invitations.filter((inv) => inv.tutorUserId !== tutorUserId),
  };
}
