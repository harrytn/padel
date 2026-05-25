"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SlotGrid from "@/components/booking/SlotGrid";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { SlotData } from "@/components/booking/SlotCard";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function maxISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function BookPage() {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [settings, setSettings] = useState<{
    base_price: number;
    racket_price_with_balls: number;
    balls_only_price: number;
    lighting_price: number;
    peak_premium: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [slotTakenError, setSlotTakenError] = useState(false);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoading(true);
    setError(null);
    setSlotTakenError(false);
    try {
      const res = await fetch(`/api/slots?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
        setSettings(data.settings);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || t.error_generic);
        setSlots([]);
      }
    } catch (err) {
      console.error("fetchSlots error:", err);
      setError(t.error_generic);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [t.error_generic]);

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const handleSlotTaken = () => {
    setSelectedSlot(null);
    setSlotTakenError(true);
    fetchSlots(selectedDate);
  };

  return (
    <div className="bg-[url('/bg-tropical.png')] bg-cover bg-center bg-fixed min-h-screen">
      {/* Subtle dark tint */}
      <div className="fixed inset-0 bg-[#1E2438]/20 -z-10" />

      <div className="max-w-[1500px] mx-auto px-8 py-8">
        
        {/* ── TOP HEADER ── */}
        <header className="rounded-[28px] bg-white/55 backdrop-blur-sm border border-white/40 shadow-lg px-8 py-5 flex items-center justify-between gap-8">
          {/* Left: Brand */}
          <div className="flex items-center gap-[12px] shrink-0">
            <Image src="/logo-no-bg.png" alt="Caribbean World Djerba" width={48} height={48} className="h-[48px] w-auto object-contain" priority />
            <span className="font-bold text-[18px] text-[#1E2438] tracking-tight hidden sm:block">Caribbean World</span>
          </div>
          
          {/* Center: Title */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#1E2438] tracking-tight">
              {t.book_title}
            </h1>
            <span className="text-[15px] font-medium text-[#1E2438]/70 capitalize mt-1 hidden sm:block">
              {selectedDate ? formatDateDisplay(selectedDate) : ""}
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-6 shrink-0">
            <input type="date" value={selectedDate} min={todayISO()} max={maxISO()} onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }} className="h-12 px-5 rounded-2xl bg-white/80 border border-cyan-200 shadow-sm text-[15px] font-bold text-[#1E2438] outline-none focus:border-[#2CAFC2] transition-colors cursor-pointer" />
            <LanguageToggle />
          </div>
        </header>

        {/* ── MAIN CONTENT LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-10 items-start mt-[48px] outline outline-[4px] outline-green-500">
          
          {/* ── SIDEBAR ── */}
          <aside className="w-full lg:w-[280px] rounded-[30px] bg-white/60 backdrop-blur-sm border border-white/40 shadow-xl px-[24px] py-[28px] flex flex-col gap-[28px]">
            {/* Navigation */}
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="h-[56px] px-[20px] flex items-center gap-[12px] rounded-[20px] transition-all bg-cyan-50 text-[#1E2438] font-bold text-[15px] shadow-sm border border-cyan-100"
              >
                <span className="material-symbols-outlined text-[20px] text-[#2CAFC2]">sports_tennis</span>
                Courts
              </a>
              <a
                href="/admin"
                className="h-[56px] px-[20px] flex items-center gap-[12px] rounded-[20px] transition-all text-[#1E2438]/70 font-semibold text-[15px] hover:bg-white/50"
              >
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                Accès Staff
              </a>
            </nav>

            {/* Legend */}
            <div className="px-[8px]">
              <p className="text-[12px] font-bold text-[#1E2438]/40 uppercase tracking-widest mb-4">
                Légende
              </p>
              <ul className="flex flex-col space-y-3">
                <li className="flex items-center gap-[12px] text-[14px] font-medium text-slate-700 leading-relaxed">
                  <span className="w-4 h-4 rounded-md border-2 border-cyan-400 bg-white shrink-0" />
                  Disponible
                </li>
                <li className="flex items-center gap-[12px] text-[14px] font-medium text-slate-700 leading-relaxed">
                  <span className="w-4 h-4 rounded-md bg-amber-200 border border-amber-300 shrink-0" />
                  Occupé
                </li>
                <li className="flex items-center gap-[12px] text-[14px] font-medium text-slate-700 leading-relaxed">
                  <span className="w-4 h-4 rounded-md bg-[#E41E2D] shrink-0" />
                  Sélectionné
                </li>
                <li className="flex items-center gap-[12px] text-[14px] font-medium text-slate-700 leading-relaxed">
                  <span className="w-4 h-4 rounded-md bg-slate-300 border border-slate-400 shrink-0" />
                  Passé
                </li>
              </ul>
            </div>
          </aside>

          {/* ── WHITE CARD GRID PANEL ── */}
          <main className="booking-panel-root rounded-[30px] bg-white/60 backdrop-blur-sm border border-white/40 shadow-xl flex flex-col outline outline-[4px] outline-blue-500">
            <div className="flex items-center justify-between mb-[32px]">
              <h2 className="text-[24px] font-bold text-[#1E2438] tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-[#2CAFC2] text-3xl">sports_tennis</span>
                Créneaux disponibles
              </h2>
              <span className="px-4 py-2 rounded-full bg-white/60 text-xs font-bold tracking-widest text-slate-500 shadow-sm border border-white/40">
                9 SLOTS / JOUR
              </span>
            </div>

            {slotTakenError && (
              <div className="mb-7 px-[20px] py-[16px] bg-[#E41E2D]/10 border border-[#E41E2D]/30 rounded-[16px] text-[14px] font-bold text-[#E41E2D] text-center">
                ⚠️ {t.checkout_slot_taken}
              </div>
            )}

            <SlotGrid
              slots={slots}
              selectedSlot={selectedSlot?.slotStart ?? null}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setSlotTakenError(false);
              }}
              loading={loading}
              error={error}
              selectedDate={selectedDate}
            />

            <div className="mt-8 pt-6 border-t border-white/40 text-center">
              <p className="text-[13px] font-medium text-[#1E2438]/60">
                Merci de vous présenter à la réception 15 minutes avant votre session.
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      {selectedSlot && settings && (
        <CheckoutModal
          slot={selectedSlot}
          settings={settings}
          date={selectedDate}
          onClose={() => setSelectedSlot(null)}
          onSlotTaken={handleSlotTaken}
        />
      )}
    </div>
  );
}