# v0 Import Guide

How to bring a **v0** frontend design into an **AI Engineering Framework (AEF)** project without breaking architecture, Supabase, or Gemini setup.

## Mental model

| Layer | Source | Location |
|-------|--------|----------|
| Framework (Next.js, Supabase, Gemini, rules) | AEF template | `lib/`, `services/`, `agents/`, `prompts/` |
| Visual design (layouts, screens, widgets) | v0 | `app/`, `components/<feature>/` |
| Business logic & integrations | You (or Cursor) | `services/`, `app/api/`, Server Actions |

**v0 = UI only.** AEF = engine. Never replace the whole repository with a v0 export.

---

## Prerequisites

- AEF Sprint 1+ is working locally (`npm run dev`, `npm run build`).
- Repository created from the AEF template (or cloned `ai-engineering-framework`).
- v0 design exported as **Next.js App Router + TypeScript**.

For product work (e.g. Pakistan Disaster Response AI), use a **new repo from the template**, not the raw template repo itself.

---

## Step 1 — Create the product repository

See **[TEMPLATE-SETUP.md](./TEMPLATE-SETUP.md)** for the full checklist.

1. On GitHub, click **Use this template** on `ai-engineering-framework`.
2. Name the new repo (e.g. `pakistan-disaster-ai`).
3. Clone and install:

```bash
git clone https://github.com/YOUR_USERNAME/pakistan-disaster-ai.git
cd pakistan-disaster-ai
npm install
npm run setup -- --name "Pakistan Disaster Response AI"
```

Configure Supabase and Gemini in `.env.local` before wiring data.

---

## Step 2 — Design in v0

In v0, build screens for your product:

- Landing / marketing pages
- Dashboard / command center
- Forms (incident report, login UI shell)
- Tables, cards, sidebars, modals

**Tips for smoother import:**

- Prefer layouts that match shadcn/ui (AEF already includes the full component set).
- Export **App Router** code, not Pages Router.
- One v0 block per screen or feature when possible — easier to merge.

---

## Step 3 — Export from v0

From v0, copy or download:

- Page files (`page.tsx`, layouts)
- Feature components (not entire `lib/` or config)
- Any **new** dependencies listed in the export notes

Do **not** export or overwrite:

- `package.json` (merge dependencies manually instead)
- `lib/`, `middleware.ts`, `supabase/`
- `PROJECT_CONSTITUTION.md`, `.cursor/rules/`
- `.env.example`

---

## Step 4 — Copy files into AEF (merge strategy)

Use **feature folders** so v0 code stays isolated:

```text
app/
├── page.tsx                          # keep or update landing only
├── (dashboard)/                      # NEW — v0 dashboard group
│   └── command-center/
│       └── page.tsx
├── (auth)/                           # NEW — v0 auth UI shells (logic in services later)
│   └── login/
│       └── page.tsx

components/
├── ui/                               # KEEP AEF shadcn — do not replace blindly
└── disaster/                         # NEW — v0 feature components
    ├── IncidentForm.tsx
    ├── CommandCenterHeader.tsx
    └── StatsGrid.tsx
```

### Merge rules

| v0 file | Action |
|---------|--------|
| New page under `app/` | Add in route group, e.g. `app/(dashboard)/...` |
| New feature component | `components/<feature>/` |
| Duplicate `components/ui/*` | **Keep AEF version** unless you intentionally need v0’s variant |
| New npm package | Add with `npm install <pkg>` — don’t paste v0’s whole `package.json` |
| `globals.css` changes | Merge tokens carefully into `app/globals.css` |

---

## Step 5 — Fix imports and dependencies

1. Ensure imports use the `@/` alias (AEF standard).
2. Install any new packages v0 requires:

```bash
npm install <package>
```

3. Verify:

```bash
npm run lint
npm run build
```

Fix missing components by using AEF’s existing `components/ui/` set before adding duplicates.

---

## Step 6 — Wire UI to the service layer

v0 components are presentational until connected.

### Target architecture

```text
v0 Component (UI)
    → Server Action or fetch('/api/...')
        → services/*.service.ts
            → Supabase / Gemini / n8n / Resend
```

### Wiring checklist

| UI element | Connect to |
|------------|------------|
| Login / signup form | `services/auth.service.ts` + Supabase Auth (Phase 10) |
| Data tables / dashboards | Server Components loading from `services/` |
| Submit incident form | `services/incident.service.ts` → Supabase |
| “Analyze with AI” button | `services/ai.service.ts` → `lib/ai.ts` / `agents/` |
| File upload dropzone | `services/storage.service.ts` → Supabase Storage |
| Send notification | `services/notification.service.ts` → Resend / n8n |

### Do not

- Call `createClient()` from Supabase inside every v0 component — use services or Server Components.
- Put `GEMINI_API_KEY` or prompts inside UI files.
- Put long business logic in `components/disaster/*.tsx`.

---

## Step 7 — Cursor prompt after import

Paste this in Cursor after copying v0 files:

```text
Read PROJECT_CONSTITUTION.md and follow it.

I imported v0 UI into:
- app/(dashboard)/...
- components/<feature>/...

Tasks:
1. Fix any build/lint errors from the import.
2. Do not replace components/ui/ unless required.
3. Wire [specific screen] to services/ and Supabase/Gemini using the AEF patterns.
4. Keep all business logic in services/, not in components.
```

Replace paths and screen names for your project.

---

## Step 8 — Test before commit

```bash
npm run dev          # visual check
npm run lint
npm run test
npm run build
```

Manual checks:

- [ ] Routes load without 404
- [ ] No duplicate shadcn components causing style drift
- [ ] Forms submit to real API/service (not mock-only)
- [ ] Secrets stay in `.env.local` only

---

## Pakistan Disaster Response AI — example map

| v0 screen | AEF path | Backend (phases) |
|-----------|----------|------------------|
| Command center dashboard | `app/(dashboard)/command-center/page.tsx` | Incident service + Supabase |
| Incident report form | `components/disaster/IncidentForm.tsx` | `incident.service.ts` |
| Media upload | `components/disaster/MediaUpload.tsx` | Storage + vision agent |
| AI summary panel | `components/disaster/AiSummary.tsx` | `agents/orchestrator.ts` + Gemini |
| Alert / toast feedback | Use AEF `sonner` in layout | `notification.service.ts` |

---

## Common problems

| Problem | Fix |
|---------|-----|
| “Module not found” for UI component | Import from `@/components/ui/...` (AEF already has it) |
| Styles look wrong | Merge `globals.css` tokens; avoid replacing entire file |
| Two Button/Card implementations | Delete v0 duplicate; keep `components/ui/` |
| Build fails on `"use client"` | Add directive only where hooks/events are used |
| v0 used Pages Router | Convert to App Router `app/` structure |

---

## Quick reference — safe vs unsafe overwrite

| Safe to add/overwrite | Never overwrite from v0 |
|-----------------------|-------------------------|
| `app/(feature)/**` | `lib/**` |
| `components/<feature>/**` | `services/**`, `agents/**`, `prompts/**` |
| New static assets in `public/` | `supabase/**`, `middleware.ts` |
| Feature-specific `types/` | `.cursor/rules/**`, `PROJECT_CONSTITUTION.md` |

---

## Related docs

- [PROJECT_CONSTITUTION.md](../PROJECT_CONSTITUTION.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [CODING_STANDARDS.md](../CODING_STANDARDS.md)
- [DEPLOYMENT.md](../DEPLOYMENT.md)
- [SPRINT-1.md](./SPRINT-1.md)
