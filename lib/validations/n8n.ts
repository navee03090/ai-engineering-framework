import { z } from "zod";

import { N8N_EVENT_NAMES } from "@/lib/n8n/types";

export const triggerN8nSchema = z.object({
  event: z.enum(N8N_EVENT_NAMES).or(z.string().min(1)),
  payload: z.record(z.string(), z.unknown()).default({}),
});
