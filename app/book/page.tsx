"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SlotGrid from "@/components/booking/SlotGrid";
import CheckoutModal from "@/components/booking/CheckoutModal";
import { SlotData } from "@/components/booking/SlotCard";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [slotTakenError, setSlotTakenError] = useState(false);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoading(true);
    setSlotTakenError(false);
    try {
      const res = await fetch(`/api/slots?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots);
        setSettings(data.settings);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const handleSlotTaken = () => {
    setSelectedSlot(null);
    setSlotTakenError(true);
    fetchSlots(selectedDate);
  };

  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="min-h-screen">
      {/* Background decorative elements */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #14b8a6, transparent)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #f59e0b, transparent)",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                style={{ background: "linear-gradient(135deg, #0891b2, #14b8a6)" }}
              >
                🎾
              </div>
              <div>
                <h1
                  className="text-xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-outfit)", color: "#0e7490" }}
                >
                  {t.nav_title}
                </h1>
                <p className="text-sm text-slate-500">{t.nav_subtitle}</p>
              </div>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Page Title */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold text-slate-800 mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {t.book_title}
          </h2>
          <p className="text-slate-500">{t.book_subtitle}</p>
        </div>

        {/* Date Picker */}
        <div className="glass-card p-5 mb-6">
          <label
            htmlFor="date-picker"
            className="block text-sm font-semibold text-slate-600 mb-2"
          >
            📅 {t.book_select_date}
          </label>
          <div className="flex items-center gap-4">
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              min={todayISO()}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
              className="form-input"
              style={{ maxWidth: "220px" }}
            />
            {selectedDate && (
              <p className="text-slate-700 font-medium">
                {formatDateDisplay(selectedDate)}
              </p>
            )}
          </div>
        </div>

        {/* Availability Summary */}
        {!loading && slots.length > 0 && (
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#14b8a6" }}
              />
              <span className="text-sm text-slate-600">
                {availableCount} {t.book_available}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-sm text-slate-600">
                {9 - availableCount} {t.book_booked}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#f59e0b" }}
              />
              <span className="text-sm text-slate-600">⚡ Peak +10 DT</span>
            </div>
          </div>
        )}

        {/* Slot taken error banner */}
        {slotTakenError && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2">
            ⚠️ {t.checkout_slot_taken}
          </div>
        )}

        {/* Slot Grid */}
        <SlotGrid
          slots={slots}
          selectedSlot={selectedSlot?.slotStart ?? null}
          onSelectSlot={(slot) => {
            setSelectedSlot(slot);
            setSlotTakenError(false);
          }}
          loading={loading}
        />

        {/* Admin link */}
        <div className="mt-12 text-center">
          <a
            href="/admin"
            className="text-sm text-slate-400 hover:text-teal-600 transition-colors"
          >
            Staff access →
          </a>
        </div>
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
