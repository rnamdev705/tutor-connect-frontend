"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCasesByIdInvitationsByTutorIdMutation,
  getCasesByIdQueryKey,
  postCasesByIdInvitationsMutation,
} from "@/api/@tanstack/react-query.gen";
import type { CaseDetail } from "@/api/types.gen";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  appendInvitationToCaseDetail,
  removeInvitationFromCaseDetail,
} from "@/lib/queries/case-detail-cache";
import { invalidateAllCasesList } from "@/lib/queries/invalidate";
import { toast } from "sonner";

export function useCaseInvitationMutations(caseId: string) {
  const queryClient = useQueryClient();

  const patchCaseDetail = (updater: (current: CaseDetail) => CaseDetail) => {
    queryClient.setQueryData(
      getCasesByIdQueryKey({ path: { id: caseId } }),
      (old: CaseDetail | undefined) => (old ? updater(old) : old),
    );
  };

  const inviteMutation = useMutation({
    ...postCasesByIdInvitationsMutation(),
    onSuccess: (invitation, variables) => {
      patchCaseDetail((current) =>
        appendInvitationToCaseDetail(
          current,
          { ...invitation, caseId },
          variables.body?.tutorProfileId,
        ),
      );
      void invalidateAllCasesList(queryClient);
      toast.success("Tutor invited successfully");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const revokeMutation = useMutation({
    ...deleteCasesByIdInvitationsByTutorIdMutation(),
    onSuccess: (_, variables) => {
      patchCaseDetail((current) =>
        removeInvitationFromCaseDetail(current, variables.path.tutorId),
      );
      void invalidateAllCasesList(queryClient);
      toast.success("Invitation removed");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { inviteMutation, revokeMutation };
}
