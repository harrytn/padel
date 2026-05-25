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
      className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 border-r border-white/40 bg-white/60 backdrop-blur-md ${
        isCollapsed ? "w-20" : "w-[280px]"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-white text-[#1B4332] flex items-center justify-center hover:bg-slate-50 transition-colors z-50 border border-white/40 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Logo */}
      <div
        className={`p-[24px] border-b border-white/40 flex items-center gap-[12px] ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="shrink-0 text-[#1B4332]">
          <Wind size={24} strokeWidth={1.5} />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-[#1E2438] text-[15px] tracking-tight uppercase">Caribbean</h1>
            <p className="text-[11px] text-[#1E2438]/60 font-bold tracking-widest leading-none mt-[4px]">
              Staff Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-[16px] flex flex-col gap-[8px] mt-[16px]">
        <a
          href="/admin"
          className={`flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all group ${
            isCollapsed ? "justify-center" : ""
          } text-[#1E2438]/80 hover:text-[#1E2438] hover:bg-white/50`}
        >
          <Calendar size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Planning</span>}
        </a>

        {/* Settings — Admin only */}
        {isAdmin && (
          <a
            href="/admin/settings"
            className={`flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all group ${
              isCollapsed ? "justify-center" : ""
            } text-[#1E2438]/80 hover:text-[#1E2438] hover:bg-white/50`}
          >
            <Settings size={18} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span>Paramètres</span>}
          </a>
        )}
      </nav>

      {/* Role Badge + Logout */}
      <div className="p-[16px] border-t border-white/40 flex flex-col gap-[12px]">
        {/* Role Badge */}
        {!isCollapsed && (
          <div
            className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-xl bg-white/40 border border-white/30 shadow-sm"
          >
            {isAdmin ? (
              <ShieldCheck size={16} className="text-violet-600 shrink-0" />
            ) : (
              <UserRound size={16} className="text-[#1B4332] shrink-0" />
            )}
            <div className="min-w-0">
              <p
                className="text-[12px] font-bold truncate text-[#1E2438]"
              >
                {isAdmin ? "Administrateur" : "Réception"}
              </p>
              <p className="text-[10px] font-bold text-[#1E2438]/60 leading-none mt-0.5 uppercase tracking-wide">
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
          className={`w-full flex items-center gap-[12px] px-[16px] h-[48px] rounded-xl text-[14px] font-bold transition-all group ${
            isCollapsed ? "justify-center" : ""
          } text-[#E41E2D]/80 hover:text-[#E41E2D] hover:bg-white/50`}
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
