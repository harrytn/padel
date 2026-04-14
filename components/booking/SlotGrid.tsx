"use client";
import { SlotData } from "./SlotCard";
import SlotCard from "./SlotCard";
import { useI18n } from "@/lib/i18n";

interface SlotGridProps {
  slots: SlotData[];
  selectedSlot: string | null;
  onSelectSlot: (slot: SlotData) => void;
  loading: boolean;
}

export default function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
}: SlotGridProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="glass-card p-4 h-36 animate-pulse"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />
        ))}
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-5xl mb-4">📅</div>
        <p className="font-medium">{t.book_select_date}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {slots.map((slot) => (
        <SlotCard
          key={slot.slotStart}
          slot={slot}
          isSelected={selectedSlot === slot.slotStart}
          onClick={() => onSelectSlot(slot)}
        />
      ))}
    </div>
  );
}
