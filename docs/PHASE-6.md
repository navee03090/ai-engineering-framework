# Phase 6 — Agent Framework

**Status:** Complete  
**Version:** AEF v1.0

## Goal

Extensible multi-agent architecture with typed I/O, orchestration, memory, and API endpoints — ready for Pakistan Disaster Response AI pipelines.

## Delivered

| Module                       | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `agents/base-agent.ts`       | Abstract agent with Zod validation, logging, memory hooks |
| `agents/types.ts`            | Agent, pipeline, and memory types                         |
| `agents/memory.ts`           | Per-run execution memory store                            |
| `agents/registry.ts`         | Agent registration (`summarizer`, `classifier`)           |
| `agents/orchestrator.ts`     | Single-agent runs and multi-step pipelines                |
| `agents/summarizer.agent.ts` | Text summarization via Gemini                             |
| `agents/classifier.agent.ts` | Structured incident classification (JSON)                 |
| `agents/echo.agent.ts`       | Test-only agent (no Gemini)                               |
| `agents/index.ts`            | Public exports + `createAgentRuntime()`                   |

## API endpoints

| Method | Route                  | Description             |
| ------ | ---------------------- | ----------------------- |
| `GET`  | `/api/agents`          | List registered agents  |
| `POST` | `/api/agents/run`      | Run one agent           |
| `POST` | `/api/agents/pipeline` | Run sequential pipeline |

Requires `GEMINI_API_KEY` for `run` and `pipeline` (except unit tests using `EchoAgent`).

### Example — run summarizer

```bash
curl -X POST http://localhost:3000/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "summarizer",
    "input": {
      "content": "Flash flood reported in Swat valley. Roads blocked.",
      "audience": "emergency coordinators"
    }
  }'
```

### Example — classify then summarize pipeline

```bash
curl -X POST http://localhost:3000/api/agents/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      {
        "agent": "classifier",
        "input": {
          "content": "Building collapse in Karachi, multiple injuries reported."
        }
      },
      {
        "agent": "summarizer",
        "mapInput": "USE_SERVER_MAP"
      }
    ]
  }'
```

> Note: `mapInput` functions are only available in TypeScript code, not JSON API bodies. For HTTP pipelines, pass explicit `input` per step.

## TypeScript usage

```typescript
import { orchestrator } from "@/agents/orchestrator";

const classified = await orchestrator.run("classifier", {
  content: "Wildfire near forest reserve.",
});

if (classified.success) {
  const summary = await orchestrator.run("summarizer", {
    content: classified.data.summary,
    audience: "field teams",
  });
}
```

### Pipeline with `mapInput`

```typescript
const result = await orchestrator.runPipeline([
  {
    agent: "classifier",
    input: { content: incidentText },
  },
  {
    agent: "summarizer",
    mapInput: (previous) => ({
      content: (previous.data as { summary: string }).summary,
      audience: "command center",
    }),
  },
]);
```

## Adding a new agent

1. Create `agents/my-agent.agent.ts` extending `BaseAgent`.
2. Define Zod input/output schemas.
3. Load prompts from `prompts/` — no inline prompt strings in components.
4. Register in `agents/registry.ts` → `registerDefaultAgents()`.
5. Add unit tests (use `EchoAgent` pattern or mocks).

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Next phase

**Phase 7 — Prompt Framework:** expand `prompts/templates/`, versioning, and feature-specific prompt packs.
