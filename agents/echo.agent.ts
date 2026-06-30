import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";

export const echoInputSchema = z.object({
  message: z.string().min(1),
});

export type EchoInput = z.infer<typeof echoInputSchema>;
export type EchoOutput = { echo: string };

export class EchoAgent extends BaseAgent<EchoInput, EchoOutput> {
  readonly name = "echo";
  readonly description = "Test agent that echoes input without calling Gemini.";
  readonly inputSchema = echoInputSchema;

  protected async run(input: EchoInput): Promise<EchoOutput> {
    return { echo: input.message };
  }
}
