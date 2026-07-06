import type { CivicLanguage } from "@/lib/civicai/language";
import { GOVERNMENT_SERVICES } from "@/lib/civicai/data/services";

export function buildServicesKnowledge(): string {
  return GOVERNMENT_SERVICES.map(
    (s) =>
      `- ${s.name} (id: ${s.id})
  Department: ${s.department}
  Fee: ${s.fee}
  Processing: ${s.processingTime}
  Documents: ${s.documents.join(", ")}`
  ).join("\n");
}

export function getLanguageInstruction(language: CivicLanguage): string {
  if (language === "ur") {
    return "Respond in Urdu (اردو). Use simple, respectful language suitable for Pakistani citizens. Keep official terms (CNIC, NADRA, etc.) in English where standard.";
  }
  return "Respond in clear, simple English suitable for Pakistani citizens.";
}
