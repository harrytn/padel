import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminLayoutClient from "../../components/admin/AdminLayoutClient";
import type { Role } from "@/lib/auth";

async function getSessionRole(): Promise<Role | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = payload.role;
    if (role === "admin" || role === "reception") return role;
    return null;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getSessionRole();

  if (!role) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient role={role}>{children}</AdminLayoutClient>;
}
