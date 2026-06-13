/**
 * Read-only data access layer over mock fixtures.
 *
 * Server components and client hooks call these selectors instead of importing
 * `mock-data` directly, keeping query logic in one place.
 *
 * @module data
 */
import {
  mockCaseDocuments,
  mockCases,
  mockInvitations,
  mockTutors,
} from "./mock-data";
import type { Case, CaseInvitation, TutorProfile } from "./types";

export interface ParentCaseStats {
  total: number;
  open: number;
  matched: number;
  documents: number;
}

export interface TutorDashboardStats {
  invited: number;
  open: number;
  documents: number;
  availableCases: number;
}

export function getCaseById(id: string): Case | undefined {
  return mockCases.find((c) => c.id === id);
}

export function getTutorById(id: string): TutorProfile | undefined {
  return mockTutors.find((t) => t.id === id);
}

export function getTutorByUserId(userId: string): TutorProfile | undefined {
  return mockTutors.find((t) => t.userId === userId);
}

export function getCasesByOwnerId(ownerId: string): Case[] {
  return mockCases.filter((c) => c.ownerId === ownerId);
}

export function getParentCaseStats(ownerId: string): ParentCaseStats {
  const cases = getCasesByOwnerId(ownerId);

  return {
    total: cases.length,
    open: cases.filter((c) => c.status === "open").length,
    matched: cases.filter((c) => c.status === "matched").length,
    documents: mockCaseDocuments.filter((d) =>
      cases.some((c) => c.id === d.caseId),
    ).length,
  };
}

export function getInvitationsForTutor(tutorId: string): CaseInvitation[] {
  return mockInvitations.filter((i) => i.tutorId === tutorId);
}

export function getTutorDashboardStats(tutor: TutorProfile): TutorDashboardStats {
  const invitations = getInvitationsForTutor(tutor.id);

  return {
    invited: invitations.length,
    open: invitations.filter((i) => i.status === "pending").length,
    documents: tutor.documents.length,
    availableCases: mockCases.filter((c) => c.status === "open").length,
  };
}
