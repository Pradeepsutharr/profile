export const defaultColors = {
  darkShell: "#0a0a0e", darkBackground: "#16161c", darkSurface: "#1a1a20", darkPanel: "#1e1e26",
  darkText: "#fafafa", darkMuted: "#979798", darkBorder: "#282830", darkPrimary: "#ffdb70",
  lightShell: "#ecf0f8", lightBackground: "#ffffff", lightSurface: "#f4f6fa", lightPanel: "#eef0f6",
  lightText: "#241d16", lightMuted: "#6e6256", lightBorder: "#d2d8e0", lightPrimary: "#b07e22",
  gradientStart: "#ffdb70", gradientEnd: "#d18b37",
};

export const adminResources = {
  projects: { label: "Projects", table: "projects", order: "featured DESC, sort_order ASC, created_at DESC", fields: ["title", "slug", "excerpt", "description", "image_url", "gallery", "tags", "tech_stack", "category", "client", "role", "year", "metrics", "challenge", "approach", "outcome", "project_url", "sort_order", "featured", "published"] },
  posts: { label: "Posts", table: "blog_posts", order: "featured DESC, published_at DESC", fields: ["title", "slug", "excerpt", "content", "image_url", "category", "keywords", "featured", "published", "published_at"] },
  services: { label: "Services", table: "services", order: "sort_order ASC, created_at DESC", fields: ["title", "slug", "description", "icon", "tags", "sort_order", "published"] },
  skills: { label: "Skills", table: "skills", order: "sort_order ASC, created_at DESC", fields: ["name", "category", "score", "sort_order"] },
  experience: { label: "Experience", table: "experience", order: "sort_order ASC, start_date DESC", fields: ["company", "title", "start_date", "end_date", "location", "summary", "bullets", "sort_order"] },
  education: { label: "Education", table: "education", order: "sort_order ASC, start_date DESC", fields: ["institution", "degree", "start_date", "end_date", "location", "summary", "sort_order"] },
  contacts: { label: "Inquiries", table: "contacts", order: "created_at DESC", fields: ["name", "email", "phone", "topic", "message", "attachment_url", "status"] },
  emails: { label: "Inbox", table: "emails", order: "created_at DESC", fields: ["from_name", "from_email", "to_email", "subject", "body_text", "is_read", "is_starred"] },
};

export const publicResources = new Set(["projects", "posts", "services", "skills", "experience", "education"]);
