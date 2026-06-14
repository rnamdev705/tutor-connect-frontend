import { CaseDocumentsView } from "@/components/cases/case-documents-view";

export default async function CaseDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaseDocumentsView caseId={id} />;
}
