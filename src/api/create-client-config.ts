import type { CreateClientConfig } from "./client.gen";
import { getApiBaseUrl } from "@/lib/api-url";

/** Used by the generated OpenAPI client on init — always reads NEXT_PUBLIC_API_URL. */
export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: getApiBaseUrl(),
});
