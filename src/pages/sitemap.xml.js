// import supabase from "../lib/supabaseServer";
//
// export async function getServerSideProps({ res }) {
//   const { data: projects, error } = await supabase
//     .from("projects")
//     .select("slug, updated_at");
//   // .eq("status", "published");
//
//   if (error) {
//     console.error("Supabase error:", error);
//     res.statusCode = 500;
//     res.end("Supabase query failed");
//     return { props: {} };
//   }
//
//   const safeProjects = projects || [];
//
//   const urls = safeProjects
//     .map(
//       (p) => `
// <url>
//   <loc>https://pradeep-suthar.vercel.app/portfolio/${p.slug}</loc>
//   <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
// </url>`,
//     )
//     .join("");
//
//   res.setHeader("Content-Type", "application/xml");
//   res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=3600, stale-while-revalidate=86400",
//   );
//   res.write(`<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//
// <url>
// <loc>https://pradeep-suthar.vercel.app</loc>
// <lastmod>2025-12-04T09:34:46.081Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
// <url>
// <loc>https://pradeep-suthar.vercel.app/contact</loc>
// <lastmod>2025-12-04T09:34:46.082Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
// <url>
// <loc>https://pradeep-suthar.vercel.app/portfolio</loc>
// <lastmod>2025-12-04T09:34:46.082Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
// <url>
// <loc>https://pradeep-suthar.vercel.app/resume</loc>
// <lastmod>2025-12-04T09:34:46.082Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
//
// <url>
// <loc>https://pradeep-suthar.vercel.app/services/ui-design</loc>
// <lastmod>2025-12-04T09:34:46.081Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
//
// <url>
// <loc>https://pradeep-suthar.vercel.app/services/ux-research</loc>
// <lastmod>2025-12-04T09:34:46.082Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
//
// <url>
// <loc>https://pradeep-suthar.vercel.app/services/frontend-development</loc>
// <lastmod>2025-12-04T09:34:46.082Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
//
// <url>
// <loc>https://pradeep-suthar.vercel.app/services/product-design</loc>
// <lastmod>2025-12-04T09:34:46.082Z</lastmod>
// <changefreq>daily</changefreq>
// <priority>0.7</priority>
// </url>
//
// ${urls}
// </urlset>`);
//   res.end();
//
//   return { props: {} };
// }
//
// export default function Sitemap() {
//   return null;
// }


import supabase from "../lib/supabaseServer";

const BASE_URL = "https://pradeep-suthar.vercel.app";

/**
 * Static routes of the website
 */
const STATIC_ROUTES = [
  "",
  "contact",
  "portfolio",
  "resume",
  "services/ui-design",
  "services/ux-research",
  "services/frontend-development",
  "services/product-design",
];

/**
 * Generates XML for static pages
 */
const generateStaticUrls = (lastModified) =>
    STATIC_ROUTES.map((route) => {
      const url = route ? `${BASE_URL}/${route}` : BASE_URL;

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join("");

/**
 * Generates XML for dynamic project pages
 */
const generateProjectUrls = (projects = []) =>
    projects
        .map((project) => `
  <url>
    <loc>${BASE_URL}/portfolio/${project.slug}</loc>
    <lastmod>${new Date(project.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
        .join("");

export async function getServerSideProps({ res }) {
  try {
    // Fetch latest projects from Supabase
    const { data: projects, error } = await supabase
        .from("projects")
        .select("slug, updated_at");

    if (error) {
      throw error;
    }

    const currentDate = new Date().toISOString();

    const staticUrls = generateStaticUrls(currentDate);
    const dynamicUrls = generateProjectUrls(projects);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${dynamicUrls}
</urlset>`;

    // 🔥 Production-grade headers (NO CACHE → Instant updates)
    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    res.statusCode = 500;
    res.end("Error generating sitemap");

    return { props: {} };
  }
}

export default function Sitemap() {
  return null;
}
