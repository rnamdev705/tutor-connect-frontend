import type { User } from "@/api/types.gen";

type TutorProfileLike = {
  displayName: string;
  qualifications: string[];
  teachingBackground: string;
  yearsOfExperience: number;
  subjectsTaught: string[];
};

export function getTutorProfileMissingFields(
  profile: TutorProfileLike | undefined,
  user?: Pick<User, "email"> | null,
): string[] {
  const missing: string[] = [];

  if (!user?.email?.trim()) {
    missing.push("Email");
  }

  if (!profile) {
    missing.push("Display Name");
    missing.push("Qualifications");
    missing.push("Years of Experience");
    missing.push("Subjects Taught");
    missing.push("Teaching Background");
    return missing;
  }

  if (!profile.displayName.trim()) {
    missing.push("Display Name");
  }

  if (profile.qualifications.length === 0) {
    missing.push("Qualifications");
  }

  if (
    profile.yearsOfExperience === undefined ||
    profile.yearsOfExperience === null ||
    Number.isNaN(profile.yearsOfExperience)
  ) {
    missing.push("Years of Experience");
  }

  if (profile.subjectsTaught.length === 0) {
    missing.push("Subjects Taught");
  }

  if (!profile.teachingBackground.trim()) {
    missing.push("Teaching Background");
  }

  return missing;
}

export function isTutorProfileComplete(
  profile: TutorProfileLike | undefined,
  user?: Pick<User, "email"> | null,
): boolean {
  return getTutorProfileMissingFields(profile, user).length === 0;
}

export const TUTOR_PROFILE_SETUP_PATH = "/profile/edit";

export function isTutorProfileSetupPath(pathname: string): boolean {
  return (
    pathname === TUTOR_PROFILE_SETUP_PATH ||
    pathname.startsWith(`${TUTOR_PROFILE_SETUP_PATH}/`)
  );
}
