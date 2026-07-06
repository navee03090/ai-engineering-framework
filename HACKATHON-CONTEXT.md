# CivicAI — Hackathon Context (CECOS University)

**Use this file in a new Cursor chat tomorrow.** Paste the revealed theme, then `@HACKATHON-CONTEXT.md`.

---

## Event

| Field | Value |
| --- | --- |
| **Event** | AI Hackathon — CECOS University |
| **Date** | July 7, 2026 |
| **Build sprint** | 110 minutes after theme reveal |
| **Presentation** | Problem solved · How AI was used · Live demo |
| **Team** | Max 2 members (solo allowed) |

---

## Project

| Field | Value |
| --- | --- |
| **Name** | CivicAI — Pakistan Citizen Assistant |
| **Tagline** | AI-powered Civic Navigation for Transparent Government Services |
| **Folder** | `E:\New folder (2)\ai-engineering-framework` |
| **Type** | AI Decision Assistant (NOT a chatbot) |

### One-line pitch

> Pakistani citizens don't know which documents, fees, or offices they need — and can't verify if an officer's request is legitimate. CivicAI gives structured official guidance and verifies uploaded officer notes using a six-agent AI pipeline.

---

## What's already built (do NOT rebuild)

| Integration | Status | Purpose |
| --- | --- | --- |
| **Supabase** | ✅ Connected | Auth, Postgres, RLS, storage |
| **Google Gemini** | ✅ Connected | 6-agent AI pipeline |
| **Resend** | ✅ Connected | Report emails with PDF |
| **Vercel** | ✅ Ready | Deployment |
| **Google Maps** | ✅ Connected | Office locations |
| **Web Speech API** | ✅ Built-in | Voice input (free, no API key) |
| **jsPDF** | ✅ Built-in | Downloadable citizen reports |

### Core features working

- AI Assistant (`/assistant`) — text + voice, English/Urdu
- Document verification (`/upload`) — OCR + compliance check
- Structured reports with checklist, fees, scam warnings
- Google Maps office pins
- PDF download + email delivery
- Dashboard, history, services browser
- Marketing landing page

---

## AI architecture (6 agents)

```
Query:   Intent → Knowledge (DB) → Recommendation → Report
Upload:  Knowledge (DB) → OCR (Vision) → Compliance → Report
```

| Agent | LLM? | Role |
| --- | --- | --- |
| Intent | Gemini | Classify citizen query → service slug |
| Knowledge | **No** | Read `government_services` from Supabase |
| OCR | Gemini Vision | Extract docs from officer note image |
| Compliance | Gemini | Compare vs official checklist |
| Recommendation | Gemini | Steps, tips, scam warnings |
| Report | Gemini | Final structured citizen report |

**Key files:** `services/civicai.service.ts`, `agents/*.agent.ts`, `agents/civicai-schemas.ts`

---

## Demo flow (3 minutes)

1. Landing page → Sign up / Login
2. `/assistant` → *"I want to renew my driving license in Lahore"*
3. Show checklist, fee (PKR 1,800), scam warning, map
4. Open report → download PDF
5. Show email with PDF attachment
6. (Optional) `/upload` → officer note → OCR comparison
7. Backup: `/reports/demo` if WiFi/Gemini fails

### Pre-logged demo account

Create tonight and stay logged in at the venue to skip slow signup.

### Backups if live demo fails

- `/reports/demo` pre-built report
- Screenshots of email + PDF on phone
- Screen recording (30–60 sec)

---

## Theme pivot rules (110 min)

**DO:**
- Reframe pitch to match theme
- Update hero/landing copy (30 min max)
- Change demo query to fit theme
- Rename product if theme requires (update `lib/civicai/brand.ts`)

**DO NOT:**
- Rebuild from scratch
- New database schema
- New agent pipeline
- Push to GitHub during sprint (optional)

### Theme → pivot examples

| Theme sounds like… | Pivot |
| --- | --- |
| Civic / government / transparency | Use CivicAI as-is |
| Anti-corruption | Emphasize document verification |
| Education / awareness | "AI teaches official procedures" |
| Healthcare | Rebrand seed data to health services |
| Campus / university | "CECOS Student Services AI" |
| AI for good | Social impact + six-agent audit trail |

---

## Key documentation

| File | Contents |
| --- | --- |
| `docs/CIVICAI-PROJECT-DOCUMENTATION.md` | Full tech stack, APIs, setup |
| `docs/CIVICAI-AGENT-ARCHITECTURE.md` | Agent deep dive |
| `docs/CIVICAI-WORKFLOWS.md` | Pipeline flows |
| `docs/CIVICAI-PROMPTS.md` | Prompt reference |
| `README.md` | Quick start |

---

## Environment (`.env.local` — never commit)

Required: `NEXT_PUBLIC_SUPABASE_*`, `GEMINI_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`  
Optional: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

---

## Presentation structure

1. **Problem** (30s) — middlemen, wrong docs, unofficial fees
2. **Solution** (30s) — CivicAI decision assistant, not chatbot
3. **How AI** (60s) — six agents, DB-grounded knowledge, OCR verification
4. **Demo** (90s) — assistant → report → PDF → email
5. **Impact** (20s) — free, transparent, bilingual

---

## Tomorrow: paste this in new chat

```
Hackathon theme (CECOS University, July 7 2026):
[PASTE EXACT THEME HERE]

@HACKATHON-CONTEXT.md @docs/CIVICAI-PROJECT-DOCUMENTATION.md

Pivot this project to match the theme in ~110 minutes.
Do NOT rebuild — adapt copy, demo, prompts, and minimal UI only.
Give me: new pitch, what to change, demo script, and exact files to edit.
```

---

*Prepared: July 6, 2026 · CivicAI Hackathon Build*
