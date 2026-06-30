import { z } from "zod";

export const notificationChannelSchema = z.enum(["email", "n8n"]);

export const sendNotificationSchema = z.object({
  channels: z.array(notificationChannelSchema).optional(),
  email: z
    .object({
      to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
      subject: z.string().min(1).max(200),
      html: z.string().min(1),
      text: z.string().optional(),
    })
    .optional(),
  n8n: z
    .object({
      event: z.string().min(1),
      payload: z.record(z.string(), z.unknown()),
    })
    .optional(),
});

export const incidentNotifySchema = z.object({
  channels: z.array(notificationChannelSchema).optional(),
});
