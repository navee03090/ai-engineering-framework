import { describe, expect, it } from "vitest";

import {
  buildIncidentAnalyzedPayload,
  buildIncidentCreatedPayload,
  buildN8nEnvelope,
  buildTestPayload,
} from "@/lib/n8n/events";

describe("n8n event builders", () => {
  it("builds a standard webhook envelope", () => {
    const envelope = buildN8nEnvelope("system.test", { ok: true });

    expect(envelope.event).toBe("system.test");
    expect(envelope.payload).toEqual({ ok: true });
    expect(envelope.source).toBe("aef");
    expect(envelope.timestamp).toBeTruthy();
    expect(envelope.appName).toBeTruthy();
  });

  it("builds incident analyzed payload with critical flag", () => {
    const payload = buildIncidentAnalyzedPayload({
      id: "inc-1",
      title: "Landslide",
      category: "landslide",
      severity: "critical",
      summary: "Homes at risk.",
      recommendedAction: "Evacuate area.",
    });

    expect(payload.critical).toBe(true);
    expect(payload.incidentId).toBe("inc-1");
  });

  it("builds incident created payload", () => {
    const payload = buildIncidentCreatedPayload({
      id: "inc-2",
      title: "Flood",
      description: "Water rising fast.",
      location: "Swat",
    });

    expect(payload.title).toBe("Flood");
    expect(payload.location).toBe("Swat");
  });

  it("builds test payload with trigger user", () => {
    const payload = buildTestPayload("ops@example.com");

    expect(payload.triggeredBy).toBe("ops@example.com");
  });
});
