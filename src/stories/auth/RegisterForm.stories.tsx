import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RegisterForm } from "@/components/auth/register-form";
import { withAuthProvider } from "../decorators/auth-provider";

const meta = {
  title: "Auth/RegisterForm",
  component: RegisterForm,
  tags: ["autodocs"],
  decorators: [withAuthProvider],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Registration form with role selection (parent/tutor). Password rules enforced via registerSchema in lib/validations/auth.ts.",
      },
    },
  },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
