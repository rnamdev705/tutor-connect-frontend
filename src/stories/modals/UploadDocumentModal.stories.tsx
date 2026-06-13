import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";

const meta = {
  title: "Modals/UploadDocumentModal",
  component: UploadDocumentModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Drag-and-drop file upload with validation. Accepts PDF, DOC, DOCX, PNG, JPEG up to 10MB (see lib/constants.ts).",
      },
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onUpload: fn(),
  },
} satisfies Meta<typeof UploadDocumentModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
