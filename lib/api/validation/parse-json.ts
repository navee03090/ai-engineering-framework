import type { z } from "zod";

import { AppError } from "@/lib/api/errors";
import { API_ERROR_CODES } from "@/lib/api/error-codes";

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new AppError("Invalid JSON body", 400, API_ERROR_CODES.INVALID_JSON);
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.issues[0]?.message ?? "Validation failed",
      400,
      API_ERROR_CODES.VALIDATION_ERROR,
      parsed.error.flatten()
    );
  }

  return parsed.data;
}
