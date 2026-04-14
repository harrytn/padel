"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { getSlotEnd } from "@/lib/slots";

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

  const unblockSlot = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
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
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 px-5 py-3 rounded-xl text-white font-medium text-sm z-50 shadow-lg"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            📅 {t.admin_schedule_title}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Caribbean World Djerba — Court de Padel</p>
        </div>
        <input
          id="admin-date-picker"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 rounded-lg text-slate-200 text-sm outline-none"
          style={{
            background: "#1e293b",
            border: "1.5px solid #334155",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Schedule table */}
      <div
        className="rounded-2xl w-full overflow-x-auto"
        style={{ border: "1px solid #334155" }}
      >
        <table className="w-full whitespace-nowrap min-w-max">
          <thead>
            <tr style={{ background: "#1e293b" }}>
              {["Heure", "Type", "Client", "Chambre", "PIN", "Prix", "Statut", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
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
                  <tr key={i} style={{ background: i % 2 === 0 ? "#0f172a" : "#1e293b" }}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-4">
                        <div
                          className="h-4 rounded animate-pulse"
                          style={{ background: "#334155", width: "80%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : schedule.map(({ slotStart, isPeak, booking }, i) => {
                  const isBlock = booking?.type === "ADMIN_BLOCK";
                  const statusInfo =
                    booking && STATUS_COLORS[booking.status];
                  const busy = actionLoading === booking?.id || actionLoading === slotStart;

                  return (
                    <tr
                      key={slotStart}
                      style={{
                        background: i % 2 === 0 ? "#0f172a" : "#1e293b",
                        opacity: busy ? 0.6 : 1,
                      }}
                    >
                      {/* Time */}
                      <td className="px-4 py-4">
                        <span
                          className="font-bold text-base block"
                          style={{
                            fontFamily: "var(--font-outfit)",
                            color: isPeak ? "#f59e0b" : "#14b8a6",
                          }}
                        >
                          {slotStart} - {getSlotEnd(slotStart)}
                        </span>
                        {isPeak && (
                          <span className="text-xs text-amber-500 font-medium">⚡ Heure de pointe</span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4">
                        {booking ? (
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{
                              background: isBlock ? "#1e293b" : "#0f4c75",
                              color: isBlock ? "#94a3b8" : "#7dd3fc",
                              border: `1px solid ${isBlock ? "#334155" : "#0369a1"}`,
                            }}
                          >
                            {isBlock ? "🚫 Bloqué" : "👤 Client"}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>

                      {/* Client name */}
                      <td className="px-4 py-4 text-slate-300 text-sm">
                        {booking && !isBlock
                          ? `${booking.customer_first_name} ${booking.customer_last_name}`
                          : "—"}
                      </td>

                      {/* Room */}
                      <td className="px-4 py-4 text-slate-300 text-sm font-mono">
                        {booking?.room_number ?? "—"}
                      </td>

                      {/* PIN */}
                      <td className="px-4 py-4">
                        {booking && !isBlock ? (
                          <span
                            className="font-bold text-base tracking-widest"
                            style={{
                              fontFamily: "var(--font-outfit)",
                              color: "#a78bfa",
                            }}
                          >
                            {booking.booking_pin}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        {booking && !isBlock ? (
                          <span className="text-white font-semibold">
                            {booking.total_price} DT
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {isBlock ? (
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              background: "#f1f5f922",
                              color: "#94a3b8",
                              border: "1px solid #334155",
                            }}
                          >
                            🚫 Bloqué
                          </span>
                        ) : statusInfo ? (
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              background: statusInfo.bg + "22",
                              color: statusInfo.text,
                              border: `1px solid ${statusInfo.bg}`,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">Libre</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {!booking && (
                            <button
                              id={`block-slot-${slotStart.replace(":", "")}`}
                              onClick={() => blockSlot(slotStart)}
                              disabled={busy}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                              style={{
                                background: "#1e293b",
                                color: "#94a3b8",
                                border: "1px solid #334155",
                              }}
                            >
                              🚫 {t.admin_block_slot}
                            </button>
                          )}

                          {booking &&
                            !isBlock &&
                            booking.status === "PENDING_PAYMENT" && (
                              <button
                                id={`mark-paid-${booking.id.slice(0, 8)}`}
                                onClick={() => updateStatus(booking.id, "PAID")}
                                disabled={busy}
                                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                                style={{
                                  background: "rgba(22,163,74,0.15)",
                                  color: "#4ade80",
                                  border: "1px solid rgba(22,163,74,0.3)",
                                }}
                              >
                                ✅ {t.admin_mark_paid}
                              </button>
                            )}

                          {booking &&
                            !isBlock &&
                            booking.status === "PAID" && (
                              <button
                                id={`mark-pending-${booking.id.slice(0, 8)}`}
                                onClick={() =>
                                  updateStatus(booking.id, "PENDING_PAYMENT")
                                }
                                disabled={busy}
                                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                                style={{
                                  background: "rgba(245,158,11,0.15)",
                                  color: "#fbbf24",
                                  border: "1px solid rgba(245,158,11,0.3)",
                                }}
                              >
                                ⏳ {t.admin_mark_pending}
                              </button>
                            )}

                          {booking && !isBlock && booking.status !== "CANCELLED" && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              disabled={busy}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                              style={{
                                background: "rgba(239,68,68,0.1)",
                                color: "#f87171",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                            >
                              ❌
                            </button>
                          )}

                          {isBlock && (
                            <button
                              onClick={() => unblockSlot(booking!.id)}
                              disabled={busy}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
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
