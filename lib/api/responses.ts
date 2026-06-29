export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function apiSuccess<T>(data: T, init?: ResponseInit): Response {
  const body: ApiSuccess<T> = { success: true, data };
  return Response.json(body, init);
}

export function apiError(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
): Response {
  const body: ApiError = {
    success: false,
    error: { message, code, details },
  };
  return Response.json(body, { status });
}
