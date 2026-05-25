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
  isPast?: boolean;
}

interface SlotCardProps {
  slot: SlotData;
  isSelected: boolean;
  onClick: () => void;
  isPast?: boolean;
}

const BASE = "cw-slot-card-root flex text-left transition-all w-full";

export default function SlotCard({ slot, isSelected, onClick, isPast }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium } = slot;
  const displayPrice = basePrice + (isPeak ? peakPremium : 0);

  let stateClasses = "";
  let statusOrPrice = "";
  let showReserveCta = false;
  let isOccupied = false;

  if (isPast) {
    stateClasses = "bg-slate-200/55 border border-white/30 text-slate-600 cursor-not-allowed";
    statusOrPrice = t.passed;
  } else if (!isAvailable) {
    stateClasses = "bg-amber-100/70 border border-amber-300 text-slate-800 cursor-not-allowed";
    statusOrPrice = t.book_booked;
    isOccupied = true;
  } else if (isSelected) {
    stateClasses = "bg-[#E41E2D] border border-red-500 text-white shadow-xl";
    statusOrPrice = `${displayPrice} DT`;
    showReserveCta = true;
  } else {
    stateClasses = "bg-white/75 border border-cyan-400 text-slate-800 hover:bg-white hover:shadow-xl";
    statusOrPrice = `${displayPrice} DT`;
    showReserveCta = true;
  }

  const iconColor = isPast ? "text-slate-500" : isOccupied ? "text-slate-800/70" : isSelected ? "text-white" : "text-cyan-600";
  const durationColor = isPast ? "text-slate-500" : isOccupied ? "text-slate-800/70" : isSelected ? "text-white/90" : "text-slate-500";
  const priceColor = isPast ? "text-slate-600" : isOccupied ? "text-slate-800" : isSelected ? "text-white" : "text-cyan-600";
  const ctaColor = isSelected ? "text-white/90" : "text-cyan-600";
  const timeColor = isSelected ? "text-white" : isOccupied ? "text-slate-800" : isPast ? "text-slate-500" : "text-slate-800";

  return (
    <button
      disabled={isPast || !isAvailable}
      onClick={!isPast && isAvailable ? onClick : undefined}
      className={`${BASE} ${stateClasses}`}
    >
      <div className="cw-slot-card-inner h-full w-full flex flex-col justify-between items-start gap-[20px]">
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <Clock className={`h-[20px] w-[20px] shrink-0 ${iconColor}`} strokeWidth={2} />
              <span className={`cw-slot-time text-[24px] font-bold leading-none ${timeColor}`}>
                {slotStart}
              </span>
            </div>
            {isPeak && (
              <span className={isSelected ? "bg-white/20 text-white text-[10px] font-bold px-[8px] py-[4px] rounded-full flex items-center gap-[4px] shrink-0" : "bg-amber-100 text-amber-700 border border-amber-300 text-[10px] font-bold px-[8px] py-[4px] rounded-full flex items-center gap-[4px] shrink-0"}>
                <Zap size={10} fill="currentColor" /> Peak
              </span>
            )}
          </div>

          <span className={`cw-slot-duration mt-[8px] text-[12px] font-bold tracking-[0.12em] uppercase leading-none ${durationColor}`}>
            90 {t.durationMinutes}
          </span>
        </div>

        <div className="w-full flex items-end justify-between gap-[16px] pt-[16px] mt-auto">
          <span className={`cw-slot-price cw-slot-status text-[16px] font-bold leading-none ${priceColor}`}>
            {statusOrPrice}
          </span>

          {showReserveCta && (
            <span className={`cw-slot-cta text-[12px] font-bold tracking-[0.14em] uppercase leading-none whitespace-nowrap ${isSelected ? '' : 'opacity-0 lg:opacity-100 transition-opacity'} ${ctaColor}`}>
              {isSelected ? `✓ ${t.selected}` : `${t.reserve} →`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}