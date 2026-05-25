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

/** Glass card shared class string */
const GLASS = "bg-white/75 backdrop-blur-md rounded-3xl shadow-xl shadow-black/10 border border-white/20";

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
      {/* Subtle dark tint so glass cards pop */}
      <div className="fixed inset-0 bg-[#1E2438]/30 -z-10" />

      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo + brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-no-bg.png"
              alt="Caribbean World Djerba"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              priority
              loading="eager"
            />
            <span className="font-bold text-lg text-[#1E2438] tracking-tight hidden sm:block">
              Caribbean World Djerba
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#DB8248]"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button
              aria-label="Compte"
              className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#DB8248]"
            >
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Body ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8">

        {/* ══ SIDEBAR CARD ══════════════════════════════════════════════════ */}
        <aside className={`hidden md:flex flex-col ${GLASS} p-8 w-80 shrink-0 sticky top-24 self-start gap-8`}>
          {/* Logo block */}
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/logo-no-bg.png"
              alt="Logo"
              width={72}
              height={72}
              className="h-18 w-auto object-contain"
            />
            <div>
              <p className="font-bold text-base text-[#1E2438]">Court Booking</p>
              <p className="text-xs text-[#1E2438]/50 mt-0.5 leading-relaxed">Caribbean World</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {/* Active item */}
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#2CAFC2]/10 text-[#2CAFC2] font-bold text-sm leading-relaxed"
            >
              <span className="material-symbols-outlined text-xl">sports_tennis</span>
              Courts
            </a>
            <a
              href="/admin"
              className="flex items-center gap-3 p-3 rounded-xl text-[#1E2438]/70 font-semibold text-sm hover:bg-black/5 transition-colors leading-relaxed"
            >
              <span className="material-symbols-outlined text-xl text-[#DB8248]">admin_panel_settings</span>
              Accès Staff
            </a>
          </nav>

          {/* Legend */}
          <div className="border-t border-[#1E2438]/10 pt-6">
            <p className="text-[10px] font-bold text-[#1E2438]/40 uppercase tracking-widest mb-3 leading-relaxed">Légende</p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5 text-xs text-[#1E2438]/60 font-medium leading-relaxed">
                <span className="w-3 h-3 rounded-sm border-2 border-[#2CAFC2] bg-white shrink-0" />
                Disponible
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#1E2438]/60 font-medium leading-relaxed">
                <span className="w-3 h-3 rounded-sm bg-[#EEBB3B] shrink-0" />
                Occupé
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#1E2438]/60 font-medium leading-relaxed">
                <span className="w-3 h-3 rounded-sm bg-[#E41E2D] shrink-0" />
                Sélectionné
              </li>
              <li className="flex items-center gap-2.5 text-xs text-[#1E2438]/60 font-medium leading-relaxed">
                <span className="w-3 h-3 rounded-sm bg-black/10 shrink-0" />
                Passé
              </li>
            </ul>
          </div>
        </aside>

        {/* ══ MAIN CONTENT ══════════════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Mobile header row */}
          <div className="flex md:hidden items-center justify-between">
            <Image
              src="/logo-no-bg.png"
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
              loading="eager"
            />
            <LanguageToggle />
          </div>

          {/* ── Date Picker Card ────────────────────────────────────────── */}
          <div className={`${GLASS} p-8`}>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-xl font-bold text-[#1E2438] tracking-tight">
                  {t.book_title}
                </h1>
                {selectedDate && (
                  <p className="mt-1 text-sm text-[#1E2438]/50 capitalize leading-relaxed">
                    {formatDateDisplay(selectedDate)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="date-picker" className="sr-only">{t.book_select_date}</label>
                <input
                  id="date-picker"
                  type="date"
                  value={selectedDate}
                  min={todayISO()}
                  max={maxISO()}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="py-3 px-4 text-sm leading-relaxed border-2 border-[#2CAFC2]/40 rounded-xl bg-white/80 text-[#1E2438] outline-none focus:border-[#2CAFC2] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ── Slot-taken error banner ─────────────────────────────────── */}
          {slotTakenError && (
            <div className="px-4 py-3 bg-[#E41E2D]/10 border border-[#E41E2D]/30 rounded-2xl text-sm font-bold text-[#E41E2D] text-center">
              ⚠️ {t.checkout_slot_taken}
            </div>
          )}

          {/* ── Slot Grid Card ──────────────────────────────────────────── */}
          <div className={`${GLASS} p-8 flex flex-col gap-5`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-base font-bold text-[#1E2438] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2CAFC2] text-xl">sports_tennis</span>
                Créneaux disponibles
              </h2>
              <span className="text-[10px] font-bold text-[#1E2438]/25 uppercase tracking-widest leading-relaxed">
                9 slots / jour
              </span>
            </div>

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

            <p className="pt-4 border-t border-[#1E2438]/5 text-[10px] font-medium text-[#1E2438]/30 text-center leading-relaxed">
              Merci de vous présenter à la réception 15 minutes avant votre session.
            </p>
          </div>

        </main>
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
