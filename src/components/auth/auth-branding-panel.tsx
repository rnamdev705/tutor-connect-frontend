import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function AuthBrandingPanel() {
  return (
    <div className="hidden w-1/2 flex-col justify-between bg-neutral-900 p-12 text-white lg:flex">
      <Link href="/login" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">{APP_NAME}</span>
      </Link>
      <div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          Connect with the right tutor, effortlessly.
        </h1>
        <p className="mt-4 max-w-md text-neutral-400">
          A professional marketplace for parents seeking qualified tutors
          and tutors managing their tutoring cases.
        </p>
      </div>
      <p className="text-sm text-neutral-500">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </div>
  );
}

export function AuthMobileLogo() {
  return (
    <Link
      href="/login"
      className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white lg:hidden"
    >
      <GraduationCap className="h-6 w-6" />
    </Link>
  );
}
