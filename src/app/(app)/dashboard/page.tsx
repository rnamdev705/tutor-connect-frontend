"use client";

import { ParentDashboard } from "@/components/dashboard/parent-dashboard";
import { TutorDashboard } from "@/components/dashboard/tutor-dashboard";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === "tutor" ? <TutorDashboard /> : <ParentDashboard />;
}
