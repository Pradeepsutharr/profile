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

  if (checking) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d10]">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-subtle text-xs font-mono tracking-widest mt-4 animate-pulse">VERIFYING CREDENTIALS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d10] text-main flex flex-col">
      <ActivityTracker timeoutMs={10 * 60 * 1000} onLogout={handleLogout} />

      {/* Top bar (Premium Glassmorphic) */}
      <header className="flex justify-between items-center bg-[#16161a]/60 backdrop-blur-md border-b border-stroke/40 px-6 md:px-10 py-3.5 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/seo-logo.svg" width={38} height={38} alt="logo" className="hover:opacity-80 transition-opacity" />
          <span className="h-5 w-px bg-stroke/60 hidden sm:block" />
          <span className="text-xs font-bold tracking-widest text-subtle/50 hidden sm:block uppercase">Admin Dashboard</span>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Sign Out"
          className="flex items-center justify-center p-2.5 rounded-xl border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500 hover:text-black transition-all duration-300 shadow-md group disabled:opacity-50"
        >
          <LogOut size={16} className="group-hover:scale-105 transition-transform" />
        </button>
      </header>

      {/* Body Grid Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 md:px-10 py-6 max-w-[1400px] w-full mx-auto">
        <aside className="w-full lg:w-64 lg:sticky lg:top-24 h-fit">
          <div className="bg-[#16161a]/40 border border-stroke/40 rounded-2xl p-4">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-subtle/30 px-3 block mb-3">Management</label>
            <AdminSidebar />
          </div>
        </aside>

        <main className="flex-grow min-w-0 bg-[#16161a]/30 border border-stroke/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
          {children}
        </main>
      </div>
    </div>
  );
}
