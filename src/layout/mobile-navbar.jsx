import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import ThemeToggle from "@/components/theme-toggle";

const nav_data = [
  {
    id: 1,
    title: "about",
    link: "/",
  },
  {
    id: 2,
    title: "resume",
    link: "/resume",
  },
  {
    id: 3,
    title: "portfolio",
    link: "/portfolio",
  },
  {
    id: 4,
    title: "blogs",
    link: "/blogs",
  },
  {
    id: 5,
    title: "contact",
    link: "/contact",
  },
];

function MobileNavbar({ theme, onToggleTheme }) {
  const location = useRouter();
  const isActive =
    location.route === "/portfolio" || location.route === "/portfolio/[slug]"
      ? "/portfolio"
      : location.route === "/blogs" || location.route === "/blogs/[slug]"
        ? "/blogs"
        : ["/", "/resume", "/contact"].includes(location.route)
          ? location.route
          : null;


  return (
    <nav className="mobile-navbar !z-50 select-none backdrop-blur-md">
      <ul className="flex items-center justify-between gap-1 px-4 py-2">
        {nav_data?.map((item) => (
          <li key={item.id} className="flex-1 text-center">
            <Link
              href={item.link}
              className={`text-[12px] py-2 px-2.5 rounded-full block capitalize font-semibold transition-all duration-300 ${isActive === item.link ? "text-primary bg-primary/10 border border-primary/15" : "text-subtle border border-transparent"
                }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileNavbar;
