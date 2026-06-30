"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NotificationStatus } from "@/services/notification.service";

type NotificationPanelProps = {
  initialStatus: NotificationStatus;
};

export function NotificationPanel({ initialStatus }: NotificationPanelProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWebhook, setSendingWebhook] = useState(false);

  async function loadStatus() {
    setLoading(true);

    try {
      const response = await fetch("/api/notifications/status");
      const body = await response.json();

      if (body.success) {
        setStatus(body.data.status);
      } else {
        toast.error(body.error?.message ?? "Failed to load notification status");
      }
    } catch {
      toast.error("Failed to load notification status");
    } finally {
      setLoading(false);
    }
  }

  async function handleTestEmail() {
    setSendingEmail(true);

    try {
      const response = await fetch("/api/notifications/test", { method: "POST" });
      const body = await response.json();

      if (!body.success) {
        toast.error(body.error?.message ?? "Test email failed");
        return;
      }

      if (body.data.result?.skipped) {
        toast.message("Email skipped", {
          description: body.data.result.reason ?? "Resend is not configured",
        });
        return;
      }

      toast.success(`Test email sent to ${body.data.sentTo}`);
    } catch {
      toast.error("Test email failed");
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleTestWebhook() {
    setSendingWebhook(true);

    try {
      const response = await fetch("/api/n8n/test", { method: "POST" });
      const body = await response.json();

      if (!body.success) {
        toast.error(body.error?.message ?? "n8n test failed");
        return;
      }

      if (body.data.result?.skipped) {
        toast.message("n8n skipped", {
          description: "N8N_WEBHOOK_URL is not configured",
        });
        return;
      }

      toast.success(`n8n webhook delivered (${body.data.result.status})`);
    } catch {
      toast.error("n8n test failed");
    } finally {
      setSendingWebhook(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Channel status</CardTitle>
          <CardDescription>
            Resend email and n8n webhook configuration from environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading status…</p>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">Email (Resend)</span>
                <Badge variant={status.email.configured ? "default" : "secondary"}>
                  {status.email.configured ? "Configured" : "Not configured"}
                </Badge>
              </div>
              {status.email.fromEmail ? (
                <p className="text-muted-foreground">From: {status.email.fromEmail}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">n8n webhook</span>
                <Badge variant={status.n8n.configured ? "default" : "secondary"}>
                  {status.n8n.configured ? "Configured" : "Not configured"}
                </Badge>
                {status.n8n.hasSecret ? (
                  <Badge variant="outline">Secret header enabled</Badge>
                ) : null}
              </div>
              {status.n8n.configured ? (
                <p className="text-muted-foreground">
                  Events: {status.n8n.events.join(", ")}
                </p>
              ) : null}
              <p className="text-muted-foreground">
                Active channels:{" "}
                {status.availableChannels.length > 0
                  ? status.availableChannels.join(", ")
                  : "none"}
              </p>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => void loadStatus()}>
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send test email</CardTitle>
          <CardDescription>
            Sends a template test message to your signed-in account email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled={sendingEmail || loading} onClick={() => void handleTestEmail()}>
            {sendingEmail ? "Sending…" : "Send test email"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send test n8n webhook</CardTitle>
          <CardDescription>
            Fires a <code className="text-xs">system.test</code> event to your n8n Cloud workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            disabled={sendingWebhook || loading}
            onClick={() => void handleTestWebhook()}
          >
            {sendingWebhook ? "Sending…" : "Send test webhook"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Import workflows from <code>n8n/workflows/</code> and set{" "}
            <code>N8N_WEBHOOK_URL</code> in <code>.env.local</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
