import type { ApiResponse } from "@/types";

const BASE_PATH = "/api";

export class ApiError extends Error {
  statusCode: number;
  errorDetails?: unknown;

  constructor(message: string, statusCode: number, errorDetails?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined | null>;
  headers?: Record<string, string>;
  skipAuthRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

export async function refreshToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_PATH}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return false;
        const json = (await res.json()) as ApiResponse<{ accessToken: string }>;
        return json.success === true;
      } catch {
        return false;
      } finally {
        setTimeout(() => {
          refreshPromise = null;
        }, 0);
      }
    })();
  }
  return refreshPromise;
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function isAuthPath(path: string): boolean {
  return (
    path.includes("/auth/login") ||
    path.includes("/auth/register") ||
    path.includes("/auth/refresh-token") ||
    path.includes("/payments/confirm")
  );
}

async function doFetch<T>(path: string, options: RequestOptions): Promise<ApiResponse<T>> {
  const { method = "GET", body, params, headers = {}, skipAuthRefresh = false } = options;

  let url = `${BASE_PATH}${path}`;
  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, String(value));
      }
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuthRefresh && !isAuthPath(path)) {
    const ok = await refreshToken();
    if (ok) {
      return doFetch<T>(path, { ...options, skipAuthRefresh: true });
    }
    unauthorizedHandler?.();
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (res.status === 204) {
    return { success: true, statusCode: 204, message: "", data: undefined as T };
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || json === null || json.success === false) {
    throw new ApiError(
      json?.message || `Request failed with status ${res.status}`,
      json?.statusCode ?? res.status,
      json?.errorDetails
    );
  }

  return json;
}

export const api = {
  get<T>(path: string, options: Omit<RequestOptions, "method"> = {}) {
    return doFetch<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return doFetch<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return doFetch<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return doFetch<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(path: string, options: Omit<RequestOptions, "method"> = {}) {
    return doFetch<T>(path, { ...options, method: "DELETE" });
  },
};

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}