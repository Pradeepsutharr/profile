import "./globals.css";

export const metadata = {
  title: {
    default: "Pradeep Suthar — Product Designer & Frontend Developer",
    template: "%s — Pradeep Suthar",
  },
  description:
    "Product design, UX research, and frontend development for digital products that make a difference.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
