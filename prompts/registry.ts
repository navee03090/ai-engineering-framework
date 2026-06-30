import { promptTemplatePacks } from "@/prompts/templates";
import type { PromptTemplate, PromptTemplateMeta } from "@/prompts/types";

function templateKey(id: string, version: string): string {
  return `${id}@${version}`;
}

function compareVersions(a: string, b: string): number {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i += 1) {
    const diff = (aParts[i] ?? 0) - (bParts[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

export class PromptRegistry {
  private readonly templates = new Map<string, PromptTemplate>();

  register(template: PromptTemplate): void {
    const key = templateKey(template.id, template.version);

    if (this.templates.has(key)) {
      throw new Error(`Prompt template already registered: ${key}`);
    }

    this.templates.set(key, template);
  }

  registerMany(templates: PromptTemplate[]): void {
    templates.forEach((template) => this.register(template));
  }

  get(id: string, version?: string): PromptTemplate {
    if (version) {
      const exact = this.templates.get(templateKey(id, version));
      if (!exact) {
        throw new Error(`Prompt template not found: ${id}@${version}`);
      }
      return exact;
    }

    const matches = [...this.templates.values()]
      .filter((template) => template.id === id)
      .sort((a, b) => compareVersions(b.version, a.version));

    if (!matches[0]) {
      throw new Error(`Prompt template not found: ${id}`);
    }

    return matches[0];
  }

  has(id: string, version?: string): boolean {
    try {
      this.get(id, version);
      return true;
    } catch {
      return false;
    }
  }

  list(): PromptTemplateMeta[] {
    return [...this.templates.values()]
      .map((template) => ({
        id: template.id,
        version: template.version,
        description: template.description,
        role: template.role,
        tags: template.tags ?? [],
        requiredVariables: template.requiredVariables ?? [],
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  listByTag(tag: string): PromptTemplateMeta[] {
    return this.list().filter((template) => template.tags?.includes(tag));
  }

  clear(): void {
    this.templates.clear();
  }
}

export const promptRegistry = new PromptRegistry();

let defaultsRegistered = false;

export function registerDefaultPrompts(registry: PromptRegistry = promptRegistry): void {
  if (defaultsRegistered && registry === promptRegistry) {
    return;
  }

  const templates = Object.values(promptTemplatePacks).flatMap((pack) =>
    Object.values(pack)
  ) as PromptTemplate[];

  templates.forEach((template) => {
    if (!registry.has(template.id, template.version)) {
      registry.register(template);
    }
  });

  if (registry === promptRegistry) {
    defaultsRegistered = true;
  }
}

export function ensurePromptRegistry(registry: PromptRegistry = promptRegistry): PromptRegistry {
  registerDefaultPrompts(registry);
  return registry;
}
