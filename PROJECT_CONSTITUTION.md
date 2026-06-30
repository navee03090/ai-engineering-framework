# AI Engineering Framework — Project Constitution

**Short name:** AEF  
**Version:** v1.0  
**Repository:** `ai-engineering-framework`

## Mission

AEF is a reusable engineering foundation for AI applications. Every new project — hackathons, SaaS, civic tech, disaster response — starts from this template instead of repeating setup.

## First consumer project

**Pakistan Disaster Response AI Command Center** validates the framework. If AEF supports multi-agent AI, OCR, vision, orchestration, uploads, email, n8n, and analytics for that project, it is mature enough for CivicAI and future systems.

## How to use this repository

1. Create a new repo from the **GitHub Template**.
2. Rename the repository for your product.
3. Copy `.env.example` → `.env.local` and configure services.
4. In Cursor, say: **"Read PROJECT_CONSTITUTION.md and follow it."**
5. Import UI from v0, then implement features in `services/`, `agents/`, and `app/`.

## Non-negotiable principles

| Principle | Rule |
|-----------|------|
| Modularity | Business logic in `services/`, not in React components or route handlers |
| AI isolation | Prompts in `prompts/`, agents in `agents/`, Gemini access via `lib/ai.ts` |
| Type safety | Zod at boundaries; typed Supabase client |
| Security | Service role key server-only; RLS enabled on all tables |
| Incremental delivery | One phase at a time — complete, test, document, commit |
| Production mindset | Error handling, logging, and validation from day one |

## Documentation map

| Document | Purpose |
|----------|---------|
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | TypeScript, React, and file conventions |
| [AI_RULES.md](./AI_RULES.md) | How Cursor and agents should use AI |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and folder responsibilities |
| [API_GUIDELINES.md](./API_GUIDELINES.md) | Route handlers and response contracts |
| [DATABASE_GUIDELINES.md](./DATABASE_GUIDELINES.md) | Supabase schema, RLS, migrations |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel, Supabase, env vars |
| [PROMPT_ENGINEERING.md](./PROMPT_ENGINEERING.md) | Prompt templates and composition |
| [AGENT_DESIGN.md](./AGENT_DESIGN.md) | Multi-agent patterns and orchestration |

## Sprint 1 scope (completed)

- Phase 1: Next.js foundation, shadcn/ui, Prettier, Husky, Vercel config
- Phase 2: Constitution, Cursor rules, engineering docs
- Phase 3: Folder structure and architecture scaffolding
- Phase 4: Supabase clients, migrations, seed, types
- Phase 5: Gemini infrastructure (`gemini.ts`, `ai.ts`, prompt manager, validators)

## Phase 6 (completed)

- Agent framework: `BaseAgent`, registry, orchestrator, memory
- Example agents: `summarizer`, `classifier`
- API: `GET /api/agents`, `POST /api/agents/run`, `POST /api/agents/pipeline`

## Phase 7 (completed)

- Prompt registry with versioning and required-variable validation
- Disaster prompt pack (`disaster.*`) and shared templates
- `buildAgentPromptBundle`, `resolveTemplate`, `GET /api/prompts`

## Remaining roadmap

Phases 8–15: Service layer, API framework, auth (email/password), file upload, Resend email, n8n Cloud, testing expansion, GitHub template publish.

## Cursor instruction

When starting work on any AEF-based project, read this file first, then the relevant guideline for the task at hand.
