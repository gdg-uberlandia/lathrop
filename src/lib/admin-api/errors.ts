export type AdminApiErrorPayload = {
  error?: string;
  message?: string;
  issues?: unknown;
};

export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AdminApiError";
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isValidationError() {
    return this.status === 400 || this.status === 422;
  }
}

export function getAdminApiErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a operação",
) {
  return error instanceof AdminApiError ? error.message : fallback;
}

export function isRequestCanceled(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
