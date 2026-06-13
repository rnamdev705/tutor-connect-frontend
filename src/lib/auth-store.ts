/**
 * Client-side credential store backed by demo users and `localStorage`.
 *
 * Demo accounts are always available; registrations are appended to
 * `tutorconnect-users`. Passwords are stored in plain text for this prototype only.
 *
 * @module auth-store
 */
import { mockUsers } from "./mock-data";
import type { User, UserRole } from "./types";

const USERS_STORAGE_KEY = "tutorconnect-users";

export interface StoredUser extends User {
  password: string;
}

const demoUsers: StoredUser[] = [
  {
    id: "user-parent-1",
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    role: "parent",
    password: "Password1",
  },
  {
    id: "user-tutor-1",
    name: "James Chen",
    email: "james@example.com",
    role: "tutor",
    password: "Password1",
  },
];

function readRegisteredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as StoredUser[];
  } catch {
    return [];
  }
}

function writeRegisteredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getAllUsers(): StoredUser[] {
  const registered = readRegisteredUsers();
  const demoIds = new Set(demoUsers.map((u) => u.id));
  const extra = registered.filter((u) => !demoIds.has(u.id));
  return [...demoUsers, ...extra];
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getAllUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
}

export function authenticateUser(
  email: string,
  password: string,
): User | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  const { password: _, ...publicUser } = user;
  return publicUser;
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): { user?: User; error?: string } {
  if (findUserByEmail(input.email)) {
    return { error: "An account with this email already exists" };
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    role: input.role,
    password: input.password,
  };

  const registered = readRegisteredUsers();
  writeRegisteredUsers([...registered, newUser]);

  const { password: _, ...publicUser } = newUser;
  return { user: publicUser };
}

export function toPublicUser(user: StoredUser): User {
  const { password: _, ...publicUser } = user;
  return publicUser;
}

// Re-export mock users for backwards compatibility
export { mockUsers };
