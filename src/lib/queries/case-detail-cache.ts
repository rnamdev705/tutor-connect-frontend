import type { CaseDetail } from "@/api/types.gen";

type CaseInvitationRecord = CaseDetail["invitations"][number];

export function upsertInvitationInCaseDetail(
  current: CaseDetail,
  invitation: CaseInvitationRecord,
  tutorProfileId?: string,
): CaseDetail {
  const profileId = tutorProfileId ?? invitation.tutorProfileId;
  const existingIndex = current.invitations.findIndex(
    (item) =>
      item.id === invitation.id ||
      (profileId != null && item.tutorProfileId === profileId) ||
      item.tutorUserId === invitation.tutorUserId,
  );

  if (existingIndex >= 0) {
    const invitations = [...current.invitations];
    invitations[existingIndex] = {
      ...invitations[existingIndex],
      ...invitation,
      caseId: current.id,
    };
    return { ...current, invitations };
  }

  return {
    ...current,
    invitedCount: current.invitedCount + 1,
    invitedTutorIds:
      profileId && !current.invitedTutorIds.includes(profileId)
        ? [...current.invitedTutorIds, profileId]
        : current.invitedTutorIds,
    invitations: [{ ...invitation, caseId: current.id }, ...current.invitations],
  };
}

/** @deprecated Prefer upsertInvitationInCaseDetail */
export function appendInvitationToCaseDetail(
  current: CaseDetail,
  invitation: CaseInvitationRecord,
  tutorProfileId?: string,
): CaseDetail {
  return upsertInvitationInCaseDetail(current, invitation, tutorProfileId);
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
