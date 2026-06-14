import { keepPreviousData } from "@tanstack/react-query";
import {
  getCasesByIdOptions,
  getCasesOptions,
  getInvitationsOptions,
  getTutorsOptions,
} from "@/api/@tanstack/react-query.gen";
import { MAX_FETCH_LIMIT } from "@/lib/pagination";

const bulkListQuery = {
  page: 1,
  limit: MAX_FETCH_LIMIT,
  skipCount: true as const,
};

export const allCasesListQueryOptions = {
  ...getCasesOptions({ query: bulkListQuery }),
  placeholderData: keepPreviousData,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
};

export const openCasesListQueryOptions = {
  ...getCasesOptions({
    query: { ...bulkListQuery, status: "open" as const },
  }),
  placeholderData: keepPreviousData,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
};

export const allTutorsListQueryOptions = {
  ...getTutorsOptions({ query: bulkListQuery }),
  placeholderData: keepPreviousData,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
};

export const allInvitationsListQueryOptions = {
  ...getInvitationsOptions({ query: bulkListQuery }),
  placeholderData: keepPreviousData,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
};

export function caseDetailQueryOptions(caseId: string) {
  return {
    ...getCasesByIdOptions({ path: { id: caseId } }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  };
}
