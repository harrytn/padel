"use client";
import { useI18n } from "@/lib/i18n";
import { Language } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";

const LANGUAGES: { code: Language; name: string }[] = [
  { code: "fr", name: "FR" },
  { code: "en", name: "EN" },
  { code: "de", name: "DE" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="cw-language-toggle bg-white/60 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center rounded-full">
      <Globe className="h-[16px] w-[16px] text-slate-400 shrink-0" strokeWidth={1.5} />
      <div className="flex items-center gap-[12px] sm:gap-[16px]">
        {LANGUAGES.map(({ code, name }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`text-[11px] font-bold tracking-widest transition-colors ${
              lang === code
                ? "text-[#1B4332]"
                : "text-[#1A1A1A]/30 hover:text-[#1B4332]/60"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
