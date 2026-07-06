# API middleware modules

Phase 9 centralizes API concerns in `lib/api/`:

| Module              | Purpose                          |
| ------------------- | -------------------------------- |
| `create-handler.ts` | `createApiHandler()` factory     |
| `rate-limit.ts`     | In-memory per-IP rate limiting   |
| `logger.ts`         | Structured request/response logs |
| `validation/`       | JSON body and query parsing      |
| `error-codes.ts`    | Shared API error codes           |

Next.js root `middleware.ts` remains responsible for Supabase session refresh.

Future: move route-specific guards here (API key auth, role checks).
