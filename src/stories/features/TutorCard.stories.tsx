import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TutorCard } from "@/components/tutors/tutor-card";
import { mockTutors } from "@/stories/fixtures/mock-data";
import type { TutorProfileSummary } from "@/api/types.gen";

function toSummary(tutor: (typeof mockTutors)[0]): TutorProfileSummary {
  return {
    id: tutor.id,
    tutorId: tutor.tutorId,
    displayName: tutor.displayName,
    qualifications: tutor.qualifications,
    experiences: [],
    teachingBackground: tutor.teachingBackground,
    yearsOfExperience: tutor.yearsOfExperience,
    subjectsTaught: tutor.subjectsTaught,
  };
}

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
    tutor: toSummary(mockTutors[0]),
  },
};

export const Grid: Story = {
  args: { tutor: toSummary(mockTutors[0]) },
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockTutors.slice(0, 3).map((tutor) => (
        <TutorCard key={tutor.id} tutor={toSummary(tutor)} />
      ))}
    </div>
  ),
};
