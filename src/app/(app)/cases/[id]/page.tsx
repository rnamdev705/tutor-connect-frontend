import { notFound } from "next/navigation";
import { CaseDetailView } from "@/components/cases/case-detail-view";
import { getCaseById } from "@/lib/data";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseData = getCaseById(id);
  if (!caseData) notFound();
  return <CaseDetailView caseData={caseData} />;
}
