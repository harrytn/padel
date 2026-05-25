"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { getSlotEnd } from "@/lib/slots";
import { useRole } from "@/lib/role-context";

interface BookingRecord {
  id: string;
  booking_pin: string;
  type: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  room_number: string | null;
  date: string;
  slot_start: string;
  racket_count: number;
  bought_balls_only: boolean;
  needs_lighting: boolean;
  total_price: number;
  status: string;
}

interface ScheduleSlot {
  slotStart: string;
  isPeak: boolean;
  booking: BookingRecord | null;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PAID: { bg: "#dcfce7", text: "#166534", label: "✅ Payé" },
  PENDING_PAYMENT: { bg: "#fef3c7", text: "#92400e", label: "⏳ En attente" },
  CANCELLED: { bg: "#fee2e2", text: "#991b1b", label: "❌ Annulé" },
};

export default function AdminSchedulePage() {
  const { t } = useI18n();
  const role = useRole();
  const isAdmin = role === "admin";

  const [date, setDate] = useState(todayISO());
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSchedule = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schedule?date=${d}`);
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.schedule);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule(date);
  }, [date, fetchSchedule]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(
          newStatus === "PAID" ? "✅ Marqué comme payé" : "⏳ Marqué en attente"
        );
        fetchSchedule(date);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Annuler cette réservation ?")) return;
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) {
        showToast("❌ Réservation annulée");
        fetchSchedule(date);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ── Admin-only actions ────────────────────────────────────────────────────
  const unblockSlot = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("✅ Créneau débloqué");
        fetchSchedule(date);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const blockSlot = async (slotStart: string) => {
    setActionLoading(slotStart);
    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slotStart }),
      });
      if (res.ok) {
        showToast("🚫 Créneau bloqué");
        fetchSchedule(date);
      } else if (res.status === 409) {
        showToast("⚠️ Ce créneau est déjà réservé");
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 px-[20px] py-[12px] rounded-xl text-white font-medium text-sm z-50 shadow-lg"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1
            className="text-[24px] font-bold text-[#1E2438] tracking-tight"
          >
            📅 {t.admin_schedule_title}
          </h1>
          <p className="text-[#1E2438]/60 text-[14px] font-bold mt-[4px]">Caribbean World Djerba — Court de Padel</p>
        </div>
        <input
          id="admin-date-picker"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="cw-input"
        />
      </div>

      {/* Schedule table */}
      <div
        className="cw-glass-card w-full overflow-x-auto p-0 border-none"
      >
        <table className="w-full whitespace-nowrap min-w-max">
          <thead>
            <tr className="border-b border-[#1E2438]/10">
              {["Heure", "Type", "Client", "Chambre", "PIN", "Prix", "Statut", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-[24px] py-[16px] text-left text-[12px] font-bold text-[#1E2438]/60 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#1E2438]/5">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-[24px] py-[20px]">
                        <div
                          className="h-[16px] rounded bg-[#1E2438]/10 animate-pulse w-[80%]"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : schedule.map(({ slotStart, isPeak, booking }, i) => {
                  const isBlock = booking?.type === "ADMIN_BLOCK";
                  const statusInfo = booking && STATUS_COLORS[booking.status];
                  const busy =
                    actionLoading === booking?.id || actionLoading === slotStart;

                  return (
                    <tr
                      key={slotStart}
                      className="border-b border-[#1E2438]/5 transition-colors hover:bg-white/40"
                      style={{
                        opacity: busy ? 0.6 : 1,
                      }}
                    >
                      {/* Time */}
                      <td className="px-[24px] py-[20px]">
                        <span
                          className={`font-bold text-[15px] block ${isPeak ? "text-amber-600" : "text-[#2CAFC2]"}`}
                        >
                          {slotStart} - {getSlotEnd(slotStart)}
                        </span>
                        {isPeak && (
                          <span className="text-[11px] text-amber-600 font-bold tracking-tight">
                            ⚡ Heure de pointe
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-[24px] py-[20px]">
                        {booking ? (
                          <span
                            className="text-[11px] px-[12px] py-[6px] rounded-full font-bold uppercase tracking-wide"
                            style={{
                              background: isBlock ? "rgba(30,36,56,0.05)" : "rgba(44,175,194,0.1)",
                              color: isBlock ? "#1E2438" : "#2CAFC2",
                              border: `1px solid ${isBlock ? "rgba(30,36,56,0.1)" : "rgba(44,175,194,0.2)"}`,
                            }}
                          >
                            {isBlock ? "🚫 Bloqué" : "👤 Client"}
                          </span>
                        ) : (
                          <span className="text-[#1E2438]/40 text-[14px] font-bold">—</span>
                        )}
                      </td>

                      {/* Client name */}
                      <td className="px-[24px] py-[20px] text-[#1E2438] font-bold text-[14px]">
                        {booking && !isBlock
                          ? `${booking.customer_first_name} ${booking.customer_last_name}`
                          : "—"}
                      </td>

                      {/* Room */}
                      <td className="px-[24px] py-[20px] text-[#1E2438] font-bold text-[14px]">
                        {booking?.room_number ?? "—"}
                      </td>

                      {/* PIN */}
                      <td className="px-[24px] py-[20px]">
                        {booking && !isBlock ? (
                          <span
                            className="font-bold text-[14px] tracking-widest text-violet-600 bg-violet-50 px-[12px] py-[4px] rounded-lg border border-violet-100"
                          >
                            {booking.booking_pin}
                          </span>
                        ) : (
                          <span className="text-[#1E2438]/40 font-bold">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-[24px] py-[20px]">
                        {booking && !isBlock ? (
                          <span className="text-[#1E2438] font-bold text-[14px]">{booking.total_price} DT</span>
                        ) : (
                          <span className="text-[#1E2438]/40 font-bold">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-[24px] py-[20px]">
                        {isBlock ? (
                          <span
                            className="text-[11px] font-bold px-[12px] py-[6px] rounded-full uppercase tracking-wide bg-[#1E2438]/5 text-[#1E2438]/60 border border-[#1E2438]/10"
                          >
                            🚫 Bloqué
                          </span>
                        ) : statusInfo ? (
                          <span
                            className="text-[11px] font-bold px-[12px] py-[6px] rounded-full uppercase tracking-wide"
                            style={{
                              background: statusInfo.bg,
                              color: statusInfo.text,
                              border: `1px solid ${statusInfo.text}30`,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        ) : (
                          <span className="text-[#1E2438]/40 text-[13px] font-bold">Libre</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-[16px] py-[16px]">
                        <div className="flex items-center gap-[8px]">
                          {/* Block — Admin only */}
                          {!booking && isAdmin && (
                            <button
                              id={`block-slot-${slotStart.replace(":", "")}`}
                              onClick={() => blockSlot(slotStart)}
                              disabled={busy}
                              className="text-xs px-[12px] py-[8px] rounded-lg font-medium transition-colors"
                              style={{
                                background: "#1e293b",
                                color: "#94a3b8",
                                border: "1px solid #334155",
                              }}
                            >
                              🚫 {t.admin_block_slot}
                            </button>
                          )}

                          {/* Mark Paid — both roles */}
                          {booking &&
                            !isBlock &&
                            booking.status === "PENDING_PAYMENT" && (
                              <button
                                id={`mark-paid-${booking.id.slice(0, 8)}`}
                                onClick={() => updateStatus(booking.id, "PAID")}
                                disabled={busy}
                                className="text-xs px-[12px] py-[8px] rounded-lg font-semibold transition-all"
                                style={{
                                  background: "rgba(22,163,74,0.15)",
                                  color: "#4ade80",
                                  border: "1px solid rgba(22,163,74,0.3)",
                                }}
                              >
                                ✅ {t.admin_mark_paid}
                              </button>
                            )}

                          {/* Mark Pending — both roles */}
                          {booking &&
                            !isBlock &&
                            booking.status === "PAID" && (
                              <button
                                id={`mark-pending-${booking.id.slice(0, 8)}`}
                                onClick={() => updateStatus(booking.id, "PENDING_PAYMENT")}
                                disabled={busy}
                                className="text-xs px-[12px] py-[8px] rounded-lg font-medium transition-all"
                                style={{
                                  background: "rgba(245,158,11,0.15)",
                                  color: "#fbbf24",
                                  border: "1px solid rgba(245,158,11,0.3)",
                                }}
                              >
                                ⏳ {t.admin_mark_pending}
                              </button>
                            )}

                          {/* Cancel — both roles */}
                          {booking && !isBlock && booking.status !== "CANCELLED" && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              disabled={busy}
                              className="text-xs px-[12px] py-[8px] rounded-lg font-medium transition-all"
                              style={{
                                background: "rgba(239,68,68,0.1)",
                                color: "#f87171",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                            >
                              ❌
                            </button>
                          )}

                          {/* Unblock — Admin only */}
                          {isBlock && isAdmin && (
                            <button
                              onClick={() => unblockSlot(booking!.id)}
                              disabled={busy}
                              className="text-xs px-[12px] py-[8px] rounded-lg font-medium transition-all"
                              style={{
                                background: "rgba(239,68,68,0.1)",
                                color: "#f87171",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                            >
                              {t.admin_unblock_slot}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
