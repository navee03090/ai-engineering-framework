import { z, type ZodType } from "zod";

export function validateAiResponse<T extends ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`AI response validation failed: ${issues}`);
  }

  return result.data;
}
