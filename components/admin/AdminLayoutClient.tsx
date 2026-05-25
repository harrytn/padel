"use client";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { RoleProvider } from "@/lib/role-context";
import type { Role } from "@/lib/auth";

interface AdminLayoutClientProps {
  role: Role;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ role, children }: AdminLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <RoleProvider role={role}>
      <div className="bg-[url('/bg-tropical.png')] bg-cover bg-center bg-fixed min-h-screen flex relative">
        {/* Subtle dark tint */}
        <div className="absolute inset-0 bg-[#1E2438]/20 z-0 pointer-events-none" />
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-x-auto min-w-0 z-10 relative px-[24px] py-[32px] md:px-[40px] md:py-[48px]">
          <div className="cw-glass-panel w-full">
            {children}
          </div>
        </main>
      </div>
    </RoleProvider>
  );
}
