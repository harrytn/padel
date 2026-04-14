"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { ALL_SLOTS } from "@/lib/slots";

interface Settings {
  id: number;
  base_price: number;
  racket_price_with_balls: number;
  balls_only_price: number;
  lighting_price: number;
  peak_premium: number;
  open_hour: number;
  close_hour: number;
  lighting_trigger_hour: string;
  peak_slots: string;
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
      className="block text-sm font-medium text-slate-400 mb-1.5"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-lg text-slate-200 text-sm outline-none transition-all"
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
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parse peak_slots from comma-separated input back to JSON array
      const peakArr = peakSlotsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => ALL_SLOTS.includes(s as (typeof ALL_SLOTS)[number]));

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

  if (!settings) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
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
          className="rounded-2xl p-6 space-y-4"
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
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            🕐 Horaires
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Heure d'ouverture"
              id="open-hour"
              type="number"
              {...field("open_hour")}
            />
            <InputField
              label="Heure de fermeture"
              id="close-hour"
              type="number"
              {...field("close_hour")}
            />
            <InputField
              label="Déclenchement éclairage"
              id="lighting-trigger"
              {...field("lighting_trigger_hour")}
            />
          </div>
        </div>

        {/* Peak Slots Section */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            ⚡ Créneaux de pointe
          </h2>
          <div>
            <label
              htmlFor="peak-slots"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              Créneaux (séparés par des virgules)
            </label>
            <input
              id="peak-slots"
              type="text"
              value={peakSlotsInput}
              onChange={(e) => setPeakSlotsInput(e.target.value)}
              placeholder="17:00, 18:30, 20:00"
              className="w-full px-4 py-2.5 rounded-lg text-slate-200 text-sm outline-none"
              style={{
                background: "#0f172a",
                border: "1.5px solid #334155",
                fontFamily: "var(--font-mono, monospace)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Créneaux valides: {ALL_SLOTS.join(" · ")}
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
