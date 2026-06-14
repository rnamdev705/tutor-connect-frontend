import { TutorProfileDetailView } from "@/components/tutors/tutor-profile-detail-view";

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TutorProfileDetailView tutorId={id} />;
}
