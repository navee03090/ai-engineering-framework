import { describe, expect, it } from "vitest";

import { AppError } from "@/lib/api/errors";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { createIncidentSchema } from "@/lib/validations/incidents";
import { aiService } from "@/services/ai.service";
import { emailService } from "@/services/email.service";
import { notificationService } from "@/services/notification.service";

describe("aiService", () => {
  it("lists registered agents without Gemini", () => {
    const agents = aiService.listAgents();
    expect(agents.map((agent) => agent.name).sort()).toEqual(["classifier", "summarizer"]);
  });

  it("throws when Gemini is not configured", async () => {
    const original = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    await expect(
      aiService.runAgent("summarizer", { content: "test", audience: "ops", maxWords: 50 })
    ).rejects.toMatchObject({
      code: "AI_UNAVAILABLE",
      status: 503,
    });

    process.env.GEMINI_API_KEY = original;
  });
});

describe("emailService", () => {
  it("reports configuration state from env", () => {
    const originalKey = process.env.RESEND_API_KEY;
    const originalFrom = process.env.RESEND_FROM_EMAIL;

    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    expect(emailService.isConfigured()).toBe(false);
    expect(emailService.getStatus().configured).toBe(false);

    process.env.RESEND_API_KEY = originalKey;
    process.env.RESEND_FROM_EMAIL = originalFrom;
  });
});

describe("notificationService", () => {
  it("skips incident email when no channels are configured", async () => {
    const originalKey = process.env.RESEND_API_KEY;
    const originalFrom = process.env.RESEND_FROM_EMAIL;
    const originalN8n = process.env.N8N_WEBHOOK_URL;

    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.N8N_WEBHOOK_URL;

    const result = await notificationService.notifyIncidentAnalyzed({
      id: "inc-1",
      title: "Flood report",
      category: "flood",
      severity: "high",
      recipientEmail: "ops@example.com",
    });

    expect(result).toEqual({ skipped: true, reason: "no_channels_configured" });

    process.env.RESEND_API_KEY = originalKey;
    process.env.RESEND_FROM_EMAIL = originalFrom;
    process.env.N8N_WEBHOOK_URL = originalN8n;
  });

  it("reports available notification channels", () => {
    const originalKey = process.env.RESEND_API_KEY;
    const originalFrom = process.env.RESEND_FROM_EMAIL;
    const originalN8n = process.env.N8N_WEBHOOK_URL;

    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.N8N_WEBHOOK_URL;

    expect(notificationService.getStatus().availableChannels).toEqual([]);

    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "noreply@example.com";
    expect(notificationService.getStatus().availableChannels).toEqual(["email"]);

    process.env.N8N_WEBHOOK_URL = "https://n8n.example.com/webhook";
    expect(notificationService.getStatus().availableChannels).toEqual(["email", "n8n"]);

    process.env.RESEND_API_KEY = originalKey;
    process.env.RESEND_FROM_EMAIL = originalFrom;
    process.env.N8N_WEBHOOK_URL = originalN8n;
  });
});

describe("createIncidentSchema", () => {
  it("validates incident creation payload", () => {
    const parsed = createIncidentSchema.safeParse({
      title: "Flash flood",
      description: "Roads blocked near Mingora, multiple families stranded.",
      location: "Swat",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects short descriptions", () => {
    const parsed = createIncidentSchema.safeParse({
      title: "Flash flood",
      description: "short",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("handleServiceRoute", () => {
  it("maps AppError to api response", async () => {
    const response = await handleServiceRoute(async () => {
      throw new AppError("Service failed", 418, "TEAPOT");
    });

    expect(response.status).toBe(418);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("TEAPOT");
  });
});
