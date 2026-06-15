import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (isPublicPath(pathname)) {
    if (token && authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
