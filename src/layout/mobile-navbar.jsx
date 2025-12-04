import Link from "next/link";
import React from "react";
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

function MobileNavbar() {
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
    <nav className="mobile-navbar">
      <ul className="flex items-center justify-evenly">
        {nav_data?.map((item) => (
          <li>
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
      </ul>
    </nav>
  );
}

export default MobileNavbar;
