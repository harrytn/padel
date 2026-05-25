import AdminLayoutClient from "../../components/admin/AdminLayoutClient";
import { getRole } from "@/lib/auth";
import type { Role } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already verified the JWT and redirected unauthenticated users
  // before this layout runs. We only read the role here to pass it to the
  // client component tree — we never redirect from a layout.
  const role = await getRole();

  // Graceful fallback: if role is somehow null (e.g. on the /admin/login page
  // which middleware passes through), just render children without the shell.
  if (!role) {
    return <>{children}</>;
  }

  return <AdminLayoutClient role={role as Role}>{children}</AdminLayoutClient>;
}
