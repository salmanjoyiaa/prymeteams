import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
