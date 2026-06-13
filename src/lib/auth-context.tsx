"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authenticateUser, registerUser } from "./auth-store";
import type { RegisterInput } from "./validations/auth";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "tutorconnect-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const persistUser = useCallback((nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authenticated = authenticateUser(email, password);
    if (!authenticated) {
      return { success: false, error: "Invalid email or password" };
    }
    persistUser(authenticated);
    return { success: true };
  }, [persistUser]);

  const register = useCallback(async (input: RegisterInput) => {
    const result = registerUser({
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
    });
    if (result.error || !result.user) {
      return { success: false, error: result.error ?? "Registration failed" };
    }
    persistUser(result.user);
    return { success: true };
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
