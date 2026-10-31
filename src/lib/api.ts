export type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string | null;
  meta?: Record<string, unknown>;
  data: T;
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function backendUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new ApiRequestError("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const response = await fetch(backendUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(
      payload?.message || "Request failed. Please try again.",
      response.status,
    );
  }

  return payload;
}

export function jsonRequest<T>(
  path: string,
  method: "POST" | "PATCH",
  body: unknown,
  accessToken?: string,
) {
  return apiRequest<T>(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
}
