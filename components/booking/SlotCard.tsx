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

const BASE = "px-6 py-5 rounded-[24px] flex flex-col justify-between items-start transition-all min-h-[112px] w-full text-left";

export default function SlotCard({ slot, isSelected, onClick, isPast }: SlotCardProps) {
  const { t } = useI18n();
  const { slotStart, isAvailable, isPeak, basePrice, peakPremium } = slot;
  const displayPrice = basePrice + (isPeak ? peakPremium : 0);

  // ── PAST STATE ───────────────────────────────────────────────────────────
  if (isPast) {
    return (
      <button
        disabled
        className={`${BASE} bg-slate-200/55 border border-white/30 text-slate-600 cursor-not-allowed`}
      >
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Clock size={20} strokeWidth={2} className="text-slate-500 shrink-0" />
            <span className="text-2xl font-bold leading-none">{slotStart}</span>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase mt-2 text-slate-500">
            90 minutes
          </span>
        </div>
        <div className="mt-4">
          <span className="text-base font-bold text-slate-600">Passé</span>
        </div>
      </button>
    );
  }

  // ── OCCUPIED STATE ────────────────────────────────────────────────────────
  if (!isAvailable) {
    return (
      <button
        disabled
        className={`${BASE} bg-amber-100/70 border border-amber-300 text-slate-800 cursor-not-allowed`}
      >
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Clock size={20} strokeWidth={2} className="text-slate-800/70 shrink-0" />
            <span className="text-2xl font-bold leading-none">{slotStart}</span>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase mt-2 text-slate-800/70">
            90 minutes
          </span>
        </div>
        <div className="mt-4">
          <span className="text-base font-bold text-slate-800">{t.book_booked}</span>
        </div>
      </button>
    );
  }

  // ── SELECTED STATE ────────────────────────────────────────────────────────
  if (isSelected) {
    return (
      <button
        onClick={onClick}
        className={`${BASE} bg-[#E41E2D] border border-red-500 text-white shadow-xl`}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <Clock size={20} strokeWidth={2} className="text-white shrink-0" />
              <span className="text-2xl font-bold leading-none">{slotStart}</span>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase mt-2 text-white/90">
              90 minutes
            </span>
          </div>
          {isPeak && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
              <Zap size={10} fill="currentColor" /> Peak
            </span>
          )}
        </div>
        <div className="flex items-end justify-between w-full mt-4">
          <span className="text-base font-bold">{displayPrice} DT</span>
          <span className="text-xs font-bold tracking-wider uppercase text-white/90">✓ Sélectionné</span>
        </div>
      </button>
    );
  }

  // ── AVAILABLE STATE (DEFAULT) ─────────────────────────────────────────────
  return (
    <button
      onClick={onClick}
      className={`${BASE} bg-white/75 border border-cyan-400 text-slate-800 hover:bg-white hover:shadow-xl`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <Clock size={20} strokeWidth={2} className="text-cyan-600 shrink-0" />
            <span className="text-2xl font-bold leading-none">{slotStart}</span>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase mt-2 text-slate-500">
            90 minutes
          </span>
        </div>
        {isPeak && (
          <span className="bg-amber-100 text-amber-700 border border-amber-300 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
            <Zap size={10} fill="currentColor" /> Peak
          </span>
        )}
      </div>
      <div className="flex items-end justify-between w-full mt-4">
        <span className="text-base font-bold text-cyan-600">{displayPrice} DT</span>
        <span className="text-xs font-bold opacity-0 lg:opacity-100 transition-opacity text-cyan-600 uppercase tracking-widest">
          Réserver →
        </span>
      </div>
    </button>
  );
}