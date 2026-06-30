# API Guidelines

## Route structure

- Place handlers in `app/api/<resource>/route.ts`.
- Export named HTTP method functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Use `createApiHandler()` from `lib/api`** for all new and updated routes.

## Standard handler pattern

```typescript
import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { mySchema } from "@/lib/validations/my-feature";
import { myService } from "@/services/my.service";

export const POST = createApiHandler({
  route: "POST /api/my-resource",
  rateLimit: RATE_LIMITS.default,
  auth: true, // optional
  bodySchema: mySchema,
  handler: async ({ body, user, params }) => {
    const result = await myService.create(body, user!.id);
    return apiSuccess({ result }, { status: 201 });
  },
});
```

## Response contract

Use helpers from `lib/api/responses.ts`:

```typescript
return apiSuccess({ id: "123" });
return apiError("Invalid input", 400, "VALIDATION_ERROR");
```

Every successful `createApiHandler` response includes `x-request-id`.

## Validation

- JSON body: `bodySchema` on `createApiHandler` (uses `parseJsonBody`).
- Query params: `querySchema` on `createApiHandler` (uses `parseQueryParams`).
- Do not call `request.json()` directly in route files.

## Authentication

- Set `auth: true` on routes that require a logged-in user.
- Services remain the place for business authorization rules.

## Rate limiting

| Preset | Use for |
|--------|---------|
| `RATE_LIMITS.default` | General CRUD |
| `RATE_LIMITS.ai` | Agent/AI/analyze routes |
| `RATE_LIMITS.auth` | Signup/signin/signout |
| `rateLimit: false` | Health checks |

## Service layer

```text
createApiHandler → services/ → Supabase / Gemini / Resend / n8n
```

Never call external services directly from route handlers.

## AI routes

- Keep routes thin; call `services/ai.service.ts`.
- Use `RATE_LIMITS.ai`.
- Never expose raw model errors to clients — logs capture details server-side.

## Health endpoints

| Route | Purpose |
|-------|---------|
| `GET /api/health` | Framework + env configuration status |
| `POST /api/ai/health` | Live Gemini structured response test |
| `GET /api/agents` | List registered agents |
| `POST /api/agents/run` | Run a single agent |
| `POST /api/agents/pipeline` | Run sequential agent pipeline |
| `GET /api/prompts` | List prompt template metadata (`?tag=disaster`) |
| `POST /api/auth/signup` | Register with email/password |
| `POST /api/auth/signin` | Sign in |
| `GET /api/incidents` | List incidents |
| `POST /api/incidents` | Create incident |
| `POST /api/incidents/[id]/analyze` | AI analyze + persist |
| `POST /api/uploads` | Upload file (multipart) |
| `GET /api/uploads?folder=incidents` | List user uploads |
| `POST /api/incidents/[id]/attachments` | Link file to incident |
| `GET /api/notifications/status` | Email + n8n channel status |
| `POST /api/notifications/test` | Test email to signed-in user |
| `GET /api/n8n/status` | n8n webhook config + event catalog |
| `POST /api/n8n/test` | Fire `system.test` webhook |
| `POST /api/n8n/trigger` | Custom n8n event |

See [docs/API-REFERENCE.md](./docs/API-REFERENCE.md) for the full route list.

## Logging

- `lib/api/logger.ts` logs request id, route, status, and duration.
- Do not log passwords, tokens, or full prompts with PII.

See [docs/PHASE-9.md](./docs/PHASE-9.md).
