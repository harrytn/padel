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

/** Shared layout classes applied to every slot button */
const BASE =
  "w-full text-left rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 border";

export default function SlotCard({ slot, isSelected, onClick, isPast }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium } = slot;
  const displayPrice = basePrice + (isPeak ? peakPremium : 0);

  // ── PAST ──────────────────────────────────────────────────────────────────
  if (isPast) {
    return (
      <button
        disabled
        className={`${BASE} bg-black/10 border-transparent text-gray-500 cursor-not-allowed opacity-70`}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.5} className="text-gray-400" />
              <span className="text-sm font-bold tracking-tight">{slotStart}</span>
            </div>
            <span className="text-[10px] uppercase font-medium tracking-wider text-gray-400">
              90 minutes
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between w-full">
          <span className="text-xs font-semibold text-gray-400">Passé</span>
        </div>
      </button>
    );
  }

  // ── OCCUPIED ──────────────────────────────────────────────────────────────
  if (!isAvailable) {
    return (
      <button
        disabled
        className={`${BASE} bg-[#EEBB3B] border-[#EEBB3B] text-[#1E2438] cursor-not-allowed`}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.5} className="text-[#1E2438]/50" />
              <span className="text-sm font-bold tracking-tight">{slotStart}</span>
            </div>
            <span className="text-[10px] uppercase font-medium tracking-wider text-[#1E2438]/60">
              90 minutes
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between w-full">
          <span className="text-xs font-semibold">{t.book_booked}</span>
        </div>
      </button>
    );
  }

  // ── SELECTED ──────────────────────────────────────────────────────────────
  if (isSelected) {
    return (
      <button
        onClick={onClick}
        className={`${BASE} bg-[#E41E2D] border-[#E41E2D] text-white shadow-lg shadow-[#E41E2D]/30`}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Clock size={14} strokeWidth={1.5} className="text-white/70" />
              <span className="text-sm font-bold tracking-tight text-white">{slotStart}</span>
            </div>
            <span className="text-[10px] uppercase font-medium tracking-wider text-white/70">
              90 minutes
            </span>
          </div>
          {isPeak && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap size={9} fill="currentColor" /> Peak
            </span>
          )}
        </div>
        <div className="flex items-end justify-between w-full">
          <span className="text-sm font-bold text-white">{displayPrice} DT</span>
          <span className="text-[10px] font-medium text-white/70">✓ Sélectionné</span>
        </div>
      </button>
    );
  }

  // ── AVAILABLE (default) ───────────────────────────────────────────────────
  return (
    <button
      onClick={onClick}
      className={`${BASE} bg-white border-2 border-[#2CAFC2] text-[#2CAFC2] group hover:bg-[#2CAFC2] hover:text-white hover:shadow-md hover:shadow-[#2CAFC2]/20 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Clock size={14} strokeWidth={1.5} className="text-[#2CAFC2] group-hover:text-white" />
            <span className="text-sm font-bold tracking-tight">{slotStart}</span>
          </div>
          <span className="text-[10px] uppercase font-medium tracking-wider text-[#2CAFC2]/70 group-hover:text-white/70">
            90 minutes
          </span>
        </div>
        {isPeak && (
          <span className="bg-[#EEBB3B] text-[#1E2438] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap size={9} fill="currentColor" /> Peak
          </span>
        )}
      </div>
      <div className="flex items-end justify-between w-full">
        <span className="text-sm font-bold">{displayPrice} DT</span>
        <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Réserver →
        </span>
      </div>
    </button>
  );
}
