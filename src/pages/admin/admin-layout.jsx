import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { LogOut } from "lucide-react";
import Image from "next/image";
import ActivityTracker from "../../components/user-tracker/activity-tracker";
import AdminSidebar from "./admin-sidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.replace("/admin/login");

      const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (!data) {
        await supabase.auth.signOut();
        return router.replace("/admin/login");
      }

      setChecking(false);
    };
    check();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (checking) return <div>Checking auth...</div>;

  return (
    <div>
      <ActivityTracker timeoutMs={10 * 60 * 1000} onLogout={handleLogout} />

      {/* Top bar */}
      <div className="flex justify-between items-center bg-[#2b2b2d] px-10 py-3 sticky top-0 z-10">
        <Image src="/seo-logo.svg" width={50} height={50} alt="logo" />
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="bg-red-500 p-2 rounded-md"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex gap-6 px-10 mt-4">
        <aside className="w-60 sticky top-20">
          <AdminSidebar />
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
