/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shell: "rgb(var(--color-shell) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        "elevated-soft": "rgb(var(--color-elevated-soft) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        "input-focus": "rgb(var(--color-input-focus) / <alpha-value>)",
        field: "rgb(var(--color-field) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        main: "rgb(var(--color-main) / <alpha-value>)",
        subtle: "rgb(var(--color-subtle) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        "muted-soft": "rgb(var(--color-muted-soft) / <alpha-value>)",
        "muted-strong": "rgb(var(--color-muted-strong) / <alpha-value>)",
        stroke: "rgb(var(--color-stroke) / <alpha-value>)",
      },
      spacing: {
        fluid: "100%",
      },
      container: {
        center: true,
        // padding: ".6rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1210px",
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
};
