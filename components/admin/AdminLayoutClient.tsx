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
      <div className="flex min-h-screen" style={{ background: "#0f172a" }}>
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-x-auto min-w-0">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </RoleProvider>
  );
}
