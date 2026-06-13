import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserAvatar } from "@/components/common/user-avatar";

const meta = {
  title: "Common/UserAvatar",
  component: UserAvatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Initials-based avatar used in nav, profile headers, and invitation lists. Sizes: `sm` (32px), `md` (40px), `lg` (48px), `xl` (80px).",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Sarah Mitchell",
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <UserAvatar name="James Chen" size="sm" />
      <UserAvatar name="James Chen" size="md" />
      <UserAvatar name="James Chen" size="lg" />
      <UserAvatar name="James Chen" size="xl" />
    </div>
  ),
};
