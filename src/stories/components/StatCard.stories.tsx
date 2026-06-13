import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Briefcase, FileText, Users } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";

const meta = {
  title: "Common/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dashboard metric card with icon, value, and optional subtitle. Used on parent and tutor dashboards.",
      },
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Open cases",
    value: 3,
    description: "Awaiting tutor match",
    icon: Briefcase,
  },
};

export const DashboardGrid: Story = {
  args: {
    title: "Open cases",
    value: 3,
    icon: Briefcase,
  },
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total cases"
        value={5}
        description="All time"
        icon={Briefcase}
      />
      <StatCard
        title="Invitations"
        value={2}
        description="Pending response"
        icon={Users}
      />
      <StatCard
        title="Documents"
        value={8}
        description="Uploaded files"
        icon={FileText}
      />
    </div>
  ),
};
