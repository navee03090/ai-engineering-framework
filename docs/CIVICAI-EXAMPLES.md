# CivicAI Example Conversations

**Version:** 1.0.0  
**Purpose:** Reference dialogues demonstrating query and upload pipelines across six seeded government services  
**Data source:** `supabase/migrations/00005_civicai_seed.sql`, `agents/civicai-schemas.ts`

All interactions require **authenticated Supabase session**. Examples show expected agent behavior — actual LLM wording may vary while structured outputs conform to Zod schemas.

---

## 1. Conversation Format Legend

| Symbol    | Meaning                                 |
| --------- | --------------------------------------- |
| 👤        | Citizen                                 |
| 🤖        | CivicAI (assembled from agent pipeline) |
| `[Agent]` | Internal agent step (not shown to user) |
| `{field}` | Structured output field                 |

**Query pipeline agents:** Intent → Knowledge → Recommendation → Report  
**Upload pipeline agents:** Knowledge → OCR → Compliance → Report

---

## 2. Driving License Renewal

**Service slug:** `driving-license`  
**Department:** Traffic Police / Licensing Authority  
**Official fee:** PKR 1,800  
**Processing:** 7–14 working days

### 2.1 Query Pipeline (English)

👤 **Citizen:** I want to renew my driving license. What documents do I need and how much is the fee?

`[Intent]` → `{ intent: "license_renewal", serviceSlug: "driving-license", confidence: 94 }`  
`[Knowledge]` → DB: documents, fee, warnings  
`[Recommendation]` → checklist, timeline, FAQs  
`[Report]` → citizenSummary

🤖 **CivicAI:**

> To renew your driving license, visit your nearest District Licensing Center (Traffic Police). The official fee is **PKR 1,800**, and processing typically takes **7–14 working days**.

**Document checklist:**

| Document            | Status   |
| ------------------- | -------- |
| CNIC                | required |
| Old driving license | required |
| Medical certificate | required |
| Passport photos     | required |

**Next steps:**

1. Visit the licensing center with all documents
2. Complete biometric verification
3. Pay PKR 1,800 at the official counter and keep your receipt
4. Collect your license after the processing period

**Warnings:**

- Only pay PKR 1,800 at the official counter
- Avoid unofficial facilitation fees

`{ reportId: "...", confidence: 94 }`

---

### 2.2 Upload Pipeline (Officer Note)

👤 **Citizen:** _[Uploads photo of handwritten note listing: CNIC, Old License, Medical Certificate, Police Clearance, Agent Fee PKR 5000]_  
**Service selected:** Driving License Renewal

`[OCR]` → `{ documents: [CNIC, Old License, Medical Certificate, Police Clearance], overallConfidence: 85 }`  
`[Compliance]` → compares against official list

🤖 **CivicAI:**

**Extracted documents:**

| Document            | Status   | Note                                                                           |
| ------------------- | -------- | ------------------------------------------------------------------------------ |
| CNIC                | verified | On official checklist                                                          |
| Old driving license | verified | On official checklist                                                          |
| Medical certificate | verified | On official checklist                                                          |
| Police Clearance    | unknown  | Not on standard renewal checklist — you may ask the officer why this is needed |
| —                   | missing  | Passport photos (officially required)                                          |

**Compliance score:** 72/100

**Advisory:**

> Three of the requested documents match the official renewal requirements. **Police Clearance** is not typically required for standard license renewal — you may politely ask the officer whether it applies to your specific case. **Passport photos** are officially required but were not listed on the note; please bring them when you visit. The official fee is PKR 1,800 at the counter — if you are asked to pay PKR 5,000 to an agent, that is not part of the official fee schedule.

---

## 3. Passport Application

**Service slug:** `passport`  
**Department:** Directorate General of Immigration & Passports  
**Official fee:** PKR 12,000 – 25,000  
**Processing:** 10–21 working days

### 3.1 Query Pipeline (Urdu)

👤 **Citizen:** مجھے نیا پاسپورٹ بنوانا ہے۔ کیا طریقہ کار ہے؟  
_(I need to get a new passport. What is the procedure?)_

`[Intent]` → `{ detectedLanguage: "ur", serviceSlug: "passport", confidence: 91 }`

🤖 **CivicAI (Urdu response):**

> نیا پاسپورٹ کے لیے آپ کو Regional Passport Office جانا ہوگا۔ Official fee **PKR 12,000 سے 25,000** ہے (category کے مطابق)۔ Processing **10–21 working days** لگ سکتی ہے۔

**Documents:**

| Document          | Status   |
| ----------------- | -------- |
| CNIC              | required |
| Previous passport | required |
| Bank challan      | required |
| Photographs       | required |

**Timeline:**

1. passport.gov.pk پر online form fill کریں
2. Bank challan pay کریں
3. Office visit for biometric
4. Online track کریں

**Warnings:**

- صرف official challan amount pay کریں
- Agents سے faster processing کے وعدے سے بچیں

---

### 3.2 Clarification Example

👤 **Citizen:** I need new ID documents.

`[Intent]` → `{ serviceSlug: "unknown", confidence: 45, needsClarification: true }`

🤖 **CivicAI:** Could you clarify which service you need — a **CNIC** from NADRA, a **Passport**, or something else?

`{ code: "CIVICAI_NEEDS_CLARIFICATION", status: "clarify" }`

---

## 4. CNIC / NICOP

**Service slug:** `cnic`  
**Department:** NADRA  
**Official fee:** PKR 0 – 15,000  
**Processing:** 15–30 days

### 4.1 Query Pipeline

👤 **Citizen:** How do I apply for a new CNIC for my 18-year-old son?

`[Intent]` → `{ intent: "cnic_application", serviceSlug: "cnic", entities: ["18-year-old son"], confidence: 88 }`

🤖 **CivicAI:**

> For a first CNIC application, visit your nearest **NADRA Registration Center** with the required documents. The fee ranges from **PKR 0 to 15,000** depending on category (normal/urgent/NICOP). Processing takes **15–30 days**.

**Checklist:**

| Document          | Status   |
| ----------------- | -------- |
| Birth certificate | required |
| Parent CNIC       | required |
| Proof of address  | required |
| Photographs       | required |

**Preparation tips:**

- Bring original parent CNIC and a copy of the birth certificate
- Verify current fee schedule at nadra.gov.pk before visiting
- The applicant (your son) must appear for biometric capture

**FAQs:**

| Question                               | Answer                                                   |
| -------------------------------------- | -------------------------------------------------------- |
| Does the applicant need to be present? | Yes — biometric capture requires personal appearance     |
| Can I apply from abroad?               | NICOP is available for overseas Pakistanis through NADRA |

---

## 5. Birth Certificate

**Service slug:** `birth-certificate`  
**Department:** Union Council / NADRA  
**Official fee:** PKR 200 – 500  
**Processing:** 3–7 working days

### 5.1 Query Pipeline

👤 **Citizen:** I need a birth certificate for school admission. Where do I go?

`[Intent]` → `{ serviceSlug: "birth-certificate", confidence: 90 }`

🤖 **CivicAI:**

> Apply at your local **Union Council Office** for a birth certificate. The fee is approximately **PKR 200–500**, and processing takes **3–7 working days**.

**Documents:**

| Document                  | Status   |
| ------------------------- | -------- |
| Parent CNIC               | required |
| Hospital birth record     | required |
| Affidavit (if applicable) | optional |

**Next steps:**

1. Apply at your union council with hospital birth record
2. Obtain NADRA-verified copy if needed for official use

---

### 5.2 Upload Pipeline (Suspicious Request)

👤 **Citizen:** _[Uploads note requesting: Parent CNIC, Hospital Record, Union Council Stamp, Notarized Affidavit, "Processing Fee" PKR 3,000 to private account]_

`[Compliance]` → flags suspicious items

🤖 **CivicAI:**

| Document                         | Status   | Note                                                                  |
| -------------------------------- | -------- | --------------------------------------------------------------------- |
| Parent CNIC                      | verified | Required                                                              |
| Hospital birth record            | verified | Required                                                              |
| Union Council Stamp              | required | Normal part of process                                                |
| Notarized Affidavit              | optional | May be needed in some cases                                           |
| Processing Fee (private account) | unknown  | Official fees are paid at union council counter, not private accounts |

**Advisory:**

> Most items on this list align with standard birth certificate procedures. However, official fees (PKR 200–500) should be paid **at the union council counter**, not to a private account. If you are asked to transfer money to a personal account, please verify with the union council office directly.

---

## 6. Vehicle Registration

**Service slug:** `vehicle-registration`  
**Department:** Excise & Taxation Department  
**Official fee:** Varies by vehicle  
**Processing:** 3–10 working days

### 6.1 Query Pipeline

👤 **Citizen:** I just bought a used car. How do I transfer registration to my name?

`[Intent]` → `{ intent: "vehicle_transfer", serviceSlug: "vehicle-registration", confidence: 86 }`

🤖 **CivicAI:**

> Register or transfer vehicle ownership at your district **Excise & Taxation Office**. Fees vary by vehicle type. Processing typically takes **3–10 working days**.

**Checklist:**

| Document          | Status   |
| ----------------- | -------- |
| CNIC              | required |
| Purchase invoice  | required |
| Token tax receipt | required |
| Insurance         | required |

**Timeline:**

1. Submit documents at excise office
2. Pay registration fee at designated bank
3. Collect registration book

**Warnings:**

- Pay token tax only at designated banks

---

## 7. Property Transfer

**Service slug:** `property-transfer`  
**Department:** Sub-Registrar Office  
**Official fee:** Stamp duty + registration fee  
**Processing:** 7–21 working days

### 7.1 Query Pipeline

👤 **Citizen:** What documents are needed to transfer property ownership in Lahore?

`[Intent]` → `{ serviceSlug: "property-transfer", entities: ["Lahore"], confidence: 93 }`

🤖 **CivicAI:**

> Property transfer is executed at the **Sub-Registrar Office** in your district. You will pay **stamp duty plus registration fee** (calculated based on property value). Processing takes **7–21 working days**.

**Documents:**

| Document            | Status   |
| ------------------- | -------- |
| CNIC                | required |
| Sale deed           | required |
| Fard                | required |
| NOC (if applicable) | optional |
| Tax clearance       | required |

**Next steps:**

1. Obtain fard from patwari
2. Pay stamp duty at designated bank
3. Execute sale deed at sub-registrar
4. Register mutation

**Warnings:**

- Stamp duty is calculated officially — verify at the registrar office

---

### 7.2 Upload Pipeline (Compliance Check)

👤 **Citizen:** _[Uploads officer note: CNIC, Sale Deed, Fard, NOC, Tax Clearance, "Facilitation Fee" PKR 50,000]_

`[OCR]` → `{ overallConfidence: 78 }`  
`[Compliance]` →

🤖 **CivicAI:**

| Document         | Status     |
| ---------------- | ---------- |
| CNIC             | verified   |
| Sale deed        | verified   |
| Fard             | verified   |
| NOC              | optional   |
| Tax clearance    | verified   |
| Facilitation Fee | suspicious |

**Compliance score:** 68/100

**Advisory:**

> The core documents on this list match official property transfer requirements. A **"Facilitation Fee" of PKR 50,000** is not part of the official fee schedule — stamp duty and registration fees are paid through designated banks and the sub-registrar office. You may politely ask for an official fee receipt for any payment requested.

---

## 8. API Request Examples

### 8.1 Query Request

```http
POST /api/civicai/assistant HTTP/1.1
Authorization: Bearer <supabase-session>
Content-Type: application/json

{
  "query": "I want to renew my driving license",
  "language": "en"
}
```

### 8.2 Upload Request

```http
POST /api/civicai/verify-document HTTP/1.1
Authorization: Bearer <supabase-session>
Content-Type: multipart/form-data

file=<binary>
serviceId=property-transfer
language=en
```

---

## 9. Pipeline Output Snapshots

### 9.1 Query Pipeline JSON (abbreviated)

Stored in `citizen_requests.pipeline_result`:

```json
{
  "intent": {
    "detectedLanguage": "en",
    "intent": "license_renewal",
    "serviceSlug": "driving-license",
    "confidence": 94,
    "needsClarification": false
  },
  "knowledge": {
    "serviceName": "Driving License Renewal",
    "fee": "PKR 1,800",
    "documents": [
      "CNIC",
      "Old driving license",
      "Medical certificate",
      "Passport photos"
    ]
  },
  "recommendation": {
    "checklist": [{ "name": "CNIC", "status": "required" }],
    "nextSteps": ["Visit licensing center with all documents"]
  },
  "report": {
    "citizenSummary": "...",
    "qrData": "{\"serviceSlug\":\"driving-license\",\"reportDate\":\"...\"}"
  }
}
```

### 9.2 Upload Pipeline JSON (abbreviated)

Stored in `document_verifications.compliance_result`:

```json
{
  "serviceName": "Property Transfer",
  "complianceScore": 68,
  "items": [
    { "name": "CNIC", "status": "verified", "note": "On official checklist" },
    {
      "name": "Facilitation Fee",
      "status": "unknown",
      "note": "Not on official fee schedule"
    }
  ],
  "suspiciousRequests": ["Facilitation Fee PKR 50,000"],
  "advisory": "..."
}
```

---

## 10. Error Conversation Examples

### 10.1 Unauthenticated

👤 **Citizen:** _[Not signed in]_ "Help me with passport"

🤖 **System:** 401 Unauthorized — Please sign in to use CivicAI.

### 10.2 Rate Limited

👤 **Citizen:** _[11th request in 60 seconds]_

🤖 **System:** 429 Too Many Requests — Please wait before sending another request.

### 10.3 Low OCR Quality

👤 **Citizen:** _[Uploads blurry photo]_

🤖 **CivicAI:** Image quality is too low. Please upload a clearer photo of the officer note.

`{ code: "CIVICAI_OCR_LOW_CONFIDENCE", overallConfidence: 42 }`

---

## 11. Related Documentation

- [CIVICAI-AGENT-ARCHITECTURE.md](./CIVICAI-AGENT-ARCHITECTURE.md)
- [CIVICAI-PROMPTS.md](./CIVICAI-PROMPTS.md)
- [CIVICAI-WORKFLOWS.md](./CIVICAI-WORKFLOWS.md)
