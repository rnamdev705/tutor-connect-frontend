import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function CardShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function TableContentSkeleton({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function TutorGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardShell key={index} className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </CardShell>
      ))}
    </div>
  );
}

export function DashboardContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardShell key={index} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardShell>
        ))}
      </div>
      <CardShell className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <TableContentSkeleton rows={4} />
      </CardShell>
      <CardShell className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </CardShell>
    </div>
  );
}

export function CaseDetailContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <CardShell className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </CardShell>
      <CardShell className="space-y-4">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </CardShell>
      <CardShell className="space-y-4 lg:col-span-2">
        <Skeleton className="h-5 w-28" />
        <TableContentSkeleton rows={3} />
      </CardShell>
    </div>
  );
}

export function FormContentSkeleton({
  sections = 3,
  className,
}: {
  sections?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: sections }).map((_, index) => (
        <CardShell key={index} className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </CardShell>
      ))}
    </div>
  );
}

export function DocumentTableSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return <TableContentSkeleton rows={rows} className={className} />;
}

export function InvitedTutorListSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 rounded-lg border p-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ProfileActivitySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardShell key={index} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12" />
          </CardShell>
        ))}
      </div>
      <CardShell className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <TableContentSkeleton rows={4} />
      </CardShell>
      <CardShell className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </CardShell>
    </div>
  );
}

export function TutorProfileContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <CardShell className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardShell>
      <div className="grid gap-6 lg:grid-cols-2">
        <CardShell className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardShell>
        <CardShell className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardShell>
      </div>
      <CardShell>
        <TableContentSkeleton rows={3} />
      </CardShell>
    </div>
  );
}
