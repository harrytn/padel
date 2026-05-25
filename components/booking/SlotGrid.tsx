"use client";
import { SlotData } from "./SlotCard";
import SlotCard from "./SlotCard";
import { useI18n } from "@/lib/i18n";
import { Calendar, AlertCircle } from "lucide-react";

interface SlotGridProps {
  slots: SlotData[];
  selectedSlot: string | null;
  onSelectSlot: (slot: SlotData) => void;
  loading: boolean;
  error?: string | null;
  selectedDate: string; // ISO "YYYY-MM-DD"
}

/** Returns true if the slot start time on the given date is already in the past. */
function isSlotPast(isoDate: string, slotStart: string): boolean {
  if (!isoDate || !slotStart) return false;
  const [hours, minutes] = slotStart.split(":").map(Number);
  const slotDateTime = new Date(isoDate + "T12:00:00"); // start with a valid date
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime < new Date();
}

export default function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  error,
  selectedDate,
}: SlotGridProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] w-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flat-card h-24 animate-pulse"
            style={{ background: "rgba(27, 67, 50, 0.02)" }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-[#F28482]/5 rounded-xl border border-dashed border-[#F28482]/20">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} strokeWidth={1} className="text-[#F28482] opacity-40" />
        </div>
        <p className="text-sm font-bold text-[#F28482] opacity-80 tracking-tight">
          {error}
        </p>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="text-center py-12 bg-white/40 rounded-xl border border-dashed border-[#1B4332]/20">
        <div className="flex justify-center mb-4">
          <Calendar size={48} strokeWidth={1} className="text-[#1B4332] opacity-20" />
        </div>
        <p className="text-sm font-medium text-[#1B4332] opacity-60 tracking-tight">
          {t.book_select_date}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] w-full">
      {slots.map((slot) => (
        <SlotCard
          key={slot.slotStart}
          slot={slot}
          isSelected={selectedSlot === slot.slotStart}
          onClick={() => onSelectSlot(slot)}
          isPast={isSlotPast(selectedDate, slot.slotStart)}
        />
      ))}
    </div>
  );
}
