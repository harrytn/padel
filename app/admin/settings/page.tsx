"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { generateTimeSlots, normalizeHour } from "@/lib/slots";
import { useRole } from "@/lib/role-context";
import { ShieldAlert } from "lucide-react";

interface Settings {
  id: number;
  base_price: number;
  racket_price_with_balls: number;
  balls_only_price: number;
  lighting_price: number;
  peak_premium: number;
  open_hour: string;
  close_hour: string;
  lighting_trigger_hour: string;
  peak_slots: string;
  slot_duration_minutes: number;
}

const InputField = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  step,
}: {
  label: string;
  id: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  step?: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-400"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 mt-1 rounded-lg text-slate-200 text-sm outline-none transition-all"
      style={{
        background: "#0f172a",
        border: "1.5px solid #334155",
        fontFamily: "var(--font-body)",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
      onBlur={(e) => (e.target.style.borderColor = "#334155")}
    />
  </div>
);

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const role = useRole();
  const isAdmin = role === "admin";

  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [peakSlotsInput, setPeakSlotsInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isAdmin) return; // Don't bother fetching if access denied
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setForm(data.settings);
        try {
          const arr = JSON.parse(data.settings.peak_slots);
          setPeakSlotsInput(arr.join(", "));
        } catch {
          setPeakSlotsInput(data.settings.peak_slots);
        }
      });
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const openHour = normalizeHour(form?.open_hour ?? "08:00");
      const closeHour = normalizeHour(form?.close_hour ?? "22:00");
      const duration = Number(form?.slot_duration_minutes || 90);
      const generatedSlots = generateTimeSlots(openHour, closeHour, duration);
      const peakArr = peakSlotsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => generatedSlots.includes(s));

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          peak_slots: JSON.stringify(peakArr),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showToast("✅ Paramètres sauvegardés");
      } else {
        showToast("❌ Erreur lors de la sauvegarde");
      }
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof Settings) => ({
    value: String(form?.[key] ?? ""),
    onChange: (val: string) => setForm((prev) => ({ ...prev, [key]: val })),
  });

  // ── Access Denied Panel ────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            ⚙️ {t.admin_settings_title}
          </h1>
        </div>
        <div
          className="rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <ShieldAlert size={32} className="text-red-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Accès refusé</p>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              La modification des paramètres est réservée aux administrateurs. Contactez votre responsable pour obtenir un accès.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!settings) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        Chargement...
      </div>
    );
  }

  // ── Admin Settings Form ────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 px-5 py-3 rounded-xl text-white font-medium text-sm z-50 shadow-lg"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          ⚙️ {t.admin_settings_title}
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Mises à jour appliquées immédiatement aux nouvelles réservations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Pricing Section */}
        <div
          className="rounded-2xl p-6 md:p-8 space-y-4"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            💰 Tarifs (DT)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Prix de base (court 90 min)"
              id="base-price"
              type="number"
              step="0.5"
              {...field("base_price")}
            />
            <InputField
              label="Supplément heure de pointe"
              id="peak-premium"
              type="number"
              step="0.5"
              {...field("peak_premium")}
            />
            <InputField
              label="Raquette + balles (par raquette)"
              id="racket-price"
              type="number"
              step="0.5"
              {...field("racket_price_with_balls")}
            />
            <InputField
              label="Location balles uniquement"
              id="balls-price"
              type="number"
              step="0.5"
              {...field("balls_only_price")}
            />
            <InputField
              label="Éclairage du terrain"
              id="lighting-price"
              type="number"
              step="0.5"
              {...field("lighting_price")}
            />
          </div>
        </div>

        {/* Schedule Section */}
        <div
          className="rounded-2xl p-6 md:p-8 space-y-4"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            🕐 Horaires
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Heure d'ouverture (HH:mm)"
              id="open-hour"
              type="time"
              {...field("open_hour")}
            />
            <InputField
              label="Heure de fermeture (HH:mm)"
              id="close-hour"
              type="time"
              {...field("close_hour")}
            />
            <InputField
              label="Déclenchement éclairage"
              id="lighting-trigger"
              {...field("lighting_trigger_hour")}
            />
            <div>
              <label htmlFor="slot-duration" className="block text-sm font-medium text-slate-400">
                {t.admin_settings_duration}
              </label>
              <select
                id="slot-duration"
                value={form.slot_duration_minutes || 90}
                onChange={(e) => setForm(prev => ({ ...prev, slot_duration_minutes: Number(e.target.value) }))}
                className="w-full px-4 py-3 mt-1 rounded-lg text-slate-200 text-sm outline-none transition-all"
                style={{
                  background: "#0f172a",
                  border: "1.5px solid #334155",
                  fontFamily: "var(--font-body)",
                }}
              >
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Peak Slots Section */}
        <div
          className="rounded-2xl p-6 md:p-8 space-y-4"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            ⚡ Créneaux de pointe
          </h2>
          <div>
            <label
              htmlFor="peak-slots"
              className="block text-sm font-medium text-slate-400"
            >
              Créneaux (séparés par des virgules)
            </label>
            <input
              id="peak-slots"
              type="text"
              value={peakSlotsInput}
              onChange={(e) => setPeakSlotsInput(e.target.value)}
              placeholder="17:00, 18:30, 20:00"
              className="w-full px-4 py-3 mt-1 rounded-lg text-slate-200 text-sm outline-none"
              style={{
                background: "#0f172a",
                border: "1.5px solid #334155",
                fontFamily: "var(--font-mono, monospace)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Créneaux valides: {generateTimeSlots(
                normalizeHour(form?.open_hour ?? "08:00"),
                normalizeHour(form?.close_hour ?? "22:00"),
                Number(form?.slot_duration_minutes || 90)
              ).join(" · ")}
            </p>
          </div>
        </div>

        {/* Save button */}
        <button
          id="save-settings-btn"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl font-bold text-white transition-all"
          style={{
            background: saving
              ? "#334155"
              : "linear-gradient(135deg, #0891b2, #14b8a6)",
            boxShadow: saving ? "none" : "0 4px 16px rgba(8,145,178,0.3)",
          }}
        >
          {saving ? "Sauvegarde..." : "💾 Sauvegarder les paramètres"}
        </button>
      </div>
    </div>
  );
}
