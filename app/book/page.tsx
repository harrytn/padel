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
    <div className="bg-[url('/bg-tropical.png')] bg-cover bg-center bg-fixed min-h-screen p-[16px] md:p-[32px]">
      {/* Subtle dark tint */}
      <div className="fixed inset-0 bg-[#1E2438]/20 -z-10" />

      {/* ── UNIFIED APP WINDOW ── */}
      <div className="max-w-[1480px] mx-auto bg-white/40 backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl flex flex-col min-h-[85vh] border border-white/50">
        
        {/* ── TOP HEADER ── */}
        <header className="w-full bg-white/40 border-b border-white/30 px-[32px] h-[96px] flex items-center justify-between shrink-0">
          {/* Left: Brand */}
          <div className="flex items-center gap-[12px] w-[260px] shrink-0">
            <Image src="/logo-no-bg.png" alt="Caribbean World Djerba" width={48} height={48} className="h-[48px] w-auto object-contain" priority />
            <span className="font-bold text-[18px] text-[#1E2438] tracking-tight hidden sm:block">Caribbean World</span>
          </div>
          
          {/* Center: Title (Pushed away from brand) */}
          <div className="flex-1 flex justify-start pl-[48px]">
            <h1 className="text-[22px] font-extrabold text-[#1E2438] tracking-tight hidden md:block">
              {t.book_title}
            </h1>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-[32px]">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[15px] font-bold text-[#1E2438] capitalize">
                {selectedDate ? formatDateDisplay(selectedDate) : ""}
              </span>
            </div>
            <input type="date" value={selectedDate} min={todayISO()} max={maxISO()} onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }} className="h-[44px] px-[20px] rounded-[14px] bg-white border border-black/10 shadow-sm text-[15px] font-bold text-[#1E2438] outline-none focus:border-[#2CAFC2] transition-colors cursor-pointer" />
            <div className="w-[1px] h-[32px] bg-black/10 hidden sm:block"></div>
            <LanguageToggle />
          </div>
        </header>

        {/* ── MAIN CONTENT LAYOUT ── */}
        <div className="flex flex-col lg:flex-row flex-1 p-[32px] gap-[48px]">
          
          {/* ── SIDEBAR ── */}
          <aside className="w-full lg:w-[260px] shrink-0 flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex flex-col gap-[8px] mb-[48px]">
              <a
                href="#"
                className="h-[48px] px-[16px] rounded-[16px] flex items-center gap-[16px] bg-white/60 backdrop-blur-md text-[#1E2438] font-bold text-[15px] shadow-sm border border-white/50"
              >
                <span className="material-symbols-outlined text-[20px] text-[#2CAFC2]">sports_tennis</span>
                Courts
              </a>
              <a
                href="/admin"
                className="h-[48px] px-[16px] rounded-[16px] flex items-center gap-[16px] text-[#1E2438]/60 font-semibold text-[15px] hover:bg-black/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                Accès Staff
              </a>
            </nav>

            {/* Legend */}
            <div className="mt-auto">
              <p className="text-[12px] font-bold text-[#1E2438]/40 uppercase tracking-widest mb-[24px]">
                Légende
              </p>
              <ul className="flex flex-col gap-[16px]">
                <li className="flex items-center gap-[16px] text-[14px] text-[#1E2438]/80 font-semibold">
                  <span className="w-[16px] h-[16px] rounded-[4px] border-2 border-[#2CAFC2] bg-white shrink-0" />
                  Disponible
                </li>
                <li className="flex items-center gap-[16px] text-[14px] text-[#1E2438]/80 font-semibold">
                  <span className="w-[16px] h-[16px] rounded-[4px] bg-[#EEBB3B] shrink-0" />
                  Occupé
                </li>
                <li className="flex items-center gap-[16px] text-[14px] text-[#1E2438]/80 font-semibold">
                  <span className="w-[16px] h-[16px] rounded-[4px] bg-[#E41E2D] shrink-0" />
                  Sélectionné
                </li>
                <li className="flex items-center gap-[16px] text-[14px] text-[#1E2438]/80 font-semibold">
                  <span className="w-[16px] h-[16px] rounded-[4px] bg-black/10 shrink-0" />
                  Passé
                </li>
              </ul>
            </div>
          </aside>

          {/* ── WHITE CARD GRID PANEL ── */}
          <main className="flex-1 bg-white/50 backdrop-blur-lg rounded-[24px] shadow-sm border border-white/50 flex flex-col p-[40px]">
            <div className="flex justify-between items-center mb-[40px] w-full">
              <h2 className="text-[24px] font-bold text-[#1E2438] tracking-tight">
                Créneaux disponibles
              </h2>
              <span className="text-[12px] font-bold text-[#1E2438]/40 uppercase tracking-widest bg-black/5 px-[16px] py-[8px] rounded-full">
                9 slots / jour
              </span>
            </div>

            {slotTakenError && (
              <div className="mb-[24px] px-[20px] py-[16px] bg-[#E41E2D]/10 border border-[#E41E2D]/30 rounded-[16px] text-[14px] font-bold text-[#E41E2D] text-center">
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

            <div className="mt-auto pt-[40px]">
              <p className="border-t border-[#1E2438]/10 pt-[24px] text-[13px] font-medium text-[#1E2438]/50 text-center">
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