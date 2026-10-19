import { getCollection } from "@/lib/server/site-data";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const [projects, posts, services] = await Promise.all([
    getCollection("projects"),
    getCollection("posts"),
    getCollection("services"),
  ]);

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/resume", priority: 0.8, changeFrequency: "monthly" },
    { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blogs", priority: 0.8, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  ].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const projectRoutes = projects.map((project) => ({
    url: absoluteUrl(`/portfolio/${project.slug}`),
    lastModified: project.updated_at || project.created_at || new Date(),
    changeFrequency: "monthly",
    priority: project.featured ? 0.85 : 0.7,
  }));

  const postRoutes = posts.map((post) => ({
    url: absoluteUrl(`/blogs/${post.slug}`),
    lastModified:
      post.updated_at || post.published_at || post.created_at || new Date(),
    changeFrequency: "monthly",
    priority: post.featured ? 0.8 : 0.65,
  }));

  const serviceRoutes = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: service.updated_at || service.created_at || new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes, ...serviceRoutes];
}
