import type {
  ActivityEvent,
  Case,
  CaseInvitation,
  Document,
  TutorProfile,
  User,
} from "./types";

export const mockUsers: User[] = [
  {
    id: "user-parent-1",
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    role: "parent",
  },
  {
    id: "user-tutor-1",
    name: "James Chen",
    email: "james@example.com",
    role: "tutor",
  },
];

export const mockTutors: TutorProfile[] = [
  {
    id: "tutor-1",
    userId: "user-tutor-1",
    displayName: "James Chen",
    qualifications: ["MSc Mathematics, Imperial College", "PGCE Secondary Education"],
    teachingBackground:
      "Former head of mathematics department with 12 years of classroom experience. Specialises in exam preparation and confidence building.",
    yearsOfExperience: 12,
    subjectsTaught: ["Mathematics", "Physics", "Further Mathematics"],
    documents: [
      {
        id: "doc-t1",
        fileName: "Teaching_Certificate.pdf",
        fileType: "application/pdf",
        size: 245000,
        uploadedBy: "James Chen",
        uploadedAt: "2025-11-10T09:00:00Z",
        tutorId: "tutor-1",
      },
      {
        id: "doc-t2",
        fileName: "DBS_Check.pdf",
        fileType: "application/pdf",
        size: 180000,
        uploadedBy: "James Chen",
        uploadedAt: "2025-11-12T14:30:00Z",
        tutorId: "tutor-1",
      },
    ],
  },
  {
    id: "tutor-2",
    userId: "user-tutor-2",
    displayName: "Emily Watson",
    qualifications: ["BA English Literature, Oxford", "TEFL Certified"],
    teachingBackground:
      "Experienced English tutor supporting GCSE and A-Level students. Focus on essay writing, literary analysis, and exam technique.",
    yearsOfExperience: 8,
    subjectsTaught: ["English", "History", "Geography"],
    documents: [
      {
        id: "doc-t3",
        fileName: "Qualifications.pdf",
        fileType: "application/pdf",
        size: 320000,
        uploadedBy: "Emily Watson",
        uploadedAt: "2025-10-05T11:00:00Z",
        tutorId: "tutor-2",
      },
    ],
  },
  {
    id: "tutor-3",
    userId: "user-tutor-3",
    displayName: "David Okonkwo",
    qualifications: ["PhD Chemistry, UCL", "Qualified Teacher Status"],
    teachingBackground:
      "Research scientist turned educator. Passionate about making science accessible through practical examples and clear explanations.",
    yearsOfExperience: 15,
    subjectsTaught: ["Chemistry", "Biology", "Science"],
    documents: [
      {
        id: "doc-t4",
        fileName: "PhD_Certificate.pdf",
        fileType: "application/pdf",
        size: 410000,
        uploadedBy: "David Okonkwo",
        uploadedAt: "2025-09-20T08:00:00Z",
        tutorId: "tutor-3",
      },
      {
        id: "doc-t5",
        fileName: "References.docx",
        fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 95000,
        uploadedBy: "David Okonkwo",
        uploadedAt: "2025-09-22T16:00:00Z",
        tutorId: "tutor-3",
      },
      {
        id: "doc-t6",
        fileName: "Safeguarding_Cert.pdf",
        fileType: "application/pdf",
        size: 120000,
        uploadedBy: "David Okonkwo",
        uploadedAt: "2025-10-01T10:00:00Z",
        tutorId: "tutor-3",
      },
    ],
  },
  {
    id: "tutor-4",
    userId: "user-tutor-4",
    displayName: "Priya Sharma",
    qualifications: ["BSc Computer Science, Cambridge", "Industry Certifications"],
    teachingBackground:
      "Software engineer with tutoring experience in programming fundamentals, algorithms, and university-level computer science.",
    yearsOfExperience: 6,
    subjectsTaught: ["Computer Science", "Mathematics", "Economics"],
    documents: [
      {
        id: "doc-t7",
        fileName: "Degree_Certificate.pdf",
        fileType: "application/pdf",
        size: 280000,
        uploadedBy: "Priya Sharma",
        uploadedAt: "2025-12-01T12:00:00Z",
        tutorId: "tutor-4",
      },
    ],
  },
];

export const mockCases: Case[] = [
  {
    id: "case-1",
    title: "GCSE Maths Exam Preparation",
    subject: "Mathematics",
    level: "GCSE",
    location: "London, SW1",
    budgetPerHour: 45,
    status: "open",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedTutorIds: ["tutor-1"],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-20T14:30:00Z",
  },
  {
    id: "case-2",
    title: "A-Level English Literature Support",
    subject: "English",
    level: "A-Level",
    location: "Manchester, M1",
    budgetPerHour: 55,
    status: "matched",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedTutorIds: ["tutor-2"],
    createdAt: "2025-12-01T09:00:00Z",
    updatedAt: "2026-01-28T11:00:00Z",
  },
  {
    id: "case-3",
    title: "Primary Science Enrichment",
    subject: "Science",
    level: "Primary",
    location: "Birmingham, B1",
    budgetPerHour: 35,
    status: "open",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedTutorIds: [],
    createdAt: "2026-02-10T16:00:00Z",
    updatedAt: "2026-02-10T16:00:00Z",
  },
  {
    id: "case-4",
    title: "University Chemistry Revision",
    subject: "Chemistry",
    level: "University",
    location: "Online",
    budgetPerHour: 60,
    status: "closed",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedTutorIds: ["tutor-3"],
    createdAt: "2025-09-01T08:00:00Z",
    updatedAt: "2025-11-30T17:00:00Z",
  },
];

export const mockInvitations: CaseInvitation[] = [
  {
    id: "inv-1",
    caseId: "case-1",
    tutorId: "tutor-1",
    invitedAt: "2026-02-01T10:00:00Z",
    status: "pending",
  },
  {
    id: "inv-2",
    caseId: "case-2",
    tutorId: "tutor-2",
    invitedAt: "2025-12-05T14:00:00Z",
    status: "accepted",
  },
  {
    id: "inv-3",
    caseId: "case-4",
    tutorId: "tutor-3",
    invitedAt: "2025-09-10T09:00:00Z",
    status: "accepted",
  },
];

export const mockCaseDocuments: Document[] = [
  {
    id: "doc-c1",
    fileName: "Exam_Syllabus.pdf",
    fileType: "application/pdf",
    size: 520000,
    uploadedBy: "Sarah Mitchell",
    uploadedAt: "2026-01-16T11:00:00Z",
    caseId: "case-1",
  },
  {
    id: "doc-c2",
    fileName: "Past_Papers.zip",
    fileType: "application/zip",
    size: 2400000,
    uploadedBy: "Sarah Mitchell",
    uploadedAt: "2026-01-20T15:00:00Z",
    caseId: "case-1",
  },
  {
    id: "doc-c3",
    fileName: "Reading_List.docx",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 85000,
    uploadedBy: "Sarah Mitchell",
    uploadedAt: "2025-12-02T10:00:00Z",
    caseId: "case-2",
  },
];

export const mockActivities: ActivityEvent[] = [
  {
    id: "act-1",
    type: "case_created",
    description: "Case created: GCSE Maths Exam Preparation",
    timestamp: "2026-01-15T10:00:00Z",
    caseId: "case-1",
  },
  {
    id: "act-2",
    type: "tutor_invited",
    description: "James Chen was invited to the case",
    timestamp: "2026-02-01T10:00:00Z",
    caseId: "case-1",
  },
  {
    id: "act-3",
    type: "document_uploaded",
    description: "Exam_Syllabus.pdf was uploaded",
    timestamp: "2026-01-16T11:00:00Z",
    caseId: "case-1",
  },
  {
    id: "act-4",
    type: "case_updated",
    description: "Budget updated to £45/hour",
    timestamp: "2026-02-20T14:30:00Z",
    caseId: "case-1",
  },
  {
    id: "act-5",
    type: "tutor_invited",
    description: "Emily Watson was invited to the case",
    timestamp: "2025-12-05T14:00:00Z",
    caseId: "case-2",
  },
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getQualificationSummary(tutor: TutorProfile): string {
  return tutor.qualifications[0] ?? "No qualifications listed";
}

export function getExperienceSummary(tutor: TutorProfile): string {
  return `${tutor.yearsOfExperience} years · ${tutor.subjectsTaught.slice(0, 2).join(", ")}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
