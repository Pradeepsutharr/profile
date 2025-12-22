import { useRouter } from "next/router";

export default function AdminSidebar() {
  const router = useRouter();

  const links = [
    { label: "Projects", path: "/admin" },
    { label: "Services", path: "/admin/service-manager" },
    { label: "Skills", path: "/admin/skills-manager" },
    { label: "Experience", path: "/admin/experience-manager" },
    { label: "Education", path: "/admin/education-manager" },
    { label: "User", path: "/admin/user-data" },
    // { label: "Emails", path: "/admin/emails" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {links.map((l) => (
        <button
          key={l.path}
          onClick={() => router.push(l.path)}
          className={`py-3 px-3 rounded-md text-left ${
            router.pathname === l.path
              ? "bg-primary text-black"
              : "bg-[#2b2b2d] text-subtle"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
