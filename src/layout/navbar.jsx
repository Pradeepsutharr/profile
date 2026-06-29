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
      className="bg-elevated/75 w-fit px-6 rounded-bl-3xl border border-stroke backdrop-blur-xl"
    >
      <ul className="flex items-center gap-8 px-4">
        {nav_data?.map((item) => (
          <li key={item.id} className="text-subtle">
            <Link
              href={item.link}
              className={`py-5 inline-block capitalize font-medium hover:text-primary ${
                isActive === item.link ? "text-primary" : "text-subtle"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li className="flex items-center">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
