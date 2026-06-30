import { z } from "zod";

export const promptsQuerySchema = z.object({
  tag: z.string().min(1).optional(),
});
