"use client";

import { If, Then, Else } from "react-if";
import { ParentDashboard } from "@/components/dashboard/parent-dashboard";
import { TutorDashboard } from "@/components/dashboard/tutor-dashboard";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <If condition={user?.role === "tutor"}>
      <Then>
        <TutorDashboard />
      </Then>
      <Else>
        <ParentDashboard />
      </Else>
    </If>
  );
}
