"use client";
import { useI18n } from "@/lib/i18n";
import { getSlotEnd } from "@/lib/slots";

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
  const { slotStart, isAvailable, isPeak, hasLighting, basePrice, peakPremium } = slot;
  const slotEnd = getSlotEnd(slotStart);

  const stateClass = !isAvailable
    ? "slot-booked"
    : isSelected
    ? "slot-selected"
    : isPeak
    ? "slot-available slot-peak"
    : "slot-available";

  const displayPrice = basePrice + (isPeak ? peakPremium : 0);

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
      role={isAvailable ? "button" : undefined}
      tabIndex={isAvailable ? 0 : -1}
      onKeyDown={(e) => e.key === "Enter" && isAvailable && onClick()}
      className={`glass-card p-4 flex flex-col gap-2 select-none ${stateClass}`}
    >
      {/* Time Range */}
      <div className="flex items-center justify-between">
        <span
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-outfit)",
            color: isSelected ? "white" : isPeak ? "#b45309" : "#0e7490",
          }}
        >
          {slotStart}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: isSelected
              ? "rgba(255,255,255,0.2)"
              : isAvailable
              ? isPeak
                ? "rgba(245,158,11,0.12)"
                : "rgba(20,184,166,0.1)"
              : "rgba(148,163,184,0.15)",
            color: isSelected
              ? "white"
              : isAvailable
              ? isPeak
                ? "#b45309"
                : "#0e7490"
              : "#94a3b8",
          }}
        >
          {t.book_duration}
        </span>
      </div>

      {/* End time */}
      <p
        className="text-sm"
        style={{ color: isSelected ? "rgba(255,255,255,0.9)" : "#64748b" }}
      >
        {t.book_ends_at} {slotEnd}
      </p>

      {/* Badges row */}
      <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-1">
        {isPeak && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: isSelected
                ? "rgba(255,255,255,0.25)"
                : "rgba(245,158,11,0.15)",
              color: isSelected ? "white" : "#92400e",
            }}
          >
            ⚡ {t.book_peak_badge}
          </span>
        )}
        {hasLighting && isAvailable && !isSelected && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(139,92,246,0.1)", color: "#6d28d9" }}
          >
            💡 {t.book_lighting_badge}
          </span>
        )}
        {!isAvailable && (
          <span className="text-xs font-medium text-slate-400">
            🚫 {t.book_booked}
          </span>
        )}
      </div>

      {/* Price */}
      <div
        className="font-bold text-lg mt-1"
        style={{
          fontFamily: "var(--font-outfit)",
          color: isSelected ? "white" : isPeak ? "#d97706" : "#0891b2",
        }}
      >
        {isAvailable ? `${displayPrice} DT` : "—"}
      </div>
    </div>
  );
}
