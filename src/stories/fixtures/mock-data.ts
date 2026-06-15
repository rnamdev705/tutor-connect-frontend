import type { Case, TutorProfileSummary } from "@/api/types.gen";

export const mockCases: Case[] = [
  {
    id: "case-1",
    title: "GCSE Maths Support",
    subject: "Mathematics",
    level: "GCSE",
    location: "London",
    budgetPerHour: 35,
    status: "open",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedCount: 2,
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-01-15T14:30:00Z",
  },
  {
    id: "case-2",
    title: "A-Level English Literature",
    subject: "English",
    level: "A-Level",
    location: "Manchester",
    budgetPerHour: 45,
    status: "matched",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedCount: 3,
    createdAt: "2025-11-20T09:00:00Z",
    updatedAt: "2026-01-10T11:00:00Z",
  },
];

export const mockTutors: TutorProfileSummary[] = [
  {
    id: "tutor-1",
    tutorId: "user-tutor-1",
    displayName: "James Chen",
    qualifications: ["MSc Mathematics, Imperial College"],
    experiences: ["Head of Maths Department"],
    teachingBackground: "12 years classroom experience.",
    yearsOfExperience: 12,
    subjectsTaught: ["Mathematics", "Physics"],
  },
];
