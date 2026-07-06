export type CivicLanguage = "en" | "ur";

export const CIVIC_LANGUAGE_STORAGE_KEY = "civicai-language";

export const CIVIC_LANGUAGE_LABELS: Record<CivicLanguage, string> = {
  en: "English",
  ur: "اردو (Urdu)",
};

export function isCivicLanguage(value: string): value is CivicLanguage {
  return value === "en" || value === "ur";
}

export function getStoredLanguage(): CivicLanguage {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(CIVIC_LANGUAGE_STORAGE_KEY);
  return stored && isCivicLanguage(stored) ? stored : "en";
}

export function setStoredLanguage(language: CivicLanguage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CIVIC_LANGUAGE_STORAGE_KEY, language);
}
