"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

import {
  CIVIC_LANGUAGE_LABELS,
  type CivicLanguage,
  getStoredLanguage,
  setStoredLanguage,
} from "@/lib/civicai/language";
import { useHasMounted } from "@/hooks/use-has-mounted";

type CivicLanguageContextValue = {
  language: CivicLanguage;
  setLanguage: (language: CivicLanguage) => void;
  label: string;
};

const LANGUAGE_EVENT = "civic-language-change";

const CivicLanguageContext = createContext<CivicLanguageContextValue | null>(null);

function subscribeLanguage(onStoreChange: () => void) {
  window.addEventListener(LANGUAGE_EVENT, onStoreChange);
  return () => window.removeEventListener(LANGUAGE_EVENT, onStoreChange);
}

function getClientLanguage(): CivicLanguage {
  return getStoredLanguage();
}

export function CivicLanguageProvider({ children }: { children: React.ReactNode }) {
  const mounted = useHasMounted();
  const language = useSyncExternalStore(
    subscribeLanguage,
    getClientLanguage,
    () => "en" as CivicLanguage
  );

  const setLanguage = useCallback((next: CivicLanguage) => {
    setStoredLanguage(next);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CivicLanguageContext.Provider
      value={{
        language,
        setLanguage,
        label: CIVIC_LANGUAGE_LABELS[language],
      }}
    >
      {children}
    </CivicLanguageContext.Provider>
  );
}

export function useCivicLanguage() {
  const context = useContext(CivicLanguageContext);
  if (!context) {
    return {
      language: "en" as CivicLanguage,
      setLanguage: () => {},
      label: CIVIC_LANGUAGE_LABELS.en,
    };
  }
  return context;
}
