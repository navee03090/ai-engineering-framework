# EcoMind AI — Pakistan's Intelligent Waste Command Center

**AI that doesn't just report waste—it predicts, prioritizes, and coordinates cleanup.**

EcoMind AI is an AI **Decision Assistant** that helps Pakistani citizens report waste and environmental issues — classify problems, identify responsible authorities, verify evidence, and generate incident reports — for cleaner cities.

Built on the [AI Engineering Framework (AEF) v1.0](https://github.com/navee03090/ai-engineering-framework) template (pivoted from CivicAI).

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

| Layer        | Technology                                                              |
| ------------ | ----------------------------------------------------------------------- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Framer Motion |
| **Backend**  | Next.js API Routes, Zod validation, service layer                       |
| **Database** | Supabase (Postgres, Auth, Storage, RLS)                                 |
| **AI**       | Google Gemini (6-agent pipeline with Zod schemas)                       |
| **Email**    | Resend (report PDF delivery)                                            |
| **Maps**     | Google Maps (`@vis.gl/react-google-maps`)                               |
| **Voice**    | Web Speech API (browser-native, free)                                   |
| **PDF**      | jsPDF                                                                   |
| **Testing**  | Vitest, Playwright, ESLint, Prettier, Husky                             |

---

## Core features

- **AI Assistant** — Report environmental issues in English or Urdu (type or speak)
- **Evidence Verification** — Upload waste photos; OCR + compliance comparison
- **Structured Reports** — Citizen checklists, safety tips, authority guidance
- **Google Maps** — Municipal offices, recycling centers, pollution hotspots
- **PDF + Email** — Downloadable incident report and email with PDF attachment
- **Dashboard & History** — Track past reports and evidence uploads
- **Bilingual UI** — English and Urdu throughout

---

## Documentation

| Document                                                                        | Description                                              |
| ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **[HACKATHON-CONTEXT.md](./HACKATHON-CONTEXT.md)**                              | Hackathon theme + pivot plan                             |
| **[CIVICAI-PROJECT-DOCUMENTATION.md](./docs/CIVICAI-PROJECT-DOCUMENTATION.md)** | Complete project docs — tools, architecture, setup, APIs |
| [CIVICAI-AGENT-ARCHITECTURE.md](./docs/CIVICAI-AGENT-ARCHITECTURE.md)           | Six-agent system deep dive                               |
| [CIVICAI-WORKFLOWS.md](./docs/CIVICAI-WORKFLOWS.md)                             | Query & upload pipeline flows                            |
| [CIVICAI-PROMPTS.md](./docs/CIVICAI-PROMPTS.md)                                 | Prompt engineering reference                             |
| [CIVICAI-EXAMPLES.md](./docs/CIVICAI-EXAMPLES.md)                               | Sample queries and outputs                               |
| [API-REFERENCE.md](./docs/API-REFERENCE.md)                                     | Full HTTP API reference                                  |

---

## Environment variables

See [`.env.example`](./.env.example). Minimum required:

- `NEXT_PUBLIC_SUPABASE_URL` + keys
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (for maps)

Optional: `RESEND_API_KEY` + `RESEND_FROM_EMAIL` for email delivery.

---

## Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Production build         |
| `npm run lint`     | ESLint                   |
| `npm run test`     | Vitest unit tests        |
| `npm run test:e2e` | Playwright E2E tests     |

---

## Supabase setup

Run migrations in order from `supabase/migrations/`:

1. `00001` – `00003` — Base schema
2. `00004_civicai.sql` — Application tables
3. `00005_civicai_seed.sql` — Environmental services seed data

**After pivot:** Re-run `00005_civicai_seed.sql` to replace government services with environmental services.

---

## Demo flow (3 minutes)

1. Landing → show tagline + six-agent architecture
2. Sign in → `/assistant`
3. Voice: _"There is illegal dumping near Ring Road."_
4. View checklist, map (LWMC), and incident report
5. Check email for PDF attachment
6. Optional: upload waste photo at `/upload` for OCR + compliance
7. Dashboard history

---

## License

MIT (inherited from AEF template)
