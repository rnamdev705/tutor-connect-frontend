import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginForm } from "@/components/auth/login-form";
import { withAuthProvider } from "../decorators/auth-provider";

const meta = {
  title: "Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  decorators: [withAuthProvider],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Sign-in form validated with Zod (loginSchema). Submitting calls the API — start tutorConnect-api for interactive login, or use the visual layout offline.",
      },
    },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
