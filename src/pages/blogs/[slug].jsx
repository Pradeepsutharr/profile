import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/common/seo";
import { ArrowLeft, CalendarDays, Layers } from "lucide-react";

function BlogDetails({ blog }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-subtle p-8">Loading article...</div>;
  }

  if (!blog) {
    return <div className="text-subtle p-8">Article not found.</div>;
  }

  return (
    <>
      <SEO
        ogTitle={blog.title}
        ogUrl={`https://pradeep-suthar.vercel.app/blogs/${blog.slug}/`}
        ogImage={blog.bg_image || "https://pradeep-suthar.vercel.app/seo-logo.png"}
        pageTitle={`${blog.title} | Blogs | Pradeep Suthar`}
        pageDescription={
          blog.meta_description ||
          blog.description ||
          "Read selected articles on frontend development and product design written by Pradeep Suthar."
        }
        keywords={
          blog.keywords ||
          "Frontend Blog, UI UX Blog, React, Next.js development, Product Design Articles"
        }
      />

      <section className="relative overflow-hidden">
        {/* Background radial glow */}
        {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

        {/* Back navigation */}
        <Link
          href="/blogs"
          className="group cursor-pointer text-subtle flex gap-2 items-center hover:text-primary w-fit font-medium text-sm transition-colors duration-300 mb-6"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
          Back to blogs
        </Link>

        {/* Cover Image Block */}
        {blog.bg_image && (
          <div className="relative overflow-hidden rounded-2xl glass-card aspect-[21/9] w-full max-h-[45vh] mb-8">
            <Image
              src={blog.bg_image}
              alt={blog.title}
              fill
              priority
              quality={90}
              className="object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        {/* Blog Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-xs mb-4 text-subtle/80">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary bg-primary/5 border border-primary/20 rounded-md px-2.5 py-1">
            <Layers size={12} />
            {blog.category || "General"}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-subtle/70">
            <CalendarDays size={13} className="text-primary/70" />
            {new Date(blog.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Blog Title */}
        <h1
          className="text-main text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight capitalize"
        >
          {blog.title}
        </h1>

        {/* Blog HTML Content */}
        <div
          className="blog-content w-full text-subtle/90 font-light text-base leading-relaxed my-6 glass-card rounded-2xl p-6 md:p-10
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-main [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-stroke/30 [&_h2]:pb-2
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-main [&_h3]:mt-4 [&_h3]:mb-3
            [&_p]:mb-6 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
            [&_li]:leading-relaxed
            [&_strong]:text-main [&_strong]:font-semibold
            [&_pre]:bg-surface/60 [&_pre]:border [&_pre]:border-stroke/50 [&_pre]:p-5 [&_pre]:rounded-2xl [&_pre]:my-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto
            [&_code]:bg-surface/50 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-primary/95
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
            [&_img]:rounded-2xl [&_img]:my-6 [&_img]:max-w-full [&_img]:border [&_img]:border-stroke/30
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

      </section>
    </>
  );
}

export default BlogDetails;

export async function getStaticPaths() {
  try {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("slug");

    if (error) {
      console.error("Supabase error fetching blog slugs for static paths:", error);
      return { paths: [], fallback: "blocking" };
    }

    const paths = blogs
      ?.filter((b) => b.slug)
      .map((b) => ({
        params: { slug: b.slug },
      })) || [];

    return {
      paths,
      fallback: "blocking",
    };
  } catch (err) {
    console.error("Unexpected error in getStaticPaths:", err);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Supabase error fetching blog slug "${slug}":`, error);
      return { notFound: true, revalidate: 60 };
    }

    if (!data) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        blog: data,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (err) {
    console.error("Unexpected error in getStaticProps:", err);
    return { notFound: true, revalidate: 60 };
  }
}
