"use client";

import Link from "next/link";
import {
  Briefcase,
  FileText,
  FolderOpen,
  Mail,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/common/user-avatar";
import { StatCard } from "@/components/common/stat-card";
import { CasesTable } from "@/components/cases/cases-table";
import { EmptyState } from "@/components/common/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getCasesByOwnerId, getParentCaseStats } from "@/lib/data";

export function ParentProfileView() {
  const { user } = useAuth();

  if (!user) return null;

  const parentCases = getCasesByOwnerId(user.id);
  const stats = getParentCaseStats(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and tutoring activity
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile/edit">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm" size="sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="xl" />
            <div>
              <h2 className="text-lg font-semibold leading-tight">{user.name}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1.5 capitalize">
                {user.role} account
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cases" value={stats.total} icon={Briefcase} />
        <StatCard title="Open Cases" value={stats.open} icon={FolderOpen} />
        <StatCard title="Matched Cases" value={stats.matched} icon={Users} />
        <StatCard title="Documents" value={stats.documents} icon={FileText} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
            <CardDescription>Your registered information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Full name</dt>
                <dd className="mt-1 text-sm font-medium">{user.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                <dd className="mt-1 text-sm font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Account type</dt>
                <dd className="mt-1 text-sm font-medium capitalize">{user.role}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Member since</dt>
                <dd className="mt-1 text-sm font-medium">Jan 2026</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Quick Links</CardTitle>
            <CardDescription>Common actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/cases">
                <Briefcase className="mr-2 h-4 w-4" />
                View all my cases
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/tutors">
                <Users className="mr-2 h-4 w-4" />
                Find a tutor
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/dashboard">
                <Mail className="mr-2 h-4 w-4" />
                Go to dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">My Cases</CardTitle>
            <CardDescription>Cases you have created</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {parentCases.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No cases yet"
              description="Create your first tutoring case to get started."
              actionLabel="Create Case"
              actionHref="/cases/new"
              variant="compact"
            />
          ) : (
            <CasesTable cases={parentCases.slice(0, 5)} showUpdated />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
