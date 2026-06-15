const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";
const API_PREFIX = "/api/v1";

/**
 * Resolved API base URL for all client requests.
 * Reads NEXT_PUBLIC_API_URL and normalizes host-only values, e.g.
 * `my-api.up.railway.app` → `https://my-api.up.railway.app/api/v1`
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    return DEFAULT_API_BASE_URL;
  }

  let url = raw;

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  url = url.replace(/\/+$/, "");

  if (!url.endsWith(API_PREFIX)) {
    url = `${url}${API_PREFIX}`;
  }

  return url;
}
