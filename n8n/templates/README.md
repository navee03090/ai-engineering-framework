# n8n Workflow Templates

Import JSON files from `../workflows/` into **n8n Cloud**.

## Recommended setup

| Workflow | Webhook path | Events handled |
|----------|--------------|----------------|
| `incident-notification.json` | `aef-incidents` | `incident.created`, `incident.analyzed` |
| `critical-incident-alert.json` | `aef-critical` | `incident.analyzed` when `payload.critical` is true |
| `attachment-received.json` | `aef-attachments` | `incident.attachment.uploaded` |

You can use **one webhook URL** for all events (single workflow with Switch node) or separate workflows per path. AEF sends all events to `N8N_WEBHOOK_URL`.

## Webhook envelope

Every POST body follows this shape:

```json
{
  "event": "incident.analyzed",
  "payload": { "incidentId": "...", "title": "...", "critical": true },
  "timestamp": "2026-06-29T12:00:00.000Z",
  "source": "aef",
  "appName": "AI Engineering Framework",
  "environment": "development"
}
```

## Optional secret header

Set `N8N_WEBHOOK_SECRET` in `.env.local`. AEF sends it as `x-aef-webhook-secret`. Validate in n8n with an IF node before processing.

## Test from the app

1. Set `N8N_WEBHOOK_URL` to your production webhook URL.
2. Sign in → **Notifications** → **Send test webhook**.
3. Confirm execution in n8n Cloud.

## Custom events

Use `POST /api/n8n/trigger` (authenticated) to send ad-hoc events during development.
