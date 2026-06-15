"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TutorsDirectoryView } from "@/components/tutors/tutors-directory-view";
import { PageHeader } from "@/components/common/page-header";
import { TutorGridSkeleton } from "@/components/common/content-skeletons";
import { useAuth } from "@/lib/auth-context";

export default function TutorsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === "tutor") {
      router.replace("/unauthorized");
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role === "tutor") {
    return (
      <div className="space-y-6">
        <PageHeader title="Tutor Directory" description="Browse qualified tutors for your cases" />
        <TutorGridSkeleton />
      </div>
    );
  }

  return <TutorsDirectoryView />;
}
