"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { syncAuthCookieFromStorage } from "@/api/setup";
import { useAuth } from "@/lib/auth-context";
import { AppSidebar } from "./app-sidebar";
import { AppTopNav } from "./app-top-nav";
import { TutorProfileGate } from "@/components/tutors/tutor-profile-gate";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    syncAuthCookieFromStorage();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Skeleton className="hidden w-60 md:block" />
        <div className="flex flex-1 flex-col">
          <Skeleton className="h-16 w-full" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "pl-[68px]" : "pl-60",
        )}
      >
        <AppTopNav />
        <main className="min-w-0 flex-1 p-6">
          <TutorProfileGate>{children}</TutorProfileGate>
        </main>
      </div>
    </div>
  );
}
