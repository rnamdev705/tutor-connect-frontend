const GENERIC_ERROR = "Something went wrong. Please try again.";

const UNSAFE_MESSAGE_PATTERNS = [
  /database error/i,
  /prisma/i,
  /\bP\d{4}\b/,
  /invalid `.*?` invocation/i,
  /transaction api error/i,
  /transaction already closed/i,
  /unique constraint failed/i,
  /foreign key constraint/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /ETIMEDOUT/i,
  /socket hang up/i,
  /can't reach database server/i,
  /connection terminated/i,
  /syntax error at or near/i,
  /stack trace/i,
  /\bat\s+\S+\s+\(/,
];

type ApiErrorPayload = {
  message?: string;
  code?: string;
};

function extractApiErrorPayload(error: unknown): ApiErrorPayload | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  if ("error" in error && typeof (error as { error?: unknown }).error === "object") {
    const nested = (error as { error: ApiErrorPayload }).error;
    return {
      message: nested.message,
      code: nested.code,
    };
  }

  return null;
}

function isUnsafePrismaCode(code: string | undefined): boolean {
  return typeof code === "string" && /^P\d{4}$/.test(code);
}

function isUnsafeMessage(message: string): boolean {
  return UNSAFE_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

function toUserFacingMessage(payload: ApiErrorPayload | null, fallback?: string): string {
  const message = payload?.message?.trim() || fallback?.trim();

  if (!message) {
    return GENERIC_ERROR;
  }

  if (isUnsafePrismaCode(payload?.code) || isUnsafeMessage(message)) {
    return GENERIC_ERROR;
  }

  return message;
}

/** Maps API / network errors to a safe string for toasts and inline UI copy. */
export function getApiErrorMessage(error: unknown): string {
  const payload = extractApiErrorPayload(error);

  if (payload) {
    return toUserFacingMessage(payload);
  }

  if (error instanceof Error && error.message) {
    return toUserFacingMessage(null, error.message);
  }

  if (typeof error === "string" && error.trim()) {
    return toUserFacingMessage(null, error);
  }

  return GENERIC_ERROR;
}

export function getApiErrorCode(error: unknown): string | undefined {
  return extractApiErrorPayload(error)?.code;
}

/** True when the API returned 403 with FORBIDDEN. */
export function isApiForbiddenError(error: unknown): boolean {
  return getApiErrorCode(error) === "FORBIDDEN";
}

/** True when the API returned 503 because Neon/DB is waking up. */
export function isDbUnavailableError(error: unknown): boolean {
  return getApiErrorCode(error) === "DB_UNAVAILABLE";
}
