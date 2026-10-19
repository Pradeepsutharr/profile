import { defaultColors } from "./site-config";
import {
  defaultHomeContent,
  defaultProfileIntro,
  defaultProfileSummary,
} from "./profile-home";

export const fallbackProfile = {
  name: "Pradeep Suthar",
  title: "Product Designer & Frontend Developer",
  email: "hello@pradeepsuthar.com",
  phone: "+91 70239 27315",
  location: "Ahmedabad, Gujarat, India",
  avatar_url: "/images/logo.png",
  og_image_url: "/images/portrait.webp",
  availability: "Available for work",
  intro: defaultProfileIntro,
  summary: defaultProfileSummary,
  seo_title: "Product Designer & Front-End Developer | Pradeep Suthar",
  seo_description:
    "Pradeep Suthar - Product Designer and Front-End Developer crafting intuitive, elegant, and performance-driven digital experiences with UI/UX, React, Next.js, and modern design systems.",
  keywords:
    "Product Designer, Front-End Developer, UI UX Designer, React Developer, Next.js Developer, Hire Product Designer, Ahmedabad",
  socials: { github: "#", linkedin: "#", instagram: "#" },
  home: defaultHomeContent,
};

export const fallbackData = {
  projects: [
    { id: "starter-1", slug: "product-platform", title: "Finlytic", excerpt: "Analytics dashboard for fintech teams - redesigned onboarding lifted activation by 32%.", image_url: "/images/p1.jpg", category: "Product design", year: "2025", client: "Confidential", role: "Product design & frontend", tags: ["UX strategy", "Design system"], tech_stack: ["Figma", "Next.js"], metrics: [{ label: "Conversion lift", value: "+24%" }, { label: "Design system", value: "42 screens" }, { label: "Core flow", value: "3 weeks" }], challenge: "Turn a complicated workflow into a focused product journey.", approach: "Mapped the user flow, designed a flexible system, then partnered closely with engineering.", outcome: "A clearer interface, faster task completion, and a system the team can grow with.", published: true },
    { id: "starter-2", slug: "smart-workspace", title: "Nestly", excerpt: "Property discovery experience with map search, saved collections and booking flows.", image_url: "/images/p2.jpg", category: "Web app", year: "2024", tags: ["UX", "React"], tech_stack: ["Figma", "React"], published: true },
    { id: "starter-3", slug: "brand-dashboard", title: "Pulse HR", excerpt: "A polished control centre designed around real decision-making.", image_url: "/images/p3.jpg", category: "Dashboard", year: "2024", tags: ["UI design"], tech_stack: ["Figma"], published: true },
  ],
  posts: [
    { id: "post-1", slug: "designing-for-clarity", title: "Designing for clarity before decoration", excerpt: "A few practical principles for interfaces that help users decide and move forward.", category: "Product thinking", image_url: "/images/hero-illustration.png", content: "Start with the job the person is trying to get done. Clear hierarchy, honest defaults, and deliberate states make an interface feel lighter - even when the problem is not.", published_at: "2025-01-15", published: true },
    { id: "post-2", slug: "design-systems-that-ship", title: "Design systems that teams actually ship", excerpt: "How to make a design system useful enough that it becomes the default way of working.", category: "Design systems", image_url: "/images/hero-illustration.png", content: "A design system earns trust when it makes the next task quicker. Start with the components that repeat, document the decisions, and keep the vocabulary close to the product.", published_at: "2024-12-10", published: true },
  ],
  services: [
    { id: "service-0", slug: "ux-research", title: "UX research", description: "Understand real user needs and validate product decisions before building.", icon: "Search", tags: ["Interviews", "Personas", "Testing"], published: true },
    { id: "service-1", slug: "product-design", title: "Product design", description: "Research-led UX and UI for digital products that feel clear, confident, and human.", icon: "Sparkles", tags: ["UX research", "User flows", "Interface design"], published: true },
    { id: "service-2", slug: "design-systems", title: "Design systems", description: "Practical systems that bring consistency to product teams without slowing them down.", icon: "Layers", tags: ["Tokens", "Components", "Documentation"], published: true },
    { id: "service-3", slug: "frontend-development", title: "Frontend development", description: "Responsive, high-performance product interfaces built with modern React and Next.js.", icon: "Code2", tags: ["React", "Next.js", "Accessibility"], published: true },
  ],
  skills: [{ id: "skill-1", name: "Product design", category: "Design", score: 96 }, { id: "skill-2", name: "UX research", category: "Design", score: 89 }, { id: "skill-3", name: "Figma", category: "Tools", score: 94 }, { id: "skill-4", name: "React & Next.js", category: "Development", score: 90 }],
  experience: [{ id: "exp-1", company: "Independent", title: "Product Designer & Frontend Developer", start_date: "2021-01-01", location: "Ahmedabad, India", summary: "Partnering with founders and teams to shape products from research through implementation.", bullets: ["Led product discovery and interface design", "Built responsive React and Next.js applications"] }],
  education: [{ id: "edu-1", institution: "Design & Technology", degree: "Product design and frontend practice", start_date: "2017-01-01", location: "India", summary: "A continuing practice of design, technology, and product thinking." }],
};

export const fallbackSettings = { colors: defaultColors };
