import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ErrorState } from "@/components/common/error-state";

const meta = {
  title: "Common/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Error card for failed loads or missing resources. Supports retry callback or navigation link.",
      },
    },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onRetry: fn(),
  },
};

export const CustomMessage: Story = {
  args: {
    title: "Case not found",
    message: "This case may have been removed or you do not have access.",
    actionLabel: "Back to cases",
    actionHref: "/cases",
  },
};

export const WithRetry: Story = {
  args: {
    title: "Failed to load",
    message: "Could not fetch tutor directory. Check your connection and try again.",
    actionLabel: "Retry",
    onRetry: fn(),
  },
};
