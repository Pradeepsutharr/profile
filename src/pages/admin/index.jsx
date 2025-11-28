import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import ActivityTracker from "@/components/user-tracker/activity-tracker";
import ProjectsManager from "./projects-manager";

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login");
  };

  useEffect(() => {
    // listen to a custom window event if you want global signout control:
    const onSignOut = async () => {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error(err);
      }
      router.push("/admin/login");
    };
    window.addEventListener("supabase:signout", onSignOut);
    return () => window.removeEventListener("supabase:signout", onSignOut);
  }, [router]);

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/admin/login");
      const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      if (!data) {
        await supabase.auth.signOut();
        return router.push("/admin/login");
      }
      setChecking(false);
    };
    check();
  }, []);

  if (checking) return <div>Checking auth...</div>;

  return (
    <div className="">
      <ActivityTracker
        timeoutMs={24 * 60 * 60 * 1000}
        onLogout={handleLogout}
      />{" "}
      <h1 className="text-3xl text-main font-semibold">Admin</h1>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>
      <div className="flex">
        <div className="col-3 flex flex-col gap-y-3">
          {["services", "projects", "skills", "experience", "education"].map(
            (item, index) => (
              <button
                key={index}
                className="bg-primary py-2 px-3 capitalize font-medium text-start rounded-md"
              >
                {item}
              </button>
            )
          )}
        </div>
        <div className="col-9">
          <ProjectsManager />
        </div>
      </div>
    </div>
  );
}
