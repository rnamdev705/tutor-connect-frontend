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

/** Allowed MIME types for document upload (see UploadDocumentModal). */
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

/** Maximum upload size in megabytes. */
export const MAX_FILE_SIZE_MB = 10;

export const APP_NAME = "TutorConnect";

/** Must match API default `TUTOR_FREE_RESPONSE_LIMIT`. */
export const TUTOR_FREE_RESPONSE_LIMIT = 3;
