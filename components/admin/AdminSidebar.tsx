"use client";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wind,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRole } from "@/lib/role-context";

interface AdminSidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function AdminSidebar({ isCollapsed, toggleCollapse }: AdminSidebarProps) {
  const router = useRouter();
  const role = useRole();
  const isAdmin = role === "admin";

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div
      className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      style={{ background: "#1e293b", borderRight: "1px solid #334155" }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#334155] text-white flex items-center justify-center hover:bg-[#475569] transition-colors z-50 border border-[#1e293b]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Logo */}
      <div
        className={`p-6 border-b flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
        style={{ borderColor: "#334155" }}
      >
        <div className="shrink-0 text-teal-400">
          <Wind size={24} strokeWidth={1.5} />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight uppercase">Caribbean</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest leading-none">
              Staff Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <a
          href="/admin"
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
            isCollapsed ? "justify-center" : ""
          } text-slate-400 hover:text-white hover:bg-white/5`}
        >
          <Calendar size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Planning</span>}
        </a>

        {/* Settings — Admin only */}
        {isAdmin && (
          <a
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
              isCollapsed ? "justify-center" : ""
            } text-slate-400 hover:text-white hover:bg-white/5`}
          >
            <Settings size={18} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span>Paramètres</span>}
          </a>
        )}
      </nav>

      {/* Role Badge + Logout */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: "#334155" }}>
        {/* Role Badge */}
        {!isCollapsed && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: isAdmin ? "rgba(139,92,246,0.1)" : "rgba(20,184,166,0.1)",
              border: `1px solid ${isAdmin ? "rgba(139,92,246,0.25)" : "rgba(20,184,166,0.25)"}`,
            }}
          >
            {isAdmin ? (
              <ShieldCheck size={15} className="text-violet-400 shrink-0" />
            ) : (
              <UserRound size={15} className="text-teal-400 shrink-0" />
            )}
            <div className="min-w-0">
              <p
                className="text-xs font-bold truncate"
                style={{ color: isAdmin ? "#a78bfa" : "#2dd4bf" }}
              >
                {isAdmin ? "Administrateur" : "Réception"}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                {isAdmin ? "Accès complet" : "Accès limité"}
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            {isAdmin ? (
              <ShieldCheck size={18} className="text-violet-400" />
            ) : (
              <UserRound size={18} className="text-teal-400" />
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
            isCollapsed ? "justify-center" : ""
          } text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400`}
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
