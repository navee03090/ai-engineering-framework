# Deployment Guide

## Stack

| Service | Host |
|---------|------|
| Next.js app | Vercel |
| Database + Auth + Storage | Supabase |
| AI | Google Gemini API |
| Email | Resend |
| Automation | n8n Cloud |

## New project from template

1. **[Use this template](https://github.com/navee03090/ai-engineering-framework/generate)** on GitHub.
2. Clone, `npm install`, `npm run setup`.
3. Follow **[docs/TEMPLATE-SETUP.md](./docs/TEMPLATE-SETUP.md)**.

## Local development

```bash
npm run setup          # copies .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy every key from `.env.example` into:

- **Local:** `.env.local`
- **Vercel:** Project Settings → Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to client |
| `GEMINI_API_KEY` | AI routes |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Email (optional) |
| `N8N_WEBHOOK_URL` | n8n automation (optional) |

## Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Run migrations in order:
   - `supabase/migrations/00001_init.sql`
   - `supabase/migrations/00002_incidents.sql`
   - `supabase/migrations/00003_incident_attachments.sql`
3. Copy URL and keys to `.env.local`.
4. Set auth redirect URL: `https://your-domain.com/auth/callback` (production).

## Vercel deployment

1. Push your **product** repository to GitHub (created from template).
2. Import project in Vercel.
3. Add environment variables for Production and Preview.
4. Deploy — `vercel.json` is preconfigured.

## GitHub template (framework repo)

For `ai-engineering-framework` maintainers:

1. Push to `github.com/navee03090/ai-engineering-framework`.
2. **Settings → General → Template repository** → enable.
3. Users see **Use this template** → `.../generate`.

## Post-deploy checks

- `GET /api/health` returns `status: ok`, `phase: 15`
- Supabase auth session refreshes via middleware
- With `GEMINI_API_KEY`, `POST /api/ai/health` returns structured JSON
- Protected routes (`/dashboard`, `/uploads`, `/notifications`) require sign-in
