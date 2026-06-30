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
  const [sending, setSending] = useState(false);

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
    setSending(true);

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
      setSending(false);
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
              </div>
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
          <Button disabled={sending || loading} onClick={() => void handleTestEmail()}>
            {sending ? "Sending…" : "Send test email"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
