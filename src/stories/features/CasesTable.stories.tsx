import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CasesTable } from "@/components/cases/cases-table";
import type { Case } from "@/api/types.gen";

const sampleCases: Case[] = [
  {
    id: "case-1",
    title: "GCSE Maths Support",
    subject: "Mathematics",
    level: "GCSE",
    location: "London",
    budgetPerHour: 35,
    status: "open",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedCount: 2,
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-01-15T14:30:00Z",
  },
  {
    id: "case-2",
    title: "A-Level English Literature",
    subject: "English",
    level: "A-Level",
    location: "Manchester",
    budgetPerHour: 45,
    status: "matched",
    ownerId: "user-parent-1",
    ownerName: "Sarah Mitchell",
    invitedCount: 3,
    createdAt: "2025-11-20T09:00:00Z",
    updatedAt: "2026-01-10T11:00:00Z",
  },
];

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
    cases: sampleCases,
  },
};

export const WithUpdatedColumn: Story = {
  args: {
    cases: sampleCases,
    showUpdated: true,
  },
};
