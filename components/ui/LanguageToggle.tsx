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
    <div className="flex items-center gap-4 px-4 py-2 bg-white/40 rounded-full border border-[#1B4332]/10">
      <Globe size={14} strokeWidth={1.5} className="text-[#1B4332]/40" />
      <div className="flex items-center gap-3">
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
