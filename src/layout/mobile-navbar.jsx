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
    <nav className="mobile-navbar">
      <ul className="flex items-center justify-evenly gap-2 px-3">
        {nav_data?.map((item) => (
          <li key={item.id}>
            <Link
              href={item.link}
              className={`text-main py-5 px-2 block capitalize ${
                isActive === item.link ? "text-primary" : "text-subtle"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li className="flex items-center">
          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            className="px-2.5 py-1.5 text-[11px]"
          />
        </li>
      </ul>
    </nav>
  );
}

export default MobileNavbar;
