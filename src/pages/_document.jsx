import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var key = "portfolio-theme";
                var pathname = window.location.pathname || "";
                var isAdminRoute = pathname.indexOf("/admin") === 0;
                var theme = isAdminRoute ? "dark" : (window.localStorage.getItem(key) || "dark");
                document.documentElement.dataset.theme = theme;
              })();
            `,
          }}
        />
      </Head>
      <body className="lg:my-12">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
