// This layout intentionally does NOT wrap children in the admin auth check.
// It shadows the parent /admin/layout.tsx for the /admin/login route only.
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
