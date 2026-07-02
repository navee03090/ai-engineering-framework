# DigTech 2026 — Beyond Limits Strategy (Solo)

**Status:** Implemented in AEF (DigTech Civic OS)

## Built routes

| Route | Purpose |
|-------|---------|
| `/` | Civic landing + live stats |
| `/report` | Public intake + optional photo evidence |
| `/command` | Priority command board (auth) |
| `/command/[id]` | Pipeline triage + escalation (auth) |

## Theme pivot

Set in `.env.local`:

```env
CIVIC_PROMPT_PACK=emergency   # or services | social
CIVIC_ALERT_EMAIL=you@email.com
```

Restart dev server after changing pack.

## Demo flow

1. Open `/report` → submit Pakistan civic case (+ optional photo)
2. Redirects to `/command/[id]` → auto-runs AI pipeline
3. Show classifier + summarizer steps + severity + recommended action
4. High/critical → alert toast (email or n8n)

---

**Reality check:** You still cannot rebuild infrastructure on event day. “Beyond limits” means **depth, orchestration, and demo impact** — pre-built before July 7, **reconfigured** in 15 minutes when the theme drops.

---

## What top students will build (predictable)

| Their stack | Why judges get bored |
|-------------|---------------------|
| ChatGPT wrapper in a single page | No structure, no ops workflow |
| One prompt → paragraph output | AI not visible as a *system* |
| Generic “AI for good” landing | No Pakistan specificity |
| Static form → JSON in console | No command center feel |
| Slides heavier than product | Weak live demo |

**Your counter:** Multi-agent triage + evidence + prioritized command queue + **live escalation** — looks like software a city could pilot, not a hackathon homework.

---

## Your unfair weapon: AEF Civic OS

You already have what takes others weeks:

| Capability | AEF asset | Judge-facing story |
|------------|-----------|-------------------|
| Multi-agent AI | classifier + summarizer + orchestrator | “AI pipeline, not one chat prompt” |
| Structured output | Zod + JSON classification | “Reliable triage categories” |
| Persistence | Supabase incidents | “Reports don’t disappear” |
| Evidence | Upload + attachments | “Citizens attach proof” |
| Escalation | Resend + n8n | “Critical cases trigger alerts automatically” |
| Engineering credibility | Services, API, auth | “Production-shaped architecture” |

**Product positioning name (pick one):**  
**Pakistan Civic Intelligence Command (PCIC)** · **CivicOps AI** · **Raahbar Civic AI** (راہبر)

---

## The “beyond limits” architecture (5 layers)

Build this **before** DigTech. Theme day only changes **Layer 1 labels** and **Layer 2 prompt categories**.

```text
┌─────────────────────────────────────────────────────────┐
│  L1  INTAKE      Public report + location + photo       │
├─────────────────────────────────────────────────────────┤
│  L2  AI CORE     Agent pipeline: classify → summarize   │
│                  (show each step on screen)              │
├─────────────────────────────────────────────────────────┤
│  L3  COMMAND     Priority queue, severity, action cards  │
├─────────────────────────────────────────────────────────┤
│  L4  ESCALATE    Auto-alert on high/critical (email/n8n)│
├─────────────────────────────────────────────────────────┤
│  L5  TRUST       Timestamps, reporter context, audit   │
└─────────────────────────────────────────────────────────┘
```

Top teams stop at L1–L2. You demo **L1→L4 live**.

---

## Demo moment that wins (90 seconds)

Memorize this — do not improvise on stage.

1. **Public intake** — Submit themed civic report (no login friction if optional guest path).
2. **Pipeline visible** — UI shows “Classifier → Summarizer → Complete” (call real `/api/agents/pipeline` or analyze route).
3. **Command board** — Incident jumps to **HIGH** with AI summary + recommended action card.
4. **Escalation** — “Critical threshold met” → show notification test or n8n webhook fired (toast + `/notifications` or logs).
5. **Evidence** — One photo attached: “This is how field teams verify reports.”

Judges remember **motion**: data in → AI thinks → queue updates → alert fires.

---

## Theme-day pivot (15 minutes, not 3 hours)

Pre-create **3 prompt packs** in `prompts/templates/` (or swap disaster categories):

| Pack | When theme sounds like… |
|------|---------------------------|
| `civic.emergency` | disaster, safety, crisis |
| `civic.services` | infrastructure, utilities, governance |
| `civic.social` | health, education, community |

**On theme reveal:**

1. ChatGPT → problem story + category list + demo paragraph (playbook Part 4).
2. Cursor → swap prompt pack + landing/command copy + category badges (15–45 min max).
3. Do **not** add new layers on event day.

---

## What we build together (pre-event roadmap)

### Phase A — Civic Command UI (with Cursor)

| Page | Route | Beyond-simple feature |
|------|-------|------------------------|
| Civic landing | `/` | Problem + live stats + “Report now” |
| Public report | `/report` | Form + **optional photo upload** |
| Command center | `/command` | Priority queue, severity colors, analyze button |
| Incident detail | `/command/[id]` | Full AI output + pipeline steps + attachment |

Reuse `/dashboard` or replace with `/command` — one command surface only.

### Phase B — Pipeline visibility

- After analyze, show **steps** from orchestrator (agent names + success).
- Badge: `AI Confidence` from severity mapping (simple rule, not fake ML).

### Phase C — Escalation hook

- On `high` / `critical` after analyze → call `notificationService` (best-effort).
- Demo: “Coordinator email / n8n webhook” — even skipped-with-configured is OK if you show test webhook once in prep.

### Phase D — Pakistan depth

- Locations: preset districts (Peshawar, Swat, Lahore, Karachi) dropdown.
- One Urdu subtitle on landing: *“شہری مسائل، ذ smart ترجیح”* (or theme-specific line).
- Demo scenario always **real geography**.

### Phase E — Judge pack

- 5 slides max.
- 15s backup video.
- Printed run sheet + **one architecture diagram** (5 boxes = layers above).

---

## ChatGPT prompt (advanced — theme day)

Use this instead of the simple version when competing at top level:

```text
DigTech 2026 CECOS — theme: "[THEME]"
I have a multi-agent civic platform (classify + summarize + command queue + alerts + photo upload).
Solo competitor. Need to beat students using ChatGPT wrappers.

Give me:
1. Product name (authoritative, Pakistan civic)
2. Problem narrative (specific city/district, 3 sentences)
3. 7 classification categories for THIS theme
4. Severity rules (what makes high/critical for this theme)
5. Recommended actions examples (3)
6. Live demo script (exact text to type in report form)
7. One-liner differentiator vs "simple AI chatbot"
8. Urdu tagline (short)
9. Cursor change list (prompt categories + UI copy only)

Do not suggest rebuilding stack. Focus on civic ops depth.
```

---

## Cursor prompt (advanced — theme day)

```text
Read PROJECT_CONSTITUTION.md and docs/DIGTECH-2026-BEYOND-LIMITS.md.

Theme: [THEME]
ChatGPT brief: [PASTE]

ADAPT civic command platform — do not rebuild infra.

1. Update civic prompt categories in prompts/templates/ for theme
2. Landing + /report copy (Pakistan-specific)
3. Command center: severity sort, action cards, pipeline step display after analyze
4. Ensure critical/high triggers notificationService (best-effort)
5. npm run lint && npm run build

Golden demo: report + photo → pipeline visible → queue → alert toast.
```

---

## Solo time budget (top-tier execution)

| Block | Minutes | Focus |
|-------|---------|--------|
| Theme decode + ChatGPT | 10 | Categories + demo script |
| Cursor adapt | 45 | Copy + prompts only |
| Demo hardening | 25 | 3 seeded + 3 live runs |
| Escalation test | 10 | One webhook/email proof |
| **Freeze** | 20 | Pitch only |

If Cursor runs long, **cut UI polish**, never cut **pipeline + alert demo**.

---

## How to talk about “beyond limits” without overselling

**Say:**  
“We built a civic **intelligence command system** — multi-agent triage, evidence attachments, and automated escalation for high-priority cases. AI is structured and audited, not a black-box chatbot.”

**Don’t say:**  
“We solved [entire civic problem] in 3 hours” or “Our AI is 99% accurate.”

**If asked why you’re different:**  
“Others generate text. We run an **operations pipeline** — classify, summarize, prioritize, and alert — the same pattern disaster and city ops centers use.”

---

## Risk: going too big

| Trap | Fix |
|------|-----|
| Building mobile + extension + web | Web command center only |
| New ML model training | Gemini agents + structured JSON |
| 10 agents | 2 agents + orchestrator (already enough) |
| Real map API integration | District dropdown + optional static map image |
| Debugging on stage | Seeded critical incident always on board |

---

## Your plan WITH Cursor (partnership)

| When | You | Cursor (me) |
|------|-----|-------------|
| **Now → June** | Env, Supabase, repo | Build **Civic Command MVP** (report + command + pipeline UI + upload) |
| **1 week before** | Rehearse demo 10× | Theme pack structure + polish pass |
| **July 7 opening** | ChatGPT brief | 45-min adapt: prompts + copy |
| **Before present** | Pitch + backup video | No code |

**Next message from you:**  
> “Build the DigTech Beyond Limits civic command platform”

That starts Phase A–C in your product repo — the part top students won’t have ready.

---

## Related

- [DIGTECH-2026-SOLO-PLAYBOOK.md](./DIGTECH-2026-SOLO-PLAYBOOK.md) — timeline + print run sheet  
- [DIGTECH-2026-RUN-SHEET.md](./DIGTECH-2026-RUN-SHEET.md)  
- [API-REFERENCE.md](./API-REFERENCE.md)

**Win by showing a system. Let them show a screenshot of ChatGPT.**
