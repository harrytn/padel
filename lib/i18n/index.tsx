"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  Translations,
  translations,
} from "@/lib/i18n/translations";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "fr",
  setLang: () => {},
  t: translations["fr"],
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cw_lang") as Language | null;
    if (saved && ["fr", "en", "de"].includes(saved)) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("cw_lang", newLang);
  };

  // Prevent hydration mismatch by rendering default until mounted
  if (!mounted) {
    return (
      <I18nContext.Provider value={{ lang: "fr", setLang: () => {}, t: translations["fr"] }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider
      value={{ lang, setLang, t: translations[lang] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}
