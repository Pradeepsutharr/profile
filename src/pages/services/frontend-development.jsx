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

      <section className="max-w-4xl">
        {/* Header */}
        <span className="text-2xl md:text-3xl text-main font-semibold">
          Frontend Development Services
        </span>

        <div className="bg-primary w-12 h-[5px] rounded-full my-5" />

        <h1 className="text-primary text-xl md:text-3xl font-semibold leading-relaxed">
          Frontend Development Using React & Next.js
        </h1>

        <p className="text-subtle mt-4 leading-relaxed">
          I build fast, scalable, and SEO-friendly frontend applications using
          React and Next.js. My development approach focuses on performance,
          accessibility, and maintainable architecture.
        </p>

        <p className="text-subtle mt-3 leading-relaxed">
          From translating design systems into production-ready interfaces to
          optimizing application performance, I ensure that each project
          delivers smooth user experiences across devices.
        </p>

        {/* Deliverables */}
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

        {/* Approach */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-3">
            My Frontend Development Approach
          </h2>

          <p className="text-subtle">
            I follow modern frontend engineering practices to ensure clean,
            scalable, and high-performing applications. Every build is optimized
            for usability, accessibility, and long-term maintainability.
          </p>

          <ul className="mt-4 list-disc ml-5 space-y-2 text-subtle">
            {approachPoints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Best Fit */}
        <div className="mt-12 rounded-lg bg-soft">
          <h2 className="text-main font-semibold mb-2">Best Fit For</h2>

          <p className="text-subtle">
            SaaS platforms, startups, MVP development, dashboards, and marketing
            websites that require fast, scalable, and SEO-friendly frontend
            architecture.
          </p>
        </div>

        {/* Design Collaboration */}
        <div className="mt-10">
          <h2 className="text-main text-xl font-semibold mb-2">
            Design-to-Development Integration
          </h2>

          <p className="text-subtle">
            With experience in UI/UX and Product Design, I translate design
            systems into accurate frontend implementations, reducing gaps
            between design intent and final output.
          </p>
        </div>

        {/* Related */}
        <div className="mt-8 text-sm text-main">
          Related services:{" "}
          <Link href="/services/ui-design" className="text-primary underline">
            UI Design
          </Link>
          ,{" "}
          <Link
            href="/services/product-design"
            className="text-primary underline"
          >
            Product Design
          </Link>
        </div>
      </section>
    </>
  );
}
