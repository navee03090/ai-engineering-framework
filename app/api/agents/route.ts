import { orchestrator } from "@/agents/orchestrator";
import { apiSuccess } from "@/lib/api/responses";

export async function GET() {
  const agents = orchestrator.listAgents();
  return apiSuccess({ agents, count: agents.length });
}
