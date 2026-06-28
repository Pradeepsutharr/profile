import SEO from "@/common/seo";
import SEOConfig from "@/common/seo.config";
import Link from "next/link";

const deliverables = [
  {
    title: "Web Application UI Design",
    desc: "Designing scalable interfaces for dashboards, admin panels, and SaaS platforms with structured layouts and reusable components.",
  },
  {
    title: "Landing Page UI Design",
    desc: "Conversion-focused landing pages that clearly communicate value and guide users toward key actions.",
  },
  {
    title: "Design Systems",
    desc: "Reusable UI component libraries, typography scales, and color systems ensuring long-term consistency.",
  },
  {
    title: "High-Fidelity Mockups",
    desc: "Pixel-perfect responsive UI screens ready for developer handoff.",
  },
];

const tools = [
  "Figma",
  "Adobe XD",
  "Design Systems Methodology",
  "Component-based UI Architecture",
];

const focusPoints = [
  "Clear information architecture",
  "Consistent typography and spacing",
  "Accessible color contrast",
  "Responsive layouts for all screen sizes",
  "Component-driven design systems",
];

export default function UIDesign() {
  return (
    <>
      <SEO {...SEOConfig.uiDesign} />

      <section className="relative overflow-hidden container">
        {/* Background radial glow */}
        {/* <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" /> */}

        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-3xl text-main font-bold tracking-tight">UI Design Services</h2>
          <div className="relative w-12 h-1 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-stroke/40 bg-gradient-to-br from-surface/30 via-surface/10 to-transparent p-6 md:p-8 mb-8">
          <h1 className="text-primary text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
            UI Design Services for Modern Web & SaaS Products
          </h1>
          <p className="text-subtle/90 mt-4 leading-relaxed font-light">
            I provide professional UI design services for startups, SaaS platforms, and digital products that need clean, intuitive, and conversion-focused interfaces.
          </p>
          <p className="text-subtle/80 mt-3 leading-relaxed font-light text-sm">
            My work combines user-centered design principles with modern interface patterns to ensure that every screen is visually consistent, accessible, and easy to navigate across devices.
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
            My UI Design Approach
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed mb-6">
            My UI design process begins with understanding business goals, product requirements, and user expectations. I translate insights into structured wireframes, visual hierarchies, and component-based layouts.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {focusPoints.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-subtle text-sm font-light">
                <span className="text-primary mt-1">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-subtle/70 mt-4 text-xs font-light">
            Each design decision is made to improve engagement, reduce cognitive load, and help users complete tasks efficiently.
          </p>
        </div>

        {/* TOOLS */}
        <div className="mt-12">
          <h2 className="text-main text-xl font-bold tracking-tight mb-4">
            Tools & Technologies I Use
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {tools.map((tool, i) => (
              <span
                key={i}
                className="px-4 py-2.5 bg-surface/30 border border-stroke text-sm text-primary rounded-lg hover:bg-primary/10 hover:border-primary/20 cursor-default transition-all duration-300"
              >
                {tool}
              </span>
            ))}
          </div>
          <p className="text-subtle/70 mt-3 text-xs font-light">
            These tools allow efficient collaboration between design and frontend development.
          </p>
        </div>

        {/* BEST FIT */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-stroke/50 bg-surface/30">
          <h2 className="text-main font-bold tracking-tight mb-4">
            Who This Service Is Best For
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-subtle text-sm font-light">
            <li>Early-stage startups building MVP products</li>
            <li>SaaS companies improving usability</li>
            <li>Founders validating new product ideas</li>
            <li>Businesses redesigning existing applications</li>
          </ul>
        </div>

        {/* DEV COLLAB */}
        <div className="mt-12 mb-8">
          <h2 className="text-main text-xl font-bold tracking-tight mb-3">
            UI Design and Frontend Collaboration
          </h2>
          <p className="text-subtle/90 font-light leading-relaxed">
            Because I also work as a Frontend Developer using React and Next.js, my UI designs are created with real implementation constraints in mind, reducing development rework.
          </p>
          <div className="mt-8 pt-6 border-t border-stroke/30 text-sm text-subtle/80">
            Related services:{" "}
            <Link href="/services/ux-research" className="text-primary hover:underline font-semibold ml-1">
              UX Research
            </Link>
            ,{" "}
            <Link href="/services/product-design" className="text-primary hover:underline font-semibold ml-1">
              Product Design
            </Link>
            ,{" "}
            <Link href="/services/frontend-development" className="text-primary hover:underline font-semibold ml-1">
              Frontend Development
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
