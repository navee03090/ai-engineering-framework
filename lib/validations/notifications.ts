import { z } from "zod";

export const notificationChannelSchema = z.enum(["email"]);

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
});

export const incidentNotifySchema = z.object({
  channels: z.array(notificationChannelSchema).optional(),
});
