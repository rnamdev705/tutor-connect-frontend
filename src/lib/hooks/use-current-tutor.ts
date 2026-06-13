"use client";

import { useAuth } from "@/lib/auth-context";
import { getTutorByUserId } from "@/lib/data";
import type { TutorProfile } from "@/lib/types";

/**
 * Returns the {@link TutorProfile} linked to the signed-in tutor user.
 * Undefined when logged out or when the user role is not tutor.
 */
export function useCurrentTutor(): TutorProfile | undefined {
  const { user } = useAuth();
  return user ? getTutorByUserId(user.id) : undefined;
}
