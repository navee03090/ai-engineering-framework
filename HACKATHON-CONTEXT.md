# EcoMind AI — Hackathon Context (CECOS University)

**Waste & Environment theme — pivot complete.** Product: **EcoMind AI — Pakistan's Intelligent Waste Command Center**

---

## Event

| Field       | Value                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| **Event**   | AI Hackathon — CECOS University                                                      |
| **Theme**   | Waste & Environment                                                                  |
| **Product** | EcoMind AI (pivoted from CivicAI)                                                    |
| **Tagline** | AI that doesn't just report waste—it predicts, prioritizes, and coordinates cleanup. |

---

## One-line pitch

> Citizens often report overflowing garbage, illegal dumping, polluted canals, and unmanaged waste without knowing which authority is responsible. EcoMind AI uses a six-agent AI architecture to classify environmental issues, verify uploaded evidence, recommend the correct authority, generate cleanup reports, and help optimize municipal waste management.

---

## What's reused (do NOT rebuild)

| Integration        | Status | Purpose                        |
| ------------------ | ------ | ------------------------------ |
| **Supabase**       | ✅     | Auth, Postgres, RLS, storage   |
| **Google Gemini**  | ✅     | 6-agent AI pipeline            |
| **Resend**         | ✅     | Report emails with PDF         |
| **Google Maps**    | ✅     | Municipal offices, hotspots    |
| **Web Speech API** | ✅     | Voice input                    |
| **jsPDF**          | ✅     | Environmental incident reports |

---

## Demo flow (3 minutes)

1. Landing → Cleaner Cities Through AI
2. Sign in → `/assistant`
3. Voice: _"There is illegal dumping near Ring Road."_
4. Intent → Illegal Dumping → LWMC authority → Map
5. `/upload` → waste photo → OCR → Compliance
6. PDF + Email → Dashboard history

---

## Environmental services (12)

garbage-collection, illegal-dumping, recycling-center, industrial-waste, hazardous-waste, blocked-drain, plastic-pollution, air-pollution, water-pollution, tree-plantation, public-cleaning, environmental-complaint

---

## Post-deploy

Re-run `supabase/migrations/00005_civicai_seed.sql` on Supabase to load environmental seed data.
