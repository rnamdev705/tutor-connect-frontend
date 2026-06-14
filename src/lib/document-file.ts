import { getDocumentsByIdDownload } from "@/api/sdk.gen";

const blobCache = new Map<string, Blob>();

export function canPreviewDocument(mimeType: string) {
  return (
    mimeType === "application/pdf" ||
    mimeType === "image/png" ||
    mimeType === "image/jpeg"
  );
}

export function getCachedDocumentBlob(documentId: string): Blob | undefined {
  return blobCache.get(documentId);
}

export function evictDocumentBlobCache(documentId: string): void {
  blobCache.delete(documentId);
}

export async function fetchDocumentBlob(
  documentId: string,
  mimeType?: string,
): Promise<Blob> {
  const cached = blobCache.get(documentId);
  if (cached) {
    return cached;
  }

  const { data } = await getDocumentsByIdDownload({
    path: { id: documentId },
    parseAs: "blob",
    throwOnError: true,
  });

  if (!data) {
    throw new Error("Failed to load document");
  }

  const blob = mimeType ? new Blob([data], { type: mimeType }) : data;
  blobCache.set(documentId, blob);
  return blob;
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
