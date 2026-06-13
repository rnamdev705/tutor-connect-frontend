import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TutorCard } from "@/components/tutors/tutor-card";
import { mockTutors } from "@/lib/mock-data";

const meta = {
  title: "Features/TutorCard",
  component: TutorCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Directory card showing tutor avatar, qualifications, experience, document count, and link to profile.",
      },
    },
  },
} satisfies Meta<typeof TutorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tutor: mockTutors[0],
  },
};

export const Grid: Story = {
  args: { tutor: mockTutors[0] },
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockTutors.slice(0, 3).map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  ),
};
