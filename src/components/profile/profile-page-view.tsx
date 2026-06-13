"use client";

import { ParentProfileView } from "@/components/profile/parent-profile-view";
import { TutorProfileView } from "@/components/profile/tutor-profile-view";
import { useAuth } from "@/lib/auth-context";

export function ProfilePageView() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "tutor" ? <TutorProfileView /> : <ParentProfileView />;
}
