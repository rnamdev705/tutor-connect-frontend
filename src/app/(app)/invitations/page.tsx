"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { InvitedCasesView } from "@/components/cases/invited-cases-view";
import { PageHeader } from "@/components/common/page-header";
import { TableContentSkeleton } from "@/components/common/content-skeletons";
import { useAuth } from "@/lib/auth-context";

export default function InvitationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === "parent") {
      router.replace("/unauthorized");
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role === "parent") {
    return (
      <div className="space-y-6">
        <PageHeader title="Invited Cases" description="Cases you've been invited to tutor" />
        <TableContentSkeleton rows={5} />
      </div>
    );
  }

  return <InvitedCasesView />;
}
