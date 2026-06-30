import { describe, expect, it } from "vitest";

import {
  renderIncidentAnalyzedEmail,
  renderIncidentCreatedEmail,
  renderTestEmail,
} from "@/lib/email/templates";

describe("email templates", () => {
  it("renders incident analyzed template", () => {
    const email = renderIncidentAnalyzedEmail({
      incidentId: "inc-1",
      title: "Flash flood",
      category: "flood",
      severity: "high",
      summary: "Roads blocked near Mingora.",
      recommendedAction: "Deploy rescue teams.",
    });

    expect(email.subject).toContain("Flash flood");
    expect(email.html).toContain("inc-1");
    expect(email.text).toContain("Deploy rescue teams");
  });

  it("renders incident created template", () => {
    const email = renderIncidentCreatedEmail({
      incidentId: "inc-2",
      title: "Landslide",
      location: "Swat",
      description: "Multiple homes affected.",
    });

    expect(email.subject).toContain("Landslide");
    expect(email.html).toContain("Swat");
    expect(email.text).toContain("Multiple homes affected");
  });

  it("renders test email template", () => {
    const email = renderTestEmail({ recipientName: "Ops" });

    expect(email.subject).toContain("Test notification");
    expect(email.html).toContain("Ops");
  });
});
