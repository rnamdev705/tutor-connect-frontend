import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { withMockTutorsQuery } from "../decorators/with-mock-tutors";

const meta = {
  title: "Modals/InviteTutorModal",
  component: InviteTutorModal,
  tags: ["autodocs"],
  decorators: [withMockTutorsQuery],
  parameters: {
    docs: {
      description: {
        component:
          "Searchable tutor picker for parents inviting tutors to a case. Uses server-side API search in the app; Storybook seeds mock tutors via TanStack Query.",
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
