import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";

const meta = {
  title: "Common/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Page title block with optional description, item count badge, and action slot (buttons).",
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "My Cases",
    description: "Manage your tutoring requests and invitations.",
  },
};

export const WithCount: Story = {
  args: {
    title: "Tutor Directory",
    description: "Browse verified tutors by subject and level.",
    count: 12,
  },
};

export const WithActions: Story = {
  args: {
    title: "My Cases",
    description: "Manage your tutoring requests.",
    count: 3,
    children: (
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        New case
      </Button>
    ),
  },
};
