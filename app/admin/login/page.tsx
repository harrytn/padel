"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0f172a" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎾</div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Caribbean World Djerba
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Accès réservé au personnel</p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-300 mb-2"
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
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none transition-all"
                style={{
                  background: "#0f172a",
                  border: "1.5px solid #334155",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "#14b8a6")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "#334155")
                }
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
              className="w-full py-3 rounded-xl font-bold text-white transition-all"
              style={{
                background: loading
                  ? "#334155"
                  : "linear-gradient(135deg, #0891b2, #14b8a6)",
                boxShadow: loading ? "none" : "0 4px 16px rgba(8,145,178,0.3)",
              }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/book" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Retour à la réservation
          </a>
        </p>
      </div>
    </div>
  );
}
