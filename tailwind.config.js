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
        background: "#1e1e1f",
        primary: "#ffdb70",
        secondary: "#F7F7F7",
        main: "#fafafa",
        subtle: "#d6d6d6",
        stroke: "#383838",
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
          "2xl": "1320px",
        },
      },
    },
  },
  plugins: [],
};
