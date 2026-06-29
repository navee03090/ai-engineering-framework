# AI Rules

## Provider

- **Primary:** Google Gemini (`gemini-2.5-flash` by default).
- All model access goes through `lib/gemini.ts` and `lib/ai.ts`.

## Prompts

- Never hardcode long prompts inside components.
- Store prompts in `prompts/` and compose with `lib/prompt-manager.ts`.
- Use `{{variable}}` interpolation for dynamic context.

## Structured output

- When expecting JSON, use `generateStructuredResponse()` with a Zod schema.
- Parse with `lib/json-parser.ts`; validate with `lib/response-validator.ts`.

## Agents (Phase 6+)

- Extend `BaseAgent`; register in `agents/registry.ts`.
- Orchestration flows through `agents/orchestrator.ts`.
- Agent memory uses `agents/memory.ts` — not browser `localStorage` for sensitive data.

## Safety

- Do not send secrets, API keys, or service-role tokens to the model.
- Sanitize user content before including in prompts when handling untrusted input.
- Log AI failures without logging full prompts that contain PII.

## Disaster-response context

For Pakistan Disaster Response AI and similar projects:

- Prefer actionable, concise outputs.
- Flag uncertainty explicitly.
- Never fabricate incident data, locations, or casualty figures.

## Cursor behavior

- Read `PROJECT_CONSTITUTION.md` at the start of each session.
- Follow folder boundaries: no AI calls from UI components directly.
- When adding AI features, update `PROMPT_ENGINEERING.md` or `AGENT_DESIGN.md` if patterns change.
