/** CivicAI product branding — single source of truth for titles shown in UI, emails, PDFs. */
export const CIVICAI_PRODUCT_NAME = "CivicAI";
export const CIVICAI_TAGLINE = "Pakistan Citizen Assistant";
export const CIVICAI_FULL_TITLE = "CivicAI — Pakistan Citizen Assistant";
export const CIVICAI_MARKETING_TAGLINE =
  "AI-powered Civic Navigation for Transparent Government Services";

export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME ?? CIVICAI_FULL_TITLE;
}

export function getShortAppName(): string {
  const env = process.env.NEXT_PUBLIC_APP_NAME;
  if (!env || env === "AI Engineering Framework") {
    return CIVICAI_PRODUCT_NAME;
  }
  return env.startsWith("CivicAI") ? CIVICAI_PRODUCT_NAME : env;
}
