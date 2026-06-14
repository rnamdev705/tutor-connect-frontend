"use client";

import {
  getAuthMeOptions,
  getAuthMeQueryKey,
  postAuthLoginMutation,
  postAuthLogoutMutation,
  postAuthRegisterMutation,
} from "@/api/@tanstack/react-query.gen";
import { getAuthToken, setAuthToken } from "@/api/setup";
import { getApiErrorMessage } from "@/lib/api-error";
import { mapApiUser } from "@/lib/mappers";
import type { RegisterInput } from "@/lib/validations/auth";
import type { User } from "@/lib/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(!!getAuthToken());
  }, []);

  const meQuery = useQuery({
    ...getAuthMeOptions(),
    enabled: hasToken === true,
    retry: false,
  });

  useEffect(() => {
    if (hasToken && meQuery.isError) {
      setAuthToken(null);
      setHasToken(false);
    }
  }, [hasToken, meQuery.isError]);

  const loginMutation = useMutation(postAuthLoginMutation());
  const registerMutation = useMutation(postAuthRegisterMutation());
  const logoutMutation = useMutation(postAuthLogoutMutation());

  const user = useMemo(() => {
    if (!hasToken || !meQuery.data) return null;
    return mapApiUser(meQuery.data);
  }, [hasToken, meQuery.data]);

  const isLoading =
    hasToken === null || (hasToken === true && meQuery.isLoading);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation.mutateAsync({
          body: { email: email.toLowerCase().trim(), password },
        });
        setAuthToken(result.token);
        setHasToken(true);
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
        return { success: true };
      } catch (error) {
        return { success: false, error: getApiErrorMessage(error) };
      }
    },
    [loginMutation, queryClient],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const result = await registerMutation.mutateAsync({
          body: {
            email: input.email.toLowerCase().trim(),
            password: input.password,
            role: input.role,
            displayName: input.name.trim(),
          },
        });
        setAuthToken(result.token);
        setHasToken(true);
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
        return { success: true };
      } catch (error) {
        return { success: false, error: getApiErrorMessage(error) };
      }
    },
    [registerMutation, queryClient],
  );

  const logout = useCallback(async () => {
    try {
      if (getAuthToken()) {
        await logoutMutation.mutateAsync({});
      }
    } catch {
      // Stateless logout — clear client session regardless.
    } finally {
      setAuthToken(null);
      setHasToken(false);
      queryClient.clear();
    }
  }, [logoutMutation, queryClient]);

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
