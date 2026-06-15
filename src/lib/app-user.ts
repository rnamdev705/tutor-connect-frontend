import type { User as ApiUser } from "@/api/types.gen";

export type AppUser = {
  id: string;
  email: string;
  role: ApiUser["role"];
  name: string;
};

export function mapApiUser(apiUser: ApiUser): AppUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    name: apiUser.displayName?.trim() || apiUser.email,
  };
}
