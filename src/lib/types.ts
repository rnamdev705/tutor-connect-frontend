export type UserRole = "parent" | "tutor";

export type CaseStatus = "open" | "matched" | "closed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  qualifications: string[];
  teachingBackground: string;
  yearsOfExperience: number;
  subjectsTaught: string[];
  documents: Document[];
}

export interface Case {
  id: string;
  title: string;
  subject: string;
  level: string;
  location: string;
  budgetPerHour: number;
  status: CaseStatus;
  ownerId: string;
  ownerName: string;
  invitedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseInvitation {
  id: string;
  caseId: string;
  tutorId: string;
  invitedAt: string;
  status: "pending" | "accepted" | "declined" | "superseded";
}

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  caseId?: string;
  tutorId?: string;
}
