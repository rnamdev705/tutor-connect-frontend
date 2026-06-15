import type { AppRole } from "@/lib/jwt-decode";

/** Routes only parents may access (tutor directory, case management). */
export function isParentOnlyPath(pathname: string): boolean {
  if (pathname === "/cases" || pathname === "/cases/new") {
    return true;
  }

  if (/^\/cases\/[^/]+\/edit\/?$/.test(pathname)) {
    return true;
  }

  if (/^\/cases\/[^/]+\/tutors\/?$/.test(pathname)) {
    return true;
  }

  return pathname === "/tutors" || pathname.startsWith("/tutors/");
}

/** Routes only tutors may access. */
export function isTutorOnlyPath(pathname: string): boolean {
  return pathname === "/invitations" || pathname.startsWith("/invitations/");
}

export function isRoleAllowedForPath(pathname: string, role: AppRole): boolean {
  if (isParentOnlyPath(pathname) && role !== "parent") {
    return false;
  }

  if (isTutorOnlyPath(pathname) && role !== "tutor") {
    return false;
  }

  return true;
}
