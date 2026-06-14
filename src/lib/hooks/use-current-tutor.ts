"use client";

import { getTutorsMeProfileOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

/**
 * Returns the signed-in tutor's profile from the API.
 * Undefined when logged out, not a tutor, or profile is still loading / missing.
 */
export function useCurrentTutor() {
  const { user } = useAuth();

  const { data } = useQuery({
    ...getTutorsMeProfileOptions(),
    enabled: user?.role === "tutor",
  });

  return user?.role === "tutor" ? data : undefined;
}
