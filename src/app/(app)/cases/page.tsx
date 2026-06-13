"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CasesListView } from "@/components/cases/cases-list-view";
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return <CasesListView />;
}
