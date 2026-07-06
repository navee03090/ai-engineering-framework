# DigTech 2026 — Solo Playbook (CECOS University)

**Event:** July 7, 2026 · **Team:** Solo · **Stack:** AEF (no v0)

You win by **adapting a working app in 60–90 minutes**, not building from zero. This playbook is your script for theme day.

---

## Your strategy in one line

**Pre-build the engine → Theme drops → ChatGPT fills the brief → Cursor patches copy + prompts + 3 pages → Freeze early → Demo.**

---

## Part 1 — Before July 7 (do at home)

### P0 — Must work before you enter the hall

| #   | Task                                                                                                                  | How to verify                               |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | New repo from [AEF template](https://github.com/navee03090/ai-engineering-framework/generate) e.g. `digtech-civic-ai` | GitHub repo exists                          |
| 2   | `npm install` + `npm run setup -- --name "Your App Name"`                                                             | `.env.local` exists                         |
| 3   | Supabase project + migrations 00001, 00002, 00003                                                                     | SQL ran without errors                      |
| 4   | `GEMINI_API_KEY` in `.env.local`                                                                                      | `POST /api/ai/health` works                 |
| 5   | `npm run dev` + sign up once                                                                                          | You can log in                              |
| 6   | Create incident via API + analyze                                                                                     | See category/severity in DB or API response |
| 7   | Build 3 minimal pages (see Part 2)                                                                                    | Golden path in browser                      |
| 8   | Seed 3 demo incidents                                                                                                 | Dashboard never empty                       |
| 9   | Record 15s screen video of golden path                                                                                | Backup if Wi‑Fi fails                       |
| 10  | Rehearse 3-min pitch twice                                                                                            | Under 3:30 with demo                        |

### P1 — Pack in your bag

- Laptop + charger
- Phone hotspot (tested)
- Printed [RUN-SHEET](./DIGTECH-2026-RUN-SHEET.md)
- USB with: `.env.local` backup (encrypted/notes), demo video
- Account logged in before presenting (no signup on stage)

### What you do NOT prep

- v0 designs
- Mobile app / browser extension
- New auth system
- More than 3 user-facing pages

---

## Part 2 — Minimal UI (3 pages, no v0)

Use existing shadcn components. All logic stays in `services/` + existing APIs.

| Page               | Route        | Purpose                                                                                |
| ------------------ | ------------ | -------------------------------------------------------------------------------------- |
| **Landing**        | `/`          | Civic problem, theme hook, CTA “Report issue” → `/report`                              |
| **Report**         | `/report`    | Form: title, location, description → `POST /api/incidents` → redirect to analyze       |
| **Command center** | `/dashboard` | List incidents (fetch `GET /api/incidents`), severity badges, “Analyze” button per row |

**Optional 4th (only if MVP done early):** `/dashboard/[id]` detail view with AI summary.

### Golden path (memorize)

```text
Landing → Report (submit) → Auto or manual Analyze → Dashboard shows HIGH severity + summary
```

### APIs you already have (do not rebuild)

| Action        | API                                |
| ------------- | ---------------------------------- |
| Create report | `POST /api/incidents`              |
| AI analyze    | `POST /api/incidents/[id]/analyze` |
| List reports  | `GET /api/incidents`               |
| Health check  | `GET /api/health`                  |

---

## Part 3 — Theme day timeline (solo)

Assume ~3 hours total, ~110 min build (adjust if organizers change timing).

| Time           | Solo action                                                                |
| -------------- | -------------------------------------------------------------------------- |
| **0–10 min**   | Listen. Write theme on paper. Fill ChatGPT template (Part 4).              |
| **10–15 min**  | Paste Cursor prompt (Part 5). Read plan — approve scope.                   |
| **15–75 min**  | Cursor/build: copy, prompts, form labels only. You test after each change. |
| **75–95 min**  | Seed 3 themed examples. Run golden path 3×. Fix only crashes.              |
| **95–110 min** | **FREEZE.** Update slide 1 with theme. Rehearse pitch + demo.              |
| **110+ min**   | Present. No coding.                                                        |

**Solo rule:** If something breaks at 90 min, demo **seeded dashboard** + backup video. Do not debug for 20 minutes.

---

## Part 4 — ChatGPT prompt (copy when theme is revealed)

Paste this into ChatGPT **immediately** after the theme announcement. Replace nothing until theme is known.

```text
I am solo at DigTech 2026 (CECOS University). Theme just announced:

"[PASTE THEME HERE]"

I already have a working Next.js app with:
- User login (Supabase)
- Report form → database
- AI that classifies (category, severity) and summarizes incidents
- Dashboard listing reports

I have 75 minutes to ADAPT (not rebuild). No v0. Pakistan civic context.

Give me ONLY the following sections — concise, copy-paste ready:

## 1. Product name
(2-4 words, professional)

## 2. One-sentence problem
(Specific Pakistan civic pain tied to the theme)

## 3. Who reports / who acts
(e.g. citizens → local coordinators)

## 4. UI copy
- Landing headline (max 12 words)
- Landing subhead (1 sentence)
- Report form labels: title, location, description placeholders
- Dashboard title

## 5. AI categories
List 5-7 category labels for this theme (e.g. for health: outbreak, medicine shortage, ...)

## 6. Demo scenario
One realistic report (title, location, description) I will type live on stage — Pakistan-specific.

## 7. Three-sentence pitch
Problem → AI solution → impact

## 8. Cursor instruction paragraph
Tell my AI coder exactly what to change: which prompt text, which page copy, no new backend.

Do not suggest new frameworks, mobile apps, or chatbots. Keep scope minimal for solo.
```

Save ChatGPT’s output in Notes app — you’ll paste section 8 + sections 4–5 into Cursor.

---

## Part 5 — Cursor prompt (paste after ChatGPT responds)

Open your **product repo** in Cursor (not the raw template repo unless that’s your product). Start with:

```text
Read PROJECT_CONSTITUTION.md and docs/DIGTECH-2026-SOLO-PLAYBOOK.md.

DigTech 2026 theme: [THEME]
Solo hackathon — ADAPT only, do not rebuild infrastructure.

ChatGPT brief:
[PASTE ChatGPT SECTIONS 1-7]

STRICT RULES:
- Do NOT add v0 imports or new dependencies
- Do NOT rebuild auth, Supabase, or createApiHandler patterns
- Do NOT create more than 3-4 pages
- USE existing: POST /api/incidents, POST /api/incidents/[id]/analyze, GET /api/incidents
- USE existing agents (classifier, summarizer) — update prompt text in prompts/templates/ if needed for theme
- shadcn/ui only for UI

TASKS (in order):
1. Update landing page (/) with new headline, subhead, CTA to /report
2. Create or update /report page with form wired to POST /api/incidents, then trigger analyze
3. Update /dashboard to list incidents with severity/category badges (fetch GET /api/incidents)
4. Tune classify prompt categories for theme: [PASTE CATEGORIES]
5. Run npm run lint and npm run build — fix errors only

Stop when golden path works: Report → Analyze → Dashboard shows result.
```

If `/report` does not exist yet, build it **before** the event as practice; on theme day only change labels and prompts.

---

## Part 6 — Theme pivot cheat sheet

When theme drops, pick the closest row. Tell ChatGPT which row in the prompt.

| If theme sounds like… | Product angle             | Example categories                                       |
| --------------------- | ------------------------- | -------------------------------------------------------- |
| Disaster / emergency  | Response command center   | flood, earthquake, fire, medical, infrastructure         |
| Health / hygiene      | Public health triage desk | outbreak, medicine, facility, mental health, ambulance   |
| Education             | School & student issues   | access, safety, facilities, bullying, scholarships       |
| Traffic / city        | Urban issue reporter      | roads, signals, parking, waterlogging, streetlights      |
| Environment           | Eco complaint hub         | pollution, waste, water, deforestation, wildlife         |
| Governance            | Civic complaint intake    | corruption tip, service delay, documentation, harassment |
| Agriculture           | Farmer assistance router  | crop disease, weather, irrigation, pests, market         |

Same app shape every time — only **words and categories** change.

---

## Part 7 — 3-minute presentation script (solo)

Fill blanks after ChatGPT. Practice with timer.

**[0:00–0:40] Problem**  
“In Pakistan, [SPECIFIC PROBLEM from theme]. Citizens report through [channels] but [pain]. Today at DigTech, our theme is [THEME] — we built [PRODUCT NAME] to fix this.”

**[0:40–1:20] AI**  
“We use Google Gemini with a structured pipeline — not a generic chatbot. AI reads each report, assigns category and severity, and writes a one-paragraph summary with a recommended action. Humans stay in control; AI speeds triage.”

**[1:20–2:50] Demo**

1. Show landing — one sentence
2. Open `/report` — type **demo scenario** from ChatGPT
3. Submit → analyze
4. Open dashboard — point at **severity badge** and **summary**  
   “This would go to [WHO ACTS] next.”

**[2:50–3:10] Close**  
“Built solo at DigTech 2026 at CECOS. Next steps: SMS alerts, Urdu voice input, partnership with [local stakeholder]. Thank you.”

---

## Part 8 — Judges Q&A (prepare one-liners)

| Question         | Answer                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------- |
| Is this copied?  | “New product for today’s theme; I used my own framework for speed, like using Next.js.” |
| Why AI?          | “Manual triage is slow; AI standardizes category and severity in seconds.”              |
| Real deployment? | “Pilot with university/community volunteers; Supabase + Vercel ready.”                  |
| Wrong AI output? | “Human reviewer always approves; AI suggests, doesn’t decide.”                          |
| Solo?            | “I scoped to one workflow that works end-to-end.”                                       |

---

## Part 9 — Failure recovery

| Problem         | Fix in 30 seconds                                               |
| --------------- | --------------------------------------------------------------- |
| Wi‑Fi dead      | Hotspot → if still dead, play backup video                      |
| Gemini slow     | Show pre-seeded analyzed incident on dashboard                  |
| Login fails     | Use browser profile already logged in; incognito breaks session |
| Build error     | Demo last known `npm run dev` tab; don’t pull new code on stage |
| Blank dashboard | Refresh; fall back to 3 seeded incidents                        |

---

## Part 10 — Night before checklist

- [ ] `npm run dev` works
- [ ] Golden path once more
- [ ] Laptop charged
- [ ] Hotspot tested
- [ ] Logged in to demo account
- [ ] Slides on USB + Google Drive
- [ ] RUN-SHEET printed
- [ ] ChatGPT + Cursor accessible
- [ ] Sleep — solo fatigue loses demos

---

## Related

- [TEMPLATE-SETUP.md](./TEMPLATE-SETUP.md) — repo bootstrap
- [API-REFERENCE.md](./API-REFERENCE.md) — routes for debugging
- [DIGTECH-2026-RUN-SHEET.md](./DIGTECH-2026-RUN-SHEET.md) — one-page printout

**Good luck. Scope beats ambition. A working demo beats a beautiful plan.**
