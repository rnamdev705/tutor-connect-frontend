import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TutorCard } from "@/components/tutors/tutor-card";
import type { TutorProfileSummary } from "@/api/types.gen";

const sampleTutor: TutorProfileSummary = {
  id: "tutor-1",
  tutorId: "user-tutor-1",
  displayName: "James Chen",
  qualifications: ["MSc Mathematics, Imperial College"],
  experiences: ["Head of Maths Department"],
  teachingBackground: "12 years classroom experience across GCSE and A-Level.",
  yearsOfExperience: 12,
  subjectsTaught: ["Mathematics", "Physics"],
};

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
    tutor: sampleTutor,
  },
};

export const Grid: Story = {
  args: {
    tutor: sampleTutor,
  },
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TutorCard tutor={sampleTutor} />
      <TutorCard
        tutor={{
          ...sampleTutor,
          id: "tutor-2",
          displayName: "Alice Wong",
          subjectsTaught: ["English", "History"],
        }}
      />
      <TutorCard
        tutor={{
          ...sampleTutor,
          id: "tutor-3",
          displayName: "Michael Okonkwo",
          subjectsTaught: ["Chemistry", "Biology"],
        }}
      />
    </div>
  ),
};
