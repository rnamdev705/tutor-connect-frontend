import { CaseFormView } from "@/components/cases/case-form-view";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaseFormView mode="edit" caseId={id} />;
}
