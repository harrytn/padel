"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { calculatePrice } from "@/lib/pricing";
import { SlotData } from "./SlotCard";

interface CheckoutModalProps {
  slot: SlotData;
  settings: {
    base_price: number;
    racket_price_with_balls: number;
    balls_only_price: number;
    lighting_price: number;
    peak_premium: number;
  };
  date: string;
  onClose: () => void;
  onSlotTaken: () => void;
}

export default function CheckoutModal({
  slot,
  settings,
  date,
  onClose,
  onSlotTaken,
}: CheckoutModalProps) {
  const { t } = useI18n();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [racketCount, setRacketCount] = useState(0);
  const [ballsOnly, setBallsOnly] = useState(false);
  const [needsLighting, setNeedsLighting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset balls-only if rackets selected
  useEffect(() => {
    if (racketCount > 0) setBallsOnly(false);
  }, [racketCount]);

  const breakdown = calculatePrice({
    basePrice: settings.base_price,
    isPeak: slot.isPeak,
    peakPremium: settings.peak_premium,
    racketCount,
    racketPriceWithBalls: settings.racket_price_with_balls,
    boughtBallsOnly: ballsOnly,
    ballsOnlyPrice: settings.balls_only_price,
    needsLighting: slot.hasLighting && needsLighting,
    lightingPrice: settings.lighting_price,
  });

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !roomNumber.trim()) {
      setError(t.error_validation);
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          slotStart: slot.slotStart,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          roomNumber: roomNumber.trim(),
          racketCount,
          boughtBallsOnly: ballsOnly,
          needsLighting: slot.hasLighting && needsLighting,
        }),
      });

      if (res.status === 409) {
        onSlotTaken();
        return;
      }

      if (!res.ok) {
        setError(t.error_generic);
        return;
      }

      const { booking } = await res.json();
      router.push(
        `/confirmation?pin=${booking.booking_pin}&slot=${slot.slotStart}&date=${date}&total=${booking.total_price}&name=${encodeURIComponent(firstName + " " + lastName)}`
      );
    } catch {
      setError(t.error_generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PriceRow = ({
    label,
    amount,
    highlight,
  }: {
    label: string;
    amount: number;
    highlight?: boolean;
  }) => {
    if (amount === 0) return null;
    return (
      <div
        className={`flex justify-between items-center text-sm ${
          highlight ? "font-semibold text-slate-800" : "text-slate-600"
        }`}
      >
        <span>{label}</span>
        <span style={{ color: highlight ? "#0891b2" : undefined }}>
          +{amount} DT
        </span>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{
            background: "linear-gradient(135deg, #0891b2 0%, #14b8a6 100%)",
            borderRadius: "24px 24px 0 0",
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">{t.checkout_title}</h2>
              <p className="text-teal-100 text-sm mt-1">
                {t.checkout_selected_slot}:{" "}
                <span className="font-bold text-white">{slot.slotStart}</span>
                {slot.isPeak && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    ⚡ Peak
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-2xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Guest Details */}
          <div className="space-y-3">
            <input
              id="checkout-firstname"
              className="form-input"
              placeholder={t.checkout_first_name_placeholder}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-label={t.checkout_first_name}
            />
            <input
              id="checkout-lastname"
              className="form-input"
              placeholder={t.checkout_last_name_placeholder}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-label={t.checkout_last_name}
            />
            <input
              id="checkout-room"
              className="form-input"
              placeholder={t.checkout_room_placeholder}
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              aria-label={t.checkout_room_number}
              inputMode="numeric"
            />
          </div>

          {/* Rackets Add-on */}
          <div className="glass-card p-4 space-y-3">
            <div>
              <p className="font-semibold text-slate-700">{t.checkout_rackets_label}</p>
              <p className="text-sm text-slate-500">{t.checkout_rackets_desc}</p>
            </div>
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  id={`racket-count-${n}`}
                  onClick={() => setRacketCount(n)}
                  className="w-10 h-10 rounded-full font-bold text-sm transition-all duration-200"
                  style={{
                    background:
                      racketCount === n
                        ? "linear-gradient(135deg, #0891b2, #14b8a6)"
                        : "#f1f5f9",
                    color: racketCount === n ? "white" : "#475569",
                    boxShadow:
                      racketCount === n
                        ? "0 4px 12px rgba(8,145,178,0.35)"
                        : "none",
                    transform: racketCount === n ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Balls-only toggle (only when rackets = 0) */}
            {racketCount === 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="font-medium text-slate-700 text-sm">
                    {t.checkout_balls_only_label}
                  </p>
                  <p className="text-xs text-slate-400">{t.checkout_balls_only_desc}</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="balls-only-toggle"
                    checked={ballsOnly}
                    onChange={(e) => setBallsOnly(e.target.checked)}
                  />
                  <span className="toggle-knob" />
                </label>
              </div>
            )}
          </div>

          {/* Lighting Add-on */}
          {slot.hasLighting && (
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-700">
                  💡 {t.checkout_lighting_label}
                </p>
                <p className="text-sm text-slate-500">{t.checkout_lighting_desc}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="lighting-toggle"
                  checked={needsLighting}
                  onChange={(e) => setNeedsLighting(e.target.checked)}
                />
                <span className="toggle-knob" />
              </label>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="glass-card p-4 space-y-2">
            <p className="font-semibold text-slate-700 text-sm mb-3">
              {t.checkout_price_breakdown}
            </p>
            <PriceRow label={t.checkout_base} amount={breakdown.base} />
            <PriceRow
              label={t.checkout_peak_surcharge}
              amount={breakdown.peakSurcharge}
            />
            <PriceRow label={t.checkout_rackets_fee} amount={breakdown.rackets} />
            <PriceRow label={t.checkout_balls_fee} amount={breakdown.ballsOnly} />
            <PriceRow
              label={t.checkout_lighting_fee}
              amount={breakdown.lighting}
            />
            <div className="flex justify-between items-center pt-3 border-t-2 border-teal-100">
              <span className="font-bold text-slate-800">{t.checkout_total}</span>
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "#0891b2",
                }}
              >
                {breakdown.total} DT
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {t.checkout_cancel_btn}
            </button>
            <button
              id="confirm-booking-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: isSubmitting
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #0891b2, #14b8a6)",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 16px rgba(8,145,178,0.4)",
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  {t.checkout_processing}
                </>
              ) : (
                `${t.checkout_confirm_btn} — ${breakdown.total} DT`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
