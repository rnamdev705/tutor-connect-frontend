import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeTokenRole } from "@/lib/jwt-decode";
import { isRoleAllowedForPath } from "@/lib/route-access";

const AUTH_COOKIE = "tutorconnect-token";

const publicPaths = ["/", "/login", "/register", "/docs", "/unauthorized"];
const authPaths = ["/login", "/register"];
const protectedPrefixes = [
  "/dashboard",
  "/cases",
  "/tutors",
  "/profile",
  "/invitations",
];

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  return publicPaths
    .filter((path) => path !== "/")
    .some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (isPublicPath(pathname)) {
    if (token && authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !token) {
    return redirectToLogin(request, pathname);
  }

  if (token && isProtectedPath(pathname)) {
    const role = decodeTokenRole(token);

    if (!role) {
      return redirectToLogin(request, pathname);
    }

    if (!isRoleAllowedForPath(pathname, role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
