# AI Engineering Framework (AEF) v1.0

Reusable foundation for AI applications — Next.js, Supabase, Gemini, shadcn/ui, and engineering docs built in.

## Quick start

```bash
cd ai-engineering-framework
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sprint 1 includes

- **Phase 1:** Next.js 16, TypeScript, Tailwind v4, shadcn/ui, Prettier, Husky, Vercel config
- **Phase 2:** `PROJECT_CONSTITUTION.md`, Cursor rules, engineering documentation
- **Phase 3:** Folder structure (`services/`, `agents/`, `prompts/`, `database/`, `n8n/`, etc.)
- **Phase 4:** Supabase browser/server/admin clients, migrations, seed, types
- **Phase 5:** Gemini (`gemini-2.5-flash`), `lib/ai.ts`, prompt manager, JSON parser, validators

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

## Configuration

1. Create a **new** Supabase project.
2. Run `supabase/migrations/00001_init.sql`.
3. Add keys to `.env.local` (see `.env.example`).
4. Add `GEMINI_API_KEY` for AI routes.

## Health checks

- `GET /api/health` — framework status
- `POST /api/ai/health` — Gemini structured response (requires API key)

## Cursor workflow

Start each session with:

> Read PROJECT_CONSTITUTION.md and follow it.

Rules in `.cursor/rules/` load automatically.

## New project from template

1. Use this repo as a **GitHub Template**.
2. Create a new repository (e.g. `pakistan-disaster-ai`).
3. `npm install`, configure `.env.local`, import UI from v0, build features.

## First consumer

**Pakistan Disaster Response AI Command Center** — validates multi-agent AI, OCR, vision, orchestration, uploads, and notifications.

## License

Private template — adjust for your organization.
