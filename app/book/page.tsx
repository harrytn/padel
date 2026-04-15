"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SlotGrid from "@/components/booking/SlotGrid";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { SlotData } from "@/components/booking/SlotCard";
import { Calendar as CalendarIcon, MapPin, ChevronRight } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-6 py-12 lg:px-12 bg-transparent min-h-screen">
      {/* Header Bar */}
      <header className="flex items-center justify-between mb-20">
        <Image 
          src="/logo.png" 
          alt="Padel Caribbean Logo" 
          width={150} 
          height={50} 
          className="object-contain"
          priority
        />
        <LanguageToggle />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
        {/* Sidebar Controls */}
        <aside className="space-y-12">
          <section>
            <h2 className="text-[11px] font-bold text-[#1B4332] uppercase tracking-[0.15em] mb-6">
              {t.book_select_date}
            </h2>
            <div className="relative group">
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
                className="minimal-input pl-4 h-12"
              />
            </div>
            {selectedDate && (
              <p className="mt-4 text-[13px] font-bold text-[#1B4332]/60 flex items-center gap-2">
                <ChevronRight size={14} />
                {formatDateDisplay(selectedDate)}
              </p>
            )}
          </section>

          <section className="pt-8 border-t border-[#1B4332]/5">
            <h2 className="text-[11px] font-bold text-[#1B4332] uppercase tracking-[0.15em] mb-4">
              Légende
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[13px] font-medium text-[#1A1A1A]/40">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                Disponible
              </li>
              <li className="flex items-center gap-3 text-[13px] font-medium text-[#1A1A1A]/40">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F4A261]" />
                Pleine saison (Peak)
              </li>
              <li className="flex items-center gap-3 text-[13px] font-medium text-[#1A1A1A]/40">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]" />
                Occupé
              </li>
            </ul>
          </section>
        </aside>

        {/* Schedule Grid Area */}
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="text-lg font-bold text-[#1B4332] tracking-tight">
              {t.book_title}
            </h3>
            <span className="text-[11px] font-bold text-[#1A1A1A]/30 uppercase tracking-widest">
              9 slots par jour
            </span>
          </div>

          {slotTakenError && (
            <div className="mb-8 p-4 bg-[#F28482]/10 border border-[#F28482]/20 rounded-xl text-[13px] font-bold text-[#F28482] text-center">
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

          <div className="mt-20 pt-10 border-t border-[#1B4332]/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-medium text-[#1A1A1A]/30 max-w-sm text-center sm:text-left">
              Merci de vous présenter à la reception 15 minutes avant votre session.
            </p>
            <a
              href="/admin"
              className="text-[11px] font-bold text-[#1B4332]/40 hover:text-[#1B4332] tracking-widest uppercase transition-colors"
            >
              Accès Staff →
            </a>
          </div>
        </section>
      </main>

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
