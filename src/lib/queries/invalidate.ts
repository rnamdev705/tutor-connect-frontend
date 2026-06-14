import type { QueryClient } from "@tanstack/react-query";
import {
  getCasesByIdQueryKey,
  getCasesQueryKey,
  getInvitationsQueryKey,
  getTutorsQueryKey,
} from "@/api/@tanstack/react-query.gen";
import type { GetInvitationsResponse, InvitationWithCase } from "@/api/types.gen";
import { MAX_FETCH_LIMIT } from "@/lib/pagination";
import { allInvitationsListQueryOptions } from "@/lib/queries/list-queries";

const bulkCasesQueryKey = getCasesQueryKey({
  query: { page: 1, limit: MAX_FETCH_LIMIT, skipCount: true },
});

const bulkTutorsQueryKey = getTutorsQueryKey({
  query: { page: 1, limit: MAX_FETCH_LIMIT, skipCount: true },
});

const bulkInvitationsQueryKey = getInvitationsQueryKey({
  query: { page: 1, limit: MAX_FETCH_LIMIT, skipCount: true },
});

export function invalidateAllCasesList(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: bulkCasesQueryKey });
}

export function invalidateCaseDetail(queryClient: QueryClient, caseId: string) {
  return queryClient.invalidateQueries({
    queryKey: getCasesByIdQueryKey({ path: { id: caseId } }),
  });
}

export function invalidateCaseData(queryClient: QueryClient, caseId: string) {
  return Promise.all([
    invalidateAllCasesList(queryClient),
    invalidateCaseDetail(queryClient, caseId),
  ]);
}

export function invalidateAllTutorsList(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: bulkTutorsQueryKey });
}

export function invalidateAllInvitationsList(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: bulkInvitationsQueryKey });
}

export function setInvitationInListCache(
  queryClient: QueryClient,
  updated: InvitationWithCase,
) {
  queryClient.setQueryData(
    allInvitationsListQueryOptions.queryKey,
    (old: GetInvitationsResponse | undefined) => {
      if (!old) return old;

      return {
        ...old,
        data: old.data.map((item) => (item.id === updated.id ? updated : item)),
      };
    },
  );
}
