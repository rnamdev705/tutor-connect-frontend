import { client } from "./client.gen";

const TOKEN_STORAGE_KEY = "tutorconnect-token";
const TOKEN_COOKIE_KEY = "tutorconnect-token";
const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

/** Sync localStorage token to cookie for middleware route protection. */
export function syncAuthCookieFromStorage(): void {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
  }
}

client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1",
  auth: () => getAuthToken() ?? undefined,
});

client.interceptors.response.use((response) => {
  if (
    response.status === 401 &&
    typeof window !== "undefined" &&
    !window.location.pathname.startsWith("/login") &&
    !window.location.pathname.startsWith("/register")
  ) {
    setAuthToken(null);
    window.location.href = "/login";
  }
  return response;
});
