import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import { CalendarDays, ArrowRight } from "lucide-react";

function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching blogs:", error);
        } else {
          setBlogs(data || []);
          setFiltered(data || []);

          // Extract unique categories
          const cats = ["all"];
          data?.forEach((b) => {
            if (b.category && !cats.includes(b.category.toLowerCase())) {
              cats.push(b.category.toLowerCase());
            }
          });
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setFiltered(blogs);
    } else {
      const filteredList = blogs.filter(
        (b) => b.category?.toLowerCase() === category.toLowerCase()
      );
      setFiltered(filteredList);
    }
  };

  return (
    <>
      <SEO {...SEOConfig.blogs} />

      <section className="relative overflow-hidden">
        {/* Background radial glow */}
        {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-3xl text-main font-bold tracking-tight">Blogs</h2>
          <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
          </div>
        </div>

        {/* Categories filters */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mt-6 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`capitalize text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap tracking-wide
                  ${
                    activeCategory === cat
                      ? "bg-primary/10 border-primary/30 text-primary shadow-[0_4px_20px_rgba(255,219,112,0.1)]"
                      : "border-stroke/60 bg-surface/20 text-subtle hover:border-stroke hover:text-main hover:bg-input/40"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Blogs Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-stroke/50 bg-surface/20 p-4 animate-pulse"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-elevated" />
                <div className="mt-4 px-1 space-y-2">
                  <div className="w-16 h-4 bg-elevated rounded" />
                  <div className="w-3/4 h-5 bg-elevated rounded" />
                  <div className="w-full h-4 bg-elevated rounded" />
                  <div className="w-1/2 h-4 bg-elevated rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted border border-stroke/50 rounded-2xl bg-surface/10">
            No articles found. Stay tuned for upcoming posts!
          </div>
        ) : (
          /* Blogs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((b) => (
              <Link
                key={b.id}
                href={{
                  pathname: "/blogs/[slug]",
                  query: { slug: b.slug },
                }}
                onMouseEnter={() => router.prefetch(`/blogs/${b.slug}`)}
                className="group relative block"
              >
                <div className="h-full flex flex-col rounded-2xl border border-stroke/50 bg-surface/20 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-input/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-primary/5 hover:-translate-y-1">
                  
                  {/* Blog Image */}
                  {b.bg_image ? (
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-elevated border border-stroke/20">
                      <Image
                        src={b.bg_image}
                        alt={b.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-elevated border border-stroke/20 flex items-center justify-center">
                      <span className="text-xs text-muted/60">No image available</span>
                    </div>
                  )}

                  {/* Blog Content details */}
                  <div className="flex-1 flex flex-col mt-4 px-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/20 rounded-md px-2 py-0.5 inline-block">
                        {b.category || "General"}
                      </span>
                      <span className="text-[11px] text-muted flex items-center gap-1 font-medium">
                        <CalendarDays size={12} className="text-primary/70" />
                        {new Date(b.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-main group-hover:text-primary font-bold text-lg transition-colors duration-300 line-clamp-2 mt-1 leading-snug">
                      {b.title}
                    </h3>

                    {b.description && (
                      <p className="text-subtle/80 font-light text-sm line-clamp-2 mt-2 leading-relaxed">
                        {b.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                      <span>Read Article</span>
                      <ArrowRight size={13} className="transform transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default BlogsPage;
