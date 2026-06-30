# AI Engineering Framework (AEF) v1.0

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge)](https://github.com/navee03090/ai-engineering-framework/generate)

Reusable foundation for AI applications — Next.js, Supabase, Gemini, shadcn/ui, multi-agent architecture, and engineering docs built in.

**All 15 phases complete.** Use as your GitHub template for hackathons, SaaS, civic tech, and disaster response projects.

## New project (one-click)

1. Click **[Use this template](https://github.com/navee03090/ai-engineering-framework/generate)** on GitHub.
2. Clone your new repo, then:

```bash
npm install
npm run setup -- --name "Your Product Name"
```

3. Configure `.env.local`, run Supabase migrations, `npm run dev`.

Full checklist: **[docs/TEMPLATE-SETUP.md](./docs/TEMPLATE-SETUP.md)**

## Quick start (this repo)

```bash
cp .env.example .env.local   # or: npm run setup
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's included

| Layer | Stack |
|-------|--------|
| App | Next.js 16, TypeScript, Tailwind v4, shadcn/ui |
| Data | Supabase (auth, Postgres, storage, RLS) |
| AI | Google Gemini `gemini-2.5-flash`, agents, prompts |
| Integrations | Resend email, n8n webhooks |
| Engineering | Constitution, Cursor rules, API framework, docs |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Copy `.env.local`, optional `--name` for app title |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

## Configuration

1. Create a **new** Supabase project.
2. Run all migrations in `supabase/migrations/` (00001 → 00003).
3. Add keys to `.env.local` (see `.env.example`).
4. Optional: Resend, n8n — see [docs/PHASE-12.md](./docs/PHASE-12.md) and [docs/PHASE-13.md](./docs/PHASE-13.md).

## Documentation

| Doc | Purpose |
|-----|---------|
| [TEMPLATE-SETUP.md](./docs/TEMPLATE-SETUP.md) | New project from template |
| [V0-IMPORT-GUIDE.md](./docs/V0-IMPORT-GUIDE.md) | Import v0 UI safely |
| [API-REFERENCE.md](./docs/API-REFERENCE.md) | All HTTP routes |
| [PROJECT_CONSTITUTION.md](./PROJECT_CONSTITUTION.md) | Rules and architecture |

Phase deliverables: `docs/PHASE-6.md` through `docs/PHASE-15.md`

## Cursor workflow

> Read PROJECT_CONSTITUTION.md and follow it.

## First consumer example

**Pakistan Disaster Response AI Command Center** — validates multi-agent AI, uploads, orchestration, email, and n8n for CivicAI-style systems.

## License

Private template — adjust for your organization.
