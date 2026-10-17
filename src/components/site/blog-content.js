import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero, Reveal } from "./motion";
import { dateLabel, readingTime } from "./icons";

export function BlogContent({ posts }) {
  const [featured, ...rest] = posts;
  return <><PageHero eyebrow="Journal" title="Thoughts &" accent="notes" description="Lessons from the intersection of product design, systems, and front-end craft." />
    {featured && <Reveal><Link href={`/blog/${featured.slug}`} className="featured-case blog-feature liquid"><div className="project-image"><Image src={featured.image_url || "/images/hero-illustration.png"} alt="" width={1000} height={660} /></div><div className="featured-case-copy"><small>Latest · {featured.category}</small><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="post-meta">{dateLabel(featured.published_at)} · {readingTime(featured.content)}<ArrowUpRight size={18} /></div></div></Link></Reveal>}
    <div className="post-grid">{rest.map((post, index) => <Reveal key={post.id} delay={index * 0.08}><Link href={`/blog/${post.slug}`} className="post-card liquid"><div className="project-image"><Image src={post.image_url || "/images/hero-illustration.png"} alt="" width={700} height={400} /></div><div><small>{post.category}</small><h3>{post.title}</h3><p>{post.excerpt}</p><span className="post-meta">{dateLabel(post.published_at)} · {readingTime(post.content)} <ArrowUpRight size={16} /></span></div></Link></Reveal>)}</div>
  </>;
}

export function PostDetail({ post, nextPost, profile }) {
  const sections = String(post.content || "").split(/\n\s*\n/).filter(Boolean);
  return <article className="post-detail"><Link href="/blog" className="back-link">← All articles</Link><Reveal><header><span className="eyebrow">{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div className="author-line"><Image src={profile.avatar_url || "/images/avatar.png"} alt="" width={36} height={36} /><span><b>{profile.name}</b><small>{dateLabel(post.published_at)} · {readingTime(post.content)}</small></span></div></header></Reveal><Reveal><div className="case-image liquid"><Image src={post.image_url || "/images/hero-illustration.png"} alt={post.title} width={1200} height={680} priority /></div></Reveal><div className="article-copy">{sections.map((section, index) => <Reveal key={index}><p>{section}</p></Reveal>)}</div>{nextPost && <Link href={`/blog/${nextPost.slug}`} className="next-card liquid"><span><small>Read next</small><b>{nextPost.title}</b></span><ArrowRight size={20} /></Link>}</article>;
}
