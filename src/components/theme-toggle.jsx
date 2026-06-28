import { SunMoon } from "lucide-react";

export default function ThemeToggle({
  theme = "dark",
  onToggle,
  className = "",
}) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`theme-toggle inline-flex items-center gap-2 rounded-full border border-stroke/70 bg-background/80 px-2 py-2 text-xs font-semibold text-subtle transition-all duration-300 hover:border-primary/35 hover:text-main ${className}`}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={isLight}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      <span className="theme-toggle__icon flex h-7 w-7 items-center justify-center rounded-full bg-primary/12 text-primary">
        <SunMoon size={15} />
      </span>
      {/* <span className="hidden sm:inline capitalize">{theme}</span> */}
    </button>
  );
}
