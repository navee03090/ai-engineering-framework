import { describe, expect, it } from "vitest";

import {
  ALLOWED_MIME_TYPES,
  getFileCategory,
  MAX_UPLOAD_BYTES,
  validateUploadFile,
} from "@/lib/validations/uploads";
import { isProtectedRoute } from "@/lib/auth/routes";

describe("upload validations", () => {
  it("categorizes mime types", () => {
    expect(getFileCategory("image/png")).toBe("image");
    expect(getFileCategory("application/pdf")).toBe("pdf");
    expect(getFileCategory("audio/mpeg")).toBe("audio");
    expect(getFileCategory("text/plain")).toBe("document");
  });

  it("rejects oversized files", () => {
    const file = new File(["x"], "big.bin", { type: "image/png" });
    Object.defineProperty(file, "size", { value: MAX_UPLOAD_BYTES + 1 });

    expect(() => validateUploadFile(file)).toThrow(/10MB/);
  });

  it("rejects disallowed mime types", () => {
    const file = new File(["x"], "bad.exe", { type: "application/x-msdownload" });
    expect(() => validateUploadFile(file)).toThrow(/not allowed/);
  });

  it("accepts allowed image types", () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    expect(() => validateUploadFile(file)).not.toThrow();
    expect(ALLOWED_MIME_TYPES).toContain("image/png");
  });
});

describe("protected upload route", () => {
  it("includes uploads path", () => {
    expect(isProtectedRoute("/uploads")).toBe(true);
  });
});
