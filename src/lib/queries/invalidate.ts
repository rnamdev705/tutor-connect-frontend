import type { QueryClient } from "@tanstack/react-query";
import { getCasesByIdQueryKey } from "@/api/@tanstack/react-query.gen";
import type { GetInvitationsResponse, InvitationWithCase } from "@/api/types.gen";
import { isQueryKey, queryKeyIds } from "@/lib/queries/query-keys";

export function invalidateAllCasesList(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: (query) => isQueryKey(query, queryKeyIds.cases),
  });
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
  return queryClient.invalidateQueries({
    predicate: (query) => isQueryKey(query, queryKeyIds.tutors),
  });
}

export function invalidateAllInvitationsList(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: (query) => isQueryKey(query, queryKeyIds.invitations),
  });
}

export function setInvitationInListCache(
  queryClient: QueryClient,
  updated: InvitationWithCase,
) {
  queryClient.setQueriesData(
    { predicate: (query) => isQueryKey(query, queryKeyIds.invitations) },
    (old: GetInvitationsResponse | undefined) => {
      if (!old) return old;

      return {
        ...old,
        data: old.data.map((item) => (item.id === updated.id ? updated : item)),
      };
    },
  );
}
