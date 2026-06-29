# Deployment Guide

## Stack

| Service | Host |
|---------|------|
| Next.js app | Vercel |
| Database + Auth + Storage | Supabase |
| AI | Google Gemini API |
| Email | Resend |
| Automation | n8n Cloud |

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy every key from `.env.example` into:

- **Local:** `.env.local`
- **Vercel:** Project Settings → Environment Variables

Required for Sprint 1:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `GEMINI_API_KEY`

## Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/00001_init.sql` in SQL Editor.
3. Copy URL and keys to `.env.local`.

## Vercel deployment

1. Push repository to GitHub.
2. Import project in Vercel.
3. Add environment variables.
4. Deploy — `vercel.json` is preconfigured.

## GitHub template

After Sprint 1 is verified:

1. Create repo `ai-engineering-framework` on GitHub.
2. Push local code.
3. Enable **Template repository** in GitHub repo settings.

## Post-deploy checks

- `GET /api/health` returns `status: ok`
- Supabase auth session refreshes via `middleware.ts`
- With `GEMINI_API_KEY` set, `POST /api/ai/health` returns structured JSON
