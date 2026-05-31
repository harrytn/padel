"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { calculatePrice } from "@/lib/pricing";
import { SlotData } from "./SlotCard";
import { X, User, Home, Lightbulb, ShoppingBag, ArrowRight } from "lucide-react";

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
    const fn = firstName.trim();
    const ln = lastName.trim();
    const rm = roomNumber.trim();

    if (!fn || !ln || !rm) {
      setError(t.error_validation);
      return;
    }

    const nameRegex = /^[\p{L}\s\-']+$/u;
    if (!nameRegex.test(fn) || !nameRegex.test(ln)) {
      setError(t.error_name_invalid);
      return;
    }

    const roomRegex = /^\d{4}$/;
    if (!roomRegex.test(rm)) {
      setError(t.error_room_invalid);
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
          firstName: fn,
          lastName: ln,
          roomNumber: rm,
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
        `/confirmation?pin=${booking.booking_pin}&slot=${slot.slotStart}&date=${date}&total=${booking.total_price}&name=${encodeURIComponent(fn + " " + ln)}`
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
        className={`flex justify-between items-center text-[13px] ${
          highlight ? "font-bold text-[#1B4332]" : "text-[#1A1A1A]/60"
        }`}
      >
        <span>{label}</span>
        <span className={highlight ? "text-[#1B4332]" : "text-[#1A1A1A]/80"}>
          +{amount} DT
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#1B4332]/20 backdrop-blur-sm z-50 flex items-center justify-center p-[16px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cw-modal-root w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-[32px]">
          <div>
            <h2 className="text-xl font-bold text-[#1B4332] tracking-tight">{t.checkout_title}</h2>
            <div className="flex items-center gap-[8px] mt-[8px]">
              <span className="text-sm font-medium text-[#1A1A1A]/60">{t.checkout_selected_slot}: {slot.slotStart}</span>
              {slot.isPeak && (
                <span className="slot-peak-badge">⚡ +{settings.peak_premium} DT {t.book_peak_badge}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-[#1B4332]/5 rounded-full transition-colors text-[#1A1A1A]/40"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-[24px]">
          {/* Guest Details */}
          <div className="space-y-[16px]">
            <div className="relative">
              <input
                id="checkout-firstname"
                className="cw-input w-full pr-[40px] text-[15px]"
                placeholder={t.checkout_first_name_placeholder}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <User size={16} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40" />
            </div>
            <div className="relative">
              <input
                id="checkout-lastname"
                className="cw-input w-full pr-[40px] text-[15px]"
                placeholder={t.checkout_last_name_placeholder}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <User size={16} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40" />
            </div>
            <div className="relative">
              <input
                id="checkout-room"
                className="cw-input w-full pr-[40px] text-[15px]"
                placeholder={t.checkout_room_placeholder}
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
              />
              <Home size={16} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40" />
            </div>
          </div>

          {/* Rackets Add-on */}
          <div className="cw-glass-card flex flex-col gap-[16px] p-[24px]">
            <div className="flex items-center gap-[8px] text-[#1B4332]">
              <ShoppingBag size={16} strokeWidth={1.5} />
              <p className="text-sm font-bold tracking-tight">{t.checkout_rackets_label}</p>
            </div>
            <div className="flex items-center justify-between">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setRacketCount(n)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all border ${
                    racketCount === n
                      ? "bg-[#1B4332] border-[#1B4332] text-white"
                      : "bg-white border-[#1B4332]/10 text-[#1B4332]/60 hover:border-[#1B4332]/40"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {racketCount === 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-[#1B4332]/5">
                <span className="text-[13px] font-bold text-[#1B4332]/80">{t.checkout_balls_only_label}</span>
                <button 
                  onClick={() => setBallsOnly(!ballsOnly)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${ballsOnly ? 'bg-[#1B4332]' : 'bg-[#1B4332]/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${ballsOnly ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            )}
          </div>

          {/* Lighting Add-on */}
          {slot.hasLighting && (
            <div className="cw-glass-card p-[24px] flex items-center justify-between">
              <div className="flex items-center gap-[8px] text-[#1B4332]">
                <Lightbulb size={16} strokeWidth={1.5} />
                <p className="text-sm font-bold tracking-tight">{t.checkout_lighting_label}</p>
              </div>
              <button 
                onClick={() => setNeedsLighting(!needsLighting)}
                className={`w-10 h-5 rounded-full relative transition-colors ${needsLighting ? 'bg-[#1B4332]' : 'bg-[#1B4332]/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${needsLighting ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="bg-[#1B4332]/5 rounded-xl p-[24px] flex flex-col gap-[12px]">
            <PriceRow label={t.checkout_base} amount={breakdown.base} />
            <PriceRow label={t.checkout_peak_surcharge} amount={breakdown.peakSurcharge} />
            <PriceRow label={t.checkout_rackets_fee} amount={breakdown.rackets} />
            <PriceRow label={t.checkout_balls_fee} amount={breakdown.ballsOnly} />
            <PriceRow label={t.checkout_lighting_fee} amount={breakdown.lighting} />
            
            <div className="flex justify-between items-center pt-3 border-t border-[#1B4332]/10">
              <span className="text-sm font-bold text-[#1B4332]">{t.checkout_total}</span>
              <span className="text-xl font-bold text-[#1B4332]">{breakdown.total} DT</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-semibold text-[#F28482] text-center">{error}</p>
          )}

          {/* Actions */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cw-button w-full bg-[#E41E2D] text-white font-bold text-[15px] tracking-tight transition-opacity hover:opacity-90 disabled:opacity-50 mt-[8px]"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin" />
            ) : (
              <>
                <span className="tracking-tight">{t.checkout_confirm_btn}</span>
                <ArrowRight size={16} strokeWidth={1.5} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
