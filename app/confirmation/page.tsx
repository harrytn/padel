"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";

function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Background decorative */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
        />
        <div
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header with lang toggle */}
        <div className="flex justify-end mb-6">
          <LanguageToggle />
        </div>

        {/* Success card */}
        <div className="glass-card overflow-hidden">
          {/* Green success banner */}
          <div
            className="p-6 text-center"
            style={{ background: "linear-gradient(135deg, #0891b2 0%, #14b8a6 100%)" }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl pulse-glow"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              ✅
            </div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {t.confirm_title}
            </h1>
            {name && (
              <p className="text-teal-100 mt-1 text-sm">{name}</p>
            )}
          </div>

          {/* PIN display */}
          <div className="p-6 text-center border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
              {t.confirm_pin_label}
            </p>
            <div id="booking-pin-display" className="pin-display">
              {pin}
            </div>
            <p className="text-sm text-slate-400 mt-3">
              {t.confirm_screenshot_hint}
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
              {t.confirm_booking_details}
            </p>
            {[
              { label: t.confirm_date, value: formatDateDisplay(date) },
              { label: t.confirm_slot, value: `${slot} (90 min)` },
              {
                label: t.confirm_total,
                value: `${total} DT`,
                highlight: true,
              },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{label}</span>
                <span
                  className={`font-semibold ${highlight ? "text-teal-600 text-lg" : "text-slate-700"}`}
                  style={
                    highlight
                      ? { fontFamily: "var(--font-outfit)" }
                      : undefined
                  }
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="p-6 space-y-2" style={{ background: "#fffbeb" }}>
            <p className="font-semibold text-amber-800 text-sm">
              ℹ️ {t.confirm_instruction_title}
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              {t.confirm_instruction_body.replace(/\*\*/g, "")}
            </p>
          </div>

          {/* Action button */}
          <div className="p-6">
            <button
              id="book-another-btn"
              onClick={() => router.push("/book")}
              className="w-full py-3 rounded-xl font-bold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #0891b2, #14b8a6)",
                boxShadow: "0 4px 16px rgba(8,145,178,0.35)",
              }}
            >
              {t.confirm_another_btn}
            </button>
          </div>
        </div>

        {/* Branding footer */}
        <p
          className="text-center text-sm text-slate-400 mt-6"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Caribbean World Djerba · Court de Padel
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
