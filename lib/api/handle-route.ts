import { ZodError } from "zod";

import { AppError, toAppError } from "@/lib/api/errors";
import { apiError } from "@/lib/api/responses";

export async function handleServiceRoute(
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        error.issues[0]?.message ?? "Validation failed",
        400,
        "VALIDATION_ERROR"
      );
    }

    const appError = error instanceof AppError ? error : toAppError(error);
    return apiError(appError.message, appError.status, appError.code, appError.details);
  }
}
