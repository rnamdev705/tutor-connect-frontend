"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTutorsMeProfileQueryKey,
  patchInvitationsByIdMutation,
} from "@/api/@tanstack/react-query.gen";
import type { GetInvitationsResponse } from "@/api/types.gen";
import { getApiErrorMessage, isResponseLimitError } from "@/lib/api-error";
import {
  invalidateCaseData,
  setInvitationInListCache,
} from "@/lib/queries/invalidate";
import { isQueryKey, queryKeyIds } from "@/lib/queries/query-keys";
import { usePendingInvitationResponses } from "@/lib/hooks/use-pending-invitation-responses";
import { toast } from "sonner";

interface UseTutorInvitationResponseOptions {
  onResponseLimitReached?: () => void;
}

export function useTutorInvitationResponse(
  options: UseTutorInvitationResponseOptions = {},
) {
  const queryClient = useQueryClient();
  const { trackResponse, isResponding, getResponseAction } =
    usePendingInvitationResponses();

  const responseMutation = useMutation({
    ...patchInvitationsByIdMutation(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) => isQueryKey(query, queryKeyIds.invitations),
      });
      const previous = queryClient.getQueriesData<GetInvitationsResponse>({
        predicate: (query) => isQueryKey(query, queryKeyIds.invitations),
      });
      return { previous };
    },
    onSuccess: (updated) => {
      setInvitationInListCache(queryClient, updated);
      void invalidateCaseData(queryClient, updated.caseId);
      void queryClient.invalidateQueries({ queryKey: getTutorsMeProfileQueryKey() });
      toast.success(
        updated.status === "accepted"
          ? "Case invitation accepted"
          : "Case invitation declined",
      );
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      if (isResponseLimitError(error)) {
        options.onResponseLimitReached?.();
      }
      toast.error(getApiErrorMessage(error));
    },
  });

  const accept = (invitationId: string) => {
    if (isResponding(invitationId)) return;
    trackResponse(invitationId, "accept", () =>
      responseMutation.mutateAsync({
        path: { id: invitationId },
        body: { status: "accepted" },
      }),
    );
  };

  const decline = (invitationId: string) => {
    if (isResponding(invitationId)) return;
    trackResponse(invitationId, "decline", () =>
      responseMutation.mutateAsync({
        path: { id: invitationId },
        body: { status: "declined" },
      }),
    );
  };

  return {
    accept,
    decline,
    isResponding,
    getResponseAction,
  };
}
