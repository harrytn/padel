"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SlotGrid from "@/components/booking/SlotGrid";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { SlotData } from "@/components/booking/SlotCard";
import { ChevronRight } from "lucide-react";

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
  return d.toLocaleDateString(undefined, {
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
    <div className="min-h-screen bg-[url('/bg_pattern.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">

        {/* Compact Header */}
        <header className="flex items-center justify-between py-4 md:py-5">
          <Image
            src="/logo.png"
            alt="Padel Caribbean Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
          <LanguageToggle />
        </header>

        {/* Main Content: sidebar + grid aligned at top */}
        <main className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4 lg:mt-6 items-start">

          {/* Left Sidebar — compact */}
          <aside className="w-full lg:w-[260px] lg:shrink-0">
            <div className="bg-white rounded-xl shadow-md shadow-black/5 p-5 space-y-6">

              {/* Date Picker */}
              <section>
                <h2 className="text-[10px] font-bold text-[#1B4332] uppercase tracking-[0.15em] mb-3">
                  {t.book_select_date}
                </h2>
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
                  className="minimal-input pl-3 h-10 text-sm"
                />
                {selectedDate && (
                  <p className="mt-2.5 text-[12px] font-semibold text-[#1B4332]/50 flex items-center gap-1.5">
                    <ChevronRight size={12} />
                    {formatDateDisplay(selectedDate)}
                  </p>
                )}
              </section>

              {/* Legend */}
              <section className="pt-4 border-t border-[#1B4332]/5">
                <h2 className="text-[10px] font-bold text-[#1B4332] uppercase tracking-[0.15em] mb-3">
                  Légende
                </h2>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-[12px] font-medium text-[#1A1A1A]/45">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#bbf7d0] border border-[#1B4332]/10" />
                    Disponible
                  </li>
                  <li className="flex items-center gap-2.5 text-[12px] font-medium text-[#1A1A1A]/45">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#F4A261]" />
                    Pleine saison
                  </li>
                  <li className="flex items-center gap-2.5 text-[12px] font-medium text-[#1A1A1A]/45">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#ffbfbf]" />
                    Occupé
                  </li>
                </ul>
              </section>

              {/* Staff link */}
              <div className="pt-4 border-t border-[#1B4332]/5">
                <a
                  href="/admin"
                  className="text-[10px] font-bold text-[#1B4332]/30 hover:text-[#1B4332] tracking-widest uppercase transition-colors"
                >
                  Accès Staff →
                </a>
              </div>
            </div>
          </aside>

          {/* Right — Booking Grid */}
          <section className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-md shadow-black/5 p-5 md:p-6">

              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-base font-bold text-[#1B4332] tracking-tight">
                  {t.book_title}
                </h3>
                <span className="text-[10px] font-bold text-[#1A1A1A]/25 uppercase tracking-widest">
                  9 slots / jour
                </span>
              </div>

              {slotTakenError && (
                <div className="mb-5 p-3 bg-[#F28482]/10 border border-[#F28482]/20 rounded-lg text-[12px] font-bold text-[#F28482] text-center">
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
              />

              <p className="mt-6 pt-4 border-t border-[#1B4332]/5 text-[10px] font-medium text-[#1A1A1A]/25 text-center">
                Merci de vous présenter à la reception 15 minutes avant votre session.
              </p>
            </div>
          </section>

        </main>
      </div>

      {/* Checkout Modal */}
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
