export function colorVariables(colors = {}, theme = "dark") {
  const tone = theme === "dark" ? "dark" : "light";
  const values = Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [
      `--${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ]),
  );
  return {
    ...values,
    "--shell": `var(--${tone}-shell)`,
    "--background": `var(--${tone}-background)`,
    "--foreground": `var(--${tone}-text)`,
    "--card": `var(--${tone}-surface)`,
    "--card-foreground": `var(--${tone}-text)`,
    "--secondary": `var(--${tone}-panel)`,
    "--secondary-foreground": `var(--${tone}-text)`,
    "--muted": `var(--${tone}-panel)`,
    "--muted-foreground": `var(--${tone}-muted)`,
    "--primary": `var(--${tone}-primary)`,
    "--primary-foreground": theme === "dark" ? "var(--dark-shell)" : "#ffffff",
    "--border": `var(--${tone}-border)`,
    "--input": `var(--${tone}-border)`,
    "--ring": `var(--${tone}-primary)`,
    "--glow": "var(--gradient-start)",
    "--gradient-accent":
      "linear-gradient(120deg, var(--gradient-start), var(--gradient-end))",
    "--glass-fill":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 5%, transparent)"
        : "color-mix(in srgb, #ffffff 18%, transparent)",
    "--glass-fill-soft":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 2.5%, transparent)"
        : "color-mix(in srgb, #ffffff 10%, transparent)",
    "--glass-tint":
      theme === "dark"
        ? "color-mix(in srgb, #16161c 58%, transparent)"
        : `color-mix(in srgb, var(--${tone}-surface) 55%, transparent)`,
    "--glass-hi":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 9%, transparent)"
        : "color-mix(in srgb, #ffffff 28%, transparent)",
    "--glass-lo":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 1.5%, transparent)"
        : "color-mix(in srgb, #ffffff 6%, transparent)",
    "--glass-edge":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 7%, transparent)"
        : "color-mix(in srgb, #ffffff 16%, transparent)",
    "--glass-edge-dim":
      theme === "dark"
        ? "color-mix(in srgb, #000000 22%, transparent)"
        : `color-mix(in srgb, var(--${tone}-text) 4%, transparent)`,
    "--glass-shine":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 12%, transparent)"
        : "color-mix(in srgb, #ffffff 28%, transparent)",
    "--glass-specular":
      theme === "dark"
        ? "color-mix(in srgb, #ffffff 14%, transparent)"
        : "color-mix(in srgb, #ffffff 22%, transparent)",
    "--glass-shadow":
      theme === "dark"
        ? "0 22px 60px -24px rgb(0 0 0 / 55%)"
        : "0 18px 50px -22px rgb(36 29 22 / 18%)",
  };
}

export const SITE_NAV = [
  { href: "/", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];
