import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
    title: "contact",
    link: "/contact",
  },
];

function Navbar() {
  const location = useRouter();
  const [isActive, setIsActive] = useState(location.route);

  useEffect(() => {
    switch (location.route) {
      case "/resume":
        setIsActive("/resume");
        break;

      case "/portfolio":
        setIsActive("/portfolio");
        break;

      case "/contact":
        setIsActive("/contact");
        break;

      case "/":
        setIsActive("/");
        break;

      default:
        setIsActive(null);
        break;
    }
  }, [location.route]);

  return (
    <nav
      role="navbar"
      className="bg-[#2b2b2cbf] w-fit px-6 rounded-bl-3xl border border-stroke"
    >
      <ul className="flex items-center gap-12 px-4">
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
      </ul>
    </nav>
  );
}

export default Navbar;
