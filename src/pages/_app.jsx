import MobileNavbar from "@/layout/mobile-navbar";
import Navbar from "@/layout/navbar";
import SideBar from "@/layout/side-bar";
import "@/styles/globals.css";
import { Poppins, DM_Sans, Sora } from "next/font/google";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const THEME_STORAGE_KEY = "portfolio-theme";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

function hexToRgbSpace(hex) {
  if (!hex) return null;
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : null;
}

export default function App({ Component, pageProps }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const router = useRouter();
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme || "dark";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [colors, setColors] = useState({ light: "", dark: "" });

  // check if this is an admin route
  const isAdminRoute = router.pathname.startsWith("/admin");

  const getLayout = Component.getLayout || ((page) => page);
  const activeTheme = isAdminRoute ? "dark" : theme;

  // Load custom primary colors from active user profile database
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("metadata")
          .eq("is_active", true)
          .single();

        if (!error && data?.metadata) {
          setColors({
            light: data.metadata.primaryColorLight || "",
            dark: data.metadata.primaryColorDark || "",
          });
        }
      } catch (err) {
        console.error("Failed to load custom colors:", err);
      }
    };
    fetchColors();
  }, [router.pathname]);

  // Apply custom primary colors dynamically
  useEffect(() => {
    const rgbDark = colors.dark ? hexToRgbSpace(colors.dark) : null;
    const rgbLight = colors.light ? hexToRgbSpace(colors.light) : null;

    if (activeTheme === "light" && rgbLight) {
      document.documentElement.style.setProperty("--color-primary", rgbLight);
    } else if (activeTheme === "dark" && rgbDark) {
      document.documentElement.style.setProperty("--color-primary", rgbDark);
    } else {
      document.documentElement.style.removeProperty("--color-primary");
    }
  }, [activeTheme, colors]);

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme;
    if (!isAdminRoute) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [activeTheme, isAdminRoute, theme]);

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true);
    const handleComplete = () => setIsTransitioning(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />

      <Script id="gtag-init" strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}
      </Script>

      <div className={`${poppins.variable} ${dmSans.variable} ${sora.variable} ${poppins.className}`}>
        {/* Glowing Top Route Progress Bar */}
        {isTransitioning && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-[99999] overflow-hidden">
            <div className="h-full bg-primary shadow-[0_0_8px_rgb(var(--color-primary))] animate-route-progress" />
          </div>
        )}
        {isAdminRoute ? (
          // ADMIN ROUTES → layout decided by page
          <div className="mt-[-3rem]">
            {getLayout(<Component {...pageProps} />)}
          </div>
        ) : (
          // PUBLIC ROUTES → same as before
          <div className="layout relative min-h-screen">
            {/* Ambient Background Glows */}
            {/* <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" /> */}
            {/* <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none z-0" /> */}

            <div className="container">
              <div className="flex flex-wrap">
                <aside className="side-bar col-12 lg:col-3">
                  <SideBar
                    theme={theme}
                    onToggleTheme={handleThemeToggle}
                    initialUser={pageProps.activeUser}
                  />
                </aside>

                <main className="main-content col-12 lg:col-9">
                  <div className="bg-background border border-stroke rounded-2xl lg:rounded-3xl overflow-hidden lg:relative lg:px-6 lg:py-10 px-4 py-4 mb-20">
                    <div className="navbar hidden lg:flex absolute right-0 top-0">
                      <Navbar
                        theme={theme}
                        onToggleTheme={handleThemeToggle}
                      />
                    </div>

                    <div className="block lg:hidden">
                      <MobileNavbar
                        theme={theme}
                        onToggleTheme={handleThemeToggle}
                      />
                    </div>

                    <Component {...pageProps} />
                  </div>
                </main>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
