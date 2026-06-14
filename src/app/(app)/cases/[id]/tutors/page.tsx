import { CaseInvitedTutorsView } from "@/components/cases/case-invited-tutors-view";

export default async function CaseInvitedTutorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaseInvitedTutorsView caseId={id} />;
}
