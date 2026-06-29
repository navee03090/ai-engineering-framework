import { describe, expect, it } from "vitest";

import { parseModelJson } from "@/lib/json-parser";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("parseModelJson", () => {
  it("parses raw JSON", () => {
    expect(parseModelJson('{"status":"ok"}')).toEqual({ status: "ok" });
  });

  it("parses fenced JSON", () => {
    const raw = '```json\n{"status":"ok"}\n```';
    expect(parseModelJson(raw)).toEqual({ status: "ok" });
  });
});
