"use client";

import { ShieldX } from "lucide-react";
import { ErrorState } from "@/components/common/error-state";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md">
        <ErrorState
          icon={ShieldX}
          title="Access denied"
          message="You don't have permission to view this page. Please contact your administrator if you believe this is an error."
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
