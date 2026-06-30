import { describe, expect, it } from "vitest";

import {
  AUTH_ROUTES,
  isAuthOnlyRoute,
  isProtectedRoute,
} from "@/lib/auth/routes";

describe("auth routes", () => {
  it("detects protected dashboard routes", () => {
    expect(isProtectedRoute("/dashboard")).toBe(true);
    expect(isProtectedRoute("/dashboard/incidents")).toBe(true);
    expect(isProtectedRoute("/uploads")).toBe(true);
    expect(isProtectedRoute("/login")).toBe(false);
  });

  it("detects auth-only routes", () => {
    expect(isAuthOnlyRoute("/login")).toBe(true);
    expect(isAuthOnlyRoute("/signup")).toBe(true);
    expect(isAuthOnlyRoute("/dashboard")).toBe(false);
  });

  it("exposes canonical auth paths", () => {
    expect(AUTH_ROUTES.dashboard).toBe("/dashboard");
    expect(AUTH_ROUTES.callback).toBe("/auth/callback");
  });
});
