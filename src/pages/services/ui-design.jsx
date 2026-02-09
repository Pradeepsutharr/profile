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

      <section className="max-w-4xl">
        {/* HERO */}
        <span className="text-2xl md:text-3xl text-main font-semibold">
          UI Design Services
        </span>

        <div className="bg-primary w-12 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          UI Design Services for Modern Web & SaaS Products
        </h1>

        <p className="text-subtle mt-4 leading-relaxed">
          I provide professional UI design services for startups, SaaS
          platforms, and digital products that need clean, intuitive, and
          conversion-focused interfaces.
        </p>

        <p className="text-subtle mt-3 leading-relaxed">
          My work combines user-centered design principles with modern interface
          patterns to ensure that every screen is visually consistent,
          accessible, and easy to navigate across devices.
        </p>

        {/* WHAT I DELIVER */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-6">
            What I Deliver
          </h2>

          <div className="flex flex-wrap m-[-.75rem]">
            {deliverables.map((item, index) => (
              <div key={index} className="col-12 md:col-6">
                <div className="service-card icon-box rounded-lg p-6 h-full">
                  <div className="text-primary font-semibold mb-2">
                    0{index + 1} {item.title}
                  </div>
                  <p className="text-subtle">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APPROACH */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-3">
            My UI Design Approach
          </h2>

          <p className="text-subtle">
            My UI design process begins with understanding business goals,
            product requirements, and user expectations. I translate insights
            into structured wireframes, visual hierarchies, and component-based
            layouts.
          </p>

          <ul className="mt-4 list-disc ml-5 space-y-2 text-subtle">
            {focusPoints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <p className="text-subtle mt-4">
            Each design decision is made to improve engagement, reduce cognitive
            load, and help users complete tasks efficiently.
          </p>
        </div>

        {/* TOOLS */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-3">
            Tools & Technologies I Use
          </h2>

          <div className="flex flex-wrap gap-3">
            {tools.map((tool, i) => (
              <span
                key={i}
                className="px-5 py-3 bg-soft rounded-md text-sm text-primary icon-box  hover:bg-primary/30"
              >
                {tool}
              </span>
            ))}
          </div>

          <p className="text-subtle mt-3">
            These tools allow efficient collaboration between design and
            frontend development.
          </p>
        </div>

        {/* BEST FIT */}
        <div className="mt-10 rounded-lg bg-soft">
          <h2 className="text-main font-semibold mb-2">
            Who This Service Is Best For
          </h2>
          <ul className="list-disc ml-5 text-subtle space-y-2">
            <li>Early-stage startups building MVP products</li>
            <li>SaaS companies improving usability</li>
            <li>Founders validating new product ideas</li>
            <li>Businesses redesigning existing applications</li>
          </ul>
        </div>

        {/* DEV COLLAB */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-2">
            UI Design and Frontend Collaboration
          </h2>

          <p className="text-subtle">
            Because I also work as a Frontend Developer using React and Next.js,
            my UI designs are created with real implementation constraints in
            mind, reducing development rework.
          </p>
        </div>

        {/* RELATED */}
        <div className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link href="/services/ux-research" className="text-primary underline">
            UX Research
          </Link>
          ,{" "}
          <Link
            href="/services/product-design"
            className="text-primary underline"
          >
            Product Design
          </Link>
          ,{" "}
          <Link
            href="/services/frontend-development"
            className="text-primary underline"
          >
            Frontend Development
          </Link>
        </div>
      </section>
    </>
  );
}
