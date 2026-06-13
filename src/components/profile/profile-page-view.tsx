"use client";

import { If, Then, Else } from "react-if";
import { ParentProfileView } from "@/components/profile/parent-profile-view";
import { TutorProfileView } from "@/components/profile/tutor-profile-view";
import { useAuth } from "@/lib/auth-context";

export function ProfilePageView() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <If condition={user.role === "tutor"}>
      <Then>
        <TutorProfileView />
      </Then>
      <Else>
        <ParentProfileView />
      </Else>
    </If>
  );
}
