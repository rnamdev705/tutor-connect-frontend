import type { User as ApiUser } from "@/api/types.gen";
import type { User } from "@/lib/types";

export function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    name: apiUser.displayName?.trim() || apiUser.email,
  };
}
