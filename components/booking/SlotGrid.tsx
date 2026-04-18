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
}

export default function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  error,
}: SlotGridProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] rounded-2xl animate-pulse bg-[#1B4332]/[0.02] border border-[#1B4332]/5"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-[#F28482]/5 rounded-2xl border border-dashed border-[#F28482]/15">
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
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#1B4332]/10">
        <div className="flex justify-center mb-4">
          <Calendar size={48} strokeWidth={1} className="text-[#1B4332] opacity-15" />
        </div>
        <p className="text-sm font-medium text-[#1B4332] opacity-50 tracking-tight">
          {t.book_select_date}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
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
