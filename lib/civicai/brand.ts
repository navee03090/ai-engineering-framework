/** EcoMind AI product branding — single source of truth for titles shown in UI, emails, PDFs. */
export const CIVICAI_PRODUCT_NAME = "EcoMind AI";
export const CIVICAI_TAGLINE = "Pakistan's Intelligent Waste Command Center";
export const CIVICAI_FULL_TITLE =
  "EcoMind AI — Pakistan's Intelligent Waste Command Center";
export const CIVICAI_MARKETING_TAGLINE =
  "AI that doesn't just report waste—it predicts, prioritizes, and coordinates cleanup.";

export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME ?? CIVICAI_FULL_TITLE;
}

export function getShortAppName(): string {
  const env = process.env.NEXT_PUBLIC_APP_NAME;
  if (!env || env === "AI Engineering Framework") {
    return CIVICAI_PRODUCT_NAME;
  }
  return env.startsWith("EcoMind") ? CIVICAI_PRODUCT_NAME : env;
}
