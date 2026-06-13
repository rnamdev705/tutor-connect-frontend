import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FolderOpen } from "lucide-react";
import { fn } from "storybook/test";
import { EmptyState } from "@/components/common/empty-state";

const meta = {
  title: "Common/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Empty list placeholder with optional CTA. Supports `default` (bordered card) and `compact` variants.",
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: FolderOpen,
    title: "No cases yet",
    description: "Create your first tutoring case to start inviting tutors.",
    actionLabel: "Create case",
    actionHref: "/cases/new",
  },
};

export const Compact: Story = {
  args: {
    icon: FolderOpen,
    title: "No results",
    description: "Try adjusting your search or filters.",
    variant: "compact",
  },
};

export const WithAction: Story = {
  args: {
    icon: FolderOpen,
    title: "No invitations",
    description: "You have not been invited to any cases yet.",
    actionLabel: "Browse cases",
    onAction: fn(),
  },
};
