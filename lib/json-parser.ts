export function parseModelJson<T = unknown>(raw: string): T {
  const trimmed = raw.trim();

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1]?.trim() ?? trimmed;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      const slice = candidate.slice(start, end + 1);
      return JSON.parse(slice) as T;
    }

    throw new Error("Unable to parse JSON from model response.");
  }
}
