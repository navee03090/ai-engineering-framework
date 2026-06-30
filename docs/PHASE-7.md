# Phase 7 — Prompt Framework

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Professional prompt management with versioned templates, feature packs, validation, and registry APIs — supporting Pakistan Disaster Response AI and future projects.

## Delivered

| Module | Purpose |
|--------|---------|
| `prompts/types.ts` | Template, context, and bundle types |
| `prompts/registry.ts` | Versioned template registry |
| `prompts/templates/disaster/` | Disaster-response prompt pack |
| `prompts/templates/shared/` | Shared instructions (JSON output) |
| `lib/prompt-manager.ts` | `resolveTemplate`, `buildAgentPromptBundle`, validation |
| `app/api/prompts` | List prompt metadata (no secrets) |

## Template IDs (disaster pack)

| ID | Version | Use |
|----|---------|-----|
| `disaster.summarize` | 1.0.0 | Summarizer agent |
| `disaster.classify` | 1.0.0 | Classifier agent |
| `disaster.incident-intake` | 1.0.0 | Raw intake normalization (future) |
| `disaster.vision` | 1.0.0 | Image analysis (Phase 11+) |
| `disaster.ocr` | 1.0.0 | Document extraction (Phase 11+) |
| `shared.json-output` | 1.0.0 | Structured JSON responses |

## Usage

### Resolve a template

```typescript
import { resolveTemplate } from "@/lib/prompt-manager";

const prompt = resolveTemplate("disaster.summarize", {
  audience: "emergency coordinators",
  content: incidentText,
  maxWords: 150,
});
```

### Agent bundle (system + user)

```typescript
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

const { system, user, meta } = buildAgentPromptBundle({
  userTemplateId: "disaster.classify",
  userContext: { content: incidentText },
  systemContext: {
    projectName: "Pakistan Disaster Response AI",
    environment: "production",
  },
});
```

### List templates

```bash
curl http://localhost:3000/api/prompts
curl "http://localhost:3000/api/prompts?tag=disaster"
```

## Adding a new template

1. Create `prompts/templates/<pack>/my-template.prompt.ts` with `id`, `version`, `template`, `requiredVariables`.
2. Export from the pack `index.ts`.
3. Register via `registerDefaultPrompts()` (auto-loaded from `promptTemplatePacks`).
4. Use `resolveTemplate("pack.my-template", context)` in agents or services.
5. Add unit tests in `tests/unit/prompts.test.ts`.

## Versioning rules

- Bump `version` when prompt behavior changes (`1.0.0` → `1.1.0`).
- Keep old versions registered if you need rollback (register multiple versions with same `id`).
- `registry.get(id)` returns the **latest** version by semver sort.

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 8 — Service Layer:** `auth.service.ts`, `ai.service.ts`, `incident.service.ts`, thin API routes.
