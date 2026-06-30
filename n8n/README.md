# n8n Workflows

Import workflows from `workflows/` into **n8n Cloud**.

Set `N8N_WEBHOOK_URL` in `.env.local` to connect the framework to your workflow entrypoint.

Optional: set `N8N_WEBHOOK_SECRET` for an `x-aef-webhook-secret` header on every webhook call.

## Workflows

| File | Purpose |
|------|---------|
| `incident-notification.json` | Created + analyzed incident routing |
| `critical-incident-alert.json` | High/critical severity branch |
| `attachment-received.json` | Evidence upload alerts |

See `templates/README.md` for envelope format and setup steps.

## Code integration

- `services/n8n.service.ts` — webhook delivery and event helpers
- `lib/n8n/` — event catalog, payload builders, client
- API: `GET /api/n8n/status`, `POST /api/n8n/test`, `POST /api/n8n/trigger`
