import type { Query } from "@tanstack/react-query";

type GeneratedQueryKey = { _id?: string };

export function isQueryKey(query: Query, id: string): boolean {
  const head = query.queryKey[0];
  return (
    typeof head === "object" &&
    head !== null &&
    "_id" in head &&
    (head as GeneratedQueryKey)._id === id
  );
}

export const queryKeyIds = {
  cases: "getCases",
  tutors: "getTutors",
  invitations: "getInvitations",
  caseDetail: "getCasesById",
} as const;
