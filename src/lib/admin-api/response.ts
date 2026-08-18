import { AdminApiError, type AdminApiErrorPayload } from "./errors";

const TRANSIENT_HTTP_STATUSES = new Set([502, 503, 504]);

export function isTransientHttpStatus(status: number) {
  return TRANSIENT_HTTP_STATUSES.has(status);
}

export async function parseAdminApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorPayload =
      typeof payload === "object" && payload !== null
        ? (payload as AdminApiErrorPayload)
        : undefined;
    const textPayload = typeof payload === "string" ? payload.trim() : "";
    const transientMessage = isTransientHttpStatus(response.status)
      ? `O serviço está temporariamente indisponível (HTTP ${response.status}). Tente novamente em instantes.`
      : undefined;

    throw new AdminApiError(
      response.status,
      errorPayload?.error ||
        errorPayload?.message ||
        transientMessage ||
        textPayload ||
        `Erro inesperado na API (HTTP ${response.status})`,
      errorPayload?.issues,
    );
  }

  return payload as T;
}
