# Phase 8 — Service Layer

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Move business logic into `services/` so API routes stay thin and reusable across Server Actions, agents, and future v0 UI.

## Delivered services

| Service | File | Responsibility |
|---------|------|----------------|
| AI | `services/ai.service.ts` | Agent runs, pipelines, incident analysis |
| Auth | `services/auth.service.ts` | Email/password via Supabase Auth |
| Incident | `services/incident.service.ts` | Incident CRUD + AI persistence |
| Storage | `services/storage.service.ts` | Supabase Storage uploads |
| Email | `services/email.service.ts` | Resend transactional email |
| Notification | `services/notification.service.ts` | Email + n8n webhook notifications |

## API routes (thin handlers)

| Method | Route | Service |
|--------|-------|---------|
| `GET` | `/api/agents` | `aiService.listAgents` |
| `POST` | `/api/agents/run` | `aiService.runAgent` |
| `POST` | `/api/agents/pipeline` | `aiService.runPipeline` |
| `POST` | `/api/auth/signup` | `authService.signUp` |
| `POST` | `/api/auth/signin` | `authService.signIn` |
| `POST` | `/api/auth/signout` | `authService.signOut` |
| `GET` | `/api/auth/session` | `authService.getSession` |
| `GET` | `/api/incidents` | `incidentService.list` |
| `POST` | `/api/incidents` | `incidentService.create` |
| `GET` | `/api/incidents/[id]` | `incidentService.getById` |
| `POST` | `/api/incidents/[id]/analyze` | `incidentService.analyzeAndPersist` |

Shared route helper: `lib/api/handle-route.ts` maps `AppError` and Zod errors to API responses.

## Database

Run migration after Sprint 1 schema:

```sql
-- supabase/migrations/00002_incidents.sql
```

Adds `public.incidents` with RLS for authenticated users.

## Example — create and analyze incident

```bash
# Create
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Flash flood Swat",
    "description": "Roads blocked near Mingora. Families stranded on rooftops.",
    "location": "Swat, KP"
  }'

# Analyze (requires GEMINI_API_KEY + migration applied)
curl -X POST http://localhost:3000/api/incidents/<id>/analyze
```

## Architecture rule

```text
API route → service → Supabase / Gemini / Resend / n8n
```

Never call Gemini or Supabase directly from route handlers or React components.

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 9 — API Framework:** expanded middleware, logging, rate limits, and shared validation utilities.
