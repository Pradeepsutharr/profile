import supabase from "../lib/supabaseServer";

export async function getServerSideProps({ res }) {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("slug, updated_at");
  // .eq("status", "published");

  if (error) {
    console.error("Supabase error:", error);
    res.statusCode = 500;
    res.end("Supabase query failed");
    return { props: {} };
  }

  const safeProjects = projects || [];

  const urls = safeProjects
    .map(
      (p) => `
<url>
  <loc>https://pradeep-suthar.vercel.app/portfolio/${p.slug}</loc>
  <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
</url>`
    )
    .join("");

  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>https://pradeep-suthar.vercel.app</loc>
<lastmod>2025-12-04T09:34:46.081Z</lastmod>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://pradeep-suthar.vercel.app/contact</loc>
<lastmod>2025-12-04T09:34:46.082Z</lastmod>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://pradeep-suthar.vercel.app/portfolio</loc>
<lastmod>2025-12-04T09:34:46.082Z</lastmod>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://pradeep-suthar.vercel.app/resume</loc>
<lastmod>2025-12-04T09:34:46.082Z</lastmod>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>

${urls}
</urlset>`);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
