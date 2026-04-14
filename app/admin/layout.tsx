"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const isAuthenticated = session === process.env.ADMIN_PASSWORD;

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0f172a" }}>
      <AdminSidebar />
      <div className="ml-56 flex-1 min-h-screen w-[calc(100%-14rem)] overflow-x-hidden">{children}</div>
    </div>
  );
}
