import { BlogContent } from "@/components/site/blog-content";
import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  metadataFromConfig,
} from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  const { profile } = await getSiteContext();
  return metadataFromConfig("blog", { profile });
}

export default async function BlogPage() {
  const [{ profile, settings }, posts] = await Promise.all([
    getSiteContext(),
    getCollection("posts"),
  ]);
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: "Blogs",
            description: `Articles by ${profile.name}`,
            path: "/blogs",
            profile,
            items: posts.map((post) => ({
              title: post.title,
              path: `/blogs/${post.slug}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
          ]),
        ]}
      />
      <BlogContent posts={posts} />
      <CtaBanner
        title="Building something and need a design partner?"
        description="I help teams turn fuzzy ideas into clear, shippable product interfaces."
      />
    </SiteShell>
  );
}
