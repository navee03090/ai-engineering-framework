# Phase 9 — API Framework

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Standardize every API route with shared validation, logging, rate limiting, auth guards, and consistent error responses.

## Delivered

| Module                      | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `lib/api/create-handler.ts` | `createApiHandler()` route factory      |
| `lib/api/validation/`       | `parseJsonBody`, `parseQueryParams`     |
| `lib/api/rate-limit.ts`     | Per-IP in-memory rate limits            |
| `lib/api/logger.ts`         | Structured API request/response logs    |
| `lib/api/error-codes.ts`    | Shared error code constants             |
| `lib/api/index.ts`          | Single import surface for API utilities |

## `createApiHandler` features

- Zod body/query validation
- Optional `auth: true` guard
- Rate limit presets (`default`, `ai`, `auth`) or `rateLimit: false`
- `x-request-id` response header
- Automatic error mapping via `handleServiceRoute`

## Example route

```typescript
import { apiSuccess, createApiHandler } from "@/lib/api";
import { createIncidentSchema } from "@/lib/validations/incidents";
import { incidentService } from "@/services/incident.service";

export const POST = createApiHandler({
  route: "POST /api/incidents",
  bodySchema: createIncidentSchema,
  handler: async ({ body }) => {
    const incident = await incidentService.create(body);
    return apiSuccess({ incident }, { status: 201 });
  },
});
```

## Rate limits (per IP + route)

| Preset    | Window | Max |
| --------- | ------ | --- |
| `default` | 60s    | 60  |
| `ai`      | 60s    | 10  |
| `auth`    | 60s    | 20  |

Returns `429 RATE_LIMITED` when exceeded.

> Note: In-memory limits apply per server instance (adequate for template/dev; use Redis for multi-instance production).

## Breaking change

`GET /api/health` now uses the standard envelope:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "framework": "AI Engineering Framework"
  }
}
```

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 10 — Authentication UI:** login/signup pages, protected routes, session-aware layouts.
