import { useRouter } from "next/router";
import {
  Briefcase,
  BookOpen,
  Sparkles,
  Code2,
  History,
  GraduationCap,
  User,
} from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();

  const links = [
    { label: "Projects", path: "/admin", icon: Briefcase },
    { label: "Blogs", path: "/admin/blogs-manager", icon: BookOpen },
    { label: "Services", path: "/admin/service-manager", icon: Sparkles },
    { label: "Skills", path: "/admin/skills-manager", icon: Code2 },
    { label: "Experience", path: "/admin/experience-manager", icon: History },
    { label: "Education", path: "/admin/education-manager", icon: GraduationCap },
    { label: "User Profile", path: "/admin/user-data", icon: User },
  ];

  return (
    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 hide-scrollbar">
      {links.map((l) => {
        const IconComponent = l.icon;
        const isActive = router.pathname === l.path;
        return (
          <button
            key={l.path}
            onClick={() => router.push(l.path)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 flex-shrink-0 lg:w-full text-left border ${
              isActive
                ? "bg-primary text-black border-primary shadow-[0_4px_20px_rgba(var(--color-primary),0.2)]"
                : "bg-transparent border-transparent text-subtle hover:border-stroke/60 hover:bg-[#16161a]/60 hover:text-main"
            }`}
          >
            <IconComponent size={16} className={isActive ? "text-black" : "text-subtle/80 group-hover:text-main"} />
            <span>{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}
