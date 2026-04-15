"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { CheckCircle2, Calendar, Clock, DollarSign, ArrowLeft, Download } from "lucide-react";

function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function ConfirmationContent() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();

  const pin = params.get("pin") ?? "????";
  const slot = params.get("slot") ?? "";
  const date = params.get("date") ?? "";
  const total = params.get("total") ?? "0";
  const name = params.get("name") ?? "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-12 bg-transparent">
      <div className="w-full max-w-lg">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button 
           onClick={() => router.push("/book")}
           className="flex items-center gap-2 text-[11px] font-bold text-[#1B4332]/40 hover:text-[#1B4332] uppercase tracking-[0.15em] transition-colors"
          >
            <ArrowLeft size={14} />
            {t.confirm_another_btn}
          </button>
          <LanguageToggle />
        </div>

        {/* Confirmation Card */}
        <div className="flat-card bg-white p-8 sm:p-12 space-y-12">
          {/* Status Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1B4332]/5 flex items-center justify-center mb-6">
              <CheckCircle2 size={32} strokeWidth={1.5} className="text-[#1B4332]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1B4332] tracking-tight mb-2">
              {t.confirm_title}
            </h1>
            <p className="text-[13px] font-medium text-[#1A1A1A]/40 uppercase tracking-widest">
              Réservation confirmée
            </p>
          </div>

          {/* PIN Area */}
          <div className="py-10 border-y border-[#1B4332]/5 text-center">
            <span className="text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.2em] mb-4 block">
              {t.confirm_pin_label}
            </span>
            <div className="flat-pin">
              {pin}
            </div>
            <p className="text-[11px] font-medium text-[#1B4332] mt-4 opacity-40 flex items-center justify-center gap-2">
              <Download size={12} />
              {t.confirm_screenshot_hint}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#1A1A1A]/40 mb-1">
                <Calendar size={13} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.confirm_date}</span>
              </div>
              <p className="text-sm font-bold text-[#1B4332]">{formatDateDisplay(date)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#1A1A1A]/40 mb-1">
                <Clock size={13} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.confirm_slot}</span>
              </div>
              <p className="text-sm font-bold text-[#1B4332]">{slot} — 90 min</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#1A1A1A]/40 mb-1">
                <DollarSign size={13} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.confirm_total}</span>
              </div>
              <p className="text-lg font-bold text-[#1B4332]">{total} DT</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-[#F28482]/5 border border-[#F28482]/10 rounded-xl p-6">
            <p className="text-[11px] font-bold text-[#F28482] uppercase tracking-[0.1em] mb-2">
              Instructions
            </p>
            <p className="text-[13px] font-medium text-[#F28482]/80 leading-relaxed">
              {t.confirm_instruction_body.replace(/\*\*/g, "")}
            </p>
          </div>
        </div>
        
        {/* Footer branding */}
        <div className="mt-12 text-center opacity-30">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#1B4332] uppercase">
            Caribbean World Djerba
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[11px] font-bold text-[#1B4332]/40 tracking-widest uppercase">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
