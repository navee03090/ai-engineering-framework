# Prompt Engineering Guide

## Location

All prompts live in `prompts/`:

| File / folder         | Role                                   |
| --------------------- | -------------------------------------- |
| `base.prompt.ts`      | Framework-wide AI behavior             |
| `system.prompt.ts`    | Project context with `{{variables}}`   |
| `user.prompt.ts`      | Legacy template ID aliases             |
| `registry.ts`         | Versioned template registry            |
| `templates/disaster/` | Pakistan Disaster Response prompt pack |
| `templates/shared/`   | Cross-feature instructions             |

## Template IDs (preferred)

Use registry IDs instead of raw strings:

```typescript
import { resolveTemplate, buildAgentPromptBundle } from "@/lib/prompt-manager";

const { system, user } = buildAgentPromptBundle({
  userTemplateId: "disaster.summarize",
  userContext: {
    audience: "emergency coordinators",
    content: reportText,
    maxWords: 150,
  },
  systemContext: {
    projectName: "Pakistan Disaster Response AI",
    environment: "production",
  },
});
```

Legacy keys in `user.prompt.ts` map to IDs:

| Legacy key       | Template ID                |
| ---------------- | -------------------------- |
| `summarize`      | `disaster.summarize`       |
| `classify`       | `disaster.classify`        |
| `incidentIntake` | `disaster.incident-intake` |

## Variables

- Use `{{camelCase}}` placeholders in templates.
- Declare required fields in `requiredVariables` on each template.
- `resolveTemplate()` throws if required variables are missing.

## Structured output

- Shared instruction: `shared.json-output` (version `1.0.0`).
- `generateStructuredResponse()` appends this automatically via `appendJsonOutputInstruction()`.
- Or pass `appendJsonInstruction: true` to `buildAgentPromptBundle()`.

## Discovery API

```bash
GET /api/prompts
GET /api/prompts?tag=disaster
```

Returns metadata only (id, version, description, tags) — not full prompt bodies.

## Versioning

When changing prompt behavior that affects production outputs:

1. Bump `version` on the template object.
2. Register the new version in the pack (keep old version if rollback needed).
3. Note the change in commit message.
4. Regression-test on sample incidents.

See [docs/PHASE-7.md](./docs/PHASE-7.md).

## Anti-patterns

- Long prompts in JSX or route files
- Duplicating system instructions in every agent
- Hardcoding prompt strings in `agents/` (use template IDs)
- Mixing user PII into logged prompt strings
