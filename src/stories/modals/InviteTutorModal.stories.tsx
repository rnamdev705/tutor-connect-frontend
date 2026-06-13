import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";

const meta = {
  title: "Modals/InviteTutorModal",
  component: InviteTutorModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Searchable tutor picker for parents inviting tutors to a case. Filters mock tutors by name or subject.",
      },
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onInvite: fn(),
    excludeIds: [],
  },
} satisfies Meta<typeof InviteTutorModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExcludedTutors: Story = {
  args: {
    excludeIds: ["tutor-1", "tutor-2"],
  },
};
