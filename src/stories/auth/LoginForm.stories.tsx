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
          "Sign-in form validated with Zod (loginSchema). Demo: sarah@example.com or james@example.com / Password1.",
      },
    },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
