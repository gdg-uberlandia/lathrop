import { auth } from "@/utils/firebaseClient";

import { AdminApiError } from "./errors";
import { parseAdminApiResponse } from "./response";

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

  const fetchRequest = () =>
    fetch(createUrl(path, query), {
      ...requestOptions,
      body: requestBody,
      headers,
    });
  const execute = async () => {
    try {
      return await fetchRequest();
    } catch (networkError) {
      if (requestOptions.signal?.aborted) throw networkError;
      console.error(`[admin-api] Falha de rede em ${path}.`, networkError);
      throw new AdminApiError(
        0,
        window.navigator.onLine
          ? "O servidor não respondeu ao upload. Tente novamente em instantes."
          : "Você está sem conexão. Reconecte-se e tente novamente.",
      );
    }
  };

  let response = await execute();

  if (response.status === 401 && auth.currentUser) {
    headers.set("Authorization", await getAuthorizationHeader(true));
    response = await execute();
  }

  return parseAdminApiResponse<T>(response);
}
