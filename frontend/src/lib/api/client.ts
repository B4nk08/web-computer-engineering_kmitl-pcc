import { getAccessToken } from "./token";
import type { ApiEnvelope, RequestOptions } from "./types";
import { ApiError } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    if (!response.ok) {
      throw new ApiError(response.statusText || "Request failed", response.status);
    }
    throw new ApiError("Invalid JSON response", response.status);
  }

  if (!response.ok || payload.success === false) {
    throw new ApiError(
      payload.error || payload.message || response.statusText || "Request failed",
      response.status
    );
  }

  return payload.data as T;
}

/**
 * Enterprise API client — Bearer token, query builder, envelope unwrap
 */
export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, token, query, headers, ...init } = options;
  const authToken = token === undefined ? getAccessToken() : token;

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseEnvelope<T>(response);
}

/** multipart/form-data — อย่าตั้ง Content-Type เอง ให้ browser ใส่ boundary */
export async function apiFormClient<T>(
  path: string,
  options: {
    method?: string;
    formData: FormData;
    token?: string | null;
    query?: RequestOptions["query"];
  }
): Promise<T> {
  const authToken = options.token === undefined ? getAccessToken() : options.token;

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "POST",
    headers: {
      Accept: "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: options.formData,
  });

  return parseEnvelope<T>(response);
}

export function getApiBaseUrl() {
  return API_BASE;
}

export { ApiError };
