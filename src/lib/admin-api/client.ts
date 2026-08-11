import { auth } from "@/utils/firebaseClient";

import { AdminApiError, type AdminApiErrorPayload } from "./errors";

type QueryValue = string | number | boolean | null | undefined;

type AdminApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
  query?: Record<string, QueryValue>;
};

function createUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, window.location.origin);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return `${url.pathname}${url.search}`;
}

async function getAuthorizationHeader(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) {
    throw new AdminApiError(401, "Sua sessão expirou. Entre novamente.");
  }

  return `Bearer ${await user.getIdToken(forceRefresh)}`;
}

function createRequestBody(body: AdminApiRequestOptions["body"]) {
  if (
    body === undefined ||
    body === null ||
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  return JSON.stringify(body);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorPayload = payload as AdminApiErrorPayload;
    throw new AdminApiError(
      response.status,
      errorPayload.error || errorPayload.message || "Erro inesperado na API",
      errorPayload.issues,
    );
  }

  return payload as T;
}

export async function adminApiRequest<T>(
  path: string,
  options: AdminApiRequestOptions = {},
): Promise<T> {
  const { body, headers: customHeaders, query, ...requestOptions } = options;
  const requestBody = createRequestBody(body);
  const headers = new Headers(customHeaders);

  if (requestBody && !(requestBody instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Authorization", await getAuthorizationHeader());

  const execute = () =>
    fetch(createUrl(path, query), {
      ...requestOptions,
      body: requestBody,
      headers,
    });

  let response = await execute();
  if (response.status === 401 && auth.currentUser) {
    headers.set("Authorization", await getAuthorizationHeader(true));
    response = await execute();
  }

  return parseResponse<T>(response);
}
