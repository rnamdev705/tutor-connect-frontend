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
          "Searchable tutor picker for parents inviting tutors to a case. Requires tutorConnect-api running for tutor search.",
      },
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onInvite: fn(),
    invitedTutors: [],
    invitingTutorIds: [],
  },
} satisfies Meta<typeof InviteTutorModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInvitedTutors: Story = {
  args: {
    invitedTutors: [
      { tutorProfileId: "tutor-1", status: "pending" },
      { tutorProfileId: "tutor-2", status: "accepted" },
    ],
  },
};
