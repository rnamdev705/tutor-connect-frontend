"use client";

import { getTutorsMeProfileOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

/**
 * Returns the signed-in tutor's profile from the API.
 */
export function useCurrentTutor() {
  const { user } = useAuth();
  const isTutor = user?.role === "tutor";

  const query = useQuery({
    ...getTutorsMeProfileOptions(),
    enabled: isTutor,
    retry: false,
  });

  return {
    tutor: isTutor ? query.data : undefined,
    isLoading: isTutor && query.isLoading,
    isError: isTutor && query.isError,
  };
}
