export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  callback: "/auth/callback",
} as const;

export const PROTECTED_ROUTE_PREFIXES = ["/dashboard"] as const;

export const AUTH_ONLY_ROUTE_PREFIXES = ["/login", "/signup"] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
