import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import {
  complianceOutputSchema,
  intentOutputSchema,
  knowledgeOutputSchema,
  recommendationOutputSchema,
  type ReportOutput,
} from "@/agents/civicai-schemas";
import type { AgentContext } from "@/agents/types";
import {
  buildQueryReport,
  buildVerificationReport,
} from "@/lib/civicai/build-report";
import type { CivicLanguage } from "@/lib/civicai/language";

export const reportInputSchema = z.object({
  reportType: z.enum(["query", "verification"]),
  serviceName: z.string().min(1),
  intentData: z.string().default("{}"),
  knowledgeData: z.string().min(1),
  recommendationData: z.string().default("{}"),
  complianceData: z.string().default("{}"),
  language: z.enum(["en", "ur"]).default("en"),
});

export class ReportAgent extends BaseAgent<
  z.infer<typeof reportInputSchema>,
  ReportOutput
> {
  readonly name = "report";
  readonly description =
    "Assembles final environmental incident summary, printable report, PDF content, and QR data from pipeline results.";
  readonly inputSchema = reportInputSchema;

  protected async run(
    input: z.infer<typeof reportInputSchema>,
    context: AgentContext
  ): Promise<ReportOutput> {
    void context;
    const language = input.language as CivicLanguage;
    const knowledge = knowledgeOutputSchema.parse(JSON.parse(input.knowledgeData));

    if (input.reportType === "verification") {
      const compliance = complianceOutputSchema.parse(JSON.parse(input.complianceData));
      return buildVerificationReport(knowledge, compliance, language);
    }

    const intent = intentOutputSchema.parse(JSON.parse(input.intentData));
    const recommendation = recommendationOutputSchema.parse(
      JSON.parse(input.recommendationData)
    );

    return buildQueryReport(intent, knowledge, recommendation, language);
  }
}
