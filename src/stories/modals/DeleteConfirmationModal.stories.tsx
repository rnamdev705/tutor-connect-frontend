import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";

const meta = {
  title: "Modals/DeleteConfirmationModal",
  component: DeleteConfirmationModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Destructive action confirmation using AlertDialog. Used before deleting cases or documents.",
      },
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof DeleteConfirmationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeleteCase: Story = {
  args: {
    title: "Delete case",
    description:
      "This will permanently remove the case and all uploaded documents. This action cannot be undone.",
  },
};
