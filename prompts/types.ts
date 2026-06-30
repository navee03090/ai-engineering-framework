export type PromptRole = "system" | "user" | "assistant";

export type PromptTemplate = {
  id: string;
  version: string;
  description: string;
  role: PromptRole;
  template: string;
  requiredVariables?: string[];
  tags?: string[];
};

export type PromptTemplateMeta = Pick<
  PromptTemplate,
  "id" | "version" | "description" | "role" | "tags"
> & {
  requiredVariables: string[];
};

export type PromptContext = Record<string, string | number | boolean | null | undefined>;

export type ResolvedPrompt = {
  id: string;
  version: string;
  role: PromptRole;
  text: string;
};

export type AgentPromptBundle = {
  system: string;
  user: string;
  meta: {
    systemTemplateIds: string[];
    userTemplateId: string;
    userVersion: string;
  };
};
