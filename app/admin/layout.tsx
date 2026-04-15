import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutClient from "../../components/admin/AdminLayoutClient";

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

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
