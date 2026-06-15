import type { Case, TutorProfileListResponse, TutorProfileSummary } from "@/api/types.gen";

export function mockTutorsListResponse(
  tutors: TutorProfileSummary[],
): TutorProfileListResponse {
  return {
    data: tutors,
    meta: {
      page: 1,
      limit: 100,
      total: tutors.length,
      totalPages: 1,
    },
  };
}

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
  {
    id: "case-3",
    title: "Primary Science Booster",
    subject: "Science",
    level: "Primary",
    location: "Birmingham",
    budgetPerHour: 28,
    status: "open",
    ownerId: "user-parent-2",
    ownerName: "David Lee",
    invitedCount: 0,
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
];

export const mockTutors: TutorProfileSummary[] = [
  {
    id: "tutor-1",
    tutorId: "user-tutor-1",
    displayName: "James Chen",
    qualifications: ["MSc Mathematics, Imperial College"],
    experiences: ["Head of Maths Department"],
    teachingBackground: "12 years classroom experience across GCSE and A-Level.",
    yearsOfExperience: 12,
    subjectsTaught: ["Mathematics", "Physics"],
  },
  {
    id: "tutor-2",
    tutorId: "user-tutor-2",
    displayName: "Alice Wong",
    qualifications: ["BA English, Oxford"],
    experiences: ["Private tutor", "Exam marker"],
    teachingBackground: "Specialises in essay writing and literature analysis.",
    yearsOfExperience: 8,
    subjectsTaught: ["English", "History"],
  },
  {
    id: "tutor-3",
    tutorId: "user-tutor-3",
    displayName: "Michael Okonkwo",
    qualifications: ["BSc Chemistry, UCL"],
    experiences: ["Lab demonstrator"],
    teachingBackground: "GCSE and A-Level science support with practical focus.",
    yearsOfExperience: 5,
    subjectsTaught: ["Chemistry", "Biology", "Science"],
  },
];
