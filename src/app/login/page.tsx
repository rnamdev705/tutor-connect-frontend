"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AuthBrandingPanel />
      <div className="flex flex-1 items-center justify-center bg-neutral-50 p-6">
        <LoginForm />
      </div>
    </div>
  );
}
