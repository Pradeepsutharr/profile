import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/server/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
