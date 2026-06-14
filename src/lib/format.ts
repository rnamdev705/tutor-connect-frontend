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

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getQualificationSummary(tutor: {
  qualifications: string[];
}): string {
  return tutor.qualifications[0] ?? "No qualifications listed";
}

export function getExperienceSummary(tutor: {
  yearsOfExperience: number;
  subjectsTaught: string[];
}): string {
  return `${tutor.yearsOfExperience} years · ${tutor.subjectsTaught.slice(0, 2).join(", ")}`;
}
