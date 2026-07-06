# Phase 13 — n8n Cloud Integration

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Extract n8n into a dedicated service layer with typed events, webhook helpers, expanded workflows, and test APIs for n8n Cloud automation.

## Delivered

| Area                  | Implementation                                                           |
| --------------------- | ------------------------------------------------------------------------ |
| n8n client            | `lib/n8n/client.ts` — webhook delivery, optional secret header           |
| Event catalog         | `lib/n8n/events.ts` — payload builders + `N8N_EVENT_CATALOG`             |
| n8n service           | `services/n8n.service.ts` — status, trigger, incident/attachment helpers |
| Notification refactor | `notification.service.ts` delegates webhooks to `n8nService`             |
| API                   | `GET /api/n8n/status`, `POST /api/n8n/test`, `POST /api/n8n/trigger`     |
| Wiring                | Attachment upload fires `incident.attachment.uploaded` (best-effort)     |
| Workflows             | `critical-incident-alert.json`, `attachment-received.json`               |
| UI                    | Test webhook button on `/notifications`                                  |
| Docs                  | `n8n/templates/README.md`                                                |

## Events

| Event                          | When                        |
| ------------------------------ | --------------------------- |
| `incident.created`             | New incident submitted      |
| `incident.analyzed`            | AI analysis complete        |
| `incident.attachment.uploaded` | Evidence linked to incident |
| `system.test`                  | Manual connectivity check   |

## Webhook envelope

```json
{
  "event": "incident.analyzed",
  "payload": { "incidentId": "...", "critical": true },
  "timestamp": "2026-06-29T12:00:00.000Z",
  "source": "aef",
  "appName": "AI Engineering Framework",
  "environment": "development"
}
```

## Environment

```env
N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/...
N8N_WEBHOOK_SECRET=optional-shared-secret
```

When `N8N_WEBHOOK_SECRET` is set, AEF sends `x-aef-webhook-secret` on every webhook request.

## API examples

```bash
# Status + event catalog (authenticated)
curl http://localhost:3000/api/n8n/status -H "Cookie: <session>"

# Test webhook
curl -X POST http://localhost:3000/api/n8n/test -H "Cookie: <session>"

# Custom trigger
curl -X POST http://localhost:3000/api/n8n/trigger \
  -H "Content-Type: application/json" \
  -H "Cookie: <session>" \
  -d '{"event":"system.test","payload":{"message":"hello"}}'
```

## n8n Cloud setup

1. Import workflows from `n8n/workflows/`.
2. Activate a workflow and copy its production webhook URL.
3. Set `N8N_WEBHOOK_URL` in `.env.local`.
4. Sign in → **Notifications** → **Send test webhook**.

See `n8n/templates/README.md` for multi-workflow routing patterns.

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 14** — Testing & documentation expansion.
