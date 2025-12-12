import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import ActivityTracker from "@/components/user-tracker/activity-tracker";

// import your components
import ServicesManager from "./service-manager";
import ProjectsManager from "./projects-manager";
import SkillsManager from "./skills-manager";
import ExperienceManager from "./experience-manager";
import EducationManager from "./education-manager";
import UserDataManagement from "./user-data-management";
import { LogOut } from "lucide-react";
import EmailsPage from "./emails/emails";
import Image from "next/image";

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("projects"); // 👈 only this!
  const [loggingOut, setLoggingOut] = useState(false); // <- new
  const router = useRouter();

  // properly sign out with supabase and then navigate
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        // optionally show toast here
      }
    } catch (err) {
      console.error("Unexpected signOut error:", err);
    } finally {
      setLoggingOut(false);
      // clear client-side state and force navigation
      // push + reload helps ensure any in-memory state is cleared
      router.push("/admin/login").then(() => {
        // optionally force reload to ensure no cached auth state
        // window.location.reload();
      });
    }
  };

  useEffect(() => {
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

  const TABS = [
    { key: "projects", label: "projects", component: ProjectsManager },
    { key: "services", label: "services", component: ServicesManager },
    { key: "skills", label: "skills", component: SkillsManager },
    { key: "experience", label: "experience", component: ExperienceManager },
    { key: "education", label: "education", component: EducationManager },
    { key: "userData", label: "userData", component: UserDataManagement },
    { key: "Emails", label: "emails", component: EmailsPage },
  ];

  // find component to render
  const ActiveComponent =
    TABS.find((t) => t.key === activeTab)?.component || ProjectsManager;

  return (
    <div className="">
      <ActivityTracker
        timeoutMs={24 * 60 * 60 * 1000}
        onLogout={handleLogout}
      />

      <div className="flex justify-between items-center bg-[#2b2b2d] px-10 py-3 sticky top-0 w-full z-10">
        <h1 className="text-3xl text-main font-semibold">
          <Image src="/seo-logo.svg" width={50} height={50} alt="logo" />
        </h1>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className={
            "bg-red-500 text-main font-medium p-2 flex items-center gap-2 rounded-md " +
            (loggingOut ? "opacity-70 cursor-not-allowed" : "")
          }
        >
          {loggingOut ? (
            <>
              {/* small spinner */}
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </>
          ) : (
            <>
              <LogOut size={18} />
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6 -ml-3 mt-4 px-10 relative">
        {/* Sidebar tabs */}
        <aside className="">
          <div className="w-60 flex flex-col gap-4 sticky top-20 self-start ">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={
                    "py-3 px-3 rounded-md text-start font-medium transition-all capitalize " +
                    (isActive
                      ? "bg-primary text-black shadow"
                      : "bg-[#2b2b2d] text-subtle hover:bg-[#484849]")
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
