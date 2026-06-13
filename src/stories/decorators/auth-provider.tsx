import type { Decorator } from "@storybook/nextjs-vite";
import { AuthProvider } from "@/lib/auth-context";

/** Wraps stories that depend on {@link useAuth}. */
export const withAuthProvider: Decorator = (Story) => (
  <AuthProvider>
    <Story />
  </AuthProvider>
);
