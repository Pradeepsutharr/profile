import React from "react";
import Link from "next/link";
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

function Navbar({ theme, onToggleTheme }) {
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
    <nav
      className="glass-card w-fit px-4 py-1.5 rounded-full border shadow-lg m-4 select-none"
    >
      <ul className="flex items-center gap-3">
        {nav_data?.map((item) => (
          <li key={item.id} className="text-subtle">
            <Link
              href={item.link}
              className={`py-1.5 px-3.5 rounded-full text-[13px] inline-block capitalize font-medium transition-all duration-300 hover:text-primary hover:bg-primary/5 ${isActive === item.link ? "text-primary bg-primary/10 border border-primary/20" : "text-subtle border border-transparent"
                }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li className="flex items-center ml-1 border-l border-stroke/50 pl-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} className="scale-90" />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
