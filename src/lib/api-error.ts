export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as { error?: { message?: string } }).error?.message === "string"
  ) {
    return (error as { error: { message: string } }).error.message;
  }
  return "Something went wrong. Please try again.";
}
