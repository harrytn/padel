"use client";
import { useI18n } from "@/lib/i18n";
import { Language } from "@/lib/i18n/translations";

const LANGUAGES: { code: Language; flag: string }[] = [
  { code: "fr", flag: "🇫🇷" },
  { code: "en", flag: "🇬🇧" },
  { code: "de", flag: "🇩🇪" },
];

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full p-1 border border-white/80 shadow-sm">
      {LANGUAGES.map(({ code, flag }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          title={t[`lang_${code}` as keyof typeof t] as string}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            lang === code
              ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm"
              : "text-slate-600 hover:text-teal-700 hover:bg-teal-50"
          }`}
          style={lang === code ? { background: "linear-gradient(135deg, #0891b2, #14b8a6)" } : {}}
        >
          <span>{flag}</span>
          <span className="hidden sm:inline">{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
