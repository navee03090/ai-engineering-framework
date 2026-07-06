import { z } from "zod";

export const civicLanguageSchema = z.enum(["en", "ur"]);

export const civicAssistantRequestSchema = z.object({
  query: z.string().min(1, "Query is required").max(2000),
  language: civicLanguageSchema.default("en"),
});

export const civicVerifyDocumentRequestSchema = z.object({
  serviceId: z.string().optional(),
  language: civicLanguageSchema.default("en"),
});

export type CivicAssistantRequest = z.infer<typeof civicAssistantRequestSchema>;
