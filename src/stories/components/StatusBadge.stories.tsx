import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "@/components/common/status-badge";

const meta = {
  title: "Common/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Unified status pill for case statuses (`open`, `matched`, `closed`) and invitation statuses (`pending`, `accepted`, `declined`).",
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["open", "matched", "closed", "pending", "accepted", "declined"],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { status: "open" },
};

export const Matched: Story = {
  args: { status: "matched" },
};

export const Closed: Story = {
  args: { status: "closed" },
};

export const Pending: Story = {
  args: { status: "pending" },
};

export const Accepted: Story = {
  args: { status: "accepted" },
};

export const Declined: Story = {
  args: { status: "declined" },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        ["open", "matched", "closed", "pending", "accepted", "declined"] as const
      ).map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
