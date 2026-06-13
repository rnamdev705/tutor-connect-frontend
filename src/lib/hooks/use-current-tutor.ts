"use client";

import { useAuth } from "@/lib/auth-context";
import { getTutorByUserId } from "@/lib/data";
import type { TutorProfile } from "@/lib/types";

export function useCurrentTutor(): TutorProfile | undefined {
  const { user } = useAuth();
  return user ? getTutorByUserId(user.id) : undefined;
}
