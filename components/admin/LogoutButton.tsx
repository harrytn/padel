"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-left"
    >
      🚪 Déconnexion
    </button>
  );
}
