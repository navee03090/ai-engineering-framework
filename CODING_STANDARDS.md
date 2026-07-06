# Coding Standards

## TypeScript

- Strict mode is enabled — do not use `any` without justification.
- Prefer `type` for unions and props; use `interface` for extendable object shapes.
- Export types from `types/` when shared across modules.

## React & Next.js

- Use **App Router** and Server Components by default.
- Add `"use client"` only when hooks, browser APIs, or event handlers are required.
- Keep components presentational; call `services/` from server actions or route handlers.
- Use `@/` import alias consistently.

## File naming

| Kind       | Convention                  | Example                   |
| ---------- | --------------------------- | ------------------------- |
| Components | PascalCase                  | `IncidentCard.tsx`        |
| Hooks      | camelCase with `use` prefix | `useIncidents.ts`         |
| Services   | `*.service.ts`              | `auth.service.ts`         |
| Agents     | camelCase                   | `orchestrator.ts`         |
| Prompts    | `*.prompt.ts`               | `system.prompt.ts`        |
| API routes | `route.ts` in folder        | `app/api/health/route.ts` |

## Styling

- Tailwind CSS + shadcn/ui components from `components/ui/`.
- Use `cn()` from `lib/utils.ts` for conditional classes.
- No inline styles unless dynamic values require it.

## Validation

- All external input validated with **Zod** schemas in `lib/validations.ts` or feature-specific schema files.
- Shared schemas are reused across API routes and forms.

## Error handling

- Throw `AppError` from `lib/api/errors.ts` in services.
- Route handlers return `apiSuccess` / `apiError` from `lib/api/responses.ts`.

## Formatting

- Prettier for formatting; ESLint for linting.
- Run `npm run format` before committing.

## Comments

- Code should be self-explanatory.
- Comment only non-obvious business rules or security constraints.
