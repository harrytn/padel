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

/** Structural layout classes with fixed vertical padding */
const BASE = "flex flex-col justify-between min-h-[104px] rounded-2xl w-full text-left transition-all duration-200 border py-[16px]";

export default function SlotCard({ slot, isSelected, onClick, isPast }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium } = slot;
  const displayPrice = basePrice + (isPeak ? peakPremium : 0);

  // ── PAST ──────────────────────────────────────────────────────────────────
  if (isPast) {
    return (
      <button
        disabled
        className={`${BASE} bg-white/40 border-white/20 text-gray-600 cursor-not-allowed`}
      >
        <div className="flex flex-col text-left w-full pl-[24px] pr-[20px]">
          <div className="flex items-center gap-1.5">
            <Clock size={18} strokeWidth={1.5} className="text-gray-500 shrink-0" />
            <span className="text-xl font-bold leading-none text-gray-700">{slotStart}</span>
          </div>
          <span className="text-xs font-semibold tracking-wide uppercase mt-1 text-gray-500">
            90 minutes
          </span>
        </div>
        <div className="w-full pl-[24px] pr-[20px] pt-2">
          <span className="text-base font-bold text-gray-600">Passé</span>
        </div>
      </button>
    );
  }

  // ── OCCUPIED ──────────────────────────────────────────────────────────────
  if (!isAvailable) {
    return (
      <button
        disabled
        className={`${BASE} bg-[#EEBB3B]/20 border-[#EEBB3B]/30 text-[#1E2438] cursor-not-allowed`}
      >
        <div className="flex flex-col text-left w-full pl-[24px] pr-[20px]">
          <div className="flex items-center gap-1.5">
            <Clock size={18} strokeWidth={1.5} className="text-[#1E2438]/50 shrink-0" />
            <span className="text-xl font-bold leading-none">{slotStart}</span>
          </div>
          <span className="text-xs font-semibold tracking-wide uppercase mt-1 text-[#1E2438]/60">
            90 minutes
          </span>
        </div>
        <div className="w-full pl-[24px] pr-[20px] pt-2">
          <span className="text-base font-bold">{t.book_booked}</span>
        </div>
      </button>
    );
  }

  // ── SELECTED ──────────────────────────────────────────────────────────────
  if (isSelected) {
    return (
      <button
        onClick={onClick}
        className={`${BASE} bg-[#E41E2D] border-[#E41E2D]/50 text-white shadow-md shadow-[#E41E2D]/20`}
      >
        <div className="flex items-start justify-between w-full pl-[24px] pr-[20px]">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <Clock size={18} strokeWidth={1.5} className="text-white/80 shrink-0" />
              <span className="text-xl font-bold leading-none text-white">{slotStart}</span>
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase mt-1 text-white/80">
              90 minutes
            </span>
          </div>
          {isPeak && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 mr-1">
              <Zap size={9} fill="currentColor" /> Peak
            </span>
          )}
        </div>
        <div className="flex items-end justify-between w-full pl-[24px] pr-[20px] pt-2">
          <span className="text-base font-bold text-white">{displayPrice} DT</span>
          <span className="text-xs font-semibold text-white/80">✓ Sélectionné</span>
        </div>
      </button>
    );
  }

  // ── AVAILABLE (default) ───────────────────────────────────────────────────
  return (
    <button
      onClick={onClick}
      className={`${BASE} bg-white border-[#2CAFC2]/30 text-[#2CAFC2] shadow-sm hover:bg-[#2CAFC2]/5 hover:border-[#2CAFC2] hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between w-full pl-[24px] pr-[20px]">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <Clock size={18} strokeWidth={1.5} className="text-[#2CAFC2] shrink-0" />
            <span className="text-xl font-bold leading-none text-[#1E2438]">{slotStart}</span>
          </div>
          <span className="text-xs font-semibold tracking-wide uppercase mt-1 text-[#1E2438]/50">
            90 minutes
          </span>
        </div>
        {isPeak && (
          <span className="bg-[#EEBB3B]/20 text-[#1E2438] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 mr-1">
            <Zap size={9} fill="currentColor" className="text-[#EEBB3B]" /> Peak
          </span>
        )}
      </div>
      <div className="flex items-end justify-between w-full pl-[24px] pr-[20px] pt-2">
        <span className="text-base font-bold text-[#2CAFC2]">{displayPrice} DT</span>
        <span className="text-xs font-semibold opacity-0 lg:opacity-100 transition-opacity text-[#2CAFC2]">
          Réserver →
        </span>
      </div>
    </button>
  );
}