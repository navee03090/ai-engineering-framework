# Agent Design Guide

## Purpose

Agents coordinate multi-step AI workflows — classification, OCR, vision, orchestration — without bloating route handlers.

## Structure (Phase 6+)

```
agents/
├── types.ts              # Agent interfaces
├── base-agent.ts         # Abstract base class
├── orchestrator.ts       # Multi-agent coordination
├── memory.ts             # Per-run execution memory
├── registry.ts           # Agent registration
├── summarizer.agent.ts   # Example: text summarization
├── classifier.agent.ts   # Example: structured incident classification
├── echo.agent.ts         # Test agent (no Gemini)
└── index.ts              # Public exports
```

## Design rules

1. **Single responsibility** — one agent per task (classify, summarize, extract, decide).
2. **Orchestrator owns flow** — agents do not call each other directly; the orchestrator sequences them.
3. **Typed I/O** — each agent declares input/output Zod schemas.
4. **Prompts external** — agents load prompts from `prompts/`, not inline strings.
5. **Observable** — log agent name, duration, and success/failure (not sensitive content).

## Pakistan Disaster Response AI patterns

| Agent | Role |
|-------|------|
| Intake | Parse incident reports, normalize fields |
| Vision | Analyze images/video frames |
| OCR | Extract text from documents |
| Classifier | Severity and category assignment |
| Orchestrator | Route incidents through the pipeline |
| Notifier | Trigger email/n8n when thresholds met |

## Sprint 1 status

Agent framework scaffolding is reserved in `agents/`. Full `BaseAgent`, registry, and orchestrator ship in **Phase 6**.

## Extension example (future)

```typescript
// agents/classifier.agent.ts
export class ClassifierAgent extends BaseAgent<IncidentInput, ClassificationOutput> {
  readonly name = "classifier";
  // ...
}
```

Register in `registry.ts`; invoke from `orchestrator.ts` or `services/ai.service.ts`.

See [docs/PHASE-6.md](./docs/PHASE-6.md) for API endpoints and pipeline examples.
