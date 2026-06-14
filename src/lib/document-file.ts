import { getDocumentsByIdDownload } from "@/api/sdk.gen";

export function canPreviewDocument(mimeType: string) {
  return (
    mimeType === "application/pdf" ||
    mimeType === "image/png" ||
    mimeType === "image/jpeg"
  );
}

export async function fetchDocumentBlob(documentId: string): Promise<Blob> {
  const { data } = await getDocumentsByIdDownload({
    path: { id: documentId },
    parseAs: "blob",
    throwOnError: true,
  });

  if (!data) {
    throw new Error("Failed to load document");
  }

  return data;
}

export function saveDocumentBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadDocument(documentId: string, filename: string) {
  const blob = await fetchDocumentBlob(documentId);
  saveDocumentBlob(blob, filename);
}
