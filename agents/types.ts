export type AgentContext = Record<string, unknown>;

export type AgentResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
};

export type AgentDefinition = {
  name: string;
  description: string;
  run: (input: unknown, context?: AgentContext) => Promise<AgentResult<unknown>>;
};
