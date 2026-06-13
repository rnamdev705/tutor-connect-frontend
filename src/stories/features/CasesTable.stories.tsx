import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CasesTable } from "@/components/cases/cases-table";
import { mockCases } from "@/lib/mock-data";

const meta = {
  title: "Features/CasesTable",
  component: CasesTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Reusable cases list table with status badges and optional updated column. Used on parent dashboard and cases list.",
      },
    },
  },
} satisfies Meta<typeof CasesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cases: mockCases.slice(0, 4),
  },
};

export const WithUpdatedColumn: Story = {
  args: {
    cases: mockCases.slice(0, 4),
    showUpdated: true,
  },
};
