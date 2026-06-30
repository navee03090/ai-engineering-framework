import { describe, expect, it } from "vitest";

import { n8nService } from "@/services/n8n.service";

describe("n8nService", () => {
  it("reports configuration from env", () => {
    const originalUrl = process.env.N8N_WEBHOOK_URL;
    const originalSecret = process.env.N8N_WEBHOOK_SECRET;

    delete process.env.N8N_WEBHOOK_URL;
    delete process.env.N8N_WEBHOOK_SECRET;

    expect(n8nService.isConfigured()).toBe(false);
    expect(n8nService.getStatus().configured).toBe(false);
    expect(n8nService.getStatus().hasSecret).toBe(false);

    process.env.N8N_WEBHOOK_URL = "https://n8n.example.com/webhook/test";
    process.env.N8N_WEBHOOK_SECRET = "secret";

    expect(n8nService.isConfigured()).toBe(true);
    expect(n8nService.getStatus().hasSecret).toBe(true);
    expect(n8nService.getStatus().events).toContain("incident.created");

    process.env.N8N_WEBHOOK_URL = originalUrl;
    process.env.N8N_WEBHOOK_SECRET = originalSecret;
  });

  it("skips test event when webhook is not configured", async () => {
    const originalUrl = process.env.N8N_WEBHOOK_URL;
    delete process.env.N8N_WEBHOOK_URL;

    const result = await n8nService.sendTestEvent("ops@example.com");

    expect(result).toEqual({ skipped: true, reason: "n8n_not_configured" });

    process.env.N8N_WEBHOOK_URL = originalUrl;
  });

  it("exposes event catalog entries", () => {
    const catalog = n8nService.getEventCatalog();

    expect(catalog["incident.analyzed"].description).toBeTruthy();
    expect(catalog["system.test"].samplePayload).toBeTruthy();
  });
});
