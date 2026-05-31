"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserRound, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Mot de passe incorrect.");
        setPassword("");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-[16px]"
      style={{ background: "#0f172a" }}
    >
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Header */}
        <div className="text-center mb-[32px]">
          <div className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-2xl mb-[16px]"
            style={{ background: "linear-gradient(135deg, #0891b2, #14b8a6)", boxShadow: "0 8px 32px rgba(8,145,178,0.3)" }}
          >
            <span className="text-2xl">🎾</span>
          </div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Caribbean World Djerba
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Portail du Personnel</p>
        </div>

        {/* Role info cards */}
        <div className="grid grid-cols-2 gap-[12px] mb-[24px]">
          <div
            className="rounded-xl px-[12px] py-[12px] flex items-center gap-[10px]"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <ShieldCheck size={16} className="text-violet-400 shrink-0" />
            <div>
              <p className="text-violet-300 text-xs font-bold">Admin</p>
              <p className="text-slate-500 text-[10px] leading-tight">Accès complet</p>
            </div>
          </div>
          <div
            className="rounded-xl px-[12px] py-[12px] flex items-center gap-[10px]"
            style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}
          >
            <UserRound size={16} className="text-teal-400 shrink-0" />
            <div>
              <p className="text-teal-300 text-xs font-bold">Réception</p>
              <p className="text-slate-500 text-[10px] leading-tight">Planning + statuts</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-[24px]"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <p className="text-slate-400 text-xs text-center mb-[20px]">
            Votre rôle est détecté automatiquement selon votre mot de passe.
          </p>

          <form onSubmit={handleLogin} className="space-y-[16px]">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-[16px] py-[12px] pr-[44px] rounded-xl text-white placeholder-slate-500 outline-none transition-all"
                  style={{
                    background: "#0f172a",
                    border: "1.5px solid #334155",
                    fontFamily: "var(--font-body)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg border border-red-900/30">
                {error}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading || !password}
              className="w-full py-[12px] rounded-xl font-bold text-white transition-all"
              style={{
                background:
                  loading || !password
                    ? "#334155"
                    : "linear-gradient(135deg, #0891b2, #14b8a6)",
                boxShadow:
                  loading || !password
                    ? "none"
                    : "0 4px 16px rgba(8,145,178,0.3)",
              }}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center mt-[24px]">
          <a
            href="/book"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Retour à la réservation
          </a>
        </p>
      </div>
    </div>
  );
}
