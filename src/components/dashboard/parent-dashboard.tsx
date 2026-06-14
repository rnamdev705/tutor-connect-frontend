"use client";

import { If, Then, Else } from "react-if";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderOpen,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import { getCasesOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";
import { CasesTable } from "@/components/cases/cases-table";
import { EmptyState } from "@/components/common/empty-state";
import { useAuth } from "@/lib/auth-context";

export function ParentDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery(getCasesOptions());

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cases = data?.data ?? [];
  const recentCases = cases.slice(0, 5);
  const stats = {
    total: cases.length,
    open: cases.filter((c) => c.status === "open").length,
    matched: cases.filter((c) => c.status === "matched").length,
    documents: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your tutoring cases and find the right tutors.
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Case
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cases" value={stats.total} icon={Briefcase} />
        <StatCard title="Open Cases" value={stats.open} icon={FolderOpen} />
        <StatCard title="Matched Cases" value={stats.matched} icon={Users} />
        <StatCard title="Documents Uploaded" value={stats.documents} icon={FileText} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Cases</CardTitle>
            <CardDescription>Your latest tutoring cases</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <If condition={recentCases.length === 0}>
            <Then>
              <EmptyState
                icon={Briefcase}
                title="No cases yet"
                description="Create your first tutoring case to start finding qualified tutors."
                actionLabel="Create Case"
                actionHref="/cases/new"
                variant="compact"
              />
            </Then>
            <Else>
              <CasesTable cases={recentCases} />
            </Else>
          </If>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Case
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tutors">
              <Users className="mr-2 h-4 w-4" />
              Browse Tutors
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
