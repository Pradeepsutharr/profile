import { Code2, Layers3, Palette, Search, Sparkles } from "lucide-react";

const icons = { Sparkles, Layers: Layers3, Palette, Search, Code2 };
export function ServiceIcon({ name, size = 22 }) { const Icon = icons[name] || Sparkles; return <Icon size={size} />; }

export function readingTime(value = "") { return `${Math.max(1, Math.ceil(String(value).trim().split(/\s+/).length / 200))} min read`; }

export function dateLabel(value) { return value ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value)) : "New note"; }
