import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const deliverables = [
  {
    title: "React.js Application Development",
    desc: "Building scalable, maintainable user interfaces using modern React architecture.",
  },
  {
    title: "Next.js Web Applications",
    desc: "Developing fast, SEO-friendly applications with server-side rendering and optimized routing.",
  },
  {
    title: "Responsive Layout Implementation",
    desc: "Creating interfaces that work seamlessly across mobile, tablet, and desktop devices.",
  },
  {
    title: "Component-Based Architecture",
    desc: "Reusable, modular UI components that improve development speed and consistency.",
  },
  {
    title: "Performance Optimization",
    desc: "Improving loading speed, reducing bundle size, and enhancing Core Web Vitals.",
  },
  {
    title: "SEO-Friendly Implementation",
    desc: "Ensuring semantic HTML, accessibility, and technical SEO best practices.",
  },
];

const approachPoints = [
  "Clean and scalable code structure",
  "Reusable component design",
  "Accessibility-first implementation",
  "Optimized asset loading",
  "Performance monitoring and improvement",
];

export default function FrontendDevelopment() {
  return (
    <>
      <SEO {...SEOConfig.frontendDevelopment} />

      <section className="relative overflow-hidden container">
        {/* Background radial glow */}
        {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-3xl text-main font-bold tracking-tight">Frontend Development Services</h2>
          <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-stroke/40 bg-gradient-to-br from-surface/30 via-surface/10 to-transparent p-6 md:p-8 mb-8">
          <h1 className="text-primary text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
            Frontend Development Using React & Next.js
          </h1>
          <p className="text-subtle/90 mt-4 leading-relaxed font-light">
            I build fast, scalable, and SEO-friendly frontend applications using React and Next.js. My development approach focuses on performance, accessibility, and maintainable architecture.
          </p>
          <p className="text-subtle/80 mt-3 leading-relaxed font-light text-sm">
            From translating design systems into production-ready interfaces to optimizing application performance, I ensure that each project delivers smooth user experiences across devices.
          </p>
        </div>

        {/* WHAT I DELIVER */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-bold tracking-tight mb-6">
            What I Deliver
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliverables.map((item, index) => (
              <div
                key={index}
                className="group h-full rounded-2xl border border-stroke bg-surface/30 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-input/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-primary/5 hover:-translate-y-1 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded px-2.5 py-1">
                    0{index + 1}
                  </span>
                  <h3 className="text-main group-hover:text-primary font-semibold text-base transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-subtle/80 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* APPROACH */}
        <div className="mt-12 bg-surface/25 border border-stroke/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <h2 className="text-main text-xl font-bold tracking-tight mb-4">
            My Frontend Development Approach
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed mb-6">
            I follow modern frontend engineering practices to ensure clean, scalable, and high-performing applications. Every build is optimized for usability, accessibility, and long-term maintainability.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {approachPoints.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-subtle text-sm font-light">
                <span className="text-primary mt-1">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* BEST FIT */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-stroke/50 bg-surface/30">
          <h2 className="text-main font-bold tracking-tight mb-4">
            Best Fit For
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed">
            SaaS platforms, startups, MVP development, dashboards, and marketing websites that require fast, scalable, and SEO-friendly frontend architecture.
          </p>
        </div>

        {/* DESIGN COLLAB */}
        <div className="mt-12 mb-8">
          <h2 className="text-main text-xl font-bold tracking-tight mb-3">
            Design-to-Development Integration
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed">
            With experience in UI/UX and Product Design, I translate design systems into accurate frontend implementations, reducing gaps between design intent and final output.
          </p>
          <div className="mt-8 pt-6 border-t border-stroke/30 text-sm text-subtle/80">
            Related services:{" "}
            <Link href="/services/ui-design" className="text-primary hover:underline font-semibold ml-1">
              UI Design
            </Link>
            ,{" "}
            <Link href="/services/product-design" className="text-primary hover:underline font-semibold ml-1">
              Product Design
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
