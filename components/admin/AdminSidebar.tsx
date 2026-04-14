"use client";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div
      className="fixed left-0 top-0 bottom-0 w-56 flex flex-col"
      style={{ background: "#1e293b", borderRight: "1px solid #334155" }}
    >
      <div className="p-5 border-b" style={{ borderColor: "#334155" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎾</span>
          <span
            className="font-bold text-white text-sm"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Caribbean World
          </span>
        </div>
        <p className="text-xs text-slate-400">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <a
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>📅</span> Planning
        </a>
        <a
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>⚙️</span> Paramètres
        </a>
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "#334155" }}>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-left"
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}
