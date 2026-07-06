# Phase 12 — Email & Notifications

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Harden Resend email delivery with reusable templates, expand the notification service for incident alerts, and expose status/test APIs plus a protected UI.

## Delivered

| Area                 | Implementation                                                        |
| -------------------- | --------------------------------------------------------------------- |
| Email templates      | `lib/email/templates.ts` — analyzed, created, test                    |
| Email service        | `sendTemplate()`, `getStatus()`                                       |
| Notification service | Channel auto-detection, incident created/analyzed alerts, n8n payload |
| API                  | `GET /api/notifications/status`                                       |
| API                  | `POST /api/notifications/test`                                        |
| API                  | `POST /api/notifications/send`                                        |
| API                  | `POST /api/incidents/[id]/notify`                                     |
| UI                   | `/notifications` + `NotificationPanel`                                |
| n8n starter          | `n8n/workflows/incident-notification.json`                            |
| Wiring               | Create/analyze incident routes send best-effort notifications         |

## Email templates

| Template ID         | Use case                                                |
| ------------------- | ------------------------------------------------------- |
| `incident.analyzed` | After AI analysis (category, severity, summary, action) |
| `incident.created`  | New incident submitted                                  |
| `system.test`       | Resend configuration check                              |

## Environment

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
N8N_WEBHOOK_URL=
NEXT_PUBLIC_APP_NAME=AI Engineering Framework
```

## API examples

```bash
# Channel status (authenticated)
curl http://localhost:3000/api/notifications/status \
  -H "Cookie: <session>"

# Send test email to signed-in user
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Cookie: <session>"

# Manual incident notification
curl -X POST http://localhost:3000/api/incidents/<id>/notify \
  -H "Content-Type: application/json" \
  -H "Cookie: <session>" \
  -d '{"channels":["email"]}'

# Custom notification
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Cookie: <session>" \
  -d '{
    "channels": ["email"],
    "email": {
      "to": "ops@example.com",
      "subject": "Alert",
      "html": "<p>Custom alert</p>"
    }
  }'
```

## n8n

1. Import `n8n/workflows/incident-notification.json` into n8n Cloud.
2. Activate the workflow and copy the webhook URL.
3. Set `N8N_WEBHOOK_URL` in `.env.local`.

Events: `incident.created`, `incident.analyzed` (payload includes severity and `critical` flag for high/critical).

## UI

- Protected page: `/notifications`
- Dashboard link: **Open notifications**
- Test email sends to the signed-in user's address

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 13** — Full n8n Cloud integration (workflow helpers, expanded templates).
