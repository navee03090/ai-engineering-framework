import { Resend } from "resend";

import { renderEmailTemplate } from "@/lib/email/templates";
import type { EmailTemplateId } from "@/lib/email/types";
import { AppError } from "@/lib/api/errors";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export type SendTemplateEmailInput<T extends EmailTemplateId> = {
  to: string | string[];
  templateId: T;
  context: Parameters<typeof renderEmailTemplate>[1];
};

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new AppError("RESEND_API_KEY is not configured.", 503, "EMAIL_UNAVAILABLE");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export const emailService = {
  isConfigured(): boolean {
    return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
  },

  getStatus() {
    return {
      configured: this.isConfigured(),
      fromEmail: process.env.RESEND_FROM_EMAIL ?? null,
      provider: "resend" as const,
    };
  },

  async send(input: SendEmailInput) {
    const from = process.env.RESEND_FROM_EMAIL;

    if (!from) {
      throw new AppError("RESEND_FROM_EMAIL is not configured.", 503, "EMAIL_UNAVAILABLE");
    }

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    if (error) {
      throw new AppError(error.message, 500, "EMAIL_SEND_FAILED");
    }

    return data;
  },

  async sendTemplate<T extends EmailTemplateId>(input: SendTemplateEmailInput<T>) {
    const rendered = renderEmailTemplate(input.templateId, input.context);

    return this.send({
      to: input.to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });
  },
};
