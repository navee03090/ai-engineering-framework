# API Guidelines

## Route structure

- Place handlers in `app/api/<resource>/route.ts`.
- Export named HTTP method functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.

## Response contract

Use helpers from `lib/api/responses.ts`:

```typescript
// Success
return apiSuccess({ id: "123" });

// Error
return apiError("Invalid input", 400, "VALIDATION_ERROR");
```

## Validation

1. Parse `request.json()` or search params.
2. Validate with Zod.
3. Return `400` with clear messages on failure.

## Authentication (Phase 10+)

- Read session via `lib/supabase/server.ts`.
- Return `401` when unauthenticated; `403` when unauthorized.

## AI routes

- Keep routes thin; call `lib/ai.ts` or `services/ai.service.ts`.
- Return `503` when `GEMINI_API_KEY` is missing.
- Never expose raw model errors to clients — log server-side.

## Health endpoints

| Route | Purpose |
|-------|---------|
| `GET /api/health` | Framework + env configuration status |
| `POST /api/ai/health` | Live Gemini structured response test |

## Logging

- Log errors with context (route name, user id if available).
- Do not log passwords, tokens, or full prompts with PII.
