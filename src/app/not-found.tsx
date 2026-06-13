"use client";

import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md">
        <EmptyState
          icon={FileQuestion}
          title="Page not found"
          description="The page you're looking for doesn't exist or has been moved."
          actionLabel="Back to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
