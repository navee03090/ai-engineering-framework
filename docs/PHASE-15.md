# Phase 15 — GitHub Template & One-Click Setup

**Status:** Complete  
**Version:** AEF v1.0 (all 15 phases delivered)

## Goal

Polish the repository as a publishable GitHub template with a local setup script and clear new-project documentation.

## Delivered

| Area           | Implementation                                                      |
| -------------- | ------------------------------------------------------------------- |
| Setup script   | `npm run setup` → `scripts/setup.mjs`                               |
| Template guide | `docs/TEMPLATE-SETUP.md` — GitHub generate, env, migrations, deploy |
| README         | Template badge + quick path for new repos                           |
| Home page      | v1.0 complete, template CTA, feature grid updated                   |
| Deployment     | `DEPLOYMENT.md` updated for all migrations + template enable        |
| Docs UI        | `/docs` lists template setup + Phase 15                             |
| Health         | `GET /api/health` reports `phase: 15`                               |

## One-click workflow

```text
GitHub "Use this template"
    → clone → npm install → npm run setup
    → configure .env.local → run migrations → npm run dev
    → import v0 UI → build product features in services/
```

## GitHub template enable (repo owner)

**Settings → General → Template repository** → enable.

Template URL: `https://github.com/navee03090/ai-engineering-framework/generate`

## Verification

```bash
npm run lint
npm run test
npm run build
```

## AEF v1.0 complete

Phases 1–15 delivered. Use this template as the foundation for Pakistan Disaster Response AI and future projects.
