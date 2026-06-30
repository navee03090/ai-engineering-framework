import type { z } from "zod";

import { AppError } from "@/lib/api/errors";
import { API_ERROR_CODES } from "@/lib/api/error-codes";

export function parseQueryParams<T extends z.ZodType>(
  request: Request,
  schema: T
): z.infer<T> {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(query);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters",
      400,
      API_ERROR_CODES.VALIDATION_ERROR,
      parsed.error.flatten()
    );
  }

  return parsed.data;
}
