# CivicAI Workflows

**Version:** 1.0.0  
**Implementation:** `services/civicai.service.ts`, `app/api/civicai/*`, `lib/api/rate-limit.ts`

---

## 1. Workflow Overview

CivicAI exposes two primary authenticated workflows:

| Workflow            | Entry Point                         | Agents                                       | Persisted To                                                       |
| ------------------- | ----------------------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| **Query Pipeline**  | `POST /api/civicai/assistant`       | Intent → Knowledge → Recommendation → Report | `citizen_requests`, `citizen_reports`, `agent_runs`                |
| **Upload Pipeline** | `POST /api/civicai/verify-document` | Knowledge → OCR → Compliance → Report        | `document_verifications`, Storage, `citizen_reports`, `agent_runs` |

Both require **Supabase authentication** (`auth: true` on all routes).

---

## 2. Query Pipeline

### 2.1 High-Level Flow

```mermaid
flowchart TD
    START([Citizen submits query]) --> AUTH{Authenticated?}
    AUTH -->|No| E401[401 Unauthorized]
    AUTH -->|Yes| RL{Rate limit OK?}
    RL -->|No| E429[429 Too Many Requests]
    RL -->|Yes| CREATE[Create citizen_requests processing]
    CREATE --> INTENT[Intent Agent]
    INTENT --> IC{confidence ≥ 60<br/>slug ≠ unknown<br/>!needsClarification?}
    IC -->|No| CLARIFY[status = clarify]
    CLARIFY --> E422A[422 Needs Clarification]
    IC -->|Yes| KNOW[Knowledge Agent DB]
    KNOW --> REC[Recommendation Agent]
    REC --> REP[Report Agent]
    REP --> SAVE[Save citizen_reports]
    SAVE --> DONE[status = completed]
    DONE --> OK([200 Assistant Response])
```

### 2.2 Detailed Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant MW as Middleware
    participant API as assistant/route.ts
    participant CS as civicaiService
    participant OR as orchestrator
    participant GM as Gemini
    participant DB as Supabase

    U->>MW: POST /api/civicai/assistant
    MW->>MW: Verify session cookie/JWT
    alt Not authenticated
        MW-->>U: 401
    end
    MW->>API: Forward request
    API->>API: Validate body (query max 2000, language en|ur)
    API->>API: checkRateLimit(userId, RATE_LIMITS.ai)
    alt Rate exceeded
        API-->>U: 429 + Retry-After
    end
    API->>CS: askAssistant(userId, query, language)

    CS->>CS: assertGeminiConfigured()
    CS->>DB: INSERT citizen_requests (processing)

    CS->>OR: run("intent")
    OR->>GM: civic.intent prompt
    GM-->>OR: JSON → IntentOutput
    OR-->>CS: intentResult
    CS->>DB: logAgentRun (intent)

    alt Clarification needed
        CS->>DB: UPDATE status=clarify
        CS-->>U: 422 CIVICAI_NEEDS_CLARIFICATION
    end

    CS->>OR: run("knowledge")
    OR->>DB: SELECT government_services
    DB-->>OR: KnowledgeOutput
    CS->>DB: logAgentRun (knowledge)

    CS->>OR: run("recommendation")
    OR->>GM: civic.recommendation prompt
    GM-->>OR: RecommendationOutput
    CS->>DB: logAgentRun (recommendation)

    CS->>OR: run("report", reportType=query)
    OR->>GM: civic.report prompt
    GM-->>OR: ReportOutput
    CS->>DB: logAgentRun (report)

    CS->>DB: INSERT citizen_reports
    CS->>DB: UPDATE citizen_requests (completed)
    CS-->>U: 200 { answer, checklist, reportId, ... }
```

### 2.3 Request / Response Contract

**Request:**

```json
{
  "query": "I want to renew my driving license",
  "language": "en"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "serviceName": "Driving License Renewal",
    "serviceId": "driving-license",
    "department": "Traffic Police / Licensing Authority",
    "fee": "PKR 1,800",
    "processingTime": "7–14 working days",
    "answer": "<citizenSummary>",
    "confidence": 92,
    "checklist": [{ "name": "CNIC", "status": "required" }],
    "warnings": ["Only pay PKR 1,800 at official counter"],
    "timeline": [{ "step": "1", "description": "Visit licensing center" }],
    "preparationTips": ["..."],
    "nextSteps": ["..."],
    "faqs": [{ "question": "...", "answer": "..." }],
    "reportId": "uuid",
    "report": { "...": "ReportOutput" }
  }
}
```

**Clarification Response (422):**

```json
{
  "success": false,
  "error": {
    "message": "Which service do you need — passport or CNIC?",
    "code": "CIVICAI_NEEDS_CLARIFICATION",
    "details": { "intent": { "...": "IntentOutput" } }
  }
}
```

---

## 3. Upload Pipeline

### 3.1 High-Level Flow

```mermaid
flowchart TD
    START([Citizen uploads officer note]) --> AUTH{Authenticated?}
    AUTH -->|No| E401[401]
    AUTH -->|Yes| VALID{Valid image?<br/>≤8MB, JPEG/PNG/WebP/GIF}
    VALID -->|No| E400[400 Validation Error]
    VALID -->|Yes| RL{Rate limit OK?}
    RL -->|No| E429[429]
    RL -->|Yes| CREATE[Create document_verifications]
    CREATE --> UPLOAD[Upload to civicai-documents bucket]
    UPLOAD --> KNOW[Knowledge lookup by serviceId]
    KNOW --> OCR[OCR Agent Vision]
    OCR --> OC{overallConfidence ≥ 70?}
    OC -->|No| FAIL[status = failed]
    FAIL --> E422O[422 OCR Low Confidence]
    OC -->|Yes| COMP[Compliance Agent]
    COMP --> REP[Report Agent]
    REP --> SAVE[Save citizen_reports]
    SAVE --> DONE[status = completed]
    DONE --> OK([200 Verification Response])
```

### 3.2 Detailed Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant API as verify-document/route.ts
    participant CS as civicaiService
    participant ST as Supabase Storage
    participant OR as orchestrator
    participant GM as Gemini Vision
    participant DB as Supabase

    U->>API: POST multipart/form-data
    Note over U,API: file, serviceId?, language?

    API->>API: Validate mime + size (8MB max)
    API->>API: checkRateLimit(userId, RATE_LIMITS.ai)

    CS->>DB: INSERT document_verifications (processing)
    CS->>ST: upload {userId}/{timestamp}-{filename}
    CS->>DB: getBySlug(serviceId ?? "driving-license")

    CS->>OR: run("ocr", imageBase64)
    OR->>GM: civic.ocr + inline image
    GM-->>OR: OcrOutput
    CS->>DB: logAgentRun (ocr)

    alt overallConfidence < 70
        CS->>DB: UPDATE failed + ocr_result
        CS-->>U: 422 CIVICAI_OCR_LOW_CONFIDENCE
    end

    CS->>OR: run("compliance")
    OR->>GM: civic.compliance prompt
    GM-->>OR: ComplianceOutput
    CS->>DB: logAgentRun (compliance)

    CS->>OR: run("report", reportType=verification)
    OR->>GM: civic.report prompt
    GM-->>OR: ReportOutput
    CS->>DB: logAgentRun (report)

    CS->>DB: INSERT citizen_reports
    CS->>DB: UPDATE document_verifications (completed)
    CS-->>U: 200 { advisory, extractedDocuments, reportId }
```

### 3.3 Multipart Request

| Field       | Type          | Required | Default           |
| ----------- | ------------- | -------- | ----------------- |
| `file`      | File (image)  | Yes      | —                 |
| `serviceId` | string (slug) | No       | `driving-license` |
| `language`  | `en` \| `ur`  | No       | `en`              |

---

## 4. Rate Limiting

### 4.1 Configuration

Source: `lib/api/rate-limit.ts`

| Bucket                | Window     | Max Requests | Applied To                                               |
| --------------------- | ---------- | ------------ | -------------------------------------------------------- |
| `RATE_LIMITS.ai`      | 60 seconds | **10**       | `/api/civicai/assistant`, `/api/civicai/verify-document` |
| `RATE_LIMITS.default` | 60 seconds | 60           | History, stats, services, reports                        |
| `RATE_LIMITS.auth`    | 60 seconds | 20           | Sign-in, sign-up, sign-out                               |

### 4.2 Rate Limit Flow

```mermaid
flowchart LR
    REQ[Incoming Request] --> KEY[Build key: route + userId/IP]
    KEY --> BUCKET{Bucket exists<br/>& not expired?}
    BUCKET -->|New window| ALLOW[count=1, allowed]
    BUCKET -->|Under max| INCR[count++, allowed]
    BUCKET -->|At max| DENY[429 + retryAfterMs]
    ALLOW --> HANDLER[Execute handler]
    INCR --> HANDLER
```

### 4.3 Client Handling

On 429, response includes `retryAfterMs`. Clients should:

1. Display user-friendly "Please wait before trying again"
2. Back off for `retryAfterMs` milliseconds
3. Avoid retry storms on clarification loops (query pipeline)

### 4.4 Production Consideration

Current implementation uses in-memory buckets (single-process). For multi-instance Vercel deployment, migrate to Redis/Upstash for distributed rate limiting.

---

## 5. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant APP as Next.js App
    participant MW as Middleware
    participant SB as Supabase Auth
    participant API as CivicAI API

    U->>APP: Login / Signup
    APP->>SB: Authenticate
    SB-->>APP: Session cookie

    U->>API: CivicAI request + cookie
    API->>MW: createApiHandler auth:true
    MW->>SB: getUser()
    alt No user
        API-->>U: 401 Unauthorized
    else Valid user
        API->>API: handler({ user })
        Note over API: RLS enforces user_id = auth.uid()
    end
```

**All CivicAI data access is scoped by `user_id` via Row Level Security.**

---

## 6. Error Handling Matrix

| Code | Error                         | Pipeline | User Action                          |
| ---- | ----------------------------- | -------- | ------------------------------------ |
| 401  | Unauthorized                  | —        | Sign in                              |
| 429  | Rate limited                  | —        | Wait and retry                       |
| 503  | `AI_UNAVAILABLE`              | Both     | Retry later (missing GEMINI_API_KEY) |
| 422  | `CIVICAI_NEEDS_CLARIFICATION` | Query    | Answer clarification                 |
| 422  | `CIVICAI_OCR_LOW_CONFIDENCE`  | Upload   | Re-upload clearer photo              |
| 422  | `CIVICAI_*_FAILED`            | Both     | Retry or contact support             |
| 404  | `SERVICE_NOT_FOUND`           | Both     | Select valid service                 |
| 400  | `VERIFY_VALIDATION_FAILED`    | Upload   | Fix file type/size                   |

### Pipeline Abort Behavior

- First failed agent step **stops** the pipeline (orchestrator pattern)
- Parent record set to `failed` (except clarification → `clarify`)
- Completed agent runs still logged to `agent_runs`

---

## 7. Cost & Latency Optimization

### 7.1 LLM Call Budget

| Pipeline | LLM Calls                          | Non-LLM Steps              |
| -------- | ---------------------------------- | -------------------------- |
| Query    | 3 (Intent, Recommendation, Report) | 1 (Knowledge DB)           |
| Upload   | 3 (OCR, Compliance, Report)        | 1 (Knowledge DB) + Storage |

**Optimization: Knowledge agent is DB-only** — eliminates one LLM call per pipeline and removes hallucination risk for fees/documents.

### 7.2 Latency Profile (Estimated)

| Step              | Typical Latency     | Notes                   |
| ----------------- | ------------------- | ----------------------- |
| Auth + validation | 50–100 ms           | Supabase session        |
| Intent            | 800–1500 ms         | Text LLM                |
| Knowledge         | 50–200 ms           | DB query                |
| Recommendation    | 1000–2000 ms        | Largest text generation |
| Report            | 800–1500 ms         | Summary assembly        |
| OCR (Vision)      | 1500–3000 ms        | Image-dependent         |
| Compliance        | 800–1500 ms         | Comparison logic        |
| DB persistence    | 50–150 ms per write | Async audit logging     |

**Query pipeline total:** ~3–6 seconds  
**Upload pipeline total:** ~4–8 seconds

### 7.3 Cost Optimization Strategies

```mermaid
flowchart TB
    subgraph Implemented["Implemented"]
        A[DB-grounded Knowledge]
        B[Low temperature 0.1-0.3]
        C[Early exit on low intent confidence]
        D[Early exit on low OCR confidence]
        E[Sequential not parallel LLM calls]
    end

    subgraph Future["Future Optimizations"]
        F[Cache Knowledge by slug]
        G[Skip Report for quick-answer mode]
        H[Smaller model for Intent only]
        I[Batch agent_runs inserts]
    end
```

| Strategy                     | Savings                       | Status              |
| ---------------------------- | ----------------------------- | ------------------- |
| DB-only knowledge            | 1 LLM call/pipeline           | ✅ Implemented      |
| Clarification gate           | Avoids 3 downstream LLM calls | ✅ Implemented      |
| OCR confidence gate          | Avoids Compliance + Report    | ✅ Implemented      |
| Temperature tuning           | Reduces regeneration/retries  | ✅ Implemented      |
| Response caching (Knowledge) | DB read reduction             | 🔜 Recommended      |
| Report optional mode         | 1 LLM call saved              | 🔜 Product decision |

### 7.4 Token Efficiency

| Agent          | Input Size Control                        |
| -------------- | ----------------------------------------- |
| Intent         | Service index (compact slug \| name list) |
| Recommendation | Serialized knowledge + intent JSON        |
| Report         | Upstream JSON only — no re-fetch          |
| Compliance     | Comma-joined document lists               |

Query max length: **2000 characters** (`civicAssistantRequestSchema`).

---

## 8. Persistence Timeline

### 8.1 Query Pipeline DB Writes

```mermaid
gantt
    title Query Pipeline Persistence
    dateFormat X
    axisFormat %s

    section citizen_requests
    INSERT processing     :0, 1
    UPDATE clarify/failed :crit, 2, 1
    UPDATE completed      :5, 1

    section agent_runs
    intent               :1, 1
    knowledge            :2, 1
    recommendation       :3, 1
    report               :4, 1

    section citizen_reports
    INSERT report        :5, 1
```

### 8.2 State Transitions

**citizen_requests:**

```mermaid
stateDiagram-v2
    [*] --> processing: askAssistant()
    processing --> clarify: low confidence
    processing --> failed: agent error
    processing --> completed: full pipeline
    clarify --> [*]
    failed --> [*]
    completed --> [*]
```

**document_verifications:**

```mermaid
stateDiagram-v2
    [*] --> processing: verifyDocument()
    processing --> failed: OCR/compliance/report error
    processing --> completed: full pipeline
    failed --> [*]
    completed --> [*]
```

---

## 9. Supporting API Routes

| Route                           | Auth | Rate Limit | Purpose                  |
| ------------------------------- | ---- | ---------- | ------------------------ |
| `GET /api/civicai/services`     | Yes  | default    | List government services |
| `GET /api/civicai/history`      | Yes  | default    | User request history     |
| `GET /api/civicai/reports/[id]` | Yes  | default    | Fetch saved report       |
| `GET /api/civicai/stats`        | Yes  | default    | Dashboard counts         |

---

## 10. Related Documentation

- [CIVICAI-AGENT-ARCHITECTURE.md](./CIVICAI-AGENT-ARCHITECTURE.md)
- [CIVICAI-PROMPTS.md](./CIVICAI-PROMPTS.md)
- [CIVICAI-EXAMPLES.md](./CIVICAI-EXAMPLES.md)
