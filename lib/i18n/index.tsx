"use client";
import React, { createContext, useContext, useState } from "react";
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
  const [lang, setLang] = useState<Language>("fr");

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
