"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CasesListView } from "@/components/cases/cases-list-view";
import { PageHeader } from "@/components/common/page-header";
import { TableContentSkeleton } from "@/components/common/content-skeletons";
import { useAuth } from "@/lib/auth-context";

export default function CasesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === "tutor") {
      router.replace("/invitations");
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role === "tutor") {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cases" description="Manage your tutoring cases" />
        <TableContentSkeleton rows={5} />
      </div>
    );
  }

  return <CasesListView />;
}
