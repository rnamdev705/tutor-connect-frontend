import { notFound } from "next/navigation";
import { TutorProfileDetailView } from "@/components/tutors/tutor-profile-detail-view";
import { getTutorById } from "@/lib/tutor-data";

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = getTutorById(id);
  if (!tutor) notFound();
  return <TutorProfileDetailView tutor={tutor} />;
}
