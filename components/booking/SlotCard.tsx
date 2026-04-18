"use client";
import { useI18n } from "@/lib/i18n";
import { Clock, Zap } from "lucide-react";

export interface SlotData {
  slotStart: string;
  slotEnd: string;
  isAvailable: boolean;
  isPeak: boolean;
  hasLighting: boolean;
  basePrice: number;
  peakPremium: number;
}

interface SlotCardProps {
  slot: SlotData;
  isSelected: boolean;
  onClick: () => void;
}

export default function SlotCard({ slot, isSelected, onClick }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium } = slot;

  const displayPrice = basePrice + (isPeak ? peakPremium : 0);

  return (
    <button
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      className={`
        slot-btn flex flex-col gap-3 group mx-auto
        ${isSelected ? "slot-selected" : isAvailable ? "ready-to-book" : "slot-booked"}
      `}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Clock size={14} strokeWidth={1.5} className={isSelected ? "text-white" : isAvailable ? "text-[#1B4332] opacity-50" : "opacity-40"} />
            <span className="text-[15px] font-bold tracking-tight">{slotStart}</span>
          </div>
          <span className={`text-[10px] uppercase font-medium tracking-wider opacity-50 ${isSelected ? "text-white" : isAvailable ? "text-[#1A1A1A]" : ""}`}>
            90 minutes
          </span>
        </div>
        
        {isPeak && !isSelected && (
          <div className="slot-peak-badge">
            <Zap size={10} fill="currentColor" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between w-full mt-auto">
        <span className={`text-sm font-bold ${isSelected ? "text-white" : isAvailable ? "text-[#1B4332]" : ""}`}>
          {isAvailable ? `${displayPrice} DT` : t.book_booked}
        </span>
        {isAvailable && !isSelected && (
          <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-60 transition-opacity text-[#1B4332]">
            Réserver →
          </span>
        )}
      </div>
    </button>
  );
}
