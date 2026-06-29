# Prompt Engineering Guide

## Location

All prompts live in `prompts/`:

| File | Role |
|------|------|
| `base.prompt.ts` | Framework-wide AI behavior |
| `system.prompt.ts` | Project context with `{{variables}}` |
| `user.prompt.ts` | Reusable user message templates |
| `templates/` | Feature-specific templates (add as needed) |

## Composition

Use `lib/prompt-manager.ts`:

```typescript
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-manager";
import { userPromptTemplates } from "@/prompts/user.prompt";

const system = buildSystemPrompt({
  projectName: "Pakistan Disaster Response AI",
  environment: "production",
});

const user = buildUserPrompt(userPromptTemplates.summarize, {
  audience: "emergency coordinators",
  content: reportText,
});
```

## Variables

- Use `{{camelCase}}` placeholders in templates.
- Missing variables become empty strings — validate required context in services.

## Structured output

Append explicit JSON instructions when using `generateStructuredResponse()`.

Define Zod schemas next to the feature or in `lib/validations.ts` for shared shapes.

## Versioning

When changing prompt behavior that affects production outputs:

1. Update the prompt file.
2. Note the change in commit message.
3. For disaster-response features, regression-test on sample incidents.

## Anti-patterns

- Long prompts in JSX or route files
- Duplicating system instructions in every agent
- Mixing user PII into logged prompt strings
