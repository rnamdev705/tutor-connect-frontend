export const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
] as const;

export const LEVELS = [
  "Primary",
  "Secondary",
  "GCSE",
  "A-Level",
  "University",
  "Adult Learning",
] as const;

export const CASE_STATUSES = [
  { value: "open", label: "Open" },
  { value: "matched", label: "Matched" },
  { value: "closed", label: "Closed" },
] as const;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export const MAX_FILE_SIZE_MB = 10;

export const APP_NAME = "TutorConnect";
