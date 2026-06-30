import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(10000),
  location: z.string().max(300).optional(),
});

export const updateIncidentAiSchema = z.object({
  category: z.string().optional(),
  severity: z.string().optional(),
  aiSummary: z.string().optional(),
  recommendedAction: z.string().optional(),
  status: z.enum(["open", "reviewed", "closed"]).optional(),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentAiInput = z.infer<typeof updateIncidentAiSchema>;
