# Architecture

## Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   app/      │────▶│  services/   │────▶│  Supabase   │
│  (routes)   │     │  (logic)     │     │  / Storage  │
└──────┬──────┘     └──────┬───────┘     └─────────────┘
       │                   │
       │            ┌──────▼───────┐     ┌─────────────┐
       │            │   agents/    │────▶│   Gemini    │
       │            │ (orchestrate)│     │   (lib/ai)  │
       │            └──────┬───────┘     └─────────────┘
       │                   │
       ▼            ┌──────▼───────┐
┌─────────────┐     │   prompts/   │
│ components/ │     │  (templates) │
└─────────────┘     └──────────────┘
```

## Folder responsibilities

| Folder | Responsibility |
|--------|----------------|
| `app/` | Routes, layouts, API route handlers (thin) |
| `components/` | Reusable UI; `components/ui/` = shadcn |
| `hooks/` | Client-side React hooks |
| `services/` | Business logic, external integrations |
| `agents/` | Multi-agent orchestration (Phase 6+) |
| `prompts/` | Prompt templates |
| `lib/` | Shared utilities, AI, Supabase, API helpers |
| `database/` | Query helpers, DB documentation |
| `supabase/` | SQL migrations and seeds |
| `types/` | Shared TypeScript types |
| `middleware/` | Additional middleware modules |
| `middleware.ts` | Next.js entry — session refresh |
| `n8n/` | Workflow exports and docs |
| `tests/` | Vitest + Playwright |
| `docs/` | Supplementary documentation |

## Data flow

1. **Request** enters `app/api/*` or Server Action.
2. **Validate** input with Zod.
3. **Service** executes business logic.
4. **Agent** (if needed) coordinates AI steps.
5. **Response** via standard API helpers.

## Supabase clients

| Client | File | Use |
|--------|------|-----|
| Browser | `lib/supabase/client.ts` | Client components |
| Server | `lib/supabase/server.ts` | Server Components, actions, routes |
| Admin | `lib/supabase/admin.ts` | Trusted server-only operations |

## Environment

Configuration via `.env.local` (see `.env.example`). Never commit secrets.
