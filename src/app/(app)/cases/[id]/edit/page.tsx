import { notFound } from "next/navigation";
import { CaseFormView } from "@/components/cases/case-form-view";
import { getCaseById } from "@/lib/data";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseData = getCaseById(id);
  if (!caseData) notFound();
  return <CaseFormView mode="edit" caseData={caseData} />;
}
