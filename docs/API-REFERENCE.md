# API Reference

**AEF v1.0** — All HTTP routes. Every successful response uses `{ success: true, data: ... }` unless noted.

## Response envelope

```json
{
  "success": true,
  "data": {}
}
```

Errors:

```json
{
  "success": false,
  "error": { "message": "...", "code": "VALIDATION_ERROR" }
}
```

All `createApiHandler` responses include header `x-request-id`.

---

## Health & framework

| Method | Path          | Auth | Description                         |
| ------ | ------------- | ---- | ----------------------------------- |
| GET    | `/api/health` | No   | Framework status, env configuration |

---

## AI & agents

| Method | Path                   | Auth | Rate limit | Description                          |
| ------ | ---------------------- | ---- | ---------- | ------------------------------------ |
| POST   | `/api/ai/health`       | No   | AI         | Live Gemini structured response test |
| GET    | `/api/agents`          | No   | default    | List registered agents               |
| POST   | `/api/agents/run`      | No   | AI         | Run single agent                     |
| POST   | `/api/agents/pipeline` | No   | AI         | Run agent pipeline                   |

### POST `/api/agents/run`

```json
{
  "agent": "summarizer",
  "input": { "content": "...", "audience": "ops", "maxWords": 100 }
}
```

### POST `/api/agents/pipeline`

```json
{ "pipeline": "incident-analysis", "input": { "description": "..." } }
```

---

## Prompts

| Method | Path           | Auth | Description                   |
| ------ | -------------- | ---- | ----------------------------- |
| GET    | `/api/prompts` | No   | List prompt template metadata |

Query: `?tag=disaster`

---

## Authentication

| Method | Path                | Auth | Rate limit | Description             |
| ------ | ------------------- | ---- | ---------- | ----------------------- |
| POST   | `/api/auth/signup`  | No   | auth       | Register email/password |
| POST   | `/api/auth/signin`  | No   | auth       | Sign in                 |
| POST   | `/api/auth/signout` | No   | auth       | Sign out                |
| GET    | `/api/auth/session` | No   | default    | Current session         |

### POST `/api/auth/signin`

```json
{ "email": "user@example.com", "password": "secret" }
```

---

## Incidents

| Method | Path                              | Auth | Description                             |
| ------ | --------------------------------- | ---- | --------------------------------------- |
| GET    | `/api/incidents`                  | No   | List incidents                          |
| POST   | `/api/incidents`                  | No   | Create incident (notifies if signed in) |
| GET    | `/api/incidents/[id]`             | No   | Get incident by ID                      |
| POST   | `/api/incidents/[id]/analyze`     | No   | AI analyze + persist + notify           |
| POST   | `/api/incidents/[id]/notify`      | Yes  | Manual notification                     |
| GET    | `/api/incidents/[id]/attachments` | Yes  | List attachments                        |
| POST   | `/api/incidents/[id]/attachments` | Yes  | Link upload to incident                 |

### POST `/api/incidents`

```json
{
  "title": "Flash flood",
  "description": "Roads blocked near Mingora, multiple families stranded.",
  "location": "Swat"
}
```

### POST `/api/incidents/[id]/attachments`

```json
{
  "storagePath": "user-id/incidents/file.jpg",
  "fileName": "file.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 102400
}
```

---

## Uploads

| Method | Path           | Auth | Description               |
| ------ | -------------- | ---- | ------------------------- |
| POST   | `/api/uploads` | Yes  | Multipart file upload     |
| GET    | `/api/uploads` | Yes  | List folder or signed URL |
| DELETE | `/api/uploads` | Yes  | Delete file by path       |

### POST `/api/uploads`

`multipart/form-data`: `file`, optional `folder` (`general` | `incidents` | `avatars`)

### GET `/api/uploads`

- `?folder=incidents` — list files
- `?path=user-id/incidents/file.jpg` — signed URL

---

## Notifications (email)

| Method | Path                        | Auth | Description                       |
| ------ | --------------------------- | ---- | --------------------------------- |
| GET    | `/api/notifications/status` | Yes  | Email + n8n channel status        |
| POST   | `/api/notifications/test`   | Yes  | Send test email to signed-in user |
| POST   | `/api/notifications/send`   | Yes  | Custom multi-channel notification |

### POST `/api/notifications/send`

```json
{
  "channels": ["email"],
  "email": {
    "to": "ops@example.com",
    "subject": "Alert",
    "html": "<p>Message</p>"
  }
}
```

---

## n8n automation

| Method | Path               | Auth | Description                    |
| ------ | ------------------ | ---- | ------------------------------ |
| GET    | `/api/n8n/status`  | Yes  | Webhook config + event catalog |
| POST   | `/api/n8n/test`    | Yes  | Fire `system.test` event       |
| POST   | `/api/n8n/trigger` | Yes  | Custom webhook event           |

### POST `/api/n8n/trigger`

```json
{
  "event": "system.test",
  "payload": { "message": "hello" }
}
```

### Webhook envelope (sent to n8n)

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

**Events:** `incident.created`, `incident.analyzed`, `incident.attachment.uploaded`, `system.test`

---

## Protected pages

| Path                | Description                    |
| ------------------- | ------------------------------ |
| `/dashboard`        | Command center                 |
| `/uploads`          | File upload UI                 |
| `/notifications`    | Email + n8n test panel         |
| `/login`, `/signup` | Auth (redirect when signed in) |

---

## Error codes

| Code                | HTTP | Meaning                   |
| ------------------- | ---- | ------------------------- |
| `VALIDATION_ERROR`  | 400  | Zod / input failed        |
| `UNAUTHORIZED`      | 401  | Auth required             |
| `RATE_LIMITED`      | 429  | Too many requests         |
| `AI_UNAVAILABLE`    | 503  | Missing `GEMINI_API_KEY`  |
| `EMAIL_UNAVAILABLE` | 503  | Missing Resend config     |
| `N8N_UNAVAILABLE`   | 503  | Missing `N8N_WEBHOOK_URL` |

See `lib/api/error-codes.ts` for the full list.

---

## Related

- [API_GUIDELINES.md](../API_GUIDELINES.md) — patterns for new routes
- Phase docs: `PHASE-6.md` through `PHASE-13.md`
