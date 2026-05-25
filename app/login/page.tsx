"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      }
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('/bg-tropical.png')] bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center px-[16px] relative">
      {/* Subtle dark tint */}
      <div className="absolute inset-0 bg-[#1E2438]/20 z-0" />
      <div className="w-full max-w-sm z-10 relative">
        <div className="text-center mb-[32px]">
          <Image src="/logo-no-bg.png" alt="Caribbean World Djerba" width={64} height={64} className="h-[64px] w-auto object-contain mx-auto mb-[16px]" priority />
          <h1
            className="text-[24px] font-bold text-white tracking-tight drop-shadow-md"
          >
            Caribbean World
          </h1>
          <p className="text-white/80 mt-[8px] text-[14px] font-medium drop-shadow-sm">Accès réservé au personnel</p>
        </div>

        <div className="cw-form-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-[8px]">
              <label
                htmlFor="admin-password"
                className="block text-[13px] font-bold text-slate-700 tracking-wide"
              >
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="cw-input w-full text-[15px] font-medium text-slate-800 placeholder-slate-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="cw-button w-full bg-[#1B4332] text-white hover:bg-[#1B4332]/90 disabled:opacity-50 mt-[16px]"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center mt-[24px]">
          <a href="/book" className="text-[13px] font-bold text-white/80 hover:text-white transition-colors drop-shadow-sm">
            ← Retour à la réservation
          </a>
        </p>
      </div>
    </div>
  );
}
