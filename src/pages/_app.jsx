import MobileNavbar from "@/layout/mobile-navbar";
import Navbar from "@/layout/navbar";
import SideBar from "@/layout/side-bar";
import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // check if this is an admin route
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
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
                <div className="bg-[#1e1e1f] border border-stroke rounded-3xl overflow-hidden relative px-8 py-10 ">
                  <div className="navbar hidden md:flex absolute right-0 top-0">
                    <Navbar />
                  </div>

                  <div className="block md:hidden">
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
  );
}
