import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/blog-content";
import { SiteShell } from "@/components/site/site-shell";
import { getCollection, getBySlug, getSiteContext } from "@/lib/server/site-data";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) { const { slug } = await params; const post = await getBySlug("posts", slug); return { title: post ? post.title : "Article" }; }
export default async function PostPage({ params }) { const { slug } = await params; const [{ profile, settings }, posts, post] = await Promise.all([getSiteContext(), getCollection("posts"), getBySlug("posts", slug)]); if (!post) notFound(); const index = posts.findIndex((item) => item.slug === slug); const nextPost = posts[(index + 1) % posts.length]; return <SiteShell profile={profile} settings={settings}><PostDetail post={post} profile={profile} nextPost={nextPost?.slug === slug ? null : nextPost} /></SiteShell>; }
