"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SearchInput } from "@/components/common/search-input";

function SearchInputDemo({
  placeholder = "Search tutors...",
}: {
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-md space-y-2">
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder={placeholder}
      />
      <p className="text-xs text-muted-foreground">
        Current value: {value || "(empty)"}
      </p>
    </div>
  );
}

const meta = {
  title: "Common/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Controlled search field with icon. Used on tutor directory and case list pages.",
      },
    },
  },
  args: {
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SearchInputDemo />,
};

export const CustomPlaceholder: Story = {
  render: () => <SearchInputDemo placeholder="Search cases by subject..." />,
};
