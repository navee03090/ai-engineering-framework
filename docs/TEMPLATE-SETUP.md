# New Project from AEF Template

**One-click GitHub template** + local setup script for every new AI product.

## GitHub: create your repository

1. Open **[Use this template](https://github.com/navee03090/ai-engineering-framework/generate)** on GitHub.
2. Choose **Create a new repository**.
3. Name it for your product (e.g. `pakistan-disaster-ai`).
4. Clone locally:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
npm run setup -- --name "Pakistan Disaster Response AI"
```

> **Template repo owners:** In GitHub → **Settings** → **General** → enable **Template repository** so the green **Use this template** button appears.

## Local setup script

```bash
npm run setup
```

| What it does | |
|--------------|---|
| Copies `.env.example` → `.env.local` | Only if `.env.local` does not exist |
| `--name "Product Name"` | Sets `NEXT_PUBLIC_APP_NAME` in `.env.local` |
| Prints checklist | Supabase migrations, dev server, Cursor |

## Configuration checklist

### 1. Environment (`.env.local`)

| Variable | Required for |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth, database, storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin operations |
| `GEMINI_API_KEY` | AI agents and analysis |
| `RESEND_API_KEY` + `RESEND_FROM_EMAIL` | Email notifications |
| `N8N_WEBHOOK_URL` | n8n automation (optional) |

See `.env.example` for the full list.

### 2. Supabase

1. Create a **new** Supabase project (do not share with the template dev project).
2. Run migrations in order in the SQL Editor:
   - `supabase/migrations/00001_init.sql`
   - `supabase/migrations/00002_incidents.sql`
   - `supabase/migrations/00003_incident_attachments.sql`
3. **Authentication → URL configuration:**
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

### 3. Verify locally

```bash
npm run dev
```

| Check | URL |
|-------|-----|
| App | http://localhost:3000 |
| Health | http://localhost:3000/api/health |
| Docs index | http://localhost:3000/docs |

### 4. Cursor workflow

Open the project in Cursor and start each session with:

> Read PROJECT_CONSTITUTION.md and follow it.

Rules in `.cursor/rules/` load automatically.

### 5. Import v0 UI

Do **not** replace the repository with a v0 export. Import UI into `app/` and `components/` per **[V0-IMPORT-GUIDE.md](./V0-IMPORT-GUIDE.md)**.

### 6. Deploy

See **[DEPLOYMENT.md](../DEPLOYMENT.md)** — Vercel + Supabase env vars + production auth URLs.

## Rename branding (optional)

| Item | Where |
|------|--------|
| App title | `NEXT_PUBLIC_APP_NAME` in `.env.local` |
| Package name | `package.json` → `name` field |
| README | Product-specific intro at the top |
| Constitution | Update "First consumer" section for your product |

Keep `PROJECT_CONSTITUTION.md` principles — customize mission and consumer project sections only.

## What you keep from AEF

- `services/` — business logic layer
- `agents/` + `prompts/` — AI architecture
- `lib/api/` — `createApiHandler`, validation, rate limits
- Auth, uploads, notifications, n8n — ready to wire to your UI

## What you replace or extend

- Dashboard and marketing UI (v0 import)
- Domain-specific agents and prompt packs
- Supabase schema additions (new migrations, never edit old ones)

## Example: Pakistan Disaster Response AI

```bash
# After template generate + clone
npm install
npm run setup -- --name "Pakistan Disaster Response AI"
# Configure .env.local, run migrations, npm run dev
# Import v0 command center UI → wire to incidentService, aiService
```

## Related

- [PROJECT_CONSTITUTION.md](../PROJECT_CONSTITUTION.md)
- [V0-IMPORT-GUIDE.md](./V0-IMPORT-GUIDE.md)
- [API-REFERENCE.md](./API-REFERENCE.md)
- [DEPLOYMENT.md](../DEPLOYMENT.md)
