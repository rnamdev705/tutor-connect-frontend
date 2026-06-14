"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { FormContentSkeleton } from "@/components/common/content-skeletons";
import {
  isTutorProfileComplete,
  isTutorProfileSetupPath,
  TUTOR_PROFILE_SETUP_PATH,
} from "@/lib/tutor-profile-completion";

export function TutorProfileGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { tutor, isLoading } = useCurrentTutor();

  const isTutor = user?.role === "tutor";
  const onSetupPage = isTutorProfileSetupPath(pathname);
  const profileComplete = isTutorProfileComplete(tutor, user);
  const mustCompleteProfile = isTutor && !profileComplete;

  useEffect(() => {
    if (!isTutor || isLoading || profileComplete || onSetupPage) {
      return;
    }

    router.replace(TUTOR_PROFILE_SETUP_PATH);
  }, [isTutor, isLoading, profileComplete, onSetupPage, router]);

  if (!isTutor) {
    return children;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Loading...</h1>
        </div>
        <FormContentSkeleton sections={3} />
      </div>
    );
  }

  if (mustCompleteProfile && !onSetupPage) {
    return (
      <div className="space-y-6">
        <FormContentSkeleton sections={3} />
      </div>
    );
  }

  return children;
}
