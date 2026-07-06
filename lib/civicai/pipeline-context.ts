import type { IntentOutput, KnowledgeOutput } from "@/agents/civicai-schemas";

/** Compact knowledge text for the recommendation agent (~60% fewer tokens than JSON). */
export function formatKnowledgeForRecommendation(knowledge: KnowledgeOutput): string {
  const warnings =
    knowledge.warnings.length > 0 ? `\nWarnings: ${knowledge.warnings.join("; ")}` : "";
  const instructions =
    knowledge.instructions.length > 0
      ? `\nSteps: ${knowledge.instructions.join(" → ")}`
      : "";

  return [
    `Service: ${knowledge.serviceName} (${knowledge.serviceSlug})`,
    `Department: ${knowledge.department}`,
    `Fee: ${knowledge.fee} | Processing: ${knowledge.processingTime}`,
    `Documents: ${knowledge.documents.join(", ")}`,
    knowledge.description,
    warnings,
    instructions,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Compact intent text for the recommendation agent. */
export function formatIntentForRecommendation(intent: IntentOutput): string {
  const entities =
    intent.entities.length > 0 ? intent.entities.join(", ") : "none";
  return [
    `Intent: ${intent.intent}`,
    `Query: ${intent.translatedQuery}`,
    `Service: ${intent.serviceName}`,
    `Entities: ${entities}`,
    `Confidence: ${intent.confidence}%`,
  ].join("\n");
}
