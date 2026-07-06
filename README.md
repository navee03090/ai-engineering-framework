# CivicAI — Pakistan Citizen Assistant

**AI-powered Civic Navigation for Transparent Government Services**

CivicAI is an AI **Decision Assistant** that helps Pakistani citizens navigate government procedures — documents, fees, timelines, scam warnings, office locations, and document verification — without relying on middlemen.

Built on the [AI Engineering Framework (AEF) v1.0](https://github.com/navee03090/ai-engineering-framework) template.

---

## Quick start

```bash
cp .env.example .env.local   # add your API keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## What's included

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Framer Motion |
| **Backend** | Next.js API Routes, Zod validation, service layer |
| **Database** | Supabase (Postgres, Auth, Storage, RLS) |
| **AI** | Google Gemini (6-agent pipeline with Zod schemas) |
| **Email** | Resend (report PDF delivery) |
| **Maps** | Google Maps (`@vis.gl/react-google-maps`) |
| **Voice** | Web Speech API (browser-native, free) |
| **PDF** | jsPDF |
| **Testing** | Vitest, Playwright, ESLint, Prettier, Husky |

---

## Core features

- **AI Assistant** — Ask about government services in English or Urdu (type or speak)
- **Document Verification** — Upload officer notes; OCR + compliance comparison
- **Structured Reports** — Checklists, fees, timelines, scam warnings
- **Google Maps** — Office locations based on service and city
- **PDF + Email** — Downloadable report and email with PDF attachment
- **Dashboard & History** — Track past queries and verifications
- **Bilingual UI** — English and Urdu throughout

---

## Documentation

| Document | Description |
| --- | --- |
| **[HACKATHON-CONTEXT.md](./HACKATHON-CONTEXT.md)** | **Tomorrow's hackathon — paste theme + pivot plan** |
| **[CIVICAI-PROJECT-DOCUMENTATION.md](./docs/CIVICAI-PROJECT-DOCUMENTATION.md)** | Complete project docs — tools, architecture, setup, APIs |
| [CIVICAI-AGENT-ARCHITECTURE.md](./docs/CIVICAI-AGENT-ARCHITECTURE.md) | Six-agent system deep dive |
| [CIVICAI-WORKFLOWS.md](./docs/CIVICAI-WORKFLOWS.md) | Query & upload pipeline flows |
| [CIVICAI-PROMPTS.md](./docs/CIVICAI-PROMPTS.md) | Prompt engineering reference |
| [CIVICAI-EXAMPLES.md](./docs/CIVICAI-EXAMPLES.md) | Sample queries and outputs |
| [API-REFERENCE.md](./docs/API-REFERENCE.md) | Full HTTP API reference |
| [PHASE_1_PROJECT_SPEC.md](./PHASE_1_PROJECT_SPEC.md) | Original product specification |

---

## Environment variables

See [`.env.example`](./.env.example). Minimum required:

- `NEXT_PUBLIC_SUPABASE_URL` + keys
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (for maps)

Optional: `RESEND_API_KEY` + `RESEND_FROM_EMAIL` for email delivery.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

---

## Supabase setup

Run migrations in order from `supabase/migrations/`:

1. `00001` – `00003` — Base schema
2. `00004_civicai.sql` — CivicAI tables
3. `00005_civicai_seed.sql` — Government services seed data

---

## Demo flow

1. Sign up → `/assistant`
2. Ask: *"I want to renew my driving license"*
3. View checklist, map, and report
4. Check email for PDF attachment
5. Optional: upload officer note at `/upload`

---

## License

MIT (inherited from AEF template)
