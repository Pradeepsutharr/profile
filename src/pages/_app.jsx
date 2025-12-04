import MobileNavbar from "@/layout/mobile-navbar";
import Navbar from "@/layout/navbar";
import SideBar from "@/layout/side-bar";
import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import Script from "next/script";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const router = useRouter();
  // check if this is an admin route
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      ></Script>

      <Script strategy="lazyOnload">
        {`
          // Google Analytics
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>

      <div className={font.className}>
        {isAdminRoute ? (
          // -----------------------------
          // ADMIN PAGES — NO LAYOUT
          // -----------------------------
          <div className="container bg-[#1e1e1f] p-10 rounded-2xl">
            <div className="">
              <Component {...pageProps} />
            </div>
          </div>
        ) : (
          // -----------------------------
          // NORMAL PUBLIC LAYOUT
          // -----------------------------
          <div className="layout ">
            <div className="container ">
              <div className="flex flex-wrap ">
                <aside className="side-bar col-12 lg:col-3">
                  <SideBar />
                </aside>
                <div className="main-content col-12 lg:col-9 ">
                  <div className="bg-[#1e1e1f] border border-stroke rounded-2xl lg:rounded-3xl overflow-hidden lg:relative lg:px-8 lg:py-10 px-4 py-4 mb-20 md:mb-18 lg:mb-0 transition-all duration-transition-all duration-700">
                    <div className="navbar hidden lg:flex absolute right-0 top-0">
                      <Navbar />
                    </div>

                    <div className="block lg:hidden">
                      <MobileNavbar />
                    </div>

                    <Component {...pageProps} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
