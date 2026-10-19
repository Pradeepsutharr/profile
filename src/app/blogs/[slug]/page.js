import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/blog-content";
import { CtaBanner } from "@/components/site/cta-banner";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { getBySlug, getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  metadataFromConfig,
} from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [{ profile }, post] = await Promise.all([
    getSiteContext(),
    getBySlug("posts", slug),
  ]);
  if (!post) return metadataFromConfig("blog", { profile });
  return metadataFromConfig("blogDetail", {
    profile,
    name: post.title,
    title: post.seo_title,
    description: post.seo_description || post.excerpt,
    keywords: post.keywords,
    path: `/blogs/${post.slug}`,
    image: post.image_url,
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at || post.published_at || undefined,
  });
}

function scoreRelated(haystack, needles) {
  const text = String(haystack || "").toLowerCase();
  return needles.reduce(
    (score, needle) => (needle && text.includes(needle) ? score + 1 : score),
    0,
  );
}

function pickRelated(items, post, limit = 1) {
  const needles = [
    String(post.category || "").toLowerCase(),
    ...String(post.keywords || "")
      .toLowerCase()
      .split(/[,\s]+/)
      .filter((token) => token.length > 3),
    ...String(post.title || "")
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 4),
  ];
  return [...items]
    .map((item) => ({
      item,
      score:
        scoreRelated(
          [item.title, item.excerpt, item.description, item.keywords, ...(item.tags || [])].join(
            " ",
          ),
          needles,
        ) + (item.featured ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const [{ profile, settings }, posts, post, projects, services] =
    await Promise.all([
      getSiteContext(),
      getCollection("posts"),
      getBySlug("posts", slug),
      getCollection("projects"),
      getCollection("services"),
    ]);
  if (!post) notFound();
  const index = posts.findIndex((item) => item.slug === slug);
  const nextPost = posts[(index + 1) % posts.length];
  const relatedProjects = pickRelated(projects, post, 1);
  const relatedServices = pickRelated(services, post, 1);
  return (
    <SiteShell profile={profile} settings={settings}>
      <JsonLd
        data={[
          articleJsonLd(post, profile),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
            { name: post.title, path: `/blogs/${post.slug}` },
          ]),
        ]}
      />
      <PostDetail
        post={post}
        profile={profile}
        nextPost={nextPost?.slug === slug ? null : nextPost}
        relatedProjects={relatedProjects}
        relatedServices={relatedServices}
      />
      <CtaBanner
        title="Liked this thinking?"
        description="If you’re shaping a product and want a designer-developer who can ship, let’s talk."
        label="Book a discovery call"
      />
    </SiteShell>
  );
}
