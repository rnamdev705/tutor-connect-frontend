export type AppRole = "parent" | "tutor";

type JwtPayload = {
  role?: unknown;
  exp?: unknown;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

function parseAppRole(role: unknown): AppRole | null {
  if (role === "PARENT" || role === "parent") return "parent";
  if (role === "TUTOR" || role === "tutor") return "tutor";
  return null;
}

/** Decodes role from a JWT payload without verifying the signature (routing hint only). */
export function decodeTokenRole(token: string): AppRole | null {
  try {
    const normalized = decodeURIComponent(token);
    const parts = normalized.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;

    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return parseAppRole(payload.role);
  } catch {
    return null;
  }
}
