import { resolveHomeContent } from "@/lib/profile-home";
import { getCollection, getSiteContext } from "@/lib/server/site-data";
import {
  absoluteUrl,
  defaultSiteDescription,
  getSiteUrl,
} from "@/lib/seo";

function plainText(html, max = 4000) {
  const text = String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function yearSpan(item) {
  const start = item.start_date ? new Date(item.start_date).getFullYear() : "";
  const end = item.end_date ? new Date(item.end_date).getFullYear() : "Present";
  return start ? `${start} - ${end}` : end;
}

async function loadLlmsData() {
  const [{ profile }, projects, posts, services, experience, education, skills] =
    await Promise.all([
      getSiteContext(),
      getCollection("projects"),
      getCollection("posts"),
      getCollection("services"),
      getCollection("experience"),
      getCollection("education"),
      getCollection("skills"),
    ]);
  return {
    profile,
    home: resolveHomeContent(profile.home),
    projects,
    posts,
    services,
    experience,
    education,
    skills,
  };
}

/** Concise index for crawlers - points to the full file. */
export async function buildLlmsTxt() {
  const { profile, projects, posts, services } = await loadLlmsData();
  const site = getSiteUrl();
  const socials = profile.socials || {};

  const projectLines = projects
    .slice(0, 8)
    .map(
      (project) =>
        `- [${project.title}](${absoluteUrl(`/portfolio/${project.slug}`)}) - ${plainText(project.excerpt || project.description, 140)}`,
    )
    .join("\n");

  const postLines = posts
    .slice(0, 8)
    .map(
      (post) =>
        `- [${post.title}](${absoluteUrl(`/blogs/${post.slug}`)}) - ${plainText(post.excerpt || post.title, 140)}`,
    )
    .join("\n");

  const serviceLines = services
    .map(
      (service) =>
        `- **${service.title}:** ${plainText(service.description, 160)}`,
    )
    .join("\n");

  return `# ${profile.name} - Product Designer & Frontend Developer

> Summary of ${profile.name}'s portfolio, professional background, core capabilities, project showcase, and articles. Designed for AI search engines, LLM crawlers, and recruitment agents.

## Professional Summary
${defaultSiteDescription(profile)}
${profile.intro ? `\n${profile.intro}` : ""}

## Contact & Links
- **Email:** ${profile.email || ""}
- **Phone:** ${profile.phone || ""}
- **Location:** ${profile.location || ""}
- **Portfolio Website:** ${site}/
${socials.linkedin ? `- **LinkedIn:** ${socials.linkedin}` : ""}
${socials.github ? `- **GitHub:** ${socials.github}` : ""}
${socials.instagram ? `- **Instagram:** ${socials.instagram}` : ""}
${socials.x || socials.twitter ? `- **X / Twitter:** ${socials.x || socials.twitter}` : ""}
${socials.website ? `- **Website:** ${socials.website}` : ""}

## Services & Expertise
${serviceLines || "- Product design, UX research, design systems, and frontend development."}

## Main Navigation
- [About / Home](${absoluteUrl("/")}) - Biography, metrics, core philosophy, and capabilities.
- [Resume](${absoluteUrl("/resume")}) - Work experience, education history, and skill inventory.
- [Portfolio](${absoluteUrl("/portfolio")}) - Catalog of shipped design systems, UI/UX, and web apps.
- [Blogs](${absoluteUrl("/blogs")}) - Insights on product design, UX, and frontend craft.
- [Services](${absoluteUrl("/services")}) - Capabilities and engagement options.
- [Contact](${absoluteUrl("/contact")}) - Contact form and direct communication channels.

## Key Projects
${projectLines || "- No published projects yet."}

## Featured Articles
${postLines || "- No published articles yet."}

---
For full text, blog content, project definitions, and comprehensive background, read the [Full LLM Resource Directory](${absoluteUrl("/llms-full.txt")}).
`;
}

/** Full dump for deep LLM indexing - updates when CMS content changes. */
export async function buildLlmsFullTxt() {
  const {
    profile,
    home,
    projects,
    posts,
    services,
    experience,
    education,
    skills,
  } = await loadLlmsData();
  const site = getSiteUrl();
  const socials = profile.socials || {};

  const experienceBlock = experience
    .map((item) => {
      const bullets = (item.bullets || [])
        .map((bullet) => ` - ${bullet}`)
        .join("\n");
      return `### ${item.title || "Role"} - ${item.company}
- **Dates:** ${yearSpan(item)}
- **Location:** ${item.location || " - "}
${item.summary ? `- **Summary:** ${plainText(item.summary, 500)}` : ""}
${bullets ? `- **Highlights:**\n${bullets}` : ""}`;
    })
    .join("\n\n");

  const educationBlock = education
    .map(
      (item) => `### ${item.degree || "Program"} - ${item.institution}
- **Dates:** ${yearSpan(item)}
- **Location:** ${item.location || " - "}
${item.summary ? `- **Summary:** ${plainText(item.summary, 400)}` : ""}`,
    )
    .join("\n\n");

  const skillsBlock = skills
    .map(
      (skill) =>
        `- ${skill.name}${skill.category ? ` (${skill.category})` : ""}: ${skill.score}%`,
    )
    .join("\n");

  const servicesBlock = services
    .map(
      (service) => `### ${service.title}
${plainText(service.description, 800)}
- **URL:** ${absoluteUrl(`/services/${service.slug}`)}
${service.tags?.length ? `- **Tags:** ${service.tags.join(", ")}` : ""}`,
    )
    .join("\n\n");

  const projectsBlock = projects
    .map((project) => {
      const metrics = (project.metrics || [])
        .map((metric) => ` - ${metric.label}: ${metric.value}`)
        .join("\n");
      return `### ${project.title}
- **URL:** ${absoluteUrl(`/portfolio/${project.slug}`)}
- **Category:** ${project.category || " - "}
- **Year:** ${project.year || " - "}
- **Role:** ${project.role || " - "}
- **Client:** ${project.client || " - "}
${project.tags?.length ? `- **Tags:** ${project.tags.join(", ")}` : ""}
${project.tech_stack?.length ? `- **Tech:** ${project.tech_stack.join(", ")}` : ""}

${plainText(project.excerpt || "", 300)}

${project.challenge ? `**Challenge:** ${plainText(project.challenge, 600)}` : ""}
${project.approach ? `**Approach:** ${plainText(project.approach, 600)}` : ""}
${project.outcome ? `**Outcome:** ${plainText(project.outcome, 600)}` : ""}
${plainText(project.description, 1200) ? `**Details:** ${plainText(project.description, 1200)}` : ""}
${metrics ? `**Metrics:**\n${metrics}` : ""}`;
    })
    .join("\n\n");

  const postsBlock = posts
    .map(
      (post) => `### ${post.title}
- **URL:** ${absoluteUrl(`/blogs/${post.slug}`)}
- **Category:** ${post.category || " - "}
- **Published:** ${post.published_at || " - "}
${post.keywords ? `- **Keywords:** ${post.keywords}` : ""}

${plainText(post.excerpt, 400)}

${plainText(post.content, 6000)}`,
    )
    .join("\n\n---\n\n");

  const faqBlock = (home.faqs || [])
    .map(([question, answer]) => `### ${question}\n${answer}`)
    .join("\n\n");

  return `# ${profile.name} - Full Professional Profile & Resource Index

> Comprehensive professional profile of ${profile.name} including skills inventory, work history, detailed project descriptions, and the full content of published articles. Designed for deep indexing by large language models and AI search bots. This file is generated dynamically from the live CMS.

---

## 1. Biography & Contact Information

${defaultSiteDescription(profile)}

- **Full Name:** ${profile.name}
- **Title:** ${profile.title}
- **Location:** ${profile.location || ""}
- **Primary Email:** ${profile.email || ""}
- **Direct Phone:** ${profile.phone || ""}
- **Availability:** ${profile.availability || ""}
- **Official Website:** ${site}/
${socials.linkedin ? `- **LinkedIn Profile:** ${socials.linkedin}` : ""}
${socials.github ? `- **GitHub Repository:** ${socials.github}` : ""}
${socials.instagram ? `- **Instagram Profile:** ${socials.instagram}` : ""}
${socials.x || socials.twitter ? `- **X / Twitter:** ${socials.x || socials.twitter}` : ""}
${socials.website ? `- **Website:** ${socials.website}` : ""}

### Key Philosophy
"${home.philosophy} ${home.philosophyHighlight}."

${profile.intro ? `### Introduction\n${profile.intro}` : ""}
${profile.summary ? `### Summary\n${profile.summary}` : ""}

---

## 2. Core Capabilities & Services

${servicesBlock || "No published services yet."}

---

## 3. Experience

${experienceBlock || "No experience records published yet."}

---

## 4. Education

${educationBlock || "No education records published yet."}

---

## 5. Skills Inventory

${skillsBlock || "No skills published yet."}

---

## 6. Portfolio Projects

${projectsBlock || "No published projects yet."}

---

## 7. Blog Articles (Full Text)

${postsBlock || "No published articles yet."}

---

## 8. Frequently Asked Questions

${faqBlock || "No FAQs configured."}

---

## 9. Site Map for Agents

- Home: ${absoluteUrl("/")}
- Resume: ${absoluteUrl("/resume")}
- Portfolio: ${absoluteUrl("/portfolio")}
- Blogs: ${absoluteUrl("/blogs")}
- Services: ${absoluteUrl("/services")}
- Contact: ${absoluteUrl("/contact")}
- Concise LLM index: ${absoluteUrl("/llms.txt")}
- This full resource: ${absoluteUrl("/llms-full.txt")}
- XML sitemap: ${absoluteUrl("/sitemap.xml")}

## How to hire
Contact via ${absoluteUrl("/contact")} for product design, UX research, design systems, and React/Next.js frontend work. Typical reply within 12-24 hours.
`;
}

export function llmsResponse(body) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
