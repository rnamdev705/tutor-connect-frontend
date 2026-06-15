import { keepPreviousData } from "@tanstack/react-query";
import {
  getCasesByIdOptions,
  getCasesOptions,
  getInvitationsOptions,
  getTutorsOptions,
} from "@/api/@tanstack/react-query.gen";
import type {
  GetCasesData,
  GetInvitationsData,
  GetTutorsData,
} from "@/api/types.gen";
import { DEFAULT_PAGE_SIZE, MAX_FETCH_LIMIT } from "@/lib/pagination";

const listDefaults = {
  placeholderData: keepPreviousData,
  staleTime: 60_000,
  refetchOnWindowFocus: false,
} as const;

export function casesListQueryOptions(query: NonNullable<GetCasesData["query"]>) {
  return {
    ...getCasesOptions({ query }),
    ...listDefaults,
  };
}

export function tutorsListQueryOptions(query: NonNullable<GetTutorsData["query"]>) {
  return {
    ...getTutorsOptions({ query }),
    ...listDefaults,
  };
}

export function invitationsListQueryOptions(
  query: NonNullable<GetInvitationsData["query"]>,
) {
  return {
    ...getInvitationsOptions({ query }),
    ...listDefaults,
  };
}

/** Invite modals — server search, capped page size. */
export function tutorsSearchQueryOptions(search: string, enabled: boolean) {
  return tutorsListQueryOptions({
    page: 1,
    limit: MAX_FETCH_LIMIT,
    skipCount: true,
    ...(search.trim() ? { search: search.trim() } : {}),
  });
}

export function openCasesForInviteQueryOptions(tutorProfileId: string) {
  return casesListQueryOptions({
    page: 1,
    limit: MAX_FETCH_LIMIT,
    skipCount: true,
    status: "open",
    tutorProfileId,
  });
}

export function caseDetailQueryOptions(caseId: string) {
  return {
    ...getCasesByIdOptions({ path: { id: caseId } }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  };
}

export function casesCountQueryOptions(status?: "open" | "matched" | "closed") {
  return casesListQueryOptions({
    page: 1,
    limit: 1,
    ...(status ? { status } : {}),
  });
}

export function invitationsCountQueryOptions(
  status?: "pending" | "accepted" | "declined" | "superseded",
) {
  return invitationsListQueryOptions({
    page: 1,
    limit: 1,
    ...(status ? { status } : {}),
  });
}

export { DEFAULT_PAGE_SIZE };
