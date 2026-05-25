"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { CheckCircle2, Calendar, Clock, DollarSign, ArrowLeft, Download } from "lucide-react";

function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
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

  return (
    <div className="min-h-screen bg-[url('/bg-tropical.png')] bg-cover bg-center bg-fixed flex items-center justify-center p-6">

      <div className="w-full max-w-2xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/book")}
            className="flex items-center gap-2 text-[11px] font-bold text-white/70 hover:text-white uppercase tracking-[0.15em] transition-colors"
          >
            <ArrowLeft size={14} />
            {t.confirm_another_btn}
          </button>
          <LanguageToggle />
        </div>

        {/* ── Glassmorphism Receipt Card ── */}
        <div className="w-full bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/10 border border-white/20 p-8 md:p-12 space-y-10">

          {/* Status Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#2CAFC2] flex items-center justify-center mb-5 shadow-lg shadow-[#2CAFC2]/30">
              <CheckCircle2 size={32} strokeWidth={1.5} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E2438] tracking-tight mb-1">
              {t.confirm_title}
            </h1>
            <p className="text-[13px] font-medium text-[#1E2438]/40 uppercase tracking-widest">
              Réservation confirmée
            </p>
          </div>

          {/* PIN / Reservation Code */}
          <div className="py-8 border-y border-[#1E2438]/10 text-center">
            <span className="text-sm font-semibold text-[#DB8248] uppercase tracking-[0.2em] mb-4 block">
              {t.confirm_pin_label}
            </span>
            <div className="text-5xl md:text-6xl font-bold text-[#E41E2D] tracking-widest py-2">
              {pin}
            </div>
            <p className="text-[11px] font-medium text-[#1E2438]/40 mt-4 flex items-center justify-center gap-2">
              <Download size={12} />
              {t.confirm_screenshot_hint}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={13} strokeWidth={1.5} className="text-[#DB8248]" />
                <span className="text-sm font-semibold text-[#DB8248] uppercase">{t.confirm_date}</span>
              </div>
              <p className="text-lg font-medium text-[#1E2438] capitalize">{formatDateDisplay(date)}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={13} strokeWidth={1.5} className="text-[#DB8248]" />
                <span className="text-sm font-semibold text-[#DB8248] uppercase">{t.confirm_slot}</span>
              </div>
              <p className="text-lg font-medium text-[#1E2438]">{slot} — 90 min</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={13} strokeWidth={1.5} className="text-[#DB8248]" />
                <span className="text-sm font-semibold text-[#DB8248] uppercase">{t.confirm_total}</span>
              </div>
              <p className="text-lg font-medium text-[#1E2438]">{total} DT</p>
            </div>
          </div>

          {/* Instructions Notice */}
          <div className="bg-[#EEBB3B]/20 border border-[#EEBB3B]/50 rounded-xl p-4 mt-6">
            <p className="text-[11px] font-bold text-[#DB8248] uppercase tracking-[0.1em] mb-2">
              Instructions
            </p>
            <p className="text-sm font-medium text-[#1E2438] leading-relaxed">
              {t.confirm_instruction_body.replace(/\*\*/g, "")}
            </p>
          </div>
        </div>

        {/* Footer branding */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Image
              src="/logo-no-bg.png"
              alt="Caribbean World Djerba"
              width={24}
              height={24}
              className="h-6 w-auto object-contain"
            />
            <p className="text-[10px] font-bold tracking-[0.25em] text-white uppercase">
              Caribbean World Djerba
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[url('/bg-tropical.png')] bg-cover bg-center bg-fixed flex items-center justify-center">
        <span className="text-[11px] font-bold text-white/60 tracking-widest uppercase">Loading...</span>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
