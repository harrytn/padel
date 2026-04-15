"use client";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#0f172a" }}>
      {/* Sidebar - fixed width but responsive to state */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      
      {/* Main Content - flex-1 pushes beside the sidebar */}
      <main className="flex-1 min-h-screen overflow-x-auto min-w-0">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
