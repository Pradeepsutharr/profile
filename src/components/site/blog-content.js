/* eslint-disable @next/next/no-img-element -- imported legacy post images may use remote storage URLs. */
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BlogHtml } from "./blog-code-blocks";
import { PageHero, Reveal } from "./motion";
import { dateLabel, readingTime } from "./icons";

function PostImage({ post, className = "" }) {
  return (
    <img
      src={post.image_url || "/images/hero-illustration.png"}
      alt={post.title}
      className={className}
    />
  );
}

export function BlogContent({ posts }) {
  const [first, ...rest] = posts;
  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Thoughts &"
        accent="notes"
        description="Lessons from the intersection of design and code."
      />
      {first && (
        <Reveal>
          <Link
            href={`/blog/${first.slug}`}
            className="glass-card group mb-5 flex flex-col overflow-hidden rounded-3xl p-3 md:flex-row"
          >
            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-secondary md:w-1/2">
              <PostImage
                post={first}
                className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col p-5 md:w-1/2 md:p-7">
              <span className="text-[11px] uppercase tracking-[.2em] text-muted-foreground">
                {first.featured ? "Featured" : "Latest"} · {first.category}
              </span>
              <h2 className="font-display mt-3 text-2xl font-semibold leading-tight tracking-[-.03em] md:text-3xl">
                {first.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {first.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
                {dateLabel(first.published_at)} · {readingTime(first.content)}
                <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45 group-hover:text-primary" />
              </div>
            </div>
          </Link>
        </Reveal>
      )}
      <div className="flex flex-col gap-5 md:flex-row md:flex-wrap">
        {rest.map((post, index) => (
          <Reveal
            className="md:min-w-[45%] flex-1 lg:min-w-[30%]"
            key={post.id}
            delay={index * 0.08}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="glass-card group flex h-full flex-col rounded-3xl p-3 transition hover:-translate-y-1"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-secondary">
                <PostImage
                  post={post}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[11px] uppercase tracking-[.2em] text-muted-foreground">
                  {post.category}
                </span>
                <h3 className="font-display mt-2 text-xl font-semibold leading-snug tracking-[-.02em]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted-foreground">
                  {dateLabel(post.published_at)} · {readingTime(post.content)}
                  <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45 group-hover:text-primary" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Turn plain text / markdown-ish content into HTML with fenced code blocks. */
function plainContentToHtml(content) {
  const parts = String(content || "").split(/```([\w-]*)\n?([\s\S]*?)```/g);
  if (parts.length === 1) {
    return String(content || "")
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((section) => `<p>${escapeHtml(section).replaceAll("\n", "<br />")}</p>`)
      .join("");
  }
  let html = "";
  for (let index = 0; index < parts.length; index += 1) {
    if (index % 3 === 0) {
      const prose = parts[index];
      if (!prose?.trim()) continue;
      html += prose
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map(
          (section) =>
            `<p>${escapeHtml(section).replaceAll("\n", "<br />")}</p>`,
        )
        .join("");
      continue;
    }
    if (index % 3 === 1) continue;
    const language = parts[index - 1] || "";
    const code = parts[index] || "";
    html += `<pre class="blog-code-block"${language ? ` data-language="${escapeHtml(language)}"` : ""}><code>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`;
  }
  return html;
}

function normalizePostHtml(content) {
  const raw = String(content || "");
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  if (!isHtml) return plainContentToHtml(raw);
  // Quill stores one <code class="blog-code-line"> per line after sanitize;
  // join sibling lines inside each pre for cleaner blocks.
  return raw.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (_match, attrs, inner) => {
      const lines = [
        ...inner.matchAll(
          /<code[^>]*class="[^"]*blog-code-line[^"]*"[^>]*>([\s\S]*?)<\/code>/gi,
        ),
      ].map((item) => item[1]);
      if (!lines.length) return `<pre${attrs}>${inner}</pre>`;
      return `<pre${attrs}><code>${lines.join("\n")}</code></pre>`;
    },
  );
}

export function PostDetail({ post, nextPost, profile }) {
  const html = normalizePostHtml(post.content);
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All articles
      </Link>
      <Reveal>
        <header className="mt-6">
          <span className="text-[11px] uppercase tracking-[.2em] text-primary">
            {post.category}
          </span>
          <h1 className="font-display mt-3 text-3xl font-semibold leading-tight tracking-[-.035em] md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-3 text-sm">
            <img
              src={profile.avatar_url || "/images/logo.png"}
              alt=""
              className="h-9 w-9 rounded-full border object-cover"
            />
            <div>
              <div className="font-medium">{profile.name}</div>
              <div className="text-xs text-muted-foreground">
                {dateLabel(post.published_at)} · {readingTime(post.content)}
              </div>
            </div>
          </div>
        </header>
      </Reveal>
      <Reveal>
        <div className="liquid mt-8 overflow-hidden rounded-3xl p-2">
          <PostImage
            post={post}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        </div>
      </Reveal>
      <BlogHtml className="blog-content mt-10" html={html} />
      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="liquid group mt-14 flex items-center justify-between gap-4 rounded-3xl p-6"
        >
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[.2em] text-muted-foreground">
              Read next
            </div>
            <div className="font-display mt-1 text-lg font-semibold">
              {nextPost.title}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      )}
    </article>
  );
}
